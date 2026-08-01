"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
} from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

function mergeClass<State>(
  base: string,
  className?: string | ((state: State) => string | undefined),
) {
  if (typeof className === "function") {
    return (state: State) => cn(base, className(state));
  }
  return cn(base, className);
}

type DialogContextValue = {
  open: boolean;
  entered: boolean;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog parts must be used within <Dialog>");
  }
  return context;
}

function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: DialogPrimitive.Root.Props) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? Boolean(openProp) : uncontrolled;
  const entered = useOverlayEntered(open);

  return (
    <DialogContext.Provider value={{ open, entered }}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={open}
        onOpenChange={(next, eventDetails) => {
          if (!controlled) setUncontrolled(next);
          onOpenChange?.(next, eventDetails);
        }}
        {...props}
      />
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  className,
  ...props
}: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={mergeClass("", className)}
      {...props}
    />
  );
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ className, ...props }: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={mergeClass("", className)}
      {...props}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  const { entered } = useDialog();

  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={mergeClass(
        cn(
          "arctis-overlay-backdrop absolute inset-0 bg-black/40",
          entered && "arctis-overlay-backdrop-open",
        ),
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  const { entered } = useDialog();

  return (
    <DialogPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogOverlay />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={mergeClass(
            cn(
              "arctis-overlay relative z-10 grid w-full max-w-[calc(100%-2rem)] origin-center gap-4 rounded-md border border-border bg-card p-5 text-sm tracking-wide text-card-foreground outline-none sm:max-w-sm",
              showCloseButton && "[&_[data-slot=dialog-header]]:pr-10",
              entered && "arctis-overlay-open",
            ),
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className={buttonVariants({
                variant: "ghost",
                size: "icon-sm",
                className:
                  "absolute top-3 right-3 text-muted-foreground hover:text-foreground",
              })}
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className={buttonVariants({ variant: "outline" })}
        >
          Close
        </DialogPrimitive.Close>
      ) : null}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={mergeClass(
        "text-base font-medium tracking-wide text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={mergeClass(
        "text-sm tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
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

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
