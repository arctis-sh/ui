"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cta01Props = {
  className?: string;
};

export function Cta01({ className }: Cta01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-12 text-center @[32rem]:px-6 @[32rem]:py-16">
        <h2 className="text-balance text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
          Ready to ship something that feels finished?
        </h2>
        <p className="mt-3 max-w-md text-pretty text-sm tracking-wide text-muted-foreground">
          Drop in blocks, restyle with your tokens, and keep moving.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button type="button" size="sm">
            Get started
          </Button>
          <Button type="button" size="sm" variant="ghost">
            Browse blocks
          </Button>
        </div>
      </div>
    </section>
  );
}
