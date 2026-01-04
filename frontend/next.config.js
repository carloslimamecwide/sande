/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/api/images/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "4000",
        pathname: "/api/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
