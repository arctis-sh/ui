"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible parts must be used within <Collapsible>");
  }
  return context;
}

type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
};

export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const controlled = openProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ? openProp : uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) return;
      if (!controlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, disabled, onOpenChange],
  );

  const value = useMemo(
    () => ({ open, setOpen, disabled, triggerId, contentId }),
    [contentId, disabled, open, setOpen, triggerId],
  );

  return (
    <CollapsibleContext.Provider value={value}>
      <div
        {...props}
        data-slot="collapsible"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        className={cn(className)}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

type CollapsibleTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function CollapsibleTrigger({
  className,
  children,
  onClick,
  disabled,
  ...props
}: CollapsibleTriggerProps) {
  const {
    open,
    setOpen,
    disabled: rootDisabled,
    triggerId,
    contentId,
  } = useCollapsible();
  const isDisabled = disabled || rootDisabled;

  return (
    <button
      type="button"
      {...props}
      id={triggerId}
      data-slot="collapsible-trigger"
      data-state={open ? "open" : "closed"}
      aria-controls={contentId}
      aria-expanded={open}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-normal tracking-wide transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
    >
      {children}
    </button>
  );
}

type CollapsibleContentProps = HTMLAttributes<HTMLDivElement> & {
  unmountOnExit?: boolean;
  children: ReactNode;
};

export function CollapsibleContent({
  className,
  children,
  unmountOnExit = false,
  ...props
}: CollapsibleContentProps) {
  const { open, triggerId, contentId } = useCollapsible();
  const [mounted, setMounted] = useState(open || !unmountOnExit);
  const [mountKey, setMountKey] = useState(0);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (!unmountOnExit) {
      setMounted(true);
      return;
    }

    if (open) {
      if (!wasOpen.current) {
        setMountKey((key) => key + 1);
      }
      wasOpen.current = true;
      setMounted(true);
      return;
    }

    wasOpen.current = false;
    const timeout = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [open, unmountOnExit]);

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden" aria-hidden={!open}>
        {mounted ? (
          <div key={mountKey} className={cn(className)}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
