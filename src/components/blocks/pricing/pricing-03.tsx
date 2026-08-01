"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Pricing03Props = {
  className?: string;
};

const FEATURES = [
  { name: "Projects", hobby: "3", pro: "Unlimited", business: "Unlimited" },
  { name: "Blocks", hobby: "Core", pro: "All", business: "All + private" },
  { name: "Seats", hobby: "1", pro: "10", business: "Unlimited" },
  { name: "Support", hobby: "Community", pro: "Priority", business: "Dedicated" },
  { name: "SSO", hobby: "—", pro: "—", business: "Included" },
  { name: "Audit log", hobby: "—", pro: "—", business: "Included" },
] as const;

const PLANS = [
  { key: "hobby", name: "Hobby", price: "$0", cta: "Start free", featured: false },
  { key: "pro", name: "Pro", price: "$29", cta: "Get Pro", featured: true },
  { key: "business", name: "Business", price: "$99", cta: "Get Business", featured: false },
] as const;

/** Solid column fill + hairline drawn above it (not a translucent border overlay). */
const rowRule =
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-border";
const featuredRowRule =
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-primary-foreground/25";

export function Pricing03({ className }: Pricing03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Compare plans
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Everything side by side — pick what you need now.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl bg-muted p-2 @[40rem]:p-3">
          <table className="w-full min-w-[36rem] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="relative z-0 w-[28%] px-3 py-3 text-xs font-medium tracking-wide text-muted-foreground">
                  Feature
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.key}
                    className={cn(
                      "relative z-0 px-3 py-3 text-center",
                      plan.featured &&
                        "rounded-t-lg bg-primary text-primary-foreground",
                    )}
                  >
                    <div className="relative z-20">
                      <p
                        className={cn(
                          "text-sm font-medium tracking-wide",
                          plan.featured
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      >
                        {plan.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-lg font-medium tracking-tight",
                          plan.featured
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      >
                        {plan.price}
                        <span
                          className={cn(
                            "text-xs font-normal",
                            plan.featured
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          /mo
                        </span>
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.name}>
                  <td
                    className={cn(
                      "relative z-0 px-3 py-2.5 text-xs tracking-wide text-muted-foreground",
                      rowRule,
                    )}
                  >
                    <span className="relative z-20">{feature.name}</span>
                  </td>
                  {PLANS.map((plan) => (
                    <td
                      key={plan.key}
                      className={cn(
                        "relative z-0 px-3 py-2.5 text-center text-xs tracking-wide",
                        plan.featured
                          ? cn(
                              "bg-primary text-primary-foreground",
                              featuredRowRule,
                            )
                          : cn("text-foreground", rowRule),
                      )}
                    >
                      <span className="relative z-20">{feature[plan.key]}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className={cn("relative z-0 px-3 py-3", rowRule)} />
                {PLANS.map((plan) => (
                  <td
                    key={plan.key}
                    className={cn(
                      "relative z-0 px-3 py-3 text-center",
                      plan.featured
                        ? cn(
                            "rounded-b-lg bg-primary text-primary-foreground",
                            featuredRowRule,
                          )
                        : rowRule,
                    )}
                  >
                    <div className="relative z-20 flex justify-center">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full max-w-[9rem]"
                        variant={plan.featured ? "secondary" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
