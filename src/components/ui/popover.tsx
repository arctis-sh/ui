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
  type ButtonHTMLAttributes,
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

type PopoverAlign = "start" | "center" | "end";
type PopoverSide = "top" | "bottom" | "left" | "right";

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  rootRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  setHasTitle: (value: boolean) => void;
  setHasDescription: (value: boolean) => void;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover parts must be used within <Popover>");
  }
  return context;
}

type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolled;
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      rootRef,
      contentRef,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
    }),
    [open, setOpen, titleId, descriptionId, hasTitle, hasDescription],
  );

  return (
    <PopoverContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="popover"
        className="relative inline-flex"
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

function PopoverTrigger({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: PopoverTriggerProps) {
  const { open, setOpen } = usePopover();

  function handleClick(event: ReactMouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented) setOpen(!open);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      "data-slot"?: string;
      "aria-expanded"?: boolean;
      "aria-haspopup"?: "dialog";
      onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
    }>;
    return cloneElement(child, {
      ...props,
      "data-slot": "popover-trigger",
      "aria-expanded": open,
      "aria-haspopup": "dialog",
      className: cn(child.props.className, className),
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      aria-expanded={open}
      aria-haspopup="dialog"
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function oppositeSide(side: PopoverSide): PopoverSide {
  if (side === "top") return "bottom";
  if (side === "bottom") return "top";
  if (side === "left") return "right";
  return "left";
}

function spaceFor(side: PopoverSide, trigger: DOMRect, pad: number) {
  if (side === "top") return trigger.top - pad;
  if (side === "bottom") return window.innerHeight - trigger.bottom - pad;
  if (side === "left") return trigger.left - pad;
  return window.innerWidth - trigger.right - pad;
}

function needFor(
  side: PopoverSide,
  width: number,
  height: number,
  offset: number,
) {
  if (side === "top" || side === "bottom") return height + offset;
  return width + offset;
}

function resolveSide(
  preferred: PopoverSide,
  trigger: DOMRect,
  width: number,
  height: number,
  offset: number,
  pad: number,
): PopoverSide {
  const order: PopoverSide[] = [
    preferred,
    oppositeSide(preferred),
    ...(preferred === "top" || preferred === "bottom"
      ? (["right", "left"] as PopoverSide[])
      : (["top", "bottom"] as PopoverSide[])),
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

function placePopover(
  side: PopoverSide,
  align: PopoverAlign,
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
      side === "top" ? trigger.top - height - offset : trigger.bottom + offset;
    if (align === "start") left = trigger.left;
    else if (align === "end") left = trigger.right - width;
    else left = trigger.left + trigger.width / 2 - width / 2;
  } else {
    left =
      side === "left" ? trigger.left - width - offset : trigger.right + offset;
    if (align === "start") top = trigger.top;
    else if (align === "end") top = trigger.bottom - height;
    else top = trigger.top + trigger.height / 2 - height / 2;
  }

  left = Math.min(Math.max(pad, left), window.innerWidth - width - pad);
  top = Math.min(Math.max(pad, top), window.innerHeight - height - pad);

  return { top, left };
}

type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: PopoverAlign;
  side?: PopoverSide;
  sideOffset?: number;
};

function PopoverContent({
  className,
  children,
  align = "center",
  side = "bottom",
  sideOffset = 6,
  style,
  ...props
}: PopoverContentProps) {
  const {
    open,
    rootRef,
    contentRef,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
  } = usePopover();
  const [mounted, setMounted] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [layout, setLayout] = useState({
    top: 0,
    left: 0,
    side: side as PopoverSide,
  });
  const entered = useOverlayEntered(open && placed);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const root = rootRef.current;
    const tip = contentRef.current;
    if (!root || !tip) return false;

    const triggerEl =
      (root.querySelector("[data-slot='popover-trigger']") as HTMLElement | null) ??
      root;
    const trigger = triggerEl.getBoundingClientRect();
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    if (width === 0 || height === 0) return false;

    const pad = 8;
    const nextSide = resolveSide(
      side,
      trigger,
      width,
      height,
      sideOffset,
      pad,
    );
    const next = placePopover(
      nextSide,
      align,
      trigger,
      width,
      height,
      sideOffset,
      pad,
    );
    setLayout({ ...next, side: nextSide });
    return true;
  }, [align, side, sideOffset, rootRef, contentRef]);

  useLayoutEffect(() => {
    if (!open) {
      setPlaced(false);
      return;
    }
    if (updatePosition()) setPlaced(true);
    const frame = requestAnimationFrame(() => {
      if (updatePosition()) setPlaced(true);
    });
    return () => cancelAnimationFrame(frame);
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

  if (!mounted || !open) return null;

  const resolvedSide = layout.side;

  return createPortal(
    <div
      ref={contentRef}
      data-slot="popover-content"
      data-side={resolvedSide}
      role="dialog"
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      style={{
        ...style,
        top: layout.top,
        left: layout.left,
        right: "auto",
        visibility: placed ? "visible" : "hidden",
      }}
      className={cn(
        "arctis-overlay fixed z-50 flex w-72 flex-col gap-2.5 rounded-md border border-foreground/10 bg-surface p-4 text-sm text-foreground",
        resolvedSide === "bottom" && align === "start" && "origin-top-left",
        resolvedSide === "bottom" && align === "center" && "origin-top",
        resolvedSide === "bottom" && align === "end" && "origin-top-right",
        resolvedSide === "top" && align === "start" && "origin-bottom-left",
        resolvedSide === "top" && align === "center" && "origin-bottom",
        resolvedSide === "top" && align === "end" && "origin-bottom-right",
        resolvedSide === "left" && "origin-right",
        resolvedSide === "right" && "origin-left",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>;

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  );
}

type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement>;

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  const { titleId, setHasTitle } = usePopover();

  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      id={titleId}
      data-slot="popover-title"
      className={cn("font-medium tracking-wide text-foreground", className)}
      {...props}
    />
  );
}

type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  const { descriptionId, setHasDescription } = usePopover();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={descriptionId}
      data-slot="popover-description"
      className={cn("tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
