"use client";

import { useEffect } from "react";

/** Lazy images below the fold print blank, so load them all when a print starts. */
export function PrintImageLoader() {
  useEffect(() => {
    const loadAll = () => {
      document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
      });
    };
    window.addEventListener("beforeprint", loadAll);
    return () => window.removeEventListener("beforeprint", loadAll);
  }, []);
  return null;
}
