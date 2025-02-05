import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "prod-files-secure.s3.us-west-2.amazonaws.com",
            "github.com",
            "raw.githubusercontent.com",
            // 다른 도메인을 여기에 추가하세요
        ],
    },
};

export default nextConfig;
