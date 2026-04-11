import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(req) {
  try {
    let base64Str = "";
    let folder = "b2b-products";

    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get('file');
      if (!file) throw new Error("No file received");
      
      console.log("Upload API: Received multipart file:", file.name, file.type);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Str = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      const body = await req.json();
      base64Str = body.file; 
      if (body.folder) folder = body.folder;
      console.log("Upload API: Received JSON base64. Folder:", folder);
    }

    if (!base64Str) {
      console.error("Upload API: No base64 data received.");
      return NextResponse.json({ error: 'No data received.' }, { status: 400 });
    }

    console.log("Upload API: Triggering Cloudinary upload...");
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: folder,
      resource_type: 'auto'
    });

    console.log("Upload API: Success! URL:", uploadResponse.secure_url);
    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
    
  } catch (err) {
    console.error("Upload API: FATAL ERROR:", err);
    return NextResponse.json({ error: err.message || 'Failed to upload to Cloudinary.' }, { status: 500 });
  }
}
