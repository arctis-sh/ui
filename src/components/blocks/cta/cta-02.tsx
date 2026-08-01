"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cta02Props = {
  className?: string;
};

export function Cta02({ className }: Cta02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div
          data-slot="block-split"
          className="flex flex-col gap-6 rounded-xl bg-muted p-6 @[40rem]:flex-row @[40rem]:items-center @[40rem]:justify-between @[40rem]:gap-10 @[40rem]:p-8"
        >
          <div className="min-w-0 max-w-md">
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Start building today
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Install a block, drop it in a page, and ship with your theme.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button type="button" size="sm">
              Get started
            </Button>
            <Button type="button" size="sm" variant="outline">
              View pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
