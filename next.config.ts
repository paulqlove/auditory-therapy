import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable static export for GitHub Pages
  output: "export",
  // Set base path for GitHub Pages (repo name)
  basePath: process.env.NODE_ENV === "production" ? "/auditory-therapy" : "",
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
