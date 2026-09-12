import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Must stay in sync with the `unsplash()` helper in src/data/mockData.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
        search: "?auto=format&fit=crop&w=1600&q=80",
      },
    ],
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
