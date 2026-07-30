"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

export type { ToggleVariant, ToggleSize };

type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value" | "children"
> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: ReactNode;
};

const variantClass: Record<ToggleVariant, string> = {
  default:
    "bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  outline:
    "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
};

const sizeClass: Record<ToggleSize, string> = {
  default: "h-9 min-w-9 gap-2 px-2",
  sm: "h-8 min-w-8 gap-1.5 px-1.5 [&_svg]:size-3.5",
  lg: "h-10 min-w-10 gap-2 px-2.5",
};

export function toggleVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-md text-sm font-normal tracking-wide whitespace-nowrap transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}

export function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  disabled,
  className,
  type = "button",
  children,
  onClick,
  ...props
}: ToggleProps) {
  const controlled = pressedProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultPressed);
  const pressed = controlled ? pressedProp : uncontrolled;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const next = !pressed;
    if (!controlled) setUncontrolled(next);
    onPressedChange?.(next);
  }

  return (
    <button
      type={type}
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      disabled={disabled}
      className={toggleVariants({ variant, size, className })}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
