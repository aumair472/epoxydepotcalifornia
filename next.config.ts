import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Image Optimization is a paid quota (it returned 402 on the Hobby plan), so images
    // skip it: Unsplash resizes on its own CDN and local photos are pre-compressed.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
  // Map the reference site's URL shapes onto this app's routes so old links keep working.
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/shop/:slug", permanent: false },
      { source: "/contractor-account", destination: "/contractors", permanent: false },
      { source: "/data-sheets", destination: "/resources#library", permanent: false },
      { source: "/login", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
