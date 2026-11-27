import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Interactive clipper UI — prefer client state over Cache Components for MVP.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
