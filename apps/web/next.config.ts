import type { NextConfig } from "next";
// @ts-ignore
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      try {
        config.plugins = [...config.plugins, new PrismaPlugin()];
      } catch (error) {
        console.warn(
          "PrismaPlugin failed to load, continuing without it:",
          error,
        );
      }
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig) as NextConfig;
