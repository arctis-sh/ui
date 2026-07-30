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
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

type ComboboxContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  filtering: boolean;
  setFiltering: (filtering: boolean) => void;
  value: string | string[];
  multiple: boolean;
  disabled: boolean;
  invalid: boolean;
  showClear: boolean;
  autoHighlight: boolean;
  inputId: string;
  listId: string;
  highlighted: string | null;
  setHighlighted: (value: string | null) => void;
  visibleValues: string[];
  itemCount: number;
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  isSelected: (value: string) => boolean;
  getLabel: (value: string) => string;
  select: (value: string) => void;
  remove: (value: string) => void;
  clear: () => void;
  clearSelection: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error("Combobox parts must be used within <Combobox>");
  }
  return context;
}

type ComboboxProps = {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  autoHighlight?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
};

function normalizeValue(
  value: string | string[] | undefined,
  multiple: boolean,
): string | string[] {
  if (multiple) {
    if (Array.isArray(value)) return value;
    if (value == null || value === "") return [];
    return [value];
  }
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function Combobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  invalid = false,
  showClear = false,
  autoHighlight = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: ComboboxProps) {
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map<string, string>());
  const [itemsVersion, setItemsVersion] = useState(0);

  const valueControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    normalizeValue(defaultValue, multiple),
  );
  const value = normalizeValue(
    valueControlled ? valueProp : uncontrolledValue,
    multiple,
  );

  const openControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openControlled ? openProp : uncontrolledOpen;

  const [query, setQuery] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) return;
      if (!openControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) {
        setQuery("");
        setFiltering(false);
        setHighlighted(null);
      }
    },
    [disabled, onOpenChange, openControlled],
  );

  useBodyScrollLock(open);

  const setValue = useCallback(
    (next: string | string[]) => {
      if (!valueControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [onValueChange, valueControlled],
  );

  const registerItem = useCallback((itemValue: string, label: string) => {
    const prev = itemsRef.current.get(itemValue);
    if (prev === label) return;
    itemsRef.current.set(itemValue, label);
    setItemsVersion((version) => version + 1);
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    if (!itemsRef.current.has(itemValue)) return;
    itemsRef.current.delete(itemValue);
    setItemsVersion((version) => version + 1);
  }, []);

  const visibleValues = useMemo(() => {
    void itemsVersion;
    const needle = query.trim().toLowerCase();
    const entries = [...itemsRef.current.entries()];
    if (!needle) return entries.map(([itemValue]) => itemValue);
    return entries
      .filter(
        ([itemValue, label]) =>
          label.toLowerCase().includes(needle) ||
          itemValue.toLowerCase().includes(needle),
      )
      .map(([itemValue]) => itemValue);
  }, [itemsVersion, query]);

  const isSelected = useCallback(
    (itemValue: string) => {
      if (multiple) return (value as string[]).includes(itemValue);
      return value === itemValue;
    },
    [multiple, value],
  );

  const getLabel = useCallback((itemValue: string) => {
    return itemsRef.current.get(itemValue) ?? itemValue;
  }, []);

  const select = useCallback(
    (itemValue: string) => {
      if (disabled) return;
      if (multiple) {
        const current = value as string[];
        const next = current.includes(itemValue)
          ? current.filter((entry) => entry !== itemValue)
          : [...current, itemValue];
        setValue(next);
        setQuery("");
        setFiltering(false);
        inputRef.current?.focus();
        return;
      }
      setValue(itemValue);
      setQuery("");
      setFiltering(false);
      setOpen(false);
    },
    [disabled, multiple, setOpen, setValue, value],
  );

  const remove = useCallback(
    (itemValue: string) => {
      if (!multiple || disabled) return;
      setValue((value as string[]).filter((entry) => entry !== itemValue));
    },
    [disabled, multiple, setValue, value],
  );

  const clearSelection = useCallback(() => {
    if (disabled) return;
    setValue(multiple ? [] : "");
  }, [disabled, multiple, setValue]);

  const clear = useCallback(() => {
    if (disabled) return;
    setValue(multiple ? [] : "");
    setQuery("");
    setFiltering(false);
    inputRef.current?.focus();
  }, [disabled, multiple, setValue]);

  useEffect(() => {
    if (!open || !autoHighlight) return;
    setHighlighted(visibleValues[0] ?? null);
  }, [autoHighlight, open, query, visibleValues]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  const context = useMemo(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      filtering,
      setFiltering,
      value,
      multiple,
      disabled,
      invalid,
      showClear,
      autoHighlight,
      inputId,
      listId,
      highlighted,
      setHighlighted,
      visibleValues,
      itemCount: itemsRef.current.size,
      registerItem,
      unregisterItem,
      isSelected,
      getLabel,
      select,
      remove,
      clear,
      clearSelection,
      inputRef,
    }),
    [
      autoHighlight,
      clear,
      clearSelection,
      disabled,
      filtering,
      highlighted,
      inputId,
      invalid,
      isSelected,
      getLabel,
      listId,
      multiple,
      open,
      query,
      registerItem,
      remove,
      select,
      setOpen,
      showClear,
      unregisterItem,
      value,
      visibleValues,
      itemsVersion,
    ],
  );

  return (
    <ComboboxContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="combobox"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        className={cn("relative w-full", className)}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
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

function ChevronsUpDownIcon({ className }: { className?: string }) {
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
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
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

type ComboboxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  placeholder?: string;
  showIcon?: boolean;
  /** Search-only field (e.g. inside a popup). Never mirrors or clears the selected value. */
  filterOnly?: boolean;
  /** Leading content (e.g. selected avatar). Hidden while filtering unless always. */
  startAddon?: ReactNode;
  /** Keep startAddon visible while filtering. */
  startAddonAlways?: boolean;
};

export function ComboboxInput({
  className,
  placeholder = "Select…",
  showIcon = true,
  filterOnly = false,
  startAddon,
  startAddonAlways = false,
  onFocus,
  onKeyDown,
  ...props
}: ComboboxInputProps) {
  const {
    open,
    setOpen,
    query,
    setQuery,
    filtering,
    setFiltering,
    value,
    multiple,
    disabled,
    invalid,
    showClear,
    inputId,
    listId,
    highlighted,
    setHighlighted,
    visibleValues,
    select,
    clear,
    clearSelection,
    getLabel,
    inputRef,
  } = useCombobox();

  const selectedLabel =
    !multiple && value ? getLabel(value as string) : "";

  // Show the selected label until the user edits; emptied input clears the value.
  const displayValue =
    multiple || filterOnly || filtering ? query : selectedLabel;

  const canClear =
    !filterOnly &&
    showClear &&
    !disabled &&
    (multiple ? (value as string[]).length > 0 : Boolean(value));

  const showStartAddon =
    Boolean(startAddon) &&
    (startAddonAlways || filterOnly || !filtering);

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
    <div className="relative">
      {showStartAddon ? (
        <div className="pointer-events-none absolute inset-y-0 left-2.5 z-10 flex items-center">
          {startAddon}
        </div>
      ) : null}
      <input
        {...props}
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        data-slot="combobox-input"
        placeholder={placeholder}
        value={displayValue}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm tracking-wide transition-colors duration-200 ease-out placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-40",
          "aria-invalid:border-destructive",
          canClear && showIcon
            ? "pr-16"
            : canClear || showIcon
              ? "pr-9"
              : "pr-3",
          !showStartAddon && "pl-3",
          className,
          showStartAddon && "pl-9",
        )}
        onFocus={(event) => {
          onFocus?.(event);
          setOpen(true);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setFiltering(true);
          setQuery(next);
          setOpen(true);
          if (!multiple && !filterOnly && next === "") {
            clearSelection();
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            moveHighlight(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            moveHighlight(-1);
          } else if (event.key === "Enter") {
            if (open && highlighted) {
              event.preventDefault();
              select(highlighted);
            }
          } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          } else if (
            event.key === "Backspace" &&
            multiple &&
            !query &&
            (value as string[]).length
          ) {
            const last = (value as string[])[(value as string[]).length - 1];
            if (last) select(last);
          }
        }}
      />
      {canClear || showIcon ? (
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1">
          {canClear ? (
            <button
              type="button"
              tabIndex={-1}
              data-slot="combobox-clear"
              className="pointer-events-auto inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => clear()}
              aria-label="Clear"
            >
              <XIcon className="size-3.5" />
            </button>
          ) : null}
          {showIcon ? (
            <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type ComboboxTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function ComboboxTrigger({
  className,
  children,
  onClick,
  ...props
}: ComboboxTriggerProps) {
  const { open, setOpen, disabled, invalid } = useCombobox();

  return (
    <button
      type="button"
      {...props}
      data-slot="combobox-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm tracking-wide transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
        "aria-invalid:border-destructive",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
    >
      {children}
      <ChevronsUpDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}

type ComboboxContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ComboboxContent({
  className,
  children,
  ...props
}: ComboboxContentProps) {
  const { open } = useCombobox();

  return (
    <div
      data-slot="combobox-content"
      data-state={open ? "open" : "closed"}
      className={cn(
        "absolute top-[calc(100%+0.375rem)] z-50 w-full origin-top overflow-hidden rounded-md border border-foreground/10 bg-surface text-foreground transition-all duration-200 ease-out",
        open
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxListProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ComboboxList({
  className,
  children,
  ...props
}: ComboboxListProps) {
  const { listId, open, visibleValues } = useCombobox();
  const empty = visibleValues.length === 0;

  return (
    <div
      id={listId}
      role="listbox"
      data-slot="combobox-list"
      hidden={empty}
      aria-hidden={!open || undefined}
      className={cn("max-h-60 overflow-auto p-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function ComboboxEmpty({
  className,
  children = "No items found.",
  ...props
}: ComboboxEmptyProps) {
  const { visibleValues, open, itemCount } = useCombobox();
  if (!open || visibleValues.length > 0 || itemCount === 0) return null;

  return (
    <div
      data-slot="combobox-empty"
      className={cn(
        "px-2 py-4 text-center text-sm tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  /** Filter / display label when children are not a plain string. */
  label?: string;
  children: ReactNode;
  disabled?: boolean;
};

export function ComboboxItem({
  value,
  label: labelProp,
  className,
  children,
  disabled = false,
  onClick,
  onMouseEnter,
  ...props
}: ComboboxItemProps) {
  const {
    registerItem,
    unregisterItem,
    visibleValues,
    isSelected,
    select,
    highlighted,
    setHighlighted,
  } = useCombobox();

  const label =
    labelProp ??
    (typeof children === "string" ? children : value);

  useEffect(() => {
    registerItem(value, label);
    return () => unregisterItem(value);
  }, [label, registerItem, unregisterItem, value]);

  const visible = visibleValues.includes(value);
  const selected = isSelected(value);
  const active = highlighted === value;

  return (
    <div
      role="option"
      data-slot="combobox-item"
      data-selected={selected ? "" : undefined}
      data-highlighted={active ? "" : undefined}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      hidden={!visible}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[13px] font-normal tracking-wide text-foreground transition-colors duration-200 ease-out",
        "hover:bg-surface-hover hover:text-foreground",
        active && "bg-surface-hover text-foreground",
        disabled && "pointer-events-none opacity-40",
        !visible && "hidden",
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!disabled && visible) setHighlighted(value);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled && visible) select(value);
      }}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <CheckIcon
        className={cn(
          "size-3.5 shrink-0",
          selected ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

type ComboboxGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ComboboxGroup({
  className,
  children,
  ...props
}: ComboboxGroupProps) {
  return (
    <div
      data-slot="combobox-group"
      role="group"
      className={cn("overflow-hidden p-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxLabelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ComboboxLabel({
  className,
  children,
  ...props
}: ComboboxLabelProps) {
  return (
    <div
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 text-xs tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function ComboboxSeparator({
  className,
  ...props
}: ComboboxSeparatorProps) {
  return (
    <div
      role="separator"
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-foreground/10", className)}
      {...props}
    />
  );
}

type ComboboxChipsProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ComboboxChips({
  className,
  children,
  onClick,
  ...props
}: ComboboxChipsProps) {
  const { setOpen, disabled, invalid, inputRef } = useCombobox();

  return (
    <div
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent p-1.5 transition-colors duration-200 ease-out",
        invalid && "border-destructive",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          setOpen(true);
          inputRef.current?.focus();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

type ComboboxChipProps = HTMLAttributes<HTMLSpanElement> & {
  value: string;
  children: ReactNode;
};

export function ComboboxChip({
  value,
  className,
  children,
  ...props
}: ComboboxChipProps) {
  const { remove, disabled } = useCombobox();

  return (
    <span
      data-slot="combobox-chip"
      className={cn(
        "inline-flex h-5 max-w-full items-center gap-0.5 rounded-[calc(var(--radius-md)-0.375rem)] bg-secondary py-0 pl-1.5 pr-0.5 text-[11px] font-medium tracking-wide text-secondary-foreground",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        aria-label={`Remove ${typeof children === "string" ? children : value}`}
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground"
        onClick={(event) => {
          event.stopPropagation();
          remove(value);
        }}
      >
        <XIcon className="size-2.5" />
      </button>
    </span>
  );
}

type ComboboxChipsInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

export function ComboboxChipsInput({
  className,
  placeholder,
  onFocus,
  onKeyDown,
  ...props
}: ComboboxChipsInputProps) {
  const {
    open,
    query,
    setQuery,
    setOpen,
    disabled,
    inputId,
    listId,
    highlighted,
    setHighlighted,
    visibleValues,
    select,
    value,
    inputRef,
  } = useCombobox();

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
    <input
      {...props}
      ref={inputRef}
      id={inputId}
      role="combobox"
      aria-expanded={open}
      aria-controls={listId}
      aria-autocomplete="list"
      disabled={disabled}
      data-slot="combobox-chips-input"
      placeholder={placeholder}
      value={query}
      className={cn(
        "h-5 min-w-[2rem] flex-1 bg-transparent text-sm tracking-wide outline-none placeholder:text-muted-foreground",
        className,
      )}
      onFocus={(event) => {
        onFocus?.(event);
        setOpen(true);
      }}
      onChange={(event) => {
        setQuery(event.target.value);
        setOpen(true);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
          moveHighlight(1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
          moveHighlight(-1);
        } else if (event.key === "Enter") {
          if (highlighted) {
            event.preventDefault();
            select(highlighted);
          }
        } else if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
        } else if (
          event.key === "Backspace" &&
          !query &&
          (value as string[]).length
        ) {
          const last = (value as string[])[(value as string[]).length - 1];
          if (last) select(last);
        }
      }}
    />
  );
}

type ComboboxValueProps = HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string;
  children?: ReactNode;
};

export function ComboboxValue({
  className,
  placeholder = "Select…",
  children,
  ...props
}: ComboboxValueProps) {
  const { value, multiple, getLabel } = useCombobox();
  const empty = multiple
    ? (value as string[]).length === 0
    : !value;

  const fallback = multiple
    ? null
    : value
      ? getLabel(value as string)
      : null;

  return (
    <span
      data-slot="combobox-value"
      className={cn(
        "min-w-0 flex-1 truncate text-left text-sm tracking-wide",
        empty && "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (empty ? placeholder : fallback)}
    </span>
  );
}
