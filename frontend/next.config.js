/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure pages directory is properly configured
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Configure rewrites to handle API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Enable strict mode for better development
  reactStrictMode: true,
};

module.exports = nextConfig;
