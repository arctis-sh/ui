"use client";

import { useEffect, useState } from "react";

/** Mount closed, enter next frame. Close snaps (no exit motion). */
export function useOverlayEntered(open: boolean) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }

    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [open]);

  return open && entered;
}
