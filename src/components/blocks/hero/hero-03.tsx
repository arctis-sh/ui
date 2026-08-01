"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Hero03Props = {
  className?: string;
};

export function Hero03({ className }: Hero03Props) {
  return (
    <section
      className={cn("@container w-full bg-background p-3 sm:p-4", className)}
    >
      <div className="relative min-h-[28rem] w-full flex-1 overflow-hidden rounded-md">
        <img
          src="/assets/brand/demos/card-cover.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/45"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-end p-6 text-left sm:p-8">
          <h1 className="max-w-xl text-balance text-2xl font-medium tracking-wide text-white @[32rem]:text-3xl">
            Ship interfaces that feel finished
          </h1>
          <p className="mt-3 max-w-md text-pretty text-sm tracking-wide text-white/75">
            Ready made blocks you can restyle with your tokens.
          </p>
          <Button type="button" size="sm" className="mt-6">
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
}
