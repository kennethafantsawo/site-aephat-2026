import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.who.int" },
      { protocol: "https", hostname: "www.who.int" },
      { protocol: "https", hostname: "**.vidal.fr" },
      { protocol: "https", hostname: "www.vidal.fr" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
