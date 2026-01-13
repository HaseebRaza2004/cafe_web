/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me', // Humne ye domain allow kar dya
        port: '',
        pathname: '/**',
      },
      // Agar future mein Google se images ayengi to uska domain bhi yahan add hoga
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Maps photos ke liye
        port: '',
        pathname: '/**',
      },
      {
        // Kabhi kabhi Google Maps ki photos yahan se bhi aati hain (Safe side ke liye ye bhi daal dein)
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        // claudnary image       
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
