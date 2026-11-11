import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@blackford/core", "@blackford/brand"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
