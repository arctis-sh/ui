"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Onboarding03Props = {
  className?: string;
};

const GOALS = [
  { id: "landing", label: "Landing pages", detail: "Hero, features, pricing" },
  { id: "app", label: "App UI", detail: "Dashboards and settings" },
  { id: "docs", label: "Docs site", detail: "Guides and API reference" },
  { id: "marketing", label: "Campaigns", detail: "Banners, CTAs, emails" },
] as const;

export function Onboarding03({ className }: Onboarding03Props) {
  const [selected, setSelected] = useState<string[]>(["landing"]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-10 @[40rem]:grid-cols-2 @[40rem]:items-start @[40rem]:gap-12 @[40rem]:px-6 @[40rem]:py-14"
      >
        <div>
          <p className="text-xs tracking-wide text-muted-foreground">
            Almost done
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            What are you building first?
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Pick a few goals so we can suggest the right blocks. You can change
            this later.
          </p>
          <p className="mt-6 text-sm tracking-wide text-muted-foreground">
            {selected.length} selected
          </p>
        </div>

        <div>
          <ul className="flex flex-col gap-2">
            {GOALS.map((goal) => {
              const checked = selected.includes(goal.id);
              const inputId = `onboarding-03-${goal.id}`;

              return (
                <li key={goal.id}>
                  <div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3">
                    <Checkbox
                      id={inputId}
                      checked={checked}
                      onCheckedChange={() => toggle(goal.id)}
                    />
                    <label htmlFor={inputId} className="min-w-0 flex-1 cursor-pointer">
                      <span className="block text-sm font-medium tracking-wide text-foreground">
                        {goal.label}
                      </span>
                      <span className="block text-xs tracking-wide text-muted-foreground">
                        {goal.detail}
                      </span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={selected.length === 0}>
              Continue
            </Button>
            <Button type="button" size="sm" variant="ghost">
              Skip
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
