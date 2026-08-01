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
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

type NavigationMenuContextValue = {
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  rootRef: RefObject<HTMLDivElement | null>;
  clearCloseTimer: () => void;
  scheduleClose: () => void;
};

const NavigationMenuContext =
  createContext<NavigationMenuContextValue | null>(null);

type NavigationMenuItemContextValue = {
  value: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  open: boolean;
};

const NavigationMenuItemContext =
  createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("NavigationMenu parts must be used within <NavigationMenu>");
  }
  return context;
}

function useNavigationMenuItem() {
  const context = useContext(NavigationMenuItemContext);
  if (!context) {
    throw new Error(
      "NavigationMenuTrigger/Content must be used within <NavigationMenuItem>",
    );
  }
  return context;
}

function canHoverOpen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function navigationMenuTriggerStyle({ className }: { className?: string } = {}) {
  return cn(
    "group/navigation-menu-trigger inline-flex h-8 w-max items-center justify-center rounded-md px-2 py-1 text-xs font-normal tracking-wide transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground sm:h-9 sm:px-2.5 sm:py-1.5 sm:text-sm",
    className,
  );
}

type NavigationMenuProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuProps) {
  const [openValue, setOpenValue] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpenValue(null), 120);
  }, [clearCloseTimer]);

  const setOpenValueSafe = useCallback(
    (next: string | null) => {
      clearCloseTimer();
      setOpenValue(next);
    },
    [clearCloseTimer],
  );

  useBodyScrollLock(openValue !== null);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!openValue) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      const contents = document.querySelectorAll(
        "[data-slot=navigation-menu-content]",
      );
      for (const node of contents) {
        if (node.contains(target)) return;
      }
      setOpenValueSafe(null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenValueSafe(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openValue, setOpenValueSafe]);

  const value = useMemo(
    () => ({
      openValue,
      setOpenValue: setOpenValueSafe,
      rootRef,
      clearCloseTimer,
      scheduleClose,
    }),
    [openValue, setOpenValueSafe, clearCloseTimer, scheduleClose],
  );

  return (
    <NavigationMenuContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="navigation-menu"
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className,
        )}
        onPointerLeave={() => {
          if (canHoverOpen()) scheduleClose();
        }}
        onPointerEnter={() => {
          if (canHoverOpen()) clearCloseTimer();
        }}
        {...props}
      >
        {children}
      </div>
    </NavigationMenuContext.Provider>
  );
}

type NavigationMenuListProps = HTMLAttributes<HTMLUListElement>;

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none flex-wrap items-center justify-center gap-0",
        className,
      )}
      {...props}
    />
  );
}

type NavigationMenuItemProps = HTMLAttributes<HTMLLIElement> & {
  value?: string;
};

function NavigationMenuItem({
  className,
  value: valueProp,
  children,
  ...props
}: NavigationMenuItemProps) {
  const autoId = useId();
  const value = valueProp ?? autoId;
  const { openValue } = useNavigationMenu();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const open = openValue === value;

  const itemValue = useMemo(
    () => ({ value, triggerRef, contentRef, open }),
    [value, open],
  );

  return (
    <NavigationMenuItemContext.Provider value={itemValue}>
      <li
        data-slot="navigation-menu-item"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

type NavigationMenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

function NavigationMenuTrigger({
  className,
  children,
  onClick,
  onPointerEnter,
  ...props
}: NavigationMenuTriggerProps) {
  const { setOpenValue, clearCloseTimer } = useNavigationMenu();
  const { value, triggerRef, open } = useNavigationMenuItem();

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="navigation-menu-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="true"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (!canHoverOpen()) return;
        clearCloseTimer();
        setOpenValue(value);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpenValue(open ? null : value);
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-200 group-data-[state=open]/navigation-menu-trigger:rotate-180" />
    </button>
  );
}

type NavigationMenuContentProps = HTMLAttributes<HTMLDivElement>;

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(min, value), max);
}

function NavigationMenuContent({
  className,
  children,
  style,
  ...props
}: NavigationMenuContentProps) {
  const { clearCloseTimer, scheduleClose } = useNavigationMenu();
  const { open, triggerRef, contentRef } = useNavigationMenuItem();
  const entered = useOverlayEntered(open);
  const [coords, setCoords] = useState<CSSProperties>({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<{
    align: "start" | "center" | "end";
    side: "top" | "bottom";
  }>({ align: "start", side: "bottom" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    function update() {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const content = contentRef.current;
      if (!trigger || !content) return;

      const pad = 8;
      const offset = 6;
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;
      const maxWidth = Math.max(0, viewW - pad * 2);
      const maxHeight = Math.max(0, viewH - pad * 2);

      content.style.boxSizing = "border-box";
      content.style.minWidth = "0";
      content.style.width = "max-content";
      content.style.maxWidth = `${maxWidth}px`;
      content.style.maxHeight = `${maxHeight}px`;
      content.style.overflow = "auto";

      const prevTransform = content.style.transform;
      content.style.transform = "none";
      void content.offsetWidth;
      const measured = content.getBoundingClientRect();
      content.style.transform = prevTransform;

      const width = Math.min(
        Math.max(measured.width, content.scrollWidth),
        maxWidth,
      );
      const height = Math.min(
        Math.max(measured.height, Math.min(content.scrollHeight, maxHeight)),
        maxHeight,
      );

      const startLeft = trigger.left;
      const endLeft = trigger.right - width;
      const centerLeft = trigger.left + trigger.width / 2 - width / 2;

      let align: "start" | "center" | "end" = "start";
      let left = startLeft;

      const fits = (x: number) => x >= pad && x + width <= viewW - pad;

      if (fits(startLeft)) {
        align = "start";
        left = startLeft;
      } else if (fits(endLeft)) {
        align = "end";
        left = endLeft;
      } else if (fits(centerLeft)) {
        align = "center";
        left = centerLeft;
      } else if (viewW - pad - trigger.left >= trigger.right - pad) {
        align = "start";
        left = startLeft;
      } else {
        align = "end";
        left = endLeft;
      }

      left = clamp(left, pad, viewW - width - pad);

      const below = trigger.bottom + offset;
      const above = trigger.top - height - offset;
      let side: "top" | "bottom" = "bottom";
      let top = below;

      if (below + height <= viewH - pad) {
        side = "bottom";
        top = below;
      } else if (above >= pad) {
        side = "top";
        top = above;
      } else {
        side = "bottom";
        top = below;
      }

      top = clamp(top, pad, viewH - height - pad);

      setPlacement({ align, side });
      setCoords({
        top,
        left,
        width,
        maxWidth,
        maxHeight,
      });
    }

    update();
    const frame1 = requestAnimationFrame(() => {
      update();
      requestAnimationFrame(update);
    });

    const node = contentRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" && node
        ? new ResizeObserver(() => update())
        : null;
    if (node) observer?.observe(node);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame1);
      observer?.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, entered, triggerRef, contentRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      data-slot="navigation-menu-content"
      data-align={placement.align}
      data-side={placement.side}
      style={{ ...style, ...coords }}
      className={cn(
        "arctis-overlay fixed z-[70] box-border min-w-0 overflow-auto rounded-md border border-foreground/10 bg-surface p-1 text-foreground",
        placement.side === "bottom" &&
          placement.align === "start" &&
          "origin-top-left",
        placement.side === "bottom" &&
          placement.align === "center" &&
          "origin-top",
        placement.side === "bottom" &&
          placement.align === "end" &&
          "origin-top-right",
        placement.side === "top" &&
          placement.align === "start" &&
          "origin-bottom-left",
        placement.side === "top" &&
          placement.align === "center" &&
          "origin-bottom",
        placement.side === "top" &&
          placement.align === "end" &&
          "origin-bottom-right",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      onPointerEnter={() => {
        if (canHoverOpen()) clearCloseTimer();
      }}
      onPointerLeave={() => {
        if (canHoverOpen()) scheduleClose();
      }}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

type NavigationMenuLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  asChild?: boolean;
  active?: boolean;
};

function NavigationMenuLink({
  className,
  asChild = false,
  active,
  children,
  href = "#",
  ...props
}: NavigationMenuLinkProps) {
  const classes = cn(
    "flex h-full w-full items-center gap-2 rounded-md p-1.5 text-xs tracking-wide transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent/50 sm:p-2 sm:text-sm [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-4",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      "data-slot"?: string;
      "data-active"?: string;
    }>;
    return cloneElement(child, {
      ...props,
      "data-slot": "navigation-menu-link",
      "data-active": active ? "" : undefined,
      className: cn(classes, child.props.className),
    });
  }

  return (
    <a
      href={href}
      data-slot="navigation-menu-link"
      data-active={active ? "" : undefined}
      className={classes}
      {...props}
    >
      {children}
    </a>
  );
}

type NavigationMenuIndicatorProps = HTMLAttributes<HTMLDivElement>;

function NavigationMenuIndicator({
  className,
  ...props
}: NavigationMenuIndicatorProps) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-3", className)}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
};
