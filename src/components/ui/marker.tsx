import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type MarkerVariant = "default" | "border" | "separator";

const markerVariantClass: Record<MarkerVariant, string> = {
  default: "",
  separator:
    "before:mr-2 before:h-px before:min-w-4 before:flex-1 before:bg-border before:content-[''] after:ml-2 after:h-px after:min-w-4 after:flex-1 after:bg-border after:content-['']",
  border: "border-b border-border pb-2",
};

function markerVariants({
  variant = "default",
  className,
}: {
  variant?: MarkerVariant;
  className?: string;
} = {}) {
  return cn(
    "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm tracking-wide text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
    markerVariantClass[variant],
    className,
  );
}

type MarkerProps = HTMLAttributes<HTMLElement> & {
  variant?: MarkerVariant;
  render?: ReactElement;
  children?: ReactNode;
};

function Marker({
  className,
  variant = "default",
  render,
  children,
  ...props
}: MarkerProps) {
  const classes = markerVariants({ variant, className });

  if (isValidElement(render)) {
    const element = render as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;

    return cloneElement(element, {
      ...element.props,
      ...props,
      "data-slot": "marker",
      "data-variant": variant,
      className: cn(classes, element.props.className),
      children: children ?? element.props.children,
    } as never);
  }

  return (
    <div
      data-slot="marker"
      data-variant={variant}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
}

function MarkerIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function MarkerContent({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 break-words group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Marker, MarkerIcon, MarkerContent, markerVariants };
export type { MarkerVariant };
