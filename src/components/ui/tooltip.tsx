"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

type Side = "top" | "bottom" | "left" | "right";
type Align = "left" | "center" | "right";

type TooltipProviderContextValue = {
  delayDuration: number;
  skipDelayDuration: number;
  openTooltipId: string | null;
  setOpenTooltipId: (id: string | null) => void;
  lastCloseAt: number;
  markClosed: () => void;
};

const TooltipProviderContext =
  createContext<TooltipProviderContextValue | null>(null);

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  contentId: string;
  side: Side;
  setSide: (side: Side) => void;
  preferredSide: Side;
  align: Align;
  sideOffset: number;
  delayDuration?: number;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipProvider() {
  return useContext(TooltipProviderContext);
}

function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip parts must be used within <Tooltip>");
  }
  return context;
}

type TooltipProviderProps = {
  delayDuration?: number;
  skipDelayDuration?: number;
  children: ReactNode;
};

export function TooltipProvider({
  delayDuration = 200,
  skipDelayDuration = 300,
  children,
}: TooltipProviderProps) {
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);
  const lastCloseAtRef = useRef(0);

  const markClosed = useCallback(() => {
    lastCloseAtRef.current = Date.now();
  }, []);

  const value = useMemo<TooltipProviderContextValue>(
    () => ({
      delayDuration,
      skipDelayDuration,
      openTooltipId,
      setOpenTooltipId,
      get lastCloseAt() {
        return lastCloseAtRef.current;
      },
      markClosed,
    }),
    [delayDuration, skipDelayDuration, openTooltipId, markClosed],
  );

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

type TooltipProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  side?: Side;
  align?: Align;
  sideOffset?: number;
};

export function Tooltip({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
  side = "top",
  align = "center",
  sideOffset = 4,
}: TooltipProps) {
  const provider = useTooltipProvider();
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [resolvedSide, setResolvedSide] = useState(side);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolled(next);
      onOpenChange?.(next);
      if (next) {
        provider?.setOpenTooltipId(contentId);
      } else if (provider?.openTooltipId === contentId) {
        provider.setOpenTooltipId(null);
        provider.markClosed();
      }
    },
    [controlled, onOpenChange, provider, contentId],
  );

  useEffect(() => {
    if (!provider) return;
    if (
      open &&
      provider.openTooltipId &&
      provider.openTooltipId !== contentId
    ) {
      setOpen(false);
    }
  }, [provider, provider?.openTooltipId, open, contentId, setOpen]);

  useEffect(() => {
    setResolvedSide(side);
  }, [side]);

  const value = useMemo<TooltipContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentId,
      side: resolvedSide,
      setSide: setResolvedSide,
      preferredSide: side,
      align,
      sideOffset,
      delayDuration,
    }),
    [
      open,
      setOpen,
      contentId,
      resolvedSide,
      side,
      align,
      sideOffset,
      delayDuration,
    ],
  );

  return (
    <TooltipContext.Provider value={value}>
      <div
        ref={triggerRef as Ref<HTMLDivElement>}
        data-slot="tooltip"
        className="relative inline-flex"
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

type TooltipTriggerProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function TooltipTrigger({
  asChild = false,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onPointerDown,
  ...props
}: TooltipTriggerProps) {
  const { open, setOpen, triggerRef, contentId, delayDuration } = useTooltip();
  const provider = useTooltipProvider();
  const timerRef = useRef<number | null>(null);

  const delay = delayDuration ?? provider?.delayDuration ?? 200;
  const skipDelay = provider?.skipDelayDuration ?? 300;

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleOpen() {
    clearTimer();
    const recentlyClosed =
      provider && Date.now() - provider.lastCloseAt < skipDelay;
    const wait = recentlyClosed ? 0 : delay;
    if (wait <= 0) {
      setOpen(true);
      return;
    }
    timerRef.current = window.setTimeout(() => setOpen(true), wait);
  }

  function scheduleClose() {
    clearTimer();
    setOpen(false);
  }

  useEffect(() => () => clearTimer(), []);

  const handlers = {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      onMouseEnter?.(event);
      if (!event.defaultPrevented) scheduleOpen();
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      onMouseLeave?.(event);
      if (!event.defaultPrevented) scheduleClose();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      if (!event.defaultPrevented) scheduleOpen();
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      onBlur?.(event);
      if (!event.defaultPrevented) scheduleClose();
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      onPointerDown?.(event);
      if (!event.defaultPrevented) scheduleClose();
    },
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...props,
      ...handlers,
      "data-slot": "tooltip-trigger",
      "aria-describedby": open ? contentId : undefined,
      className: cn(
        typeof child.props.className === "string"
          ? child.props.className
          : undefined,
        className,
      ),
      onMouseEnter: (event: MouseEvent<HTMLElement>) => {
        (child.props.onMouseEnter as typeof onMouseEnter)?.(event);
        handlers.onMouseEnter(event);
      },
      onMouseLeave: (event: MouseEvent<HTMLElement>) => {
        (child.props.onMouseLeave as typeof onMouseLeave)?.(event);
        handlers.onMouseLeave(event);
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        (child.props.onFocus as typeof onFocus)?.(event);
        handlers.onFocus(event);
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        (child.props.onBlur as typeof onBlur)?.(event);
        handlers.onBlur(event);
      },
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        (child.props.onPointerDown as typeof onPointerDown)?.(event);
        handlers.onPointerDown(event);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="tooltip-trigger"
      aria-describedby={open ? contentId : undefined}
      className={cn("inline-flex", className)}
      {...props}
      {...handlers}
    >
      {children}
    </button>
  );
}

function oppositeSide(side: Side): Side {
  if (side === "top") return "bottom";
  if (side === "bottom") return "top";
  if (side === "left") return "right";
  return "left";
}

function spaceFor(side: Side, trigger: DOMRect, pad: number) {
  if (side === "top") return trigger.top - pad;
  if (side === "bottom") return window.innerHeight - trigger.bottom - pad;
  if (side === "left") return trigger.left - pad;
  return window.innerWidth - trigger.right - pad;
}

function needFor(side: Side, width: number, height: number, offset: number) {
  if (side === "top" || side === "bottom") return height + offset;
  return width + offset;
}

function resolveSide(
  preferred: Side,
  trigger: DOMRect,
  width: number,
  height: number,
  offset: number,
  pad: number,
): Side {
  const order: Side[] = [
    preferred,
    oppositeSide(preferred),
    ...(preferred === "top" || preferred === "bottom"
      ? (["right", "left"] as Side[])
      : (["top", "bottom"] as Side[])),
  ];

  for (const next of order) {
    if (spaceFor(next, trigger, pad) >= needFor(next, width, height, offset)) {
      return next;
    }
  }

  return order.reduce((best, next) =>
    spaceFor(next, trigger, pad) > spaceFor(best, trigger, pad) ? next : best,
  );
}

function place(
  side: Side,
  align: Align,
  trigger: DOMRect,
  width: number,
  height: number,
  offset: number,
  pad: number,
) {
  let top = 0;
  let left = 0;

  if (side === "top" || side === "bottom") {
    top =
      side === "top"
        ? trigger.top - height - offset
        : trigger.bottom + offset;
    if (align === "left") left = trigger.left;
    else if (align === "right") left = trigger.right - width;
    else left = trigger.left + trigger.width / 2 - width / 2;
  } else {
    left =
      side === "left"
        ? trigger.left - width - offset
        : trigger.right + offset;
    if (align === "left") top = trigger.top;
    else if (align === "right") top = trigger.bottom - height;
    else top = trigger.top + trigger.height / 2 - height / 2;
  }

  left = Math.min(Math.max(pad, left), window.innerWidth - width - pad);
  top = Math.min(Math.max(pad, top), window.innerHeight - height - pad);

  const inset = Math.min(
    12,
    Math.max(
      4,
      (side === "top" || side === "bottom" ? trigger.width : trigger.height) *
        0.25,
    ),
  );
  let anchorX = trigger.left + trigger.width / 2;
  let anchorY = trigger.top + trigger.height / 2;
  if (side === "top" || side === "bottom") {
    if (align === "left") anchorX = trigger.left + inset;
    else if (align === "right") anchorX = trigger.right - inset;
  } else if (align === "left") {
    anchorY = trigger.top + inset;
  } else if (align === "right") {
    anchorY = trigger.bottom - inset;
  }

  const arrowPad = 10;
  const arrowX = Math.min(Math.max(arrowPad, anchorX - left), width - arrowPad);
  const arrowY = Math.min(Math.max(arrowPad, anchorY - top), height - arrowPad);

  return { top, left, arrowX, arrowY };
}

type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  children: ReactNode;
};

export function TooltipContent({
  className,
  side: sideProp,
  align: alignProp,
  sideOffset: sideOffsetProp,
  children,
  style,
  ...props
}: TooltipContentProps) {
  const {
    open,
    triggerRef,
    contentId,
    setSide,
    preferredSide,
    align: contextAlign,
    sideOffset,
  } = useTooltip();
  const contentRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [layout, setLayout] = useState({
    top: 0,
    left: 0,
    arrowX: 0,
    arrowY: 0,
    side: (sideProp ?? preferredSide) as Side,
  });
  const resolvedPreferred = sideProp ?? preferredSide;
  const resolvedAlign = alignProp ?? contextAlign;
  const resolvedOffset = sideOffsetProp ?? sideOffset;
  const entered = useOverlayEntered(open && placed);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = contentRef.current;
    if (!trigger || !tip) return false;

    const triggerRect = trigger.getBoundingClientRect();
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    if (width === 0 || height === 0) return false;

    const pad = 8;
    const nextSide = resolveSide(
      resolvedPreferred,
      triggerRect,
      width,
      height,
      resolvedOffset,
      pad,
    );
    const next = place(
      nextSide,
      resolvedAlign,
      triggerRect,
      width,
      height,
      resolvedOffset,
      pad,
    );
    setSide(nextSide);
    setLayout({ ...next, side: nextSide });
    return true;
  }, [
    resolvedPreferred,
    resolvedAlign,
    resolvedOffset,
    setSide,
    triggerRef,
  ]);

  useLayoutEffect(() => {
    if (!open) {
      setPlaced(false);
      return;
    }
    if (updatePosition()) setPlaced(true);
  }, [open, updatePosition, children]);

  useEffect(() => {
    if (!open) return;

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  if (!portalReady || !open) return null;

  const renderSide = layout.side;
  const origin =
    renderSide === "top"
      ? resolvedAlign === "left"
        ? "origin-bottom-left"
        : resolvedAlign === "right"
          ? "origin-bottom-right"
          : "origin-bottom"
      : renderSide === "bottom"
        ? resolvedAlign === "left"
          ? "origin-top-left"
          : resolvedAlign === "right"
            ? "origin-top-right"
            : "origin-top"
        : renderSide === "left"
          ? "origin-right"
          : "origin-left";

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="tooltip"
      data-slot="tooltip-content"
      data-side={renderSide}
      data-align={resolvedAlign}
      style={{
        ...style,
        top: layout.top,
        left: layout.left,
        visibility: placed ? undefined : "hidden",
      }}
      className={cn(
        "arctis-overlay arctis-overlay-tooltip pointer-events-none fixed z-50 w-fit max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs font-normal tracking-wide text-balance text-background",
        origin,
        entered && "arctis-overlay-open",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        data-slot="tooltip-arrow"
        style={
          renderSide === "top" || renderSide === "bottom"
            ? { left: layout.arrowX }
            : { top: layout.arrowY }
        }
        className={cn(
          "absolute size-2 rotate-45 rounded-[1px] bg-foreground",
          renderSide === "top" && "bottom-0 -translate-x-1/2 translate-y-1/2",
          renderSide === "bottom" && "top-0 -translate-x-1/2 -translate-y-1/2",
          renderSide === "left" && "right-0 translate-x-1/2 -translate-y-1/2",
          renderSide === "right" && "left-0 -translate-x-1/2 -translate-y-1/2",
        )}
      />
    </div>,
    document.body,
  );
}
