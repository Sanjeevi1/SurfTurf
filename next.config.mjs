/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['utfs.io','images.unsplash.com'], // Add 'utfs.io' here
    },
    async rewrites() {
        return [
            {
                source: '/api/top-ranked-turfs', // The internal route you use in your frontend
                destination: 'http://127.0.0.1:5000/top-ranked-turfs', // Your backend URL
            },
            {
                source: '/api/similar-turfs/:turf_id',
                destination: 'http://127.0.0.1:5000/similar-turfs/:turf_id', // Backend URL
            },
        ];
    },
    // other configurations
};

export default nextConfig;
