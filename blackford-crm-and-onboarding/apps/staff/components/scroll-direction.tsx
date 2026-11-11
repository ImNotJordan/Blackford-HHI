"use client";

import { useEffect } from "react";

/** Ignore tiny movements (trackpad jitter) below this many pixels. */
const THRESHOLD = 6;
/** Pointer within this distance of the right edge reveals the scrollbar. */
const EDGE_ZONE = 24;

/**
 * Sets `data-scroll-dir="down"` on <html> while the page scrolls down, so CSS
 * can fade the scrollbar out. Scrolling up, reaching the top, or moving the
 * pointer to the right edge (to grab the bar) brings it back.
 */
export function ScrollDirection() {
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let ticking = false;

    const show = () => {
      delete root.dataset.scrollDir;
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (y <= 0) {
        show();
      } else if (y - lastY > THRESHOLD) {
        root.dataset.scrollDir = "down";
      } else if (lastY - y > THRESHOLD) {
        show();
      } else {
        return; // below threshold: keep comparing against the old position
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (root.dataset.scrollDir && e.clientX >= window.innerWidth - EDGE_ZONE) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      show();
    };
  }, []);

  return null;
}
