/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['utfs.io','images.unsplash.com'], // Add 'utfs.io' here
    },
    // Removed proxy configurations - using internal API routes instead
};

export default nextConfig;
