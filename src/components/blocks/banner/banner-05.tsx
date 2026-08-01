"use client";

import { Button } from "@/components/ui/button";

export function Banner05() {
  return (
    <div className="@container w-full border-b border-border bg-secondary">
      <div className="flex w-full flex-col items-center gap-2 px-4 py-2.5 text-center @[32rem]:flex-row @[32rem]:justify-center @[32rem]:gap-3">
        <p className="text-sm tracking-wide text-secondary-foreground">
          Arctis UI v2 is out.{" "}
          <span className="text-secondary-foreground/70">
            New blocks, tokens, and docs.
          </span>
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 shrink-0 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
        >
          See what's new
        </Button>
      </div>
    </div>
  );
}
