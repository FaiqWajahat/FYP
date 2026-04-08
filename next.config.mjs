/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**", 
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
