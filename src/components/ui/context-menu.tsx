"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";
import { useSubmenuPosition } from "@/lib/use-submenu-position";

type Point = { x: number; y: number };

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  point: Point;
  setPoint: (point: Point) => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu parts must be used within <ContextMenu>");
  }
  return context;
}

type ContextMenuProps = {
  children: ReactNode;
};

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element | null;
      if (
        target?.closest?.(
          '[data-slot="context-menu-content"], [data-slot="context-menu-sub-content"]',
        )
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onScroll() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, setOpen, point, setPoint }),
    [open, point],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      <div data-slot="context-menu" className="relative">
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

type ContextMenuTriggerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ContextMenuTrigger({
  className,
  children,
  onContextMenu,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onTouchCancel,
  ...props
}: ContextMenuTriggerProps) {
  const { setOpen, setPoint } = useContextMenu();
  const longPressRef = useRef<number | null>(null);

  function clearLongPress() {
    if (longPressRef.current !== null) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }

  function openAt(x: number, y: number) {
    setPoint({ x, y });
    setOpen(true);
  }

  return (
    <div
      data-slot="context-menu-trigger"
      className={cn(className)}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        openAt(event.clientX, event.clientY);
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        if (event.defaultPrevented) return;
        const touch = event.touches[0];
        if (!touch) return;
        clearLongPress();
        longPressRef.current = window.setTimeout(() => {
          openAt(touch.clientX, touch.clientY);
        }, 500);
      }}
      onTouchEnd={(event) => {
        onTouchEnd?.(event);
        clearLongPress();
      }}
      onTouchMove={(event) => {
        onTouchMove?.(event);
        clearLongPress();
      }}
      onTouchCancel={(event) => {
        onTouchCancel?.(event);
        clearLongPress();
      }}
      {...props}
    >
      {children}
    </div>
  );
}

type ContextMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ContextMenuContent({
  className,
  children,
  style,
  ...props
}: ContextMenuContentProps) {
  const { open, point } = useContextMenu();
  const entered = useOverlayEntered(open);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(point);

  useLayoutEffect(() => {
    if (!open) {
      setPos(point);
      return;
    }

    const node = contentRef.current;
    let x = point.x;
    let y = point.y;
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      const pad = 8;
      if (x + width > window.innerWidth - pad) {
        x = Math.max(pad, window.innerWidth - width - pad);
      }
      if (y + height > window.innerHeight - pad) {
        y = Math.max(pad, window.innerHeight - height - pad);
      }
    }
    setPos((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
  }, [open, point]);

  return (
    <div
      ref={contentRef}
      data-slot="context-menu-content"
      role="menu"
      style={{
        ...style,
        top: pos.y,
        left: pos.x,
      }}
      className={cn(
        "arctis-overlay fixed z-50 w-max min-w-40 origin-top-left rounded-md border border-foreground/10 bg-surface p-1 text-foreground",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const itemClass =
  "relative flex w-full cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-[13px] font-normal tracking-wide outline-none select-none transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground";

type ContextMenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  inset?: boolean;
  variant?: "default" | "destructive";
};

export function ContextMenuItem({
  className,
  children,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: ContextMenuItemProps) {
  const { setOpen } = useContextMenu();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="context-menu-item"
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      className={cn(
        itemClass,
        inset && "pl-8",
        variant === "destructive" &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg:not([class*='text-'])]:text-destructive",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type ContextMenuCheckboxItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function ContextMenuCheckboxItem({
  className,
  children,
  checked = false,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-slot="context-menu-checkbox-item"
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      className={cn(itemClass, "pl-8", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        onCheckedChange?.(!checked);
      }}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon className="size-3.5" /> : null}
      </span>
      {children}
    </button>
  );
}

type ContextMenuRadioGroupContextValue = {
  value: string;
  onValueChange?: (value: string) => void;
};

const ContextMenuRadioGroupContext =
  createContext<ContextMenuRadioGroupContextValue | null>(null);

type ContextMenuRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

export function ContextMenuRadioGroup({
  className,
  value = "",
  onValueChange,
  children,
  ...props
}: ContextMenuRadioGroupProps) {
  const context = useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );

  return (
    <ContextMenuRadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        data-slot="context-menu-radio-group"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </ContextMenuRadioGroupContext.Provider>
  );
}

type ContextMenuRadioItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  value: string;
};

export function ContextMenuRadioItem({
  className,
  children,
  value,
  disabled,
  onClick,
  ...props
}: ContextMenuRadioItemProps) {
  const group = useContext(ContextMenuRadioGroupContext);
  const checked = group?.value === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      data-slot="context-menu-radio-item"
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      className={cn(itemClass, "pl-8", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        group?.onValueChange?.(value);
      }}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CircleIcon className="size-2 fill-current" /> : null}
      </span>
      {children}
    </button>
  );
}

type ContextMenuLabelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inset?: boolean;
};

export function ContextMenuLabel({
  className,
  children,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <div
      data-slot="context-menu-label"
      className={cn(
        "px-2 py-1.5 text-xs tracking-wide text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ContextMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <div
      role="separator"
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-foreground/10", className)}
      {...props}
    />
  );
}

type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function ContextMenuShortcut({
  className,
  children,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type ContextMenuGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ContextMenuGroup({
  className,
  children,
  ...props
}: ContextMenuGroupProps) {
  return (
    <div
      role="group"
      data-slot="context-menu-group"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

type ContextMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ContextMenuSubContext = createContext<ContextMenuSubContextValue | null>(
  null,
);

type ContextMenuSubProps = {
  children: ReactNode;
};

export function ContextMenuSub({ children }: ContextMenuSubProps) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <ContextMenuSubContext.Provider value={value}>
      <div
        data-slot="context-menu-sub"
        className="relative"
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </ContextMenuSubContext.Provider>
  );
}

function useContextMenuSub() {
  const context = useContext(ContextMenuSubContext);
  if (!context) {
    throw new Error("ContextMenuSub parts must be used within <ContextMenuSub>");
  }
  return context;
}

type ContextMenuSubTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  inset?: boolean;
};

export function ContextMenuSubTrigger({
  className,
  children,
  inset,
  ...props
}: ContextMenuSubTriggerProps) {
  const { setOpen } = useContextMenuSub();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="context-menu-sub-trigger"
      aria-haspopup="menu"
      className={cn(itemClass, "pr-1.5", inset && "pl-8", className)}
      onMouseEnter={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5 text-muted-foreground" />
    </button>
  );
}

type ContextMenuSubContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ContextMenuSubContent({
  className,
  children,
  style,
  ...props
}: ContextMenuSubContentProps) {
  const { open } = useContextMenuSub();
  const entered = useOverlayEntered(open);
  const contentRef = useRef<HTMLDivElement>(null);
  const placement = useSubmenuPosition(open, contentRef);

  return (
    <div
      ref={contentRef}
      data-slot="context-menu-sub-content"
      role="menu"
      style={{ ...style, ...placement.style }}
      className={cn(
        "arctis-overlay absolute z-50 w-max min-w-32 rounded-md border border-foreground/10 bg-surface p-1 text-foreground",
        placement.side === "left" ? "origin-top-right" : "origin-top-left",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
