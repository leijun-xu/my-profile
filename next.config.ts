import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || ''

const nextConfig: NextConfig = {
    devIndicators: false,
    ...(process.env.NODE_ENV === "production" && { output: 'standalone' }),
    basePath,
    async rewrites() {
        const rewrites = [
            {
                source: '/health',
                destination: basePath + '/api/health'
            }
        ]
        return rewrites;
    }
}

export default nextConfig
