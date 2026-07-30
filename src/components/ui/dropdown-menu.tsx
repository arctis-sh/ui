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
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  buttonGroupFaceClass,
  buttonGroupJoinClass,
  buttonGroupOutlineJoinClass,
  buttonGroupOverlapClass,
  useButtonGroup,
} from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";
import { useSubmenuPosition } from "@/lib/use-submenu-position";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  rootRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null,
);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu parts must be used within <DropdownMenu>");
  }
  return context;
}

type DropdownMenuProps = {
  children: ReactNode;
};

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const group = useButtonGroup();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
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

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, setOpen, rootRef, contentRef }),
    [open],
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="dropdown-menu"
        className={cn(
          "relative inline-flex w-fit",
          buttonGroupOverlapClass(group),
        )}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

type DropdownMenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function DropdownMenuTrigger({
  className,
  children,
  onClick,
  ...props
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenu();
  const group = useButtonGroup();

  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      aria-expanded={open}
      aria-haspopup="menu"
      className={cn(
        "[&_[data-slot=avatar]]:ring-0",
        className,
        buttonGroupFaceClass(group),
        typeof className === "string" &&
          className.includes("border") &&
          cn(
            buttonGroupJoinClass(group),
            buttonGroupOutlineJoinClass(group),
          ),
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type DropdownMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

export function DropdownMenuContent({
  className,
  children,
  align = "center",
  sideOffset = 6,
  style,
  ...props
}: DropdownMenuContentProps) {
  const { open, rootRef, contentRef } = useDropdownMenu();
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
      const content = contentRef.current?.getBoundingClientRect();
      if (!trigger) return;

      const pad = 8;
      const width = content?.width ?? 0;
      const height = content?.height ?? 0;

      let top = trigger.bottom + sideOffset;
      if (top + height > window.innerHeight - pad) {
        top = Math.max(pad, trigger.top - sideOffset - height);
      }

      const next: CSSProperties = { top };

      if (align === "end") {
        let left = trigger.right - width;
        left = Math.min(
          Math.max(pad, left),
          window.innerWidth - width - pad,
        );
        next.left = left;
        next.right = "auto";
      } else if (align === "center") {
        let left = trigger.left + trigger.width / 2 - width / 2;
        left = Math.min(
          Math.max(pad, left),
          window.innerWidth - width - pad,
        );
        next.left = left;
        next.right = "auto";
      } else {
        let left = trigger.left;
        if (left + width > window.innerWidth - pad) {
          left = Math.max(pad, window.innerWidth - width - pad);
        }
        next.left = left;
        next.right = "auto";
      }

      setCoords(next);
    }

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, align, sideOffset, rootRef, contentRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      data-slot="dropdown-menu-content"
      role="menu"
      style={{ ...style, ...coords }}
      className={cn(
        "arctis-overlay fixed z-50 w-max min-w-40 origin-top rounded-md border border-foreground/10 bg-surface p-1 text-foreground [&_[data-slot=avatar]]:ring-0",
        align === "start" && "origin-top-left",
        align === "center" && "arctis-overlay-center origin-top",
        align === "end" && "origin-top-right",
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

const itemClass =
  "relative flex w-full cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-[13px] font-normal tracking-wide outline-none select-none transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground";

type DropdownMenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
};

export function DropdownMenuItem({
  className,
  children,
  href,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();
  const classes = cn(
    itemClass,
    inset && "pl-8",
    variant === "destructive" &&
      "text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg:not([class*='text-'])]:text-destructive",
    className,
  );

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        role="menuitem"
        data-slot="dropdown-menu-item"
        data-variant={variant}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled || undefined}
        className={cn(classes, disabled && "pointer-events-none opacity-40")}
        onClick={(event) => {
          onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
          if (!event.defaultPrevented && !disabled) setOpen(false);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-menu-item"
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      className={classes}
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

type DropdownMenuCheckboxItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function DropdownMenuCheckboxItem({
  className,
  children,
  checked = false,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-slot="dropdown-menu-checkbox-item"
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

type DropdownMenuRadioGroupContextValue = {
  value: string;
  onValueChange?: (value: string) => void;
};

const DropdownMenuRadioGroupContext =
  createContext<DropdownMenuRadioGroupContextValue | null>(null);

type DropdownMenuRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

export function DropdownMenuRadioGroup({
  className,
  value = "",
  onValueChange,
  children,
  ...props
}: DropdownMenuRadioGroupProps) {
  const context = useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );

  return (
    <DropdownMenuRadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        data-slot="dropdown-menu-radio-group"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

type DropdownMenuRadioItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  value: string;
};

export function DropdownMenuRadioItem({
  className,
  children,
  value,
  disabled,
  onClick,
  ...props
}: DropdownMenuRadioItemProps) {
  const group = useContext(DropdownMenuRadioGroupContext);
  const checked = group?.value === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      data-slot="dropdown-menu-radio-item"
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

type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inset?: boolean;
};

export function DropdownMenuLabel({
  className,
  children,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      data-slot="dropdown-menu-label"
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

type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <div
      role="separator"
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-foreground/10", className)}
      {...props}
    />
  );
}

type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function DropdownMenuShortcut({
  className,
  children,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
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

type DropdownMenuGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function DropdownMenuGroup({
  className,
  children,
  ...props
}: DropdownMenuGroupProps) {
  return (
    <div
      role="group"
      data-slot="dropdown-menu-group"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

type DropdownMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuSubContext =
  createContext<DropdownMenuSubContextValue | null>(null);

type DropdownMenuSubProps = {
  children: ReactNode;
};

export function DropdownMenuSub({ children }: DropdownMenuSubProps) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <DropdownMenuSubContext.Provider value={value}>
      <div
        data-slot="dropdown-menu-sub"
        className="relative"
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </DropdownMenuSubContext.Provider>
  );
}

function useDropdownMenuSub() {
  const context = useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error(
      "DropdownMenuSub parts must be used within <DropdownMenuSub>",
    );
  }
  return context;
}

type DropdownMenuSubTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  inset?: boolean;
};

export function DropdownMenuSubTrigger({
  className,
  children,
  inset,
  ...props
}: DropdownMenuSubTriggerProps) {
  const { setOpen } = useDropdownMenuSub();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-menu-sub-trigger"
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

type DropdownMenuSubContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function DropdownMenuSubContent({
  className,
  children,
  style,
  ...props
}: DropdownMenuSubContentProps) {
  const { open } = useDropdownMenuSub();
  const entered = useOverlayEntered(open);
  const contentRef = useRef<HTMLDivElement>(null);
  const placement = useSubmenuPosition(open, contentRef);

  return (
    <div
      ref={contentRef}
      data-slot="dropdown-menu-sub-content"
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
