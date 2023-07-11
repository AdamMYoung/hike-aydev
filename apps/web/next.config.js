/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  transpilePackages: ["ui"],

  experimental: {
    serverActions: true,
    proxyTimeout: 500_000,
  },
  async rewrites() {
    return [
      {
        source: "/geo-api/:slug*",
        destination: `${process.env.GEOSPATIAL_API_URL}/:slug*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hike.aydev.uk",
      },
    ],
  },
};
