import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardSize = "default" | "sm";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  size?: CardSize;
};

export function Card({
  className,
  size = "default",
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-[var(--card-spacing)] overflow-hidden rounded-md border border-border bg-card py-[var(--card-spacing)] text-sm text-card-foreground",
        "[--card-spacing:1rem] data-[size=sm]:[--card-spacing:0.75rem]",
        "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
        "[&>img:first-child]:rounded-t-md [&>img:last-child]:rounded-b-md",
        "[&.flex-row>img:first-child]:rounded-none [&.flex-row>img:first-child]:rounded-l-md",
        "[&.flex-row>img:last-child]:rounded-none [&.flex-row>img:last-child]:rounded-r-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min items-start gap-1 rounded-t-md px-[var(--card-spacing)]",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:items-center has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "has-data-[slot=card-action]:[&_[data-slot=card-description]]:col-start-1 has-data-[slot=card-action]:[&_[data-slot=card-description]]:row-start-2",
        "[.border-b]:pb-[var(--card-spacing)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-normal leading-none tracking-wide text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardAction({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-start-1 self-center justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-[var(--card-spacing)]", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-[var(--card-spacing)] py-[var(--card-spacing)] [.border-t]:pt-[var(--card-spacing)]",
        className,
      )}
      {...props}
    />
  );
}
