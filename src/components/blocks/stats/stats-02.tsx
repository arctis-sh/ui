"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Stats02Props = {
  className?: string;
};

const STATS = [
  { value: "2400", suffix: "+", label: "Pages shipped" },
  { value: "99", suffix: "%", label: "Satisfaction" },
  { value: "60", suffix: "", label: "Components" },
] as const;

function TickerDigit({
  digit,
  active,
  delay,
}: {
  digit: string;
  active: boolean;
  delay: number;
}) {
  const n = Number(digit);
  if (Number.isNaN(n)) {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
        style={{
          transform: active ? `translateY(${-n}em)` : "translateY(0)",
          transition: active
            ? `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
            : "none",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="flex h-[1em] items-center justify-center tabular-nums"
          >
            {i}
          </span>
        ))}
      </span>
      <span className="invisible tabular-nums">{digit}</span>
    </span>
  );
}

function TickerValue({
  value,
  suffix,
  active,
  stagger,
}: {
  value: string;
  suffix: string;
  active: boolean;
  stagger: number;
}) {
  return (
    <p className="flex items-baseline text-4xl font-medium tracking-tight text-foreground @[32rem]:text-5xl">
      <span className="inline-flex" aria-label={`${value}${suffix}`}>
        {value.split("").map((digit, index) => (
          <TickerDigit
            key={`${digit}-${index}`}
            digit={digit}
            active={active}
            delay={stagger + index * 70}
          />
        ))}
      </span>
      {suffix ? (
        <span className="ml-0.5 text-[0.7em] tracking-tight">{suffix}</span>
      ) : null}
    </p>
  );
}

export function Stats02({ className }: Stats02Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn("@container w-full bg-background", className)}
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <ul className="grid grid-cols-1 gap-8 @[32rem]:grid-cols-3 @[32rem]:gap-0 @[32rem]:divide-x @[32rem]:divide-border">
          {STATS.map((stat, index) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <TickerValue
                value={stat.value}
                suffix={stat.suffix}
                active={active}
                stagger={index * 120}
              />
              <p className="mt-2 text-xs tracking-wide text-muted-foreground">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
