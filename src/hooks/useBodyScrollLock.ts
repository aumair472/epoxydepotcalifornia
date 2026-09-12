"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";
let previousPadding = "";

/** Lock page scroll while `active`. Ref-counted so stacked overlays don't unlock each other. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      previousOverflow = body.style.overflow;
      previousPadding = body.style.paddingRight;
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount++;
    return () => {
      lockCount--;
      if (lockCount === 0) {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPadding;
      }
    };
  }, [active]);
}
