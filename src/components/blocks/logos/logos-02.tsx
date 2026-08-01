"use client";

import { cn } from "@/lib/utils";

type Logos02Props = {
  className?: string;
};

const LOGOS = [
  "slack",
  "notion",
  "linear",
  "github",
  "figma",
  "stripe",
  "intercom",
  "airtable",
  "hubspot",
  "asana",
] as const;

export function Logos02({ className }: Logos02Props) {
  const track = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className={cn("w-full overflow-hidden bg-background", className)}>
      <style>{`
        @keyframes logos-02-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
      <div className="flex w-full flex-col gap-5 py-10">
        <p className="px-6 text-left text-xs tracking-wide text-muted-foreground">
          Trusted by companies everywhere
        </p>
        <div className="w-full overflow-hidden" aria-hidden="true">
          <div
            className="flex w-max items-center"
            style={{ animation: "logos-02-scroll 28s linear infinite" }}
          >
            {track.map((name, i) => (
              <img
                key={`${name}-${i}`}
                src={`/assets/icons/logos/${name}.svg`}
                alt=""
                className="mr-10 h-5 w-auto shrink-0 object-contain opacity-70 brightness-0 sm:mr-12 sm:h-6 dark:invert"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
