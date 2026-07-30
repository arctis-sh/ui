"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type InputGroupVariant = "default" | "filled";

type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";

const groupVariantClass: Record<InputGroupVariant, string> = {
  default: "border-border bg-transparent",
  filled: "border-transparent bg-muted",
};

const addonAlignClass: Record<InputGroupAddonAlign, string> = {
  "inline-start":
    "order-first pl-2.5 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
  "inline-end":
    "order-last pr-2.5 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
  "block-start":
    "order-first w-full justify-start px-3 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
  "block-end":
    "order-last w-full justify-start px-3 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
};

const buttonSizeClass: Record<InputGroupButtonSize, string> = {
  xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
  sm: "",
  "icon-xs":
    "size-6 rounded-md p-0 has-[>svg]:p-0 [&_svg:not([class*='size-'])]:size-3",
  "icon-sm": "size-8 p-0 has-[>svg]:p-0",
};

function InputGroup({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & {
  variant?: InputGroupVariant;
}) {
  return (
    <div
      data-slot="input-group"
      data-variant={variant}
      role="group"
      className={cn(
        "group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border transition-colors duration-200 ease-out outline-none has-disabled:opacity-40 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:bg-destructive/5 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        groupVariantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: ComponentProps<"div"> & {
  align?: InputGroupAddonAlign;
}) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium tracking-wide text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-40 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&_svg:not([class*='size-'])]:size-3.5",
        addonAlignClass[align],
        className,
      )}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if ((event.target as HTMLElement).closest("button")) return;
        event.currentTarget.parentElement
          ?.querySelector<HTMLElement>("input, textarea")
          ?.focus();
      }}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<ComponentProps<typeof Button>, "size"> & {
  size?: InputGroupButtonSize;
}) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={
        size === "sm"
          ? "sm"
          : size === "icon-sm"
            ? "icon-sm"
            : size === "icon-xs"
              ? "icon-xs"
              : "xs"
      }
      className={cn(
        "flex items-center gap-2 text-sm shadow-none",
        buttonSizeClass[size],
        className,
      )}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex items-center gap-2 text-sm tracking-wide text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none disabled:bg-transparent aria-invalid:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none disabled:bg-transparent aria-invalid:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
export type { InputGroupVariant, InputGroupAddonAlign, InputGroupButtonSize };
