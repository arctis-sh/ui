"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toastManager = ToastPrimitive.createToastManager();

export const toast = toastManager;
export const createToastManager = ToastPrimitive.createToastManager;
export const useToastManager = ToastPrimitive.useToastManager;

function mergeClass<State>(
  base: string,
  className?: string | ((state: State) => string | undefined),
) {
  if (typeof className === "function") {
    return (state: State) => cn(base, className(state));
  }
  return cn(base, className);
}

type ToastProviderProps = ComponentProps<typeof ToastPrimitive.Provider>;

export function ToastProvider({
  toastManager: manager = toastManager,
  ...props
}: ToastProviderProps) {
  return <ToastPrimitive.Provider toastManager={manager} {...props} />;
}

export function ToastPortal(
  props: ComponentProps<typeof ToastPrimitive.Portal>,
) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

export function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={mergeClass(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className,
      )}
      {...props}
    />
  );
}

export function Toast({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      swipeDirection={["down", "right"]}
      className={mergeClass(
        [
          "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none rounded-md border border-border bg-popover text-popover-foreground shadow-lg outline-none will-change-transform",
          "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
          "h-[var(--height)] [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
          "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
          "data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          "data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)]",
          "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
          "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
          "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
          "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
          "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export function ToastContent({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Content>) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={mergeClass(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-[behind]:opacity-0 data-[expanded]:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export function ToastTitle({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={mergeClass("text-sm font-medium tracking-wide", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={mergeClass(
        "text-sm tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ToastAction({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={mergeClass("shrink-0", className)}
      {...props}
    />
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-3", className)}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ToastClose({
  className,
  children,
  ...props
}: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      className={mergeClass(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground/50 transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <CloseIcon />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: { type: string | undefined }) {
  if (!type) return null;

  const className = cn(
    "size-4 shrink-0",
    type === "success" && "text-success",
    type === "info" && "text-foreground",
    type === "warning" && "text-warning",
    type === "error" && "text-destructive",
    type === "loading" && "text-muted-foreground",
  );

  if (type === "success") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (type === "info") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    );
  }

  if (type === "loading") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(className, "animate-spin")}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <ToastContent>
        <ToastIcon type={item.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {item.title ? <ToastTitle>{item.title}</ToastTitle> : null}
          {item.description ? (
            <ToastDescription>{item.description}</ToastDescription>
          ) : null}
        </div>
        {item.actionProps ? (
          <ToastAction
            render={<Button size="xs" variant="outline" />}
            {...item.actionProps}
          />
        ) : null}
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

type ToasterProps = ToastProviderProps & {
  children?: ReactNode;
};

export function Toaster({
  children,
  toastManager: manager = toastManager,
  ...props
}: ToasterProps) {
  return (
    <ToastProvider toastManager={manager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}
