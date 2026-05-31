import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured in environment variables' },
        { status: 500 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: 'No design image received for analysis' },
        { status: 400 }
      );
    }

    let mimeType = 'image/jpeg';
    let base64Data;

    if (image.startsWith('data:')) {
      // ── Case 1: Already a base64 data URL (user uploaded a file directly) ──
      const mimeMatch = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
        base64Data = image.substring(mimeMatch[0].length);
      } else {
        // Malformed data URL — strip header best-effort
        base64Data = image.replace(/^data:[^;]+;base64,/, '');
      }
    } else if (image.startsWith('http://') || image.startsWith('https://')) {
      // ── Case 2: External HTTPS URL (e.g. Cloudinary) ──
      // Gemini's inline_data requires raw base64, NOT a URL.
      // Fetch the image server-side and convert it.
      const imgRes = await fetch(image.trim());
      if (!imgRes.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image from URL: ${imgRes.status} ${imgRes.statusText}` },
          { status: 400 }
        );
      }

      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      // Strip any charset/quality params — keep only the primary MIME type
      mimeType = contentType.split(';')[0].trim();
      if (!mimeType.startsWith('image/')) mimeType = 'image/jpeg';

      const arrayBuffer = await imgRes.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString('base64');
    } else {
      return NextResponse.json(
        { error: 'Unsupported image format. Provide a base64 data URL or an HTTPS image URL.' },
        { status: 400 }
      );
    }

    const promptText = `You are a B2B Apparel Production Engineer. Analyze this design drawing/mockup/logo and write a brief, professional manufacturing analysis.

Structure your analysis in clean Markdown with these headers:
1. **Feasibility Review**: Is this design easy to manufacture? What are the key details?
2. **Branding Method Recommendations**: Suggest the best printing or embroidery techniques (e.g. Screen Printing, DTG, 3D Embroidery) for this specific graphic. Explain why.
3. **Fabric & GSM Suggestions**: Recommend the ideal fabric weights (e.g., Heavy French Terry, Midweight Fleece, Single Jersey Cotton) that match this style.
4. **Production Alerts**: Are there low-contrast elements, ultra-fine details that might blur, or gradients that could cause printing issues?

Keep the tone encouraging, professional, and technical yet easy to understand for custom brand owners.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Gemini Vision Error response:', responseData);
      throw new Error(responseData.error?.message || 'Gemini API returned an error');
    }

    const aiText =
      responseData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Unable to analyze this design.';

    return NextResponse.json({ success: true, text: aiText });
  } catch (err) {
    console.error('Gemini Vision API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to analyze design image' },
      { status: 500 }
    );
  }
}
