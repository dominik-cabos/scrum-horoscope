import type { NextConfig } from "next";

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig : NextConfig = {
    // Enable serverless functions for API routes
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname
    },
    // Configure image optimization
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Strict mode for React
    reactStrictMode: true,
    // Enable experimental server components
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000']
        }
    },
}

export default nextConfig;
