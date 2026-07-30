"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

type SheetSide = "top" | "right" | "bottom" | "left";

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet parts must be used within <Sheet>");
  }
  return context;
}

type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolled;
  const titleId = useId();
  const descriptionId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const value = useMemo(
    () => ({ open, setOpen, titleId, descriptionId }),
    [open, setOpen, titleId, descriptionId],
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

type SheetTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function SheetTrigger({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: SheetTriggerProps) {
  const { setOpen } = useSheet();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented) setOpen(true);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    }>;
    return cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function SheetClose({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: SheetCloseProps) {
  const { setOpen } = useSheet();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented) setOpen(false);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    }>;
    return cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="sheet-close"
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

type SheetContentProps = HTMLAttributes<HTMLDivElement> & {
  side?: SheetSide;
  showCloseButton?: boolean;
  children: ReactNode;
};

export function SheetContent({
  side = "right",
  showCloseButton = true,
  className,
  children,
  ...props
}: SheetContentProps) {
  const { open, setOpen, titleId, descriptionId } = useSheet();
  const [portalReady, setPortalReady] = useState(false);
  const [present, setPresent] = useState(false);
  const [entered, setEntered] = useState(false);

  useBodyScrollLock(present);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (open) {
      setPresent(true);
      let frame2 = 0;
      const frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(frame1);
        cancelAnimationFrame(frame2);
      };
    }

    setEntered(false);
    const timeout = window.setTimeout(() => setPresent(false), 320);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!present) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [present, setOpen]);

  if (!portalReady || !present) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        data-slot="sheet-overlay"
        className={cn(
          "arctis-overlay-backdrop absolute inset-0 bg-black/40",
          entered && "arctis-overlay-backdrop-open",
        )}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "arctis-sheet isolate fixed z-50 flex flex-col bg-surface text-foreground shadow-lg",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 rounded-l-md sm:max-w-sm",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 rounded-r-md sm:max-w-sm",
          side === "top" && "inset-x-0 top-0 h-auto rounded-b-md",
          side === "bottom" && "inset-x-0 bottom-0 h-auto rounded-t-md",
          showCloseButton && "[&_[data-slot=sheet-header]]:pr-12",
          entered && "arctis-sheet-open",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <button
            type="button"
            data-slot="sheet-close"
            aria-label="Close"
            className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-4" />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

type SheetHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function SheetHeader({
  className,
  children,
  ...props
}: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type SheetFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function SheetFooter({
  className,
  children,
  ...props
}: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type SheetTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export function SheetTitle({
  className,
  children,
  ...props
}: SheetTitleProps) {
  const { titleId } = useSheet();

  return (
    <h2
      id={titleId}
      data-slot="sheet-title"
      className={cn("text-base font-medium tracking-wide text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

type SheetDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function SheetDescription({
  className,
  children,
  ...props
}: SheetDescriptionProps) {
  const { descriptionId } = useSheet();

  return (
    <p
      id={descriptionId}
      data-slot="sheet-description"
      className={cn("text-sm tracking-wide text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
