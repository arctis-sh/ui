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

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  collapsible: boolean;
  openValues: string[];
  toggle: (value: string) => void;
  baseId: string;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<{
  value: string;
  disabled: boolean;
  hasIcon: boolean;
  setHasIcon: (value: boolean) => void;
} | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return context;
}

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionItem parts must be used within <AccordionItem>");
  }
  return context;
}

type AccordionProps = {
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: ReactNode;
};

function toArray(value?: string | string[]) {
  if (value == null) return [] as string[];
  return Array.isArray(value) ? value : [value];
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: AccordionProps) {
  const baseId = useId();
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() => toArray(defaultValue));
  const openValues = controlled ? toArray(value) : uncontrolled;

  const setOpenValues = useCallback(
    (next: string[]) => {
      if (!controlled) setUncontrolled(next);
      if (type === "single") onValueChange?.(next[0] ?? "");
      else onValueChange?.(next);
    },
    [controlled, onValueChange, type],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const isOpen = openValues[0] === itemValue;
        if (isOpen && !collapsible) return;
        setOpenValues(isOpen ? [] : [itemValue]);
        return;
      }

      const isOpen = openValues.includes(itemValue);
      setOpenValues(
        isOpen
          ? openValues.filter((entry) => entry !== itemValue)
          : [...openValues, itemValue],
      );
    },
    [collapsible, openValues, setOpenValues, type],
  );

  const context = useMemo(
    () => ({ type, collapsible, openValues, toggle, baseId }),
    [baseId, collapsible, openValues, toggle, type],
  );

  return (
    <AccordionContext.Provider value={context}>
      <div className={cn("flex w-full flex-col", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
}: AccordionItemProps) {
  const [hasIcon, setHasIcon] = useState(false);

  return (
    <AccordionItemContext.Provider
      value={{ value, disabled, hasIcon, setHasIcon }}
    >
      <div
        data-slot="accordion-item"
        data-disabled={disabled ? "" : undefined}
        className={cn("border-b border-border last:border-b-0", className)}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function ChevronIndicator({ open, muted }: { open: boolean; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-200 ease-out",
        muted ? "text-muted-foreground/50" : "text-muted-foreground",
        open && "rotate-180",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="size-4"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PlusMinusIndicator({ open, muted }: { open: boolean; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center",
        muted ? "text-muted-foreground/50" : "text-muted-foreground",
      )}
    >
      <span className="absolute inset-x-[3px] top-1/2 h-px -translate-y-1/2 bg-current" />
      <span
        className={cn(
          "absolute inset-y-[3px] left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-200 ease-out",
          open && "rotate-90",
        )}
      />
    </span>
  );
}

type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  indicator?: "chevron" | "plus";
};

export function AccordionTrigger({
  className,
  children,
  icon,
  indicator = "chevron",
  ...props
}: AccordionTriggerProps) {
  const { openValues, toggle, baseId } = useAccordionContext();
  const { value, disabled, setHasIcon } = useAccordionItemContext();
  const open = openValues.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  useEffect(() => {
    setHasIcon(Boolean(icon));
  }, [icon, setHasIcon]);

  return (
    <div className="flex">
      <button
        type="button"
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-state={open ? "open" : "closed"}
        onClick={() => {
          if (disabled) return;
          toggle(value);
        }}
        className={cn(
          "flex flex-1 items-center gap-3 py-3 text-left text-sm font-medium tracking-wide",
          disabled ? "cursor-default text-muted-foreground/50" : "text-foreground",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-4 shrink-0 items-center justify-center",
              disabled ? "text-muted-foreground/50" : "text-muted-foreground",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">{children}</span>
        {indicator === "plus" ? (
          <PlusMinusIndicator open={open} muted={disabled} />
        ) : (
          <ChevronIndicator open={open} muted={disabled} />
        )}
      </button>
    </div>
  );
}

type AccordionContentProps = HTMLAttributes<HTMLDivElement> & {
  unmountOnExit?: boolean;
};

export function AccordionContent({
  className,
  children,
  unmountOnExit = false,
  ...props
}: AccordionContentProps) {
  const { openValues, baseId } = useAccordionContext();
  const { value, hasIcon } = useAccordionItemContext();
  const open = openValues.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;
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
      data-state={open ? "open" : "closed"}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      {...props}
    >
      <div className="overflow-hidden" aria-hidden={!open}>
        {mounted ? (
          <div
            key={mountKey}
            className={cn(
              "pb-3 text-[13px] leading-relaxed tracking-wide text-muted-foreground",
              hasIcon && "pl-7",
              className,
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
