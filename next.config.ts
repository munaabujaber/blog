/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        // allow any subdomain under ufs.sh (e.g. raxrcg7iwh.ufs.sh)
        hostname: "*.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
