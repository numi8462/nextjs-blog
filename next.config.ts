import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1, // 동시 빌드 수 제한
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // domains: [
    //   'prod-files-secure.s3.us-west-2.amazonaws.com',
    //   'github.com',
    //   'raw.githubusercontent.com',
    //   'img1.daumcdn.net',
    //   'velog.velcdn.com',
    //   'tsh.io',
    //   'private-user-images.githubusercontent.com',
    //   // 다른 도메인을 여기에 추가하세요
    // ],
  },
};

export default nextConfig;
