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

type EmptyStates02Props = {
  className?: string;
};

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function EmptyStates02({ className }: EmptyStates02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              Nothing matched your search. Try a different keyword or clear
              filters.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" size="sm" variant="outline">
              Clear search
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  );
}
