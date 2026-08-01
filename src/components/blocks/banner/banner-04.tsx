"use client";

import { Button } from "@/components/ui/button";

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Banner04() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 gap-3">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
        <div className="min-w-0">
          <p className="text-sm tracking-wide text-foreground">
            API keys rotate next week
          </p>
          <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
            Update your clients before the old keys stop working.
          </p>
        </div>
      </div>
      <Button size="sm" variant="secondary" className="shrink-0 self-start sm:self-auto">
        Read guide
      </Button>
    </div>
  );
}
