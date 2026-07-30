"use client";

import { useEffect } from "react";

let locks = 0;
let previousOverflow = "";

function acquire() {
  if (typeof document === "undefined") return;
  if (locks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
}

function release() {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

/** Locks document scroll while `locked` is true. Nested callers share one lock. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    acquire();
    return () => release();
  }, [locked]);
}
