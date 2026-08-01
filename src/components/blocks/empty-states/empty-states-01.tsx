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

type EmptyStates01Props = {
  className?: string;
};

function FolderIcon({ className }: { className?: string }) {
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </svg>
  );
}

export function EmptyStates01({ className }: EmptyStates01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <Empty className="w-full border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start shipping blocks and pages.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" size="sm">
                Create project
              </Button>
              <Button type="button" size="sm" variant="secondary">
                Import
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  );
}
