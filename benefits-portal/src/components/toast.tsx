"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Polite status toast for demo actions that would call the backend. */
export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const node = (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {message ? (
        <span className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg">{message}</span>
      ) : null}
    </div>
  );

  return [node, show] as const;
}
