"use client";

import { useEffect, useRef } from "react";

interface HotkeyOptions {
  /** Require ⌘ (mac) or Ctrl. */
  mod?: boolean;
  /** Ignore the key while typing in inputs/textareas. Defaults to true unless `mod` is set. */
  ignoreInputs?: boolean;
  enabled?: boolean;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Global keyboard shortcut. The handler can change between renders without re-binding. */
export function useHotkey(key: string, handler: (event: KeyboardEvent) => void, options: HotkeyOptions = {}) {
  const { mod = false, ignoreInputs = !mod, enabled = true } = options;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (mod && !(event.metaKey || event.ctrlKey)) return;
      if (!mod && (event.metaKey || event.ctrlKey || event.altKey)) return;
      if (ignoreInputs && isTypingTarget(event.target)) return;
      handlerRef.current(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, mod, ignoreInputs, enabled]);
}
