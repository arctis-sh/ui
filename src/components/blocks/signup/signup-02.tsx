"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Signup02Props = {
  className?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.27Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.3-1.9V7.52H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.48l3.34-2.58Z"
      />
      <path
        fill="currentColor"
        d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.86-2.86A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function Signup02({ className }: Signup02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-sm px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Create account
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Sign up with your email or a provider.
          </p>
        </div>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-02-name">Name</Label>
            <Input
              id="signup-02-name"
              name="name"
              autoComplete="name"
              placeholder="Maya Chen"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-02-email">Email</Label>
            <Input
              id="signup-02-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="maya@northline.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-02-password">Password</Label>
            <Input
              id="signup-02-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="border-0 bg-muted"
            />
          </div>
          <Button type="submit" size="sm" className="w-full">
            Create account
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs tracking-wide text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" size="sm" variant="secondary" className="w-full">
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
          <Button type="button" size="sm" variant="secondary" className="w-full">
            <GitHubIcon className="size-4" />
            Continue with GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
