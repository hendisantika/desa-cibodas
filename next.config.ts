import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Izinkan upload foto galeri hingga ~5MB via Server Action
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
