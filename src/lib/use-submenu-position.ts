"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

type SubmenuSide = "left" | "right";

type SubmenuPlacement = {
  side: SubmenuSide;
  style: CSSProperties;
};

const PAD = 8;
const GAP = 4;

const defaultPlacement: SubmenuPlacement = {
  side: "right",
  style: {
    top: 0,
    left: `calc(100% - ${GAP}px)`,
    right: "auto",
  },
};

/** Positions a submenu relative to its `relative` parent, flipping and clamping to the viewport. */
export function useSubmenuPosition(
  open: boolean,
  contentRef: RefObject<HTMLElement | null>,
): SubmenuPlacement {
  const [placement, setPlacement] = useState<SubmenuPlacement>(defaultPlacement);

  useLayoutEffect(() => {
    if (!open) return;

    function update() {
      const content = contentRef.current;
      if (!content) return;

      const parent = content.offsetParent as HTMLElement | null;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      // offset* ignores CSS scale on the closed overlay so we get the real size
      const width = content.offsetWidth;
      const height = content.offsetHeight;

      const spaceRight = window.innerWidth - parentRect.right - PAD;
      const spaceLeft = parentRect.left - PAD;
      const side: SubmenuSide =
        width > spaceRight && spaceLeft > spaceRight ? "left" : "right";

      let top = 0;
      if (parentRect.top + height > window.innerHeight - PAD) {
        top = window.innerHeight - PAD - height - parentRect.top;
      }
      if (parentRect.top + top < PAD) {
        top = PAD - parentRect.top;
      }

      setPlacement({
        side,
        style:
          side === "right"
            ? { top, left: `calc(100% - ${GAP}px)`, right: "auto" }
            : { top, right: `calc(100% - ${GAP}px)`, left: "auto" },
      });
    }

    update();
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [open, contentRef]);

  return open ? placement : defaultPlacement;
}
