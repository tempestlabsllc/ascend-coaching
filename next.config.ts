import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Make sure guide PDFs ship with the download route when deployed.
  outputFileTracingIncludes: { "/api/download": ["./private-guides/**/*"] },
};
export default nextConfig;
