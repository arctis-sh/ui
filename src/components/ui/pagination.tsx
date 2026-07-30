import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = ComponentProps<"nav">;

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

type PaginationContentProps = ComponentProps<"ul">;

function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-0.5", className)}
      {...props}
    />
  );
}

type PaginationItemProps = ComponentProps<"li">;

function PaginationItem({ className, ...props }: PaginationItemProps) {
  return (
    <li data-slot="pagination-item" className={cn(className)} {...props} />
  );
}

type PaginationLinkProps = ComponentProps<"a"> & {
  isActive?: boolean;
  size?: "default" | "icon" | "sm" | "lg" | "xs" | "icon-xs" | "icon-sm" | "icon-lg";
};

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive ? "" : undefined}
      data-state={isActive ? "on" : "off"}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size,
        }),
        "border border-transparent",
        isActive &&
          "border-border bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

type PaginationPreviousProps = ComponentProps<typeof PaginationLink> & {
  text?: string;
};

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:inline">{text}</span>
    </PaginationLink>
  );
}

type PaginationNextProps = ComponentProps<typeof PaginationLink> & {
  text?: string;
};

function PaginationNext({
  className,
  text = "Next",
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:inline">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

type PaginationEllipsisProps = ComponentProps<"span">;

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      role="presentation"
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center text-muted-foreground",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

function ChevronLeftIcon({
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MoreHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4", className)}
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
