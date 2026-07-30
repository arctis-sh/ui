import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const variantClass: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground",
  outline: "border-border bg-transparent text-foreground",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const hasBgOverride = /(?:^|\s)(?:!)?bg-/.test(className ?? "");

  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 text-[11px] font-medium tracking-wide whitespace-nowrap",
        "has-[[data-icon=inline-start]]:pl-1.5 has-[[data-icon=inline-end]]:pr-1.5",
        "[&>svg]:pointer-events-none [&>svg]:size-3",
        hasBgOverride ? "border-transparent" : variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
