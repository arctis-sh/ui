"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Pricing01Props = {
  className?: string;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PLANS = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    description: "For side projects and trying the kit.",
    features: ["3 projects", "Basic blocks", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For teams shipping real product surfaces.",
    features: [
      "Unlimited projects",
      "All blocks",
      "Priority support",
      "Team seats",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Security, SLAs, and dedicated onboarding.",
    features: ["SSO & audit logs", "Custom contracts", "Dedicated support"],
    cta: "Talk to us",
    featured: false,
  },
] as const;

export function Pricing01({ className }: Pricing01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Simple pricing
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Pick a plan and ship. Upgrade when the team grows.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 @[40rem]:grid-cols-3">
          {PLANS.map((plan) => (
            <li
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl p-5",
                plan.featured
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium tracking-wide">{plan.name}</p>
                {plan.featured ? (
                  <span className="rounded-md bg-primary-foreground px-1.5 py-0.5 text-[11px] tracking-wide text-primary">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-3 flex items-baseline gap-0.5">
                <span className="text-3xl font-medium tracking-tight">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span
                    className={cn(
                      "text-xs tracking-wide",
                      plan.featured
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {plan.period}
                  </span>
                ) : null}
              </p>
              <p
                className={cn(
                  "mt-2 text-xs tracking-wide",
                  plan.featured
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {plan.description}
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-start gap-2 text-xs tracking-wide",
                      plan.featured
                        ? "text-primary-foreground/85"
                        : "text-muted-foreground",
                    )}
                  >
                    <CheckIcon
                      className={cn(
                        "mt-0.5 size-3.5 shrink-0",
                        plan.featured
                          ? "text-primary-foreground"
                          : "text-foreground",
                      )}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  variant={plan.featured ? "secondary" : "default"}
                >
                  {plan.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
