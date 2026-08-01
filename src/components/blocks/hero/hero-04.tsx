"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Hero04Props = {
  className?: string;
};

export function Hero04({ className }: Hero04Props) {
  return (
    <section className={cn("w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="flex h-full min-h-[28rem] w-full flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:gap-6 lg:p-6"
      >
        <div className="flex flex-1 flex-col items-start justify-center py-6 text-left lg:py-10">
          <h1 className="max-w-md text-balance text-2xl font-medium tracking-wide text-foreground lg:text-3xl">
            Ship interfaces that feel finished
          </h1>
          <p className="mt-3 max-w-sm text-pretty text-sm tracking-wide text-muted-foreground">
            Ready made blocks you can restyle with your tokens.
          </p>
          <Button type="button" size="sm" className="mt-6">
            Get started
          </Button>
        </div>
        <div className="relative min-h-[16rem] w-full flex-1 overflow-hidden rounded-md lg:min-h-0">
          <img
            src="/assets/brand/demos/card-cover.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
