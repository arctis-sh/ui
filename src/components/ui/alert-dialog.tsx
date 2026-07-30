"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog parts must be used within <AlertDialog>");
  }
  return context;
}

type AlertDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function AlertDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: AlertDialogProps) {
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
    <AlertDialogContext.Provider value={value}>
      {children}
    </AlertDialogContext.Provider>
  );
}

type AlertDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function AlertDialogTrigger({
  className,
  children,
  onClick,
  ...props
}: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialog();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex rounded-md bg-primary px-2.5 py-1.5 text-sm font-normal tracking-wide text-primary-foreground transition-opacity duration-200 ease-out hover:opacity-85",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type AlertDialogContentProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "sm";
  variant?: "default" | "outline";
  children: ReactNode;
};

export function AlertDialogContent({
  size = "default",
  variant = "default",
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useAlertDialog();
  const [portalReady, setPortalReady] = useState(false);
  const entered = useOverlayEntered(open);

  useBodyScrollLock(open);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  if (!portalReady || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className={cn(
          "arctis-overlay-backdrop absolute inset-0 bg-black/40",
          entered && "arctis-overlay-backdrop-open",
        )}
        onClick={() => setOpen(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-size={size}
        data-variant={variant}
        className={cn(
          "arctis-overlay relative z-10 w-full origin-center rounded-md border border-border bg-card p-5 text-card-foreground",
          size === "sm" ? "max-w-sm p-4" : "max-w-md",
          entered && "arctis-overlay-open",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertDialogHeader({
  className,
  children,
  ...props
}: AlertDialogHeaderProps) {
  return (
    <div
      className={cn(
        "grid gap-y-1 has-[[data-slot=alert-dialog-media]]:grid-cols-[auto_1fr] has-[[data-slot=alert-dialog-media]]:gap-x-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertDialogMediaProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertDialogMedia({
  className,
  children,
  ...props
}: AlertDialogMediaProps) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "peer col-start-1 row-span-2 row-start-1 flex size-10 shrink-0 items-center justify-center self-start rounded-sm bg-background text-foreground [&>img]:size-full [&>img]:rounded-sm [&>img]:object-cover [&>svg]:size-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export function AlertDialogTitle({
  className,
  children,
  ...props
}: AlertDialogTitleProps) {
  const { titleId } = useAlertDialog();

  return (
    <h2
      id={titleId}
      className={cn(
        "text-base font-medium tracking-tight peer:col-start-2",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function AlertDialogDescription({
  className,
  children,
  ...props
}: AlertDialogDescriptionProps) {
  const { descriptionId } = useAlertDialog();

  return (
    <p
      id={descriptionId}
      className={cn("text-sm text-muted-foreground peer:col-start-2", className)}
      {...props}
    >
      {children}
    </p>
  );
}

type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertDialogFooter({
  className,
  children,
  ...props
}: AlertDialogFooterProps) {
  return (
    <div
      className={cn(
        "mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertDialogCancelProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function AlertDialogCancel({
  className,
  children,
  onClick,
  ...props
}: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialog();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-sm bg-secondary px-2.5 py-1.5 text-sm font-normal tracking-wide text-secondary-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type AlertDialogActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive";
  children: ReactNode;
};

export function AlertDialogAction({
  variant = "default",
  className,
  children,
  onClick,
  ...props
}: AlertDialogActionProps) {
  const { setOpen } = useAlertDialog();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-2.5 py-1.5 text-sm font-normal tracking-wide transition-opacity duration-200 ease-out hover:opacity-85 disabled:pointer-events-none disabled:opacity-40",
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary text-primary-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
