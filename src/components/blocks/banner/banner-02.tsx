"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Banner02() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm tracking-wide text-foreground">
          Shipping updates for all regions
        </p>
        <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
          Check the changelog before you ship so nothing slips through.
        </p>
      </div>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Dismiss"
        className="shrink-0 self-start sm:self-auto"
        onClick={() => setOpen(false)}
      >
        <CloseIcon />
      </Button>
    </div>
  );
}
