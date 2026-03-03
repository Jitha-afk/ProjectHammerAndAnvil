import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ProjectHammerAndAnvil",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
