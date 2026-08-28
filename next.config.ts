import type { NextConfig } from "next";

const repoName = "todo2";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
