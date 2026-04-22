import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
    NEXT_PUBLIC_WS_HOST: process.env.WS_HOST,
    NEXT_PUBLIC_WS_PORT: process.env.WS_PORT,
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
