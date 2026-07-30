import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type BreadcrumbProps = ComponentProps<"nav">;

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  );
}

type BreadcrumbListProps = ComponentProps<"ol">;

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs font-normal tracking-wide text-muted-foreground break-words sm:gap-2",
        className,
      )}
      {...props}
    />
  );
}

type BreadcrumbItemProps = ComponentProps<"li">;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

type BreadcrumbLinkProps = ComponentProps<"a"> & {
  asChild?: boolean;
};

export function BreadcrumbLink({
  asChild = false,
  className,
  children,
  ...props
}: BreadcrumbLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 transition-colors duration-200 ease-out hover:text-foreground [&>svg]:h-3 [&>svg]:w-auto [&>svg]:shrink-0",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      ...props,
    });
  }

  return (
    <a data-slot="breadcrumb-link" className={classes} {...props}>
      {children}
    </a>
  );
}

type BreadcrumbPageProps = ComponentProps<"span">;

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "inline-flex items-center gap-1.5 text-foreground [&>svg]:h-3 [&>svg]:w-auto [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-3.5"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BreadcrumbSeparatorProps = ComponentProps<"li"> & {
  children?: ReactNode;
};

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground/50 [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

function MoreHorizontalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-4"
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

type BreadcrumbEllipsisProps = ComponentProps<"span">;

export function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "relative flex size-5 items-center justify-center text-muted-foreground",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]">
        More
      </span>
    </span>
  );
}
