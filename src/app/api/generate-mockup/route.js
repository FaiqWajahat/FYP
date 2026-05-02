import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Construct the prompt based on user specs
    const { categoryName, fabricName, colorType, colors, construction, artwork } = data;
    
    let colorDetails = '';
    if (colorType === 'solid' && colors.Body) {
      colorDetails = `The entire garment is dyed in a rich, solid ${colors.Body} color.`;
    } else {
      colorDetails = Object.entries(colors)
        .map(([zone, color]) => `The ${zone} must be exactly ${color} color.`)
        .join(' ');
    }

    let styleDetails = '';
    if (construction && Object.keys(construction).length > 0) {
      styleDetails = `CONSTRUCTION: ${Object.entries(construction).map(([key, val]) => `${val} ${key}`).join(', ')}.`;
    }

    let artworkDetails = '';
    if (artwork) {
      artworkDetails = `BRANDING: ${artwork}.`;
    }

    const mainColor = Object.values(colors)[0] || 'custom colored';
    const prompt = `A professional studio photography shot of a ${mainColor} ${categoryName}. 
COLOR MANDATE: ${colorDetails} 
GARMENT TYPE: ${categoryName} 
MATERIAL: ${fabricName || 'premium quality textile'} 
${styleDetails} ${artworkDetails}
STYLE: Ghost mannequin, perfect 3D symmetry, solid white background, hyper-realistic, 8k, detailed fabric texture, professional fashion catalog style. 
--- 
AVOID: white garments (unless specified), humans, models, text, blurry edges.`;

    // Using Pollinations.ai (Completely Free, No API Key Required)
    // We use the 'flux' model for high quality
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error('Failed to generate image from Pollinations');
    }

    // Pollinations returns the image binary
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error generating mockup:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
