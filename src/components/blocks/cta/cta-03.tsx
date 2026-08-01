"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Cta03Props = {
  className?: string;
};

export function Cta03({ className }: Cta03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Stay in the loop
          </h2>
          <p className="mt-2 max-w-md text-sm tracking-wide text-muted-foreground">
            New blocks and release notes when they ship. No spam.
          </p>
          <form
            className="mt-6 flex w-full max-w-md flex-col gap-2 @[32rem]:flex-row @[32rem]:items-center"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              name="email"
              type="email"
              placeholder="you@company.com"
              aria-label="Email"
              className="h-9 min-h-9 max-h-9 flex-1 border-0 bg-muted py-0"
            />
            <Button
              type="submit"
              className="h-9 min-h-9 max-h-9 w-full shrink-0 whitespace-nowrap @[32rem]:w-auto"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
