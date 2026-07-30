"use client";

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  buttonGroupItemClass,
  buttonGroupOutlineJoinClass,
} from "@/components/ui/button-group";
import {
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";
type Slot = "single" | "first" | "middle" | "last";

type ToggleGroupContextValue = {
  type: "single" | "multiple";
  value: string[];
  toggle: (itemValue: string) => void;
  variant: ToggleVariant;
  size: ToggleSize;
  spacing: number;
  orientation: Orientation;
  disabled: boolean;
  slot: Slot;
  overlap: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup() {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within <ToggleGroup>");
  }
  return context;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : value === "" ? [] : [value];
}

function slotFor(index: number, total: number): Slot {
  if (total <= 1) return "single";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  return "middle";
}

type ToggleGroupBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "dir"
> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
  spacing?: number;
  orientation?: Orientation;
  disabled?: boolean;
  children?: ReactNode;
};

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  spacing = 2,
  orientation = "horizontal",
  disabled = false,
  children,
  type = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  style,
  ...props
}: ToggleGroupProps) {
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() =>
    toArray(defaultValue),
  );
  const value = controlled ? toArray(valueProp) : uncontrolled;
  const items = Children.toArray(children).filter(Boolean);
  const connected = spacing === 0;

  const toggle = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      let next: string[];
      if (type === "multiple") {
        next = value.includes(itemValue)
          ? value.filter((item) => item !== itemValue)
          : [...value, itemValue];
      } else {
        next = value.includes(itemValue) ? [] : [itemValue];
      }

      if (!controlled) setUncontrolled(next);

      if (type === "multiple") {
        (onValueChange as ((value: string[]) => void) | undefined)?.(next);
      } else {
        (onValueChange as ((value: string) => void) | undefined)?.(
          next[0] ?? "",
        );
      }
    },
    [controlled, disabled, onValueChange, type, value],
  );

  const base = useMemo(
    () => ({
      type,
      value,
      toggle,
      variant,
      size,
      spacing,
      orientation,
      disabled,
    }),
    [type, value, toggle, variant, size, spacing, orientation, disabled],
  );

  return (
    <div
      role="group"
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={
        {
          ...style,
          gap: `${spacing * 0.25}rem`,
        } as CSSProperties
      }
      className={cn(
        "flex w-fit items-center",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    >
      {items.map((child, index) => {
        const slot = connected ? slotFor(index, items.length) : "single";
        const overlap = connected && index > 0;

        return (
          <ToggleGroupContext.Provider
            key={index}
            value={{ ...base, slot, overlap }}
          >
            {child}
          </ToggleGroupContext.Provider>
        );
      })}
    </div>
  );
}

type ToggleGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "children"
> & {
  value: string;
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: ReactNode;
};

export function ToggleGroupItem({
  className,
  children,
  value,
  variant: variantProp,
  size: sizeProp,
  disabled: disabledProp,
  type = "button",
  onClick,
  ...props
}: ToggleGroupItemProps) {
  const group = useToggleGroup();
  const variant = variantProp ?? group.variant;
  const size = sizeProp ?? group.size;
  const disabled = disabledProp || group.disabled;
  const pressed = group.value.includes(value);
  const connected = group.spacing === 0;
  const joinGroup = connected
    ? {
        orientation: group.orientation,
        slot: group.slot,
        overlap: group.overlap,
      }
    : null;
  const outlineJoinStay =
    connected &&
    group.overlap &&
    variant === "outline" &&
    (group.orientation === "horizontal"
      ? "data-[state=on]:z-10 data-[state=on]:!border-l-border"
      : "data-[state=on]:z-10 data-[state=on]:!border-t-border");

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    group.toggle(value);
  }

  return (
    <button
      type={type}
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      data-spacing={group.spacing}
      data-orientation={group.orientation}
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      disabled={disabled}
      className={cn(
        toggleVariants({ variant, size }),
        "min-w-0 shrink-0 px-3",
        buttonGroupItemClass(joinGroup),
        variant === "outline" && buttonGroupOutlineJoinClass(joinGroup),
        outlineJoinStay,
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
