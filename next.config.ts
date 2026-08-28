import type { NextConfig } from "next";

const repoName = "todo2";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: `/${repoName}`,
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
