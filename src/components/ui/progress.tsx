"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ProgressContextValue = {
  value: number;
  max: number;
  labelId?: string;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("Progress parts must be used within <Progress>");
  }
  return context;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function slotName(child: ReactNode) {
  if (!isValidElement(child)) return null;
  const type = child.type as { displayName?: string; name?: string };
  if (typeof type === "string") return null;
  return type.displayName ?? type.name ?? null;
}

type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  value?: number;
  max?: number;
};

function Progress({
  className,
  value = 0,
  max = 100,
  children,
  ...props
}: ProgressProps) {
  const labelId = useId();
  const safeMax = max > 0 ? max : 100;
  const safeValue = clamp(value, 0, safeMax);
  const childArray = Children.toArray(children);
  const hasChildren = childArray.length > 0;
  const hasLabel = childArray.some(
    (child) => slotName(child) === "ProgressLabel",
  );
  const hasTrack = childArray.some(
    (child) => slotName(child) === "ProgressTrack",
  );

  return (
    <ProgressContext.Provider
      value={{ value: safeValue, max: safeMax, labelId }}
    >
      <div
        role="progressbar"
        data-slot="progress"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-labelledby={hasLabel ? labelId : undefined}
        className={cn(
          hasChildren
            ? "grid w-full grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 [&_[data-slot=progress-track]]:col-span-2"
            : "relative h-1.5 w-full",
          className,
        )}
        {...props}
      >
        {hasChildren ? children : null}
        {hasChildren && !hasTrack ? (
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        ) : null}
        {!hasChildren ? (
          <ProgressTrack className="absolute inset-0">
            <ProgressIndicator />
          </ProgressTrack>
        ) : null}
      </div>
    </ProgressContext.Provider>
  );
}

type ProgressLabelProps = HTMLAttributes<HTMLSpanElement>;

function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  const { labelId } = useProgress();

  return (
    <span
      id={labelId}
      data-slot="progress-label"
      className={cn(
        "text-sm font-medium tracking-wide text-foreground",
        className,
      )}
      {...props}
    />
  );
}
ProgressLabel.displayName = "ProgressLabel";

type ProgressValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode | ((value: number, max: number) => ReactNode);
};

function ProgressValue({ className, children, ...props }: ProgressValueProps) {
  const { value, max } = useProgress();
  const content =
    typeof children === "function"
      ? children(value, max)
      : (children ?? `${Math.round((value / max) * 100)}%`);

  return (
    <span
      data-slot="progress-value"
      className={cn(
        "text-sm font-normal tracking-wide text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    >
      {content}
    </span>
  );
}
ProgressValue.displayName = "ProgressValue";

type ProgressTrackProps = HTMLAttributes<HTMLDivElement>;

function ProgressTrack({ className, children, ...props }: ProgressTrackProps) {
  return (
    <div
      data-slot="progress-track"
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-md bg-input",
        className,
      )}
      {...props}
    >
      {children ?? <ProgressIndicator />}
    </div>
  );
}
ProgressTrack.displayName = "ProgressTrack";

type ProgressIndicatorProps = HTMLAttributes<HTMLDivElement>;

function ProgressIndicator({
  className,
  style,
  ...props
}: ProgressIndicatorProps) {
  const { value, max } = useProgress();
  const percent = (value / max) * 100;

  return (
    <div
      data-slot="progress-indicator"
      className={cn(
        "h-full rounded-md bg-primary transition-[width] duration-300 ease-out",
        className,
      )}
      style={{ width: `${percent}%`, ...style }}
      {...props}
    />
  );
}
ProgressIndicator.displayName = "ProgressIndicator";

export {
  Progress,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
};
