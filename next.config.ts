import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["gzdavygtvoqwiujbudft.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};


export default nextConfig;


