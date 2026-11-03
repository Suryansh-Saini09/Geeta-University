import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
    cpus: 1,
    workerThreads: false,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingExcludes: {
    "*": ["./public/**/*"],
    "**/*": ["./public/**/*"],
  },
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 14400,
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
      {
        protocol: "https",
        hostname: "spbsb.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
      {
        pathname: "/images/**",
        search: "",
      },
      {
        pathname: "/about/**",
        search: "",
      },
      {
        pathname: "/campus-life/**",
        search: "",
      },
      {
        pathname: "/careers/**",
        search: "",
      },
      {
        pathname: "/contact-us/**",
        search: "",
      },
      {
        pathname: "/courses/**",
        search: "",
      },
      {
        pathname: "/edge/**",
        search: "",
      },
      {
        pathname: "/faculty/**",
        search: "",
      },
      {
        pathname: "/faq/**",
        search: "",
      },
      {
        pathname: "/fee-and-scholarship/**",
        search: "",
      },
      {
        pathname: "/home/**",
        search: "",
      },
      {
        pathname: "/industry-integration/**",
        search: "",
      },
      {
        pathname: "/international-admissions/**",
        search: "",
      },
      {
        pathname: "/library/**",
        search: "",
      },
      {
        pathname: "/placements/**",
        search: "",
      },
      {
        pathname: "/programs/**",
        search: "",
      },
      {
        pathname: "/recruiters/**",
        search: "",
      },
      {
        pathname: "/recruiters/**",
        search: "?v=3",
      },
      {
        pathname: "/scholarship-predictor/**",
        search: "",
      },
      {
        pathname: "/spbsb-**/**",
        search: "",
      },
      {
        pathname: "/spbsp/**",
        search: "",
      },
      {
        pathname: "/teaching-learning-practices/**",
        search: "",
      },
      {
        pathname: "/ugc/**",
        search: "",
      },
      {
        pathname: "/*",
        search: "",
      },
    ],
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://geetauniversity.edu.in https://spbsb.vercel.app https://i.ytimg.com https://img.youtube.com",
      "connect-src 'self' https://script.google.com https://script.googleusercontent.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://script.google.com",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ];

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
