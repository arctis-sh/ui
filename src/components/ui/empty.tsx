import type { ComponentProps, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type EmptyMediaVariant = "default" | "icon";

const mediaVariantClass: Record<EmptyMediaVariant, string> = {
  default: "bg-transparent",
  icon: "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
};

function Empty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-md border-dashed p-6 text-center md:p-12",
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className,
      )}
      {...props}
    />
  );
}

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & {
  variant?: EmptyMediaVariant;
}) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none",
        mediaVariantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "text-lg font-medium tracking-wide text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed tracking-wide text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};
export type { EmptyMediaVariant };
