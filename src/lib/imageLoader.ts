"use client";

/**
 * next/image loader that never goes through Vercel's Image Optimization (a paid quota that
 * returned 402 on the Hobby plan, breaking every image).
 * - Unsplash photos are resized by Unsplash's own CDN via its `w` / `q` params.
 * - Local photos in /public are already resized and compressed, so they are served as-is;
 *   the `w` hint only gives each srcset candidate a distinct URL, as next/image expects.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    return url.toString();
  }
  return `${src}?w=${width}`;
}
