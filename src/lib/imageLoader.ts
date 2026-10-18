"use client";

/**
 * next/image loader that never goes through Vercel's Image Optimization (a paid quota that
 * returned 402 on the Hobby plan, breaking every image).
 * Every photo (including the self-hosted Unsplash ones in /photos) is served from the WebP copies
 * that scripts/build-images.mjs writes to /_img/<path>-<width>.webp before every build.
 */

// Keep in sync with WIDTHS in scripts/build-images.mjs and the image sizes in next.config.ts.
const IMAGE_WIDTHS = [64, 128, 256, 384, 640, 828, 1080, 1600];
const LOCAL_PHOTO = /^\/((?:products|flakes|metallics|fuzion|solids|photos)\/[^?]+|logo)\.(?:jpe?g|png|webp)$/i;

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const local = LOCAL_PHOTO.exec(src);
  if (local) {
    const w = IMAGE_WIDTHS.find((size) => size >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    return `/_img/${local[1]}-${w}.webp`;
  }
  return `${src}?w=${width}`;
}
