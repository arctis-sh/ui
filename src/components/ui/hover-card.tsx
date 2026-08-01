"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

type HoverCardAlign = "start" | "center" | "end";
type HoverCardSide = "top" | "bottom" | "left" | "right";

type HoverCardContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  scheduleOpen: (delay?: number) => void;
  scheduleClose: (delay?: number) => void;
  cancelTimers: () => void;
  rootRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  openDelay: number;
  closeDelay: number;
};

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCard() {
  const context = useContext(HoverCardContext);
  if (!context) {
    throw new Error("HoverCard parts must be used within <HoverCard>");
  }
  return context;
}

type HoverCardProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  children: ReactNode;
};

function HoverCard({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
}: HoverCardProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolled;
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const cancelTimers = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(
    (delay = openDelay) => {
      cancelTimers();
      openTimer.current = setTimeout(() => setOpen(true), delay);
    },
    [cancelTimers, openDelay, setOpen],
  );

  const scheduleClose = useCallback(
    (delay = closeDelay) => {
      cancelTimers();
      closeTimer.current = setTimeout(() => setOpen(false), delay);
    },
    [cancelTimers, closeDelay, setOpen],
  );

  useBodyScrollLock(open);

  useEffect(() => () => cancelTimers(), [cancelTimers]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cancelTimers();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, cancelTimers, setOpen]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      scheduleOpen,
      scheduleClose,
      cancelTimers,
      rootRef,
      contentRef,
      openDelay,
      closeDelay,
    }),
    [
      open,
      setOpen,
      scheduleOpen,
      scheduleClose,
      cancelTimers,
      openDelay,
      closeDelay,
    ],
  );

  return (
    <HoverCardContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="hover-card"
        className="relative inline-flex"
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

type HoverCardTriggerProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  delay?: number;
  closeDelay?: number;
  children: ReactNode;
};

function HoverCardTrigger({
  asChild = false,
  className,
  children,
  delay,
  closeDelay: closeDelayProp,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
  ...props
}: HoverCardTriggerProps) {
  const { open, scheduleOpen, scheduleClose } = useHoverCard();

  function handleEnter() {
    scheduleOpen(delay);
  }

  function handleLeave() {
    scheduleClose(closeDelayProp);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      "data-slot"?: string;
      "data-state"?: string;
      onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
      onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
      onFocus?: (event: ReactFocusEvent<HTMLElement>) => void;
      onBlur?: (event: ReactFocusEvent<HTMLElement>) => void;
      onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    }>;

    return cloneElement(child, {
      ...props,
      "data-slot": "hover-card-trigger",
      "data-state": open ? "open" : "closed",
      className: cn(child.props.className, className),
      onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
        child.props.onMouseEnter?.(event);
        onMouseEnter?.(event);
        if (!event.defaultPrevented) handleEnter();
      },
      onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
        child.props.onMouseLeave?.(event);
        onMouseLeave?.(event);
        if (!event.defaultPrevented) handleLeave();
      },
      onFocus: (event: ReactFocusEvent<HTMLElement>) => {
        child.props.onFocus?.(event);
        onFocus?.(event);
        if (!event.defaultPrevented) handleEnter();
      },
      onBlur: (event: ReactFocusEvent<HTMLElement>) => {
        child.props.onBlur?.(event);
        onBlur?.(event);
        if (!event.defaultPrevented) handleLeave();
      },
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        child.props.onClick?.(event);
        onClick?.(event);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="hover-card-trigger"
      data-state={open ? "open" : "closed"}
      className={cn(
        "cursor-pointer text-sm font-medium tracking-wide underline-offset-4 hover:underline",
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented) handleEnter();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (!event.defaultPrevented) handleLeave();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented) handleEnter();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented) handleLeave();
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

type HoverCardContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: HoverCardAlign;
  side?: HoverCardSide;
  sideOffset?: number;
  alignOffset?: number;
};

function HoverCardContent({
  className,
  children,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: HoverCardContentProps) {
  const { open, rootRef, contentRef, cancelTimers, scheduleClose } =
    useHoverCard();
  const entered = useOverlayEntered(open);
  const [coords, setCoords] = useState<CSSProperties>({
    top: 0,
    left: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;

    function update() {
      const trigger = rootRef.current?.getBoundingClientRect();
      const contentEl = contentRef.current;
      if (!trigger || !contentEl) return;

      // Use layout size, not getBoundingClientRect — scale transforms shrink
      // the rect and pull top/left placements into the trigger.
      const width = contentEl.offsetWidth;
      const height = contentEl.offsetHeight;
      if (width === 0 || height === 0) return;

      const next: CSSProperties = {
        top: 0,
        left: 0,
        right: "auto",
      };

      if (side === "bottom") {
        next.top = trigger.bottom + sideOffset;
        if (align === "end") {
          next.right = window.innerWidth - trigger.right - alignOffset;
          next.left = "auto";
        } else if (align === "center") {
          next.left = trigger.left + trigger.width / 2 + alignOffset;
        } else {
          next.left = trigger.left + alignOffset;
        }
      } else if (side === "top") {
        next.top = trigger.top - height - sideOffset;
        if (align === "end") {
          next.right = window.innerWidth - trigger.right - alignOffset;
          next.left = "auto";
        } else if (align === "center") {
          next.left = trigger.left + trigger.width / 2 - width / 2 + alignOffset;
        } else {
          next.left = trigger.left + alignOffset;
        }
      } else if (side === "left") {
        next.left = trigger.left - width - sideOffset;
        if (align === "end") {
          next.top = trigger.bottom - height + alignOffset;
        } else if (align === "center") {
          next.top = trigger.top + trigger.height / 2 - height / 2 + alignOffset;
        } else {
          next.top = trigger.top + alignOffset;
        }
      } else {
        next.left = trigger.right + sideOffset;
        if (align === "end") {
          next.top = trigger.bottom - height + alignOffset;
        } else if (align === "center") {
          next.top = trigger.top + trigger.height / 2 - height / 2 + alignOffset;
        } else {
          next.top = trigger.top + alignOffset;
        }
      }

      setCoords(next);
    }

    update();
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, align, side, sideOffset, alignOffset, rootRef, contentRef]);

  if (!mounted || !open) return null;

  const centerTransform = side === "bottom" && align === "center";
  // Bottom keeps the gooey Y drift; other sides scale in place so they
  // don't animate into the trigger.
  const overlayMotion =
    side === "bottom" ? "arctis-overlay" : "arctis-overlay arctis-overlay-tooltip";

  return createPortal(
    <div
      ref={contentRef}
      data-slot="hover-card-content"
      data-side={side}
      data-align={align}
      role="dialog"
      style={{ ...style, ...coords }}
      className={cn(
        "fixed z-50 w-64 rounded-md border border-foreground/10 bg-surface p-4 text-sm text-foreground shadow-md",
        overlayMotion,
        side === "bottom" && align === "start" && "origin-top-left",
        side === "bottom" && align === "center" && "origin-top",
        side === "bottom" && align === "end" && "origin-top-right",
        side === "top" && "origin-bottom",
        side === "left" && "origin-right",
        side === "right" && "origin-left",
        centerTransform && "arctis-overlay-center",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        cancelTimers();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        scheduleClose();
      }}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
export type { HoverCardAlign, HoverCardSide };
