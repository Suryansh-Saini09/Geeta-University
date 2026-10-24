import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingExcludes: {
    "*": ["./public/**/*"],
    "**/*": ["./public/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "geetauniversity.edu.in",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
