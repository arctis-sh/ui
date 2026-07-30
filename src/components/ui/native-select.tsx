import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NativeSelectProps = Omit<ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
};

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      data-slot="native-select-wrapper"
      data-size={size}
      className={cn(
        "group/native-select relative w-full has-[select:disabled]:opacity-40",
        className,
      )}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "w-full min-w-0 appearance-none rounded-md border border-border bg-muted pr-8 pl-3 text-sm tracking-wide text-foreground transition-colors duration-200 ease-out outline-none disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:bg-destructive/5",
          size === "default" && "h-9 py-1",
          size === "sm" && "h-8 py-0.5",
        )}
        {...props}
      />
      <ChevronDownIcon
        data-slot="native-select-icon"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

type NativeSelectOptionProps = ComponentProps<"option">;

function NativeSelectOption({ className, ...props }: NativeSelectOptionProps) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-surface text-foreground", className)}
      {...props}
    />
  );
}

type NativeSelectOptGroupProps = ComponentProps<"optgroup">;

function NativeSelectOptGroup({
  className,
  ...props
}: NativeSelectOptGroupProps) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-surface text-foreground", className)}
      {...props}
    />
  );
}

function ChevronDownIcon({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-4", className)}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
