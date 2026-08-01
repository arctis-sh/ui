"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Hero01Props = {
  className?: string;
};

export function Hero01({ className }: Hero01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-start justify-center px-6 py-16 text-left @[32rem]:items-center @[32rem]:text-center">
        <h1 className="text-balance text-2xl font-medium tracking-wide text-foreground @[32rem]:text-3xl">
          Ship interfaces that feel finished
        </h1>
        <p className="mt-3 max-w-md text-pretty text-sm tracking-wide text-muted-foreground">
          Ready made blocks you can restyle with your tokens.
        </p>
        <div className="mt-6 flex items-center justify-start gap-2 @[32rem]:justify-center">
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
