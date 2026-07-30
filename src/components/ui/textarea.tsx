"use client";

import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-16 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm tracking-wide transition-colors duration-200 ease-out outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-40",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/5",
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  );
}
