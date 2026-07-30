"use client";

import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";

type SwitchSize = "default" | "sm";
type SwitchRadius = "none" | "default" | "full";

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value" | "children"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
  radius?: SwitchRadius;
};

const trackRadiusClass: Record<SwitchRadius, string> = {
  none: "rounded-none",
  default: "rounded-md",
  full: "rounded-full",
};

const thumbRadiusClass: Record<SwitchRadius, string> = {
  none: "rounded-none",
  default: "rounded-[calc(var(--radius-md)-0.125rem)]",
  full: "rounded-full",
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = "default",
  radius = "default",
  disabled,
  className,
  id,
  onClick,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const controlled = checked !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isChecked = controlled ? checked : uncontrolled;

  function toggle() {
    if (disabled) return;
    const next = !isChecked;
    if (!controlled) setUncontrolled(next);
    onCheckedChange?.(next);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented) toggle();
  }

  return (
    <button
      type="button"
      {...props}
      role="switch"
      id={inputId}
      data-slot="switch"
      data-size={size}
      data-radius={radius}
      data-state={isChecked ? "checked" : "unchecked"}
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        "group/switch peer inline-flex shrink-0 items-center border border-transparent p-0.5 transition-colors duration-200 ease-out",
        "disabled:pointer-events-none disabled:opacity-40",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/5",
        trackRadiusClass[radius],
        size === "default" && "h-5 w-9",
        size === "sm" && "h-4 w-7",
        className,
      )}
      onClick={handleClick}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block bg-background transition-transform duration-200 ease-out group-data-[state=checked]/switch:bg-primary-foreground",
          thumbRadiusClass[radius],
          size === "default" &&
            "size-3.5 translate-x-0 group-data-[state=checked]/switch:translate-x-4",
          size === "sm" &&
            "size-2.5 translate-x-0 group-data-[state=checked]/switch:translate-x-3",
        )}
      />
    </button>
  );
}
