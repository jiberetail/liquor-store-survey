import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "liquor-store-survey";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
      output: "export",
      basePath: `/${repositoryName}`,
      assetPrefix: `/${repositoryName}/`,
      typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
