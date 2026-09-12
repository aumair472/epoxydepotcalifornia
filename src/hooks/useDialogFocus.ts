"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Open dialogs, most recent last — Escape only closes the topmost one. */
const dialogStack: symbol[] = [];

/**
 * Dialog keyboard behavior: focus moves into the panel when active, Tab is trapped,
 * Escape closes the topmost dialog (wherever focus is), and focus returns afterwards.
 */
export function useDialogFocus(panelRef: RefObject<HTMLElement | null>, onClose: () => void, active = true) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    const panel = panelRef.current;
    if (!panel) return;
    const id = Symbol("dialog");
    dialogStack.push(id);
    const previous = document.activeElement as HTMLElement | null;

    // Move focus in; retry for a few frames in case an enter transition hasn't made it focusable yet.
    let raf = 0;
    let attempts = 0;
    const focusInitial = () => {
      const initial =
        panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
      initial.focus({ preventScroll: true });
      if (!panel.contains(document.activeElement) && attempts++ < 10) raf = requestAnimationFrame(focusInitial);
    };
    raf = requestAnimationFrame(focusInitial);

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || dialogStack[dialogStack.length - 1] !== id) return;
      event.preventDefault();
      onCloseRef.current();
    };

    const onPanelKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown);
    panel.addEventListener("keydown", onPanelKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      dialogStack.splice(dialogStack.indexOf(id), 1);
      document.removeEventListener("keydown", onDocumentKeyDown);
      panel.removeEventListener("keydown", onPanelKeyDown);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [active, panelRef]);
}
