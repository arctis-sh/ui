"use client";

import { cn } from "@/lib/utils";

type Stats03Props = {
  className?: string;
};

const STATS = [
  {
    value: "12k+",
    label: "Pages shipped",
    description: "Teams reuse the same blocks across marketing and product.",
  },
  {
    value: "4.9",
    label: "Average rating",
    description: "Clean defaults that still feel custom once themed.",
  },
  {
    value: "30s",
    label: "Install time",
    description: "Add a block with the CLI and wire it into a route.",
  },
  {
    value: "0",
    label: "Design debt",
    description: "One token system for light, dark, and everything between.",
  },
] as const;

export function Stats03({ className }: Stats03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border @[32rem]:grid-cols-2">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="bg-background px-5 py-6 @[32rem]:px-6 @[32rem]:py-8"
            >
              <p className="text-3xl font-medium tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium tracking-wide text-foreground">
                {stat.label}
              </p>
              <p className="mt-1.5 max-w-xs text-sm tracking-wide text-muted-foreground">
                {stat.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
