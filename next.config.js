/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/view/:id',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*facebookexternalhit.*|.*Twitterbot.*|.*Slackbot.*|.*WhatsApp.*|.*Kakao.*',
          },
        ],
        destination: '/api/view/:id',
      },
      {
        source: '/view/:id',
        destination: '/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
