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
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useOverlayEntered } from "@/lib/use-overlay-entered";

type CommandItemMeta = {
  label: string;
  groupId: string | null;
  disabled: boolean;
};

type CommandContextValue = {
  query: string;
  setQuery: (query: string) => void;
  highlighted: string | null;
  setHighlighted: (value: string | null) => void;
  visibleValues: string[];
  itemCount: number;
  listId: string;
  inputId: string;
  registerItem: (value: string, meta: CommandItemMeta) => void;
  unregisterItem: (value: string) => void;
  select: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("Command parts must be used within <Command>");
  }
  return context;
}

type CommandGroupContextValue = {
  groupId: string;
  register: (value: string) => void;
  unregister: (value: string) => void;
};

const CommandGroupContext = createContext<CommandGroupContextValue | null>(
  null,
);

type CommandProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  onSelect?: (value: string) => void;
};

export function Command({
  className,
  children,
  onSelect,
  ...props
}: CommandProps) {
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(new Map<string, CommandItemMeta>());
  const [itemsVersion, setItemsVersion] = useState(0);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const registerItem = useCallback(
    (value: string, meta: CommandItemMeta) => {
      const prev = itemsRef.current.get(value);
      if (
        prev &&
        prev.label === meta.label &&
        prev.groupId === meta.groupId &&
        prev.disabled === meta.disabled
      ) {
        return;
      }
      itemsRef.current.set(value, meta);
      setItemsVersion((version) => version + 1);
    },
    [],
  );

  const unregisterItem = useCallback((value: string) => {
    if (!itemsRef.current.has(value)) return;
    itemsRef.current.delete(value);
    setItemsVersion((version) => version + 1);
  }, []);

  const visibleValues = useMemo(() => {
    void itemsVersion;
    const needle = query.trim().toLowerCase();
    const entries = [...itemsRef.current.entries()].filter(
      ([, meta]) => !meta.disabled,
    );
    if (!needle) return entries.map(([value]) => value);
    return entries
      .filter(
        ([value, meta]) =>
          meta.label.toLowerCase().includes(needle) ||
          value.toLowerCase().includes(needle),
      )
      .map(([value]) => value);
  }, [itemsVersion, query]);

  useEffect(() => {
    setHighlighted((current) =>
      current && visibleValues.includes(current) ? current : null,
    );
  }, [query, visibleValues]);

  const select = useCallback(
    (value: string) => {
      const meta = itemsRef.current.get(value);
      if (!meta || meta.disabled) return;
      onSelect?.(value);
    },
    [onSelect],
  );

  const context = useMemo(
    () => ({
      query,
      setQuery,
      highlighted,
      setHighlighted,
      visibleValues,
      itemCount: itemsRef.current.size,
      listId,
      inputId,
      registerItem,
      unregisterItem,
      select,
      inputRef,
    }),
    [
      highlighted,
      inputId,
      listId,
      query,
      registerItem,
      select,
      unregisterItem,
      visibleValues,
      itemsVersion,
    ],
  );

  return (
    <CommandContext.Provider value={context}>
      <div
        data-slot="command"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

type CommandInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  placeholder?: string;
};

export function CommandInput({
  className,
  placeholder = "Type a command or search…",
  onKeyDown,
  ...props
}: CommandInputProps) {
  const {
    query,
    setQuery,
    highlighted,
    setHighlighted,
    visibleValues,
    select,
    listId,
    inputId,
    inputRef,
  } = useCommand();

  function moveHighlight(delta: number) {
    if (!visibleValues.length) {
      setHighlighted(null);
      return;
    }
    const current = highlighted
      ? visibleValues.indexOf(highlighted)
      : -1;
    const next =
      current === -1
        ? delta > 0
          ? 0
          : visibleValues.length - 1
        : (current + delta + visibleValues.length) % visibleValues.length;
    setHighlighted(visibleValues[next] ?? null);
  }

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b border-border px-3"
    >
      <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <input
        {...props}
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        data-slot="command-input"
        placeholder={placeholder}
        value={query}
        className={cn(
          "h-9 w-full bg-transparent text-sm tracking-wide placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-40",
          className,
        )}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveHighlight(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            moveHighlight(-1);
          } else if (event.key === "Enter") {
            if (highlighted) {
              event.preventDefault();
              select(highlighted);
            }
          }
        }}
      />
    </div>
  );
}

type CommandListProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CommandList({
  className,
  children,
  ...props
}: CommandListProps) {
  const { listId, visibleValues, itemCount } = useCommand();
  const empty = visibleValues.length === 0 && itemCount > 0;

  return (
    <div
      id={listId}
      role="listbox"
      data-slot="command-list"
      className={cn(
        "max-h-72 overflow-x-hidden overflow-y-auto scroll-py-1",
        empty ? "p-0" : "p-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CommandEmptyProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function CommandEmpty({
  className,
  children = "No results found.",
  ...props
}: CommandEmptyProps) {
  const { visibleValues, itemCount } = useCommand();
  if (visibleValues.length > 0 || itemCount === 0) return null;

  return (
    <div
      data-slot="command-empty"
      className={cn(
        "px-2 py-6 text-center text-sm tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CommandGroupProps = HTMLAttributes<HTMLDivElement> & {
  heading?: ReactNode;
  children: ReactNode;
};

export function CommandGroup({
  className,
  heading,
  children,
  ...props
}: CommandGroupProps) {
  const groupId = useId();
  const { visibleValues } = useCommand();
  const itemsRef = useRef(new Set<string>());
  const [, bump] = useState(0);

  const groupContext = useMemo<CommandGroupContextValue>(
    () => ({
      groupId,
      register: (value: string) => {
        if (itemsRef.current.has(value)) return;
        itemsRef.current.add(value);
        bump((n) => n + 1);
      },
      unregister: (value: string) => {
        if (!itemsRef.current.has(value)) return;
        itemsRef.current.delete(value);
        bump((n) => n + 1);
      },
    }),
    [groupId],
  );

  void visibleValues;
  const hasVisible = [...itemsRef.current].some((value) =>
    visibleValues.includes(value),
  );
  const hideGroup = itemsRef.current.size > 0 && !hasVisible;

  return (
    <CommandGroupContext.Provider value={groupContext}>
      <div
        data-slot="command-group"
        role="group"
        hidden={hideGroup}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {heading ? (
          <div
            data-slot="command-group-heading"
            className="px-2 py-1.5 text-xs tracking-wide text-muted-foreground"
          >
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    </CommandGroupContext.Provider>
  );
}

type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function CommandSeparator({
  className,
  ...props
}: CommandSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { visibleValues } = useCommand();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function nearestGroup(start: Element | null, direction: "prev" | "next") {
      let current =
        direction === "prev"
          ? start?.previousElementSibling
          : start?.nextElementSibling;
      while (current) {
        if (current.getAttribute("data-slot") === "command-group") {
          return current;
        }
        current =
          direction === "prev"
            ? current.previousElementSibling
            : current.nextElementSibling;
      }
      return null;
    }

    const prev = nearestGroup(node, "prev");
    const next = nearestGroup(node, "next");
    const prevVisible = Boolean(prev && !prev.hasAttribute("hidden"));
    const nextVisible = Boolean(next && !next.hasAttribute("hidden"));
    setShow(prevVisible && nextVisible);
  }, [visibleValues]);

  return (
    <div
      ref={ref}
      role="separator"
      data-slot="command-separator"
      hidden={!show}
      className={cn("-mx-1 my-1 h-px bg-foreground/10", className)}
      {...props}
    />
  );
}

type CommandItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  label?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  children: ReactNode;
};

export function CommandItem({
  value,
  label: labelProp,
  className,
  children,
  disabled = false,
  onSelect: onSelectProp,
  onMouseEnter,
  onClick,
  ...props
}: CommandItemProps) {
  const {
    registerItem,
    unregisterItem,
    visibleValues,
    highlighted,
    setHighlighted,
    select,
  } = useCommand();
  const group = useContext(CommandGroupContext);
  const groupId = group?.groupId ?? null;
  const groupRegister = group?.register;
  const groupUnregister = group?.unregister;

  const label =
    labelProp ?? (typeof children === "string" ? children : value);

  useEffect(() => {
    registerItem(value, {
      label,
      groupId,
      disabled,
    });
    groupRegister?.(value);
    return () => {
      unregisterItem(value);
      groupUnregister?.(value);
    };
  }, [
    disabled,
    groupId,
    groupRegister,
    groupUnregister,
    label,
    registerItem,
    unregisterItem,
    value,
  ]);

  const visible = visibleValues.includes(value);
  const active = highlighted === value;

  return (
    <div
      role="option"
      data-slot="command-item"
      data-highlighted={active ? "" : undefined}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      hidden={!visible}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[13px] font-normal tracking-wide text-foreground transition-colors duration-200 ease-out select-none",
        "hover:bg-surface-hover hover:text-foreground",
        active && "bg-surface-hover text-foreground",
        disabled && "pointer-events-none opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!disabled && visible) setHighlighted(value);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled || !visible) return;
        onSelectProp?.(value);
        select(value);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

type CommandShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function CommandShortcut({
  className,
  children,
  ...props
}: CommandShortcutProps) {
  return (
    <span
      data-slot="command-shortcut"
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

type CommandDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const CommandDialogContext = createContext<CommandDialogContextValue | null>(
  null,
);

function useCommandDialog() {
  const context = useContext(CommandDialogContext);
  if (!context) {
    throw new Error("CommandDialog parts must be used within <CommandDialog>");
  }
  return context;
}

type CommandDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function CommandDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: CommandDialogProps) {
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
    <CommandDialogContext.Provider value={value}>
      {children}
    </CommandDialogContext.Provider>
  );
}

type CommandDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function CommandDialogTrigger({
  className,
  children,
  onClick,
  ...props
}: CommandDialogTriggerProps) {
  const { setOpen } = useCommandDialog();

  return (
    <button
      type="button"
      data-slot="command-dialog-trigger"
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

type CommandDialogContentProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function CommandDialogContent({
  title = "Command Palette",
  description = "Search for a command to run…",
  className,
  children,
  ...props
}: CommandDialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useCommandDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [anchorTop, setAnchorTop] = useState<number | null>(null);
  const entered = useOverlayEntered(open);

  useBodyScrollLock(open);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (open) return;
    setAnchorTop(null);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !entered || anchorTop !== null) return;
    const node = contentRef.current;
    if (!node) return;
    setAnchorTop(node.getBoundingClientRect().top);
  }, [open, entered, anchorTop]);

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
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-center px-4",
        anchorTop === null ? "items-center" : "items-start",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "arctis-overlay-backdrop absolute inset-0 bg-black/40",
          entered && "arctis-overlay-backdrop-open",
        )}
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-slot="command-dialog-content"
        data-state={entered ? "open" : "closed"}
        style={anchorTop !== null ? { marginTop: anchorTop } : undefined}
        className={cn(
          "arctis-overlay relative z-10 w-full max-w-lg origin-center overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          entered && "arctis-overlay-open",
          className,
        )}
        {...props}
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Close the command dialog from an item select handler. */
export function useCommandDialogClose() {
  const { setOpen } = useCommandDialog();
  return useCallback(() => setOpen(false), [setOpen]);
}
