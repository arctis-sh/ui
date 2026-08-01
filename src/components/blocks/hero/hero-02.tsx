"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Hero02Props = {
  className?: string;
};

export function Hero02({ className }: Hero02Props) {
  const noiseId = useId().replace(/:/g, "");

  return (
    <section
      className={cn(
        "@container relative w-full overflow-hidden bg-black text-white",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 125% 48% at 50% 78%, rgb(255 255 255 / 0.55) 0%, rgb(210 170 255 / 0.42) 8%, rgb(150 70 210 / 0.32) 22%, rgb(90 30 140 / 0.16) 40%, transparent 62%)",
            "radial-gradient(ellipse 90% 35% at 50% 100%, rgb(40 10 60 / 0.9) 0%, transparent 55%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[-48%] h-[95%] w-[165%] -translate-x-1/2 rounded-[100%] bg-black"
        style={{
          boxShadow:
            "0 -1px 0 0 rgb(255 255 255 / 0.75), 0 -8px 28px 2px rgb(255 255 255 / 0.2), 0 -28px 90px 24px rgb(170 90 230 / 0.28)",
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-[0.7] mix-blend-soft-light"
      >
        <filter id={noiseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.95"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
      </svg>

      <div className="relative z-10 mx-auto flex h-full min-h-[28rem] w-full max-w-2xl -translate-y-14 @[32rem]:-translate-y-20 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-balance text-xl font-medium tracking-wide text-white @[32rem]:text-2xl">
          Build once, reuse everywhere
        </h1>
        <div className="mt-6 flex items-center justify-center">
          <Button
            type="button"
            size="sm"
            className="bg-white text-black hover:opacity-85"
          >
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
}
