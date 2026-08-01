"use client";

import {
  Children,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import {
  buttonGroupItemClass,
  buttonGroupOutlineJoinClass,
  useButtonGroup,
} from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-85",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-85",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-85",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted hover:text-accent-foreground dark:hover:bg-accent",
  ghost:
    "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  link: "group/button-link rounded-none bg-transparent text-foreground",
};

const sizeClass: Record<ButtonSize, string> = {
  default: "h-9 gap-2 px-4 text-sm has-[[data-icon]]:px-3",
  xs: "h-6 gap-1 rounded-md px-2 text-xs has-[[data-icon]]:px-1.5 [&_svg]:size-3",
  sm: "h-8 gap-1.5 px-3 text-sm has-[[data-icon]]:px-2.5",
  lg: "h-10 gap-2 px-6 text-sm has-[[data-icon]]:px-4",
  icon: "size-9",
  "icon-xs": "size-6 [&_svg]:size-3",
  "icon-sm": "size-8",
  "icon-lg": "size-10",
};

function linkLabel(children: ReactNode) {
  return Children.map(children, (child) => {
    if (typeof child !== "string" && typeof child !== "number") {
      return child;
    }

    return (
      <span
        data-slot="button-link-label"
        className="relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover/button-link:after:scale-x-100"
      >
        {child}
      </span>
    );
  });
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-md font-normal tracking-wide whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "has-[[data-icon=inline-start]]:pl-2.5 has-[[data-icon=inline-end]]:pr-2.5",
    variantClass[variant],
    sizeClass[size],
    variant === "link" && "h-auto w-fit !px-0",
    className,
  );
}

export function Button({
  variant = "default",
  size = "default",
  loading = false,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const group = useButtonGroup();
  const isDisabled = disabled || loading;
  const content = variant === "link" ? linkLabel(children) : children;

  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={buttonVariants({
        variant,
        size,
        className: cn(
          loading && "relative pointer-events-none !opacity-100",
          buttonGroupItemClass(group),
          variant === "outline" && buttonGroupOutlineJoinClass(group),
          className,
        ),
      })}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center",
          size === "xs" || size === "icon-xs"
            ? "gap-1"
            : size === "sm"
              ? "gap-1.5"
              : "gap-2",
          loading && "invisible",
        )}
      >
        {content}
      </span>
      {loading ? (
        <span className="absolute inset-0 inline-flex items-center justify-center">
          <Spinner
            aria-hidden="true"
            className={cn(
              (size === "xs" || size === "icon-xs") && "size-3",
            )}
          />
        </span>
      ) : null}
    </button>
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
