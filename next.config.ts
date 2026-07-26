import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        // Allow recipe/logo assets, including ?v=mtime cache-busting query strings
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
