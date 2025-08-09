/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
        pathname: "**",
      },
    ],
  },
  // 防止静态生成API路由的错误
  experimental: {
    serverComponentsExternalPackages: ["emoji-mart"],
  },
  output: "standalone",
  swcMinify: true,
};

module.exports = nextConfig;
