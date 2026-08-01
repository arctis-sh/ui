"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Signup01Props = {
  className?: string;
};

export function Signup01({ className }: Signup01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-sm px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Create account
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Get started — it only takes a minute.
          </p>
        </div>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-01-name">Name</Label>
            <Input
              id="signup-01-name"
              name="name"
              autoComplete="name"
              placeholder="Maya Chen"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-01-email">Email</Label>
            <Input
              id="signup-01-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="maya@northline.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-01-password">Password</Label>
            <Input
              id="signup-01-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="border-0 bg-muted"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="signup-01-terms" />
            <Label htmlFor="signup-01-terms" className="font-normal">
              I agree to the terms
            </Label>
          </div>

          <Button type="submit" size="sm" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm tracking-wide text-muted-foreground">
          Already have an account?{" "}
          <a href="#" className="text-foreground">
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
}
