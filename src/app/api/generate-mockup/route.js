import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Construct the prompt based on user specs
    const { categoryName, fabricName, colorType, colors, construction, artwork } = data;
    
    let colorDetails = '';
    if (colorType === 'solid') {
      colorDetails = `The entire ${categoryName} is a solid ${colors.Body || Object.values(colors)[0] || 'color'}.`;
    } else if (colorType === 'two-tone') {
      colorDetails = `A two-tone design. The main body is ${colors.Body || 'one color'} and the sleeves/accents are ${colors.Sleeves || 'a contrasting color'}.`;
    } else {
      colorDetails = Object.entries(colors)
        .map(([zone, color]) => `The ${zone.toLowerCase()} is ${color}`)
        .join(', ') + '.';
    }

    let styleDetails = '';
    if (construction && Object.keys(construction).length > 0) {
      // Use just the values for better AI understanding (e.g. "Crew Neck, Slim Fit" instead of "Crew Neck neckStyle")
      const features = Object.values(construction).filter(Boolean).join(', ');
      styleDetails = `Design Features: ${features}.`;
    }

    let artworkDetails = '';
    if (artwork && artwork.trim() !== '') {
      artworkDetails = `Branding constraints: Includes ${artwork}.`;
    } else {
      artworkDetails = `Clean, blank, unbranded garment with absolutely no text, logos, or graphics.`;
    }

    const mainColor = colors.Body || Object.values(colors)[0] || 'colored';
    
    // Construct a highly descriptive, natural language prompt for the Flux model
    const prompt = `A hyper-realistic, high-fashion e-commerce studio photograph of a ${mainColor} ${categoryName} floating on a pure white background (ghost mannequin style). 
    
Garment Details: ${colorDetails} ${styleDetails} Fabric appears as ${fabricName || 'premium quality textile'}. ${artworkDetails}

Lighting & Style: Perfect 3D symmetry, flat front view, invisible mannequin (neck area hollow), bright soft even studio lighting, sharp focus, 8k resolution, highly detailed fabric textures, photorealistic fashion catalog shot.

CRITICAL: Do NOT include any people, models, hangers, mannequins, faces, or bodies. Just the isolated clothing item.`;

    // Using Pollinations.ai (Completely Free, No API Key Required)
    // We use the 'flux' model for high quality
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

    const getFallbackImage = (category) => {
      const cat = (category || '').toLowerCase();
      if (cat.includes('hoodie')) return '/quote-hoodie.jpg';
      if (cat.includes('jogger') || cat.includes('pant') || cat.includes('trouser')) return '/quote-joggers.webp';
      if (cat.includes('polo')) return '/quote-poloshirt.png';
      if (cat.includes('short')) return '/quote-short.jpg';
      if (cat.includes('varsity') || cat.includes('jacket')) return '/quote-varistyjacket.png';
      return '/quote-tshirt.jpg';
    };

    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations error response:', response.status, response.statusText, errorText);
      // Return fallback image instead of throwing
      return NextResponse.json({ success: true, imageUrl: getFallbackImage(categoryName) });
    }

    // Pollinations returns the image binary
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error generating mockup:', error);
    // If anything throws, try to return a fallback if we have access to the data object
    // Since req.json() is parsed early, if it failed there we'd just return 500
    // But if it fails during fetch or processing, we can return the fallback
    return NextResponse.json({ 
      success: true, 
      imageUrl: '/quote-tshirt.jpg', // safe generic fallback
      error: error.message 
    });
  }
}
