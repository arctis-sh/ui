"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";
type TabsListVariant = "default" | "line";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  baseId: string;
};

type TabsListContextValue = {
  variant: TabsListVariant;
};

const TabsContext = createContext<TabsContextValue | null>(null);
const TabsListContext = createContext<TabsListContextValue>({
  variant: "default",
});

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs parts must be used within <Tabs>");
  }
  return context;
}

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  children?: ReactNode;
};

export function Tabs({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  children,
  ...props
}: TabsProps) {
  const baseId = useId();
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ? valueProp : uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const context = useMemo(
    () => ({ value, setValue, orientation, baseId }),
    [value, setValue, orientation, baseId],
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "group/tabs flex gap-2",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TabsListVariant;
  children?: ReactNode;
};

export function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsListProps) {
  const { orientation } = useTabs();

  return (
    <TabsListContext.Provider value={{ variant }}>
      <div
        role="tablist"
        data-slot="tabs-list"
        data-variant={variant}
        data-orientation={orientation}
        aria-orientation={orientation}
        className={cn(
          "group/tabs-list inline-flex w-fit justify-center rounded-md p-1 text-foreground/50",
          orientation === "horizontal"
            ? "h-9 flex-row items-stretch"
            : "h-fit flex-col items-stretch",
          variant === "default" && "bg-muted",
          variant === "line" &&
            "h-auto items-center gap-1 rounded-none bg-transparent p-0",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabsListContext.Provider>
  );
}

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  children?: ReactNode;
};

export function TabsTrigger({
  className,
  value,
  disabled,
  children,
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const { value: active, setValue, orientation, baseId } = useTabs();
  const { variant } = useContext(TabsListContext);
  const selected = active === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-content-${value}`;

  function activate() {
    if (disabled) return;
    setValue(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    const list = event.currentTarget.closest('[role="tablist"]');
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ),
    );
    const index = tabs.indexOf(event.currentTarget);
    if (index < 0) return;

    const horizontal = orientation === "horizontal";
    let next = -1;

    if (
      (horizontal && event.key === "ArrowRight") ||
      (!horizontal && event.key === "ArrowDown")
    ) {
      next = (index + 1) % tabs.length;
    } else if (
      (horizontal && event.key === "ArrowLeft") ||
      (!horizontal && event.key === "ArrowUp")
    ) {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    }

    if (next < 0) return;
    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  }

  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      data-slot="tabs-trigger"
      data-state={selected ? "active" : "inactive"}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 border border-transparent px-3 text-sm font-normal tracking-wide whitespace-nowrap transition-colors duration-200 ease-out outline-none",
        "text-foreground/50 hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        orientation === "vertical" && "w-full justify-start",
        variant === "default" &&
          "rounded-[max(0px,calc(var(--radius-md)-0.25rem))]",
        variant === "default" &&
          orientation === "horizontal" &&
          "h-full",
        variant === "default" &&
          orientation === "vertical" &&
          "min-h-8",
        variant === "default" &&
          selected &&
          "bg-surface-hover text-foreground",
        variant === "line" &&
          "rounded-none bg-transparent after:pointer-events-none after:absolute after:bg-foreground after:opacity-0 after:transition-opacity after:content-['']",
        variant === "line" && selected && "text-foreground after:opacity-100",
        variant === "line" &&
          orientation === "horizontal" &&
          "pb-2 after:inset-x-0 after:bottom-0 after:h-0.5",
        variant === "line" &&
          orientation === "vertical" &&
          "pr-2 after:inset-y-0 after:right-0 after:w-0.5",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) activate();
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: ReactNode;
  forceMount?: boolean;
};

export function TabsContent({
  className,
  value,
  forceMount = false,
  children,
  ...props
}: TabsContentProps) {
  const { value: active, baseId } = useTabs();
  const selected = active === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-content-${value}`;

  if (!forceMount && !selected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      data-slot="tabs-content"
      data-state={selected ? "active" : "inactive"}
      aria-labelledby={triggerId}
      hidden={!selected}
      tabIndex={0}
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}
