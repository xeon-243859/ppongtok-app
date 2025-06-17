/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ SSR용 빌드 유지
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;