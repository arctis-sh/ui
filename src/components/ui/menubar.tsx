"use client";

import {
  createContext,
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
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";
import { useSubmenuPosition } from "@/lib/use-submenu-position";

type MenubarContextValue = {
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  barRef: RefObject<HTMLDivElement | null>;
};

const MenubarContext = createContext<MenubarContextValue | null>(null);

function useMenubar() {
  const context = useContext(MenubarContext);
  if (!context) {
    throw new Error("Menubar parts must be used within <Menubar>");
  }
  return context;
}

type MenubarMenuContextValue = {
  menuId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
};

const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null);

function useMenubarMenu() {
  const context = useContext(MenubarMenuContext);
  if (!context) {
    throw new Error("Menubar menu parts must be used within <MenubarMenu>");
  }
  return context;
}

type MenubarProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function Menubar({ className, children, ...props }: MenubarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(openMenuId !== null);

  useEffect(() => {
    if (!openMenuId) return;
    const menuId = openMenuId;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (barRef.current?.contains(target)) return;
      const selector = [
        `[data-slot="menubar-content"][data-menu-id="${CSS.escape(menuId)}"]`,
        `[data-slot="menubar-sub-content"][data-menu-id="${CSS.escape(menuId)}"]`,
      ].join(", ");
      const panels = document.querySelectorAll(selector);
      for (const panel of panels) {
        if (panel.contains(target)) return;
      }
      setOpenMenuId(null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenuId(null);
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenuId]);

  const value = useMemo(
    () => ({ openMenuId, setOpenMenuId, barRef }),
    [openMenuId],
  );

  return (
    <MenubarContext.Provider value={value}>
      <div
        ref={barRef}
        role="menubar"
        data-slot="menubar"
        className={cn(
          "flex h-8 w-fit items-center gap-0.5 rounded-lg border border-border p-[3px]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

type MenubarMenuProps = {
  children: ReactNode;
  value?: string;
};

function MenubarMenu({ children, value }: MenubarMenuProps) {
  const { openMenuId, setOpenMenuId } = useMenubar();
  const reactId = useId();
  const menuId = value ?? reactId;
  const open = openMenuId === menuId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenMenuId(next ? menuId : null);
    },
    [menuId, setOpenMenuId],
  );

  const context = useMemo(
    () => ({ menuId, open, setOpen, triggerRef, contentRef }),
    [menuId, open, setOpen],
  );

  return (
    <MenubarMenuContext.Provider value={context}>
      <div data-slot="menubar-menu" className="relative">
        {children}
      </div>
    </MenubarMenuContext.Provider>
  );
}

type MenubarTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function MenubarTrigger({
  className,
  children,
  onClick,
  ...props
}: MenubarTriggerProps) {
  const { open, setOpen, triggerRef } = useMenubarMenu();

  return (
    <button
      ref={triggerRef}
      type="button"
      role="menuitem"
      data-slot="menubar-trigger"
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn(
        "flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium tracking-wide select-none transition-colors duration-200 ease-out hover:bg-muted aria-expanded:bg-muted",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type MenubarContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
};

function MenubarContent({
  className,
  children,
  align = "start",
  sideOffset = 8,
  alignOffset = -4,
  style,
  onClick,
  ...props
}: MenubarContentProps) {
  const { open, menuId, triggerRef, contentRef, setOpen } = useMenubarMenu();
  const entered = useOverlayEntered(open);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<CSSProperties>({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    function update() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const next: CSSProperties = {
        top: rect.bottom + sideOffset,
      };

      if (align === "end") {
        next.right = window.innerWidth - rect.right - alignOffset;
        next.left = "auto";
      } else if (align === "center") {
        next.left = rect.left + rect.width / 2 + alignOffset;
        next.right = "auto";
      } else {
        next.left = rect.left + alignOffset;
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
  }, [open, align, alignOffset, sideOffset, triggerRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      data-slot="menubar-content"
      data-menu-id={menuId}
      style={{ ...style, ...coords }}
      className={cn(
        "arctis-overlay fixed z-50 w-max min-w-36 origin-top-left rounded-md border border-foreground/10 bg-surface p-1 text-foreground",
        align === "center" && "arctis-overlay-center origin-top",
        align === "end" && "origin-top-right",
        entered
          ? "arctis-overlay-open pointer-events-auto"
          : "pointer-events-none",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <MenubarCloseScope setOpen={setOpen}>{children}</MenubarCloseScope>
    </div>,
    document.body,
  );
}

const MenubarCloseContext = createContext<(open: boolean) => void>(() => {});

function MenubarCloseScope({
  children,
  setOpen,
}: {
  children: ReactNode;
  setOpen: (open: boolean) => void;
}) {
  return (
    <MenubarCloseContext.Provider value={setOpen}>
      {children}
    </MenubarCloseContext.Provider>
  );
}

function useMenubarClose() {
  return useContext(MenubarCloseContext);
}

const itemClass =
  "relative flex w-full cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-[13px] font-normal tracking-wide select-none transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground";

type MenubarItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  inset?: boolean;
  variant?: "default" | "destructive";
};

function MenubarItem({
  className,
  children,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: MenubarItemProps) {
  const setOpen = useMenubarClose();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="menubar-item"
      data-inset={inset ? "" : undefined}
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

type MenubarCheckboxItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  inset?: boolean;
};

function MenubarCheckboxItem({
  className,
  children,
  checked = false,
  disabled,
  onCheckedChange,
  onClick,
  inset,
  ...props
}: MenubarCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-slot="menubar-checkbox-item"
      data-inset={inset ? "" : undefined}
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

type MenubarRadioGroupContextValue = {
  value: string;
  onValueChange?: (value: string) => void;
};

const MenubarRadioGroupContext =
  createContext<MenubarRadioGroupContextValue | null>(null);

type MenubarRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

function MenubarRadioGroup({
  className,
  value = "",
  onValueChange,
  children,
  ...props
}: MenubarRadioGroupProps) {
  const context = useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );

  return (
    <MenubarRadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        data-slot="menubar-radio-group"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </MenubarRadioGroupContext.Provider>
  );
}

type MenubarRadioItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  value: string;
  inset?: boolean;
};

function MenubarRadioItem({
  className,
  children,
  value,
  disabled,
  onClick,
  inset,
  ...props
}: MenubarRadioItemProps) {
  const group = useContext(MenubarRadioGroupContext);
  const checked = group?.value === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      data-slot="menubar-radio-item"
      data-inset={inset ? "" : undefined}
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

type MenubarLabelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inset?: boolean;
};

function MenubarLabel({
  className,
  children,
  inset,
  ...props
}: MenubarLabelProps) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset ? "" : undefined}
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

type MenubarSeparatorProps = HTMLAttributes<HTMLDivElement>;

function MenubarSeparator({ className, ...props }: MenubarSeparatorProps) {
  return (
    <div
      role="separator"
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-foreground/10", className)}
      {...props}
    />
  );
}

type MenubarShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

function MenubarShortcut({
  className,
  children,
  ...props
}: MenubarShortcutProps) {
  return (
    <span
      data-slot="menubar-shortcut"
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

type MenubarGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function MenubarGroup({ className, children, ...props }: MenubarGroupProps) {
  return (
    <div
      role="group"
      data-slot="menubar-group"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

type MenubarSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MenubarSubContext = createContext<MenubarSubContextValue | null>(null);

function useMenubarSub() {
  const context = useContext(MenubarSubContext);
  if (!context) {
    throw new Error("MenubarSub parts must be used within <MenubarSub>");
  }
  return context;
}

type MenubarSubProps = {
  children: ReactNode;
};

function MenubarSub({ children }: MenubarSubProps) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <MenubarSubContext.Provider value={value}>
      <div
        data-slot="menubar-sub"
        className="relative"
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </MenubarSubContext.Provider>
  );
}

type MenubarSubTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  inset?: boolean;
};

function MenubarSubTrigger({
  className,
  children,
  inset,
  onClick,
  ...props
}: MenubarSubTriggerProps) {
  const { open, setOpen } = useMenubarSub();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="menubar-sub-trigger"
      data-inset={inset ? "" : undefined}
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn(itemClass, "pr-1.5", inset && "pl-8", className)}
      onMouseEnter={() => setOpen(true)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(true);
      }}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5 text-muted-foreground" />
    </button>
  );
}

type MenubarSubContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function MenubarSubContent({
  className,
  children,
  style,
  ...props
}: MenubarSubContentProps) {
  const { open } = useMenubarSub();
  const { menuId } = useMenubarMenu();
  const entered = useOverlayEntered(open);
  const contentRef = useRef<HTMLDivElement>(null);
  const placement = useSubmenuPosition(open, contentRef);

  return (
    <div
      ref={contentRef}
      role="menu"
      data-slot="menubar-sub-content"
      data-menu-id={menuId}
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

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
