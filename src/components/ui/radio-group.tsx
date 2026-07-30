"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  register: (value: string, el: HTMLButtonElement | null) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within <RadioGroup>");
  }
  return context;
}

type RadioGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
};

function RadioGroup({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  disabled,
  orientation = "vertical",
  children,
  onKeyDown,
  ...props
}: RadioGroupProps) {
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ? valueProp : uncontrolled;
  const itemsRef = useRef(new Map<string, HTMLButtonElement>());

  const register = useCallback(
    (itemValue: string, el: HTMLButtonElement | null) => {
      if (el) itemsRef.current.set(itemValue, el);
      else itemsRef.current.delete(itemValue);
    },
    [],
  );

  const handleChange = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const context = useMemo(
    () => ({
      value,
      disabled,
      onValueChange: handleChange,
      register,
    }),
    [value, disabled, handleChange, register],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const keys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (!keys.includes(event.key)) return;

    const items = Array.from(itemsRef.current.entries()).filter(
      ([, el]) => !el.disabled,
    );
    if (!items.length) return;

    const currentIndex = items.findIndex(([itemValue]) => itemValue === value);
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex =
        currentIndex < 0
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;
    }

    event.preventDefault();
    const [nextValue, el] = items[nextIndex]!;
    handleChange(nextValue);
    el.focus();
  }

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        data-orientation={orientation}
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        className={cn(
          "grid gap-3",
          orientation === "horizontal" && "auto-cols-max grid-flow-col",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

type RadioGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "children" | "role"
> & {
  value: string;
};

function RadioGroupItem({
  className,
  value,
  disabled,
  id,
  onClick,
  ...props
}: RadioGroupItemProps) {
  const group = useRadioGroup();
  const generatedId = useId();
  const itemId = id ?? generatedId;
  const checked = group.value === value;
  const isDisabled = Boolean(disabled || group.disabled);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented || isDisabled) return;
    group.onValueChange(value);
  }

  return (
    <button
      type="button"
      role="radio"
      id={itemId}
      data-slot="radio-group-item"
      data-state={checked ? "checked" : "unchecked"}
      aria-checked={checked}
      disabled={isDisabled}
      value={value}
      ref={(el) => group.register(value, el)}
      className={cn(
        "peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-transparent transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
        "data-[state=checked]:border-primary",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/5",
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      <span
        data-slot="radio-group-indicator"
        className={cn(
          "absolute inset-[3px] rounded-full bg-primary transition-transform duration-200 ease-out",
          checked ? "scale-100" : "scale-0",
        )}
        aria-hidden
      />
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
