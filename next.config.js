/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/u',
        destination: '/u/overview',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
