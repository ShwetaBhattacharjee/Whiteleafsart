/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['example.com'], // Replace with actual domains hosting your images (e.g., your CDN or storage service)
    },
    eslint: {
        // Optional: Ignore ESLint during builds (use only if you can't fix errors immediately)
        // ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;