import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
