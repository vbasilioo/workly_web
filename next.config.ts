import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_AUTH_URL: process.env.NEXT_AUTH_SECRET,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_URL,
  },
};

export default nextConfig;
