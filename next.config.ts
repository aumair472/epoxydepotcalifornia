import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Image Optimization is a paid quota (it returned 402 on the Hobby plan), so images
    // skip it and use the WebP copies pre-built by scripts/build-images.mjs.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // The widths scripts/build-images.mjs pre-builds as WebP (keep the three lists in sync).
    imageSizes: [64, 128, 256, 384],
    deviceSizes: [640, 828, 1080, 1600],
  },
  // Static photos and icons rarely change: let browsers keep them for a week and refresh in the background.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return ["/_img/:path*", "/products/:path*", "/flakes/:path*", "/metallics/:path*", "/fuzion/:path*", "/solids/:path*", "/photos/:path*", "/logo.png", "/favicon.ico", "/icon.png", "/apple-icon.png", "/icon-192.png", "/icon-512.png"].map(
      (source) => ({ source, headers: cache }),
    );
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
