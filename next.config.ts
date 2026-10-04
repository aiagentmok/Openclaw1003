import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",
  // GitHub Pages serves the site at https://<user>.github.io/<repo>/
  basePath: "/Openclaw1003",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
