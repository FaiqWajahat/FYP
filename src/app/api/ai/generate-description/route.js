import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productName, category, subCategory, fabric, gsm, colors } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured in environment variables" }, { status: 500 });
    }

    if (!productName) {
      return NextResponse.json({ error: "Product name is required to generate description" }, { status: 400 });
    }

    const promptText = `Write a professional, search-optimized B2B catalog description for a manufacturing product:
    
Product Details:
- Product Name: ${productName}
- Category: ${category || 'Apparel'}
- Sub-Category: ${subCategory || ''}
- Fabric/Material: ${fabric || 'Premium Blend'}
- Weight: ${gsm ? `${gsm} GSM` : 'Standard weight'}
- Color Options: ${colors || 'Multiple Colorways'}

Requirements:
1. Write 2-3 engaging, professional paragraphs emphasizing the fabric quality, retail-ready fit, construction specs, and suitability for premium clothing brands or custom merch.
2. Outline key manufacturing benefits (e.g. durable double-needle stitching, pre-shrunk, ideal canvas for printing/embroidery).
3. Keep it to a clean text format under 500 characters, suited to drop straight into a description text area. Avoid headers and bullet points; use clean paragraph text.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Gemini Description Error response:", responseData);
      throw new Error(responseData.error?.message || "Gemini API returned an error");
    }

    const aiText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ success: true, text: aiText.trim() });
  } catch (err) {
    console.error("Gemini Description API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate description" }, { status: 500 });
  }
}
