"use client";

import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";

type CheckedState = boolean | "indeterminate";

type CheckboxProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value" | "children"
> & {
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IndeterminateMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 12h12" />
    </svg>
  );
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  id,
  onClick,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const controlled = checked !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const value = controlled ? checked : uncontrolled;
  const indeterminate = value === "indeterminate";
  const isChecked = value === true;

  function toggle() {
    if (disabled) return;
    const next = indeterminate ? true : !isChecked;
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
      role="checkbox"
      id={inputId}
      data-slot="checkbox"
      data-state={
        indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"
      }
      aria-checked={indeterminate ? "mixed" : isChecked}
      disabled={disabled}
      className={cn(
        "peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-transparent text-primary-foreground transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:text-destructive",
        className,
      )}
      onClick={handleClick}
    >
      {indeterminate ? (
        <IndeterminateMark className="size-3" />
      ) : isChecked ? (
        <CheckMark className="size-3" />
      ) : null}
    </button>
  );
}
