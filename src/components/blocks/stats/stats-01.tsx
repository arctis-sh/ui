"use client";

import { cn } from "@/lib/utils";

type Stats01Props = {
  className?: string;
};

const STATS = [
  { value: "200+", label: "Blocks" },
  { value: "60", label: "Components" },
  { value: "12", label: "Themes" },
  { value: "99.9%", label: "Uptime" },
] as const;

export function Stats01({ className }: Stats01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <ul className="grid grid-cols-2 gap-y-8 @[32rem]:grid-cols-4 @[32rem]:gap-0 @[32rem]:divide-x @[32rem]:divide-border">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <p className="text-3xl font-medium tracking-tight text-foreground @[32rem]:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs tracking-wide text-muted-foreground">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
