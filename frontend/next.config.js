/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output a standalone build
  output: 'standalone',

  // Ensure pages directory is properly configured
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Enable strict mode for better development
  reactStrictMode: true,

  // Configure API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Accept',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
