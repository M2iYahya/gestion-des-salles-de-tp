import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_USER_API: process.env.NEXT_PUBLIC_USER_API,
  },
};

export default nextConfig;
