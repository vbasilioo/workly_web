import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_AUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_AUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;
