"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Login01Props = {
  className?: string;
};

export function Login01({ className }: Login01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-sm px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Sign in
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Welcome back — enter your details to continue.
          </p>
        </div>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-01-email">Email</Label>
            <Input
              id="login-01-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="maya@northline.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="login-01-password">Password</Label>
              <a
                href="#"
                className="text-xs tracking-wide text-muted-foreground"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="login-01-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="border-0 bg-muted"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="login-01-remember" />
            <Label htmlFor="login-01-remember" className="font-normal">
              Remember me
            </Label>
          </div>

          <Button type="submit" size="sm" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm tracking-wide text-muted-foreground">
          Don’t have an account?{" "}
          <a href="#" className="text-foreground">
            Create one
          </a>
        </p>
      </div>
    </section>
  );
}
