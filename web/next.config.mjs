/** @type {import('next').NextConfig} */

const nextConfig = {
    /* config options here */
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'helpx.adobe.com',
            },
        ],
        // domains: ['storage.googleapis.com'],
    },
};

export default nextConfig;
