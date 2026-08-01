"use client";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Login03Props = {
  className?: string;
};

export function Login03({ className }: Login03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div
          data-slot="block-split"
          className="grid w-full overflow-hidden rounded-xl bg-muted @[40rem]:grid-cols-2"
        >
          <div className="flex flex-col justify-between px-6 py-10 @[32rem]:px-8 @[32rem]:py-12">
            <div>
              <Logo className="block h-4 w-auto text-foreground" />
              <h2 className="mt-6 text-2xl font-medium tracking-wide text-foreground @[32rem]:text-3xl">
                Build pages faster with ready blocks
              </h2>
              <p className="mt-3 max-w-sm text-sm tracking-wide text-muted-foreground">
                Sign in to your workspace and pick up where you left off.
              </p>
            </div>
            <p className="mt-10 text-xs tracking-wide text-muted-foreground @[40rem]:mt-0">
              Trusted by teams shipping product UI every week.
            </p>
          </div>

          <div className="bg-background px-6 py-10 @[32rem]:px-8 @[32rem]:py-12">
            <h3 className="text-lg font-medium tracking-wide text-foreground">
              Sign in
            </h3>
            <p className="mt-1 text-sm tracking-wide text-muted-foreground">
              Use your work email to continue.
            </p>

            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-03-email">Email</Label>
                <Input
                  id="login-03-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="maya@northline.com"
                  className="border-0 bg-muted"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-03-password">Password</Label>
                <Input
                  id="login-03-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-0 bg-muted"
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                Continue
              </Button>
            </form>

            <p className="mt-6 text-center text-sm tracking-wide text-muted-foreground">
              New here?{" "}
              <a href="#" className="text-foreground">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
