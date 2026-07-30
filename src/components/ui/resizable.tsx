"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import type { GroupProps, PanelProps, SeparatorProps } from "react-resizable-panels";
import { cn } from "@/lib/utils";

const resizeTargetMinimumSize = {
  coarse: 8,
  fine: 4,
};

function ResizablePanelGroup({
  className,
  resizeTargetMinimumSize: resizeTargetMinimumSizeProp = resizeTargetMinimumSize,
  ...props
}: GroupProps) {
  return (
    <Group
      data-slot="resizable-panel-group"
      resizeTargetMinimumSize={resizeTargetMinimumSizeProp}
      className={cn(
        "flex h-full w-full ![touch-action:pan-x_pan-y] aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({ className, ...props }: PanelProps) {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn("![touch-action:pan-x_pan-y]", className)}
      {...props}
    />
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-2.5 text-muted-foreground"
            aria-hidden
          >
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </div>
      ) : null}
    </Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
