import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@blackford/core", "@blackford/db"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
