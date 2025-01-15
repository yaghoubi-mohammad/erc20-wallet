import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    api: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
