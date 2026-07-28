/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://124.220.195.160:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
