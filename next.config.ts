import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/schedule",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
