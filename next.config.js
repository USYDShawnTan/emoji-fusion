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
  // 指明以下路由为动态路由，不进行静态生成
  serverActions: {
    allowedOrigins: ["localhost:3000"],
  },
};

module.exports = nextConfig;
