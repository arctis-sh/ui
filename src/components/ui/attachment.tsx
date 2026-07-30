"use client";

import {
  createContext,
  useContext,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
type AttachmentSize = "default" | "sm" | "xs";
type AttachmentOrientation = "horizontal" | "vertical";

type AttachmentContextValue = {
  state: AttachmentState;
  size: AttachmentSize;
  orientation: AttachmentOrientation;
};

const AttachmentContext = createContext<AttachmentContextValue | null>(null);

function useAttachment() {
  const context = useContext(AttachmentContext);
  if (!context) {
    throw new Error("Attachment parts must be used within <Attachment>");
  }
  return context;
}

type AttachmentProps = HTMLAttributes<HTMLDivElement> & {
  state?: AttachmentState;
  size?: AttachmentSize;
  orientation?: AttachmentOrientation;
  children: ReactNode;
};

const sizeRoot: Record<AttachmentSize, string> = {
  default: "gap-3 p-3",
  sm: "gap-2.5 p-2.5",
  xs: "gap-2 p-2",
};

export function Attachment({
  state = "done",
  size = "default",
  orientation = "horizontal",
  className,
  children,
  ...props
}: AttachmentProps) {
  const busy = state === "uploading" || state === "processing";

  return (
    <AttachmentContext.Provider value={{ state, size, orientation }}>
      <div
        data-state={state}
        data-size={size}
        data-orientation={orientation}
        className={cn(
          "relative flex overflow-hidden rounded-md bg-card text-card-foreground",
          orientation === "vertical" ? "flex-col" : "flex-row items-center",
          sizeRoot[size],
          state === "error" && "bg-destructive/5 text-destructive",
          !/(?:^|\s)w-/.test(className ?? "") && "w-full",
          className,
        )}
        {...props}
      >
        {children}
        {busy ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-muted"
          >
            <div className="attachment-progress h-full w-1/3 bg-muted-foreground" />
          </div>
        ) : null}
      </div>
    </AttachmentContext.Provider>
  );
}

type AttachmentMediaProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "icon" | "image";
  children: ReactNode;
};

const mediaSize: Record<AttachmentSize, string> = {
  default: "size-10",
  sm: "size-9",
  xs: "size-8",
};

export function AttachmentMedia({
  variant = "icon",
  className,
  children,
  ...props
}: AttachmentMediaProps) {
  const { size, orientation, state } = useAttachment();
  const busy = state === "uploading" || state === "processing";

  return (
    <div
      data-variant={variant}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-sm bg-background text-foreground",
        variant === "icon" &&
          cn("flex items-center justify-center [&>svg]:size-4", mediaSize[size]),
        variant === "image" &&
          (orientation === "vertical"
            ? "aspect-[4/3] w-full [&>img]:size-full [&>img]:object-cover"
            : cn("[&>img]:size-full [&>img]:object-cover", mediaSize[size])),
        className,
      )}
      {...props}
    >
      {children}
      {busy ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/55"
        />
      ) : null}
    </div>
  );
}

type AttachmentContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AttachmentContent({
  className,
  children,
  ...props
}: AttachmentContentProps) {
  return (
    <div
      className={cn(
        "relative z-[1] flex min-w-0 flex-1 flex-col justify-center gap-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AttachmentTitleProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AttachmentTitle({
  className,
  children,
  ...props
}: AttachmentTitleProps) {
  const { state, size } = useAttachment();

  return (
    <div
      className={cn(
        "truncate font-medium tracking-tight",
        size === "xs" ? "text-xs" : "text-sm",
        state === "error" ? "text-current" : "text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AttachmentDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AttachmentDescription({
  className,
  children,
  ...props
}: AttachmentDescriptionProps) {
  const { size } = useAttachment();

  return (
    <div
      className={cn(
        "truncate text-muted-foreground",
        size === "xs" ? "text-[11px]" : "text-xs",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AttachmentActionsProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AttachmentActions({
  className,
  children,
  ...props
}: AttachmentActionsProps) {
  const { orientation } = useAttachment();

  return (
    <div
      className={cn(
        "relative z-[2] flex shrink-0 items-center gap-0.5",
        orientation === "vertical"
          ? "absolute top-2 right-2 rounded-sm bg-card/90 p-0.5"
          : "ml-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AttachmentActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function AttachmentAction({
  className,
  children,
  ...props
}: AttachmentActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-foreground [&>svg]:size-3.5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type AttachmentTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export function AttachmentTrigger({
  className,
  children,
  ...props
}: AttachmentTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "absolute inset-0 z-[1] rounded-md",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type AttachmentGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AttachmentGroup({
  className,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: AttachmentGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const settling = useRef(false);
  const scrollTimer = useRef<number | null>(null);

  function nearestLeft(node: HTMLDivElement) {
    const items = Array.from(node.children) as HTMLElement[];
    if (items.length === 0) return 0;

    const max = Math.max(0, node.scrollWidth - node.clientWidth);
    const origin = node.getBoundingClientRect().left;
    let target = 0;
    let min = Infinity;

    for (const item of items) {
      const left = Math.min(
        Math.max(
          0,
          item.getBoundingClientRect().left - origin + node.scrollLeft,
        ),
        max,
      );
      const dist = Math.abs(left - node.scrollLeft);
      if (dist < min) {
        min = dist;
        target = left;
      }
    }

    return target;
  }

  function settle(node: HTMLDivElement) {
    if (drag.current || settling.current) return;

    const target = nearestLeft(node);
    if (Math.abs(target - node.scrollLeft) < 1) return;

    settling.current = true;
    node.scrollTo({ left: target, behavior: "smooth" });

    window.setTimeout(() => {
      settling.current = false;
    }, 320);
  }

  function queueSettle() {
    const node = ref.current;
    if (!node || drag.current) return;
    if (scrollTimer.current !== null) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => settle(node), 60);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const node = ref.current;
    if (node?.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }

    const moved = state.moved;
    if (moved) suppressClick.current = true;

    drag.current = null;
    node?.removeAttribute("data-dragging");
    if (moved && node) settle(node);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full cursor-grab gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden data-[dragging]:cursor-grabbing data-[dragging]:select-none",
        className,
      )}
      onScroll={() => {
        if (drag.current || settling.current) return;
        queueSettle();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.pointerType === "touch") return;

        const target = event.target as HTMLElement | null;
        if (target?.closest("button, a, input, textarea, select, label")) {
          return;
        }

        const node = ref.current;
        if (!node) return;

        if (scrollTimer.current !== null) {
          window.clearTimeout(scrollTimer.current);
          scrollTimer.current = null;
        }

        settling.current = false;
        suppressClick.current = false;
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          scrollLeft: node.scrollLeft,
          moved: false,
        };
        node.setAttribute("data-dragging", "");
        node.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented) return;

        const state = drag.current;
        const node = ref.current;
        if (!state || !node || state.pointerId !== event.pointerId) return;

        const delta = event.clientX - state.startX;
        if (!state.moved && Math.abs(delta) < 3) return;

        state.moved = true;
        event.preventDefault();
        node.scrollLeft = state.scrollLeft - delta;
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        endDrag(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        endDrag(event);
      }}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
      {...props}
    >
      {children}
    </div>
  );
}
