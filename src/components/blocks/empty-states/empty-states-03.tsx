"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type EmptyStates03Props = {
  className?: string;
};

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function EmptyStates03({ className }: EmptyStates03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <Empty className="w-full rounded-xl bg-muted">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-transparent text-destructive">
              <AlertIcon />
            </EmptyMedia>
            <EmptyTitle>Couldn’t load this page</EmptyTitle>
            <EmptyDescription>
              Something went wrong on our side. Retry in a moment or come back
              later.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" size="sm">
                Try again
              </Button>
              <Button type="button" size="sm" variant="ghost">
                Go home
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  );
}
