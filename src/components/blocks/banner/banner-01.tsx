"use client";

import { Button } from "@/components/ui/button";

export function Banner01() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm tracking-wide text-foreground">
          New blocks are live
        </p>
        <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
          Copy ready made layouts into your app and restyle them with your
          tokens.
        </p>
      </div>
      <Button size="sm" variant="secondary" className="shrink-0 self-start sm:self-auto">
        Browse blocks
      </Button>
    </div>
  );
}
