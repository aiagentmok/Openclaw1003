import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",
  // GitHub Pages serves the site at https://<user>.github.io/<repo>/
  basePath: "/Openclaw1003",
  // Emit folder/index.html so subpaths (e.g. /Openclaw1003/To_do_list/) resolve cleanly.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
