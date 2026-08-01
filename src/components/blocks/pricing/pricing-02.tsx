"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Pricing02Props = {
  className?: string;
};

const PLANS = [
  {
    name: "Starter",
    monthly: 19,
    yearly: 15,
    description: "Solo builders and early launches.",
    features: ["10 projects", "Core blocks", "Email support"],
  },
  {
    name: "Team",
    monthly: 49,
    yearly: 39,
    description: "Growing product and design teams.",
    features: [
      "Unlimited projects",
      "All blocks",
      "Shared library",
      "Slack support",
    ],
  },
  {
    name: "Business",
    monthly: 99,
    yearly: 79,
    description: "Orgs that need control and scale.",
    features: ["Everything in Team", "SSO", "Audit log", "Priority SLA"],
  },
] as const;

function TickerDigit({ digit, delay }: { digit: string; delay: number }) {
  const n = Number(digit);

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
        style={{
          transform: `translateY(${-n}em)`,
          transition: `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
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

function PriceTicker({ value }: { value: number }) {
  const digits = String(value).split("");

  return (
    <span className="inline-flex items-baseline">
      <span className="mr-0.5">$</span>
      <span className="inline-flex" aria-label={`${value}`}>
        {digits.map((digit, index) => (
          <TickerDigit key={index} digit={digit} delay={index * 60} />
        ))}
      </span>
    </span>
  );
}

export function Pricing02({ className }: Pricing02Props) {
  const [yearly, setYearly] = useState(true);

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Pay monthly or yearly
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Yearly billing saves about 20% on every plan.
            </p>
          </div>
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs tracking-wide",
                !yearly
                  ? "bg-background text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs tracking-wide",
                yearly
                  ? "bg-background text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-1 items-stretch gap-3 @[40rem]:grid-cols-3">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;

            return (
              <li
                key={plan.name}
                className="flex h-full flex-col rounded-xl bg-muted p-5"
              >
                <p className="text-sm font-medium tracking-wide text-foreground">
                  {plan.name}
                </p>
                <p className="mt-3 flex items-baseline gap-1 text-3xl font-medium tracking-tight text-foreground">
                  <PriceTicker value={price} />
                  <span className="text-xs font-normal tracking-wide text-muted-foreground">
                    /mo
                  </span>
                </p>
                <p className="mt-1 text-[11px] tracking-wide text-muted-foreground">
                  {yearly ? "Billed yearly" : "Billed monthly"}
                </p>
                <p className="mt-3 text-xs tracking-wide text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs tracking-wide text-muted-foreground"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Button type="button" size="sm" className="w-full">
                    Choose {plan.name}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
