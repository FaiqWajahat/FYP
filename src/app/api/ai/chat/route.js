import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ─── Fetch products (no status filter — show all products) ────────────────────
async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, sku, category, sub_category, fabric, gsm_weight, gsm, description, pricing_tiers, branding_options, colors, sizes')
      .limit(40);

    if (error || !data || data.length === 0) return [];
    return data;
  } catch (e) {
    console.error('Failed to fetch products for AI:', e);
    return [];
  }
}

// ─── Build a compact catalog string for the system prompt ────────────────────
function buildCatalogText(products) {
  return products.map((p) => {
    const price = p.pricing_tiers?.[0]
      ? `from $${p.pricing_tiers[0].price} (MOQ: ${p.pricing_tiers[0].moq})`
      : 'price on request';
    const branding = Array.isArray(p.branding_options) && p.branding_options.length
      ? p.branding_options.join(', ') : 'n/a';
    const weight = p.gsm_weight || p.gsm
      ? `${p.gsm_weight || ''}${p.gsm ? ' / ' + p.gsm : ''} GSM` : '';
    return `• ${p.name} (SKU: ${p.sku}) | ${p.category}${p.sub_category ? ' > ' + p.sub_category : ''} | ${p.fabric || 'N/A'} ${weight} | ${price} | Branding: ${branding}${p.description ? ' | ' + p.description.slice(0, 80) : ''}`;
  }).join('\n');
}

// ─── Post-process: auto-inject markdown links for any product name the AI wrote ─
// This runs on the server AFTER we get the AI response.
// It scans the text for product names and wraps them in [Name](url) if not already linked.
function autoLinkProducts(text, products) {
  if (!text || !products.length) return text;

  // Sort by name length descending so longer names match before shorter substrings
  const sorted = [...products].sort((a, b) => b.name.length - a.name.length);

  let result = text;

  for (const p of sorted) {
    const categorySlug = (p.category || 'all').toLowerCase().replace(/\s+/g, '-');
    const url = `${BASE_URL}/categories/${encodeURIComponent(categorySlug)}/${encodeURIComponent(p.sku)}`;

    // Skip if already linked (already has [Name](url) format anywhere)
    const alreadyLinked = new RegExp(`\\[${escapeRegex(p.name)}\\]\\(`, 'i').test(result);
    if (alreadyLinked) continue;

    // Replace bare product name with markdown link (case-insensitive, word-boundary aware)
    // Avoid replacing inside existing markdown link syntax
    const nameRegex = new RegExp(`(?<!\\[)\\b${escapeRegex(p.name)}\\b(?!\\])`, 'gi');
    result = result.replace(nameRegex, `[${p.name}](${url})`);
  }

  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Fetch products — used both for the system prompt catalog and for post-processing
    const products = await fetchProducts();
    const catalogText = products.length ? buildCatalogText(products) : null;

    const catalogSection = catalogText
      ? `\n\n## Available Products:\n${catalogText}`
      : '';

    const systemPrompt = `You are the Factory Flow AI Manufacturing Assistant — an expert in custom B2B apparel.

Guidelines:
1. Be concise and direct. Use bullet points.
2. Recommend specific products from the catalog by their exact name and SKU when relevant.
3. Give a brief spec summary (fabric, GSM, branding options, price).
4. End with a bolded recommendation, e.g., **Recommended: Product Name (SKU: XXX) – reason.**
5. Provide advice on fabrics, branding (Screen Print, Embroidery, DTG, Woven Patches), MOQ, lead times, FOB/CIF.

Current context:
- Category: ${context?.category || 'Apparel'}
- Fabric: ${context?.fabric || 'Cotton'}
- Colors: ${context?.colors || 'Standard'}
${catalogSection}

Respond in clear markdown. Be professional and helpful.`;

    const mappedMessages = await Promise.all(messages.map(async (m) => {
      const parts = [{ text: m.text || '' }];

      if (m.fileUrl && (m.fileType?.startsWith('image/') || m.fileType === 'application/pdf')) {
        try {
          const imgRes = await fetch(m.fileUrl);
          if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            parts.push({ inlineData: { mimeType: m.fileType, data: base64 } });
          }
        } catch (fetchErr) {
          console.error('Failed to fetch attachment:', fetchErr);
        }
      }

      return {
        role: m.sender === 'model' || m.sender === 'ai' ? 'model' : 'user',
        parts,
      };
    }));

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will help with custom apparel manufacturing questions and recommend specific products when relevant.' }] },
      ...mappedMessages,
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      throw new Error(data.error?.message || 'Gemini API error');
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'I am currently unavailable. Please try again shortly.';

    // ── Server-side auto-link: inject product page links into the AI response ──
    // This works regardless of whether the AI formatted links or not.
    aiText = autoLinkProducts(aiText, products);

    return NextResponse.json({ success: true, text: aiText });

  } catch (err) {
    console.error('AI Chat Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to communicate with AI' }, { status: 500 });
  }
}
