import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["knex", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        // Check-in selfies & other uploads served straight from the S3 bucket
        // (see publicUrlForKey in src/core/storage). If a CDN / custom domain is
        // later set via S3_PUBLIC_BASE_URL, add that host here too.
        protocol: "https",
        hostname: "rha-images.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
