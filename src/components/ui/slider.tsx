"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

type SliderProps = Omit<SliderPrimitive.Root.Props, "className"> & {
  className?: string;
  /** Label while dragging — prefers above (horizontal) or right (vertical), flips if clipped. */
  formatTooltip?: (value: number, index: number) => ReactNode;
};

function toValues(
  value: number | readonly number[] | undefined,
  fallback: number[],
) {
  if (Array.isArray(value)) return [...value];
  if (typeof value === "number") return [value];
  return fallback;
}

function oppositeSide(side: Side): Side {
  if (side === "top") return "bottom";
  if (side === "bottom") return "top";
  if (side === "left") return "right";
  return "left";
}

function spaceFor(side: Side, trigger: DOMRect, pad: number) {
  if (side === "top") return trigger.top - pad;
  if (side === "bottom") return window.innerHeight - trigger.bottom - pad;
  if (side === "left") return trigger.left - pad;
  return window.innerWidth - trigger.right - pad;
}

function needFor(side: Side, width: number, height: number, offset: number) {
  if (side === "top" || side === "bottom") return height + offset;
  return width + offset;
}

function resolveSide(
  preferred: Side,
  trigger: DOMRect,
  width: number,
  height: number,
  offset: number,
  pad: number,
): Side {
  const order: Side[] = [
    preferred,
    oppositeSide(preferred),
    ...(preferred === "top" || preferred === "bottom"
      ? (["right", "left"] as Side[])
      : (["top", "bottom"] as Side[])),
  ];

  for (const next of order) {
    if (spaceFor(next, trigger, pad) >= needFor(next, width, height, offset)) {
      return next;
    }
  }

  return order.reduce((best, next) =>
    spaceFor(next, trigger, pad) > spaceFor(best, trigger, pad) ? next : best,
  );
}

function placeTip(
  side: Side,
  trigger: DOMRect,
  width: number,
  height: number,
  offset: number,
  pad: number,
) {
  let top = 0;
  let left = 0;

  if (side === "top" || side === "bottom") {
    top =
      side === "top" ? trigger.top - height - offset : trigger.bottom + offset;
    left = trigger.left + trigger.width / 2 - width / 2;
  } else {
    left =
      side === "left" ? trigger.left - width - offset : trigger.right + offset;
    top = trigger.top + trigger.height / 2 - height / 2;
  }

  left = Math.min(Math.max(pad, left), window.innerWidth - width - pad);
  top = Math.min(Math.max(pad, top), window.innerHeight - height - pad);

  return { top, left, side };
}

function SliderValueTip({
  open,
  preferredSide,
  anchorRef,
  children,
}: {
  open: boolean;
  preferredSide: Side;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const tipRef = useRef<HTMLSpanElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [layout, setLayout] = useState({
    top: 0,
    left: 0,
    side: preferredSide,
  });

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const tip = tipRef.current;
    if (!anchor || !tip) return false;

    const trigger = anchor.getBoundingClientRect();
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    if (width === 0 || height === 0) return false;

    const offset = 8;
    const pad = 8;
    const side = resolveSide(
      preferredSide,
      trigger,
      width,
      height,
      offset,
      pad,
    );
    setLayout(placeTip(side, trigger, width, height, offset, pad));
    return true;
  }, [anchorRef, preferredSide]);

  useLayoutEffect(() => {
    if (!open) {
      setPlaced(false);
      return;
    }
    if (updatePosition()) setPlaced(true);
  }, [open, updatePosition, children]);

  useEffect(() => {
    if (!open) return;

    let frame = 0;
    const tick = () => {
      updatePosition();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  if (!portalReady || !open) return null;

  return createPortal(
    <span
      ref={tipRef}
      data-slot="slider-tooltip"
      data-side={layout.side}
      aria-hidden="true"
      style={{
        top: layout.top,
        left: layout.left,
        visibility: placed ? undefined : "hidden",
      }}
      className={cn(
        "pointer-events-none fixed z-50 rounded-md bg-foreground px-2 py-1 text-[11px] leading-none tracking-wide whitespace-nowrap text-background tabular-nums",
      )}
    >
      {children}
    </span>,
    document.body,
  );
}

function SliderThumb({
  index,
  dragging,
  preferredSide,
  label,
}: {
  index: number;
  dragging: boolean;
  preferredSide: Side;
  label: ReactNode | null;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);

  return (
    <SliderPrimitive.Thumb
      ref={thumbRef}
      index={index}
      data-slot="slider-thumb"
      className={cn(
        "relative z-10 block size-3.5 shrink-0 rounded-[calc(var(--radius-md)-0.125rem)] bg-primary select-none",
        "transition-colors duration-200 ease-out",
        "disabled:pointer-events-none",
      )}
    >
      {label != null ? (
        <SliderValueTip
          open={dragging}
          preferredSide={preferredSide}
          anchorRef={thumbRef}
        >
          {label}
        </SliderValueTip>
      ) : null}
    </SliderPrimitive.Thumb>
  );
}

export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  orientation = "horizontal",
  formatTooltip,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderProps) {
  const fallback = [min];
  const [uncontrolled, setUncontrolled] = useState(() =>
    toValues(value ?? defaultValue, fallback),
  );
  const [dragging, setDragging] = useState(false);

  const values =
    value !== undefined ? toValues(value, fallback) : uncontrolled;

  const preferredSide: Side =
    orientation === "vertical" ? "right" : "top";

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation={orientation}
      thumbAlignment="edge"
      className={cn(
        "relative w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto",
        className,
      )}
      {...props}
      onValueChange={(next, eventDetails) => {
        if (value === undefined) setUncontrolled(toValues(next, fallback));
        if (
          eventDetails.reason === "drag" ||
          eventDetails.reason === "track-press" ||
          eventDetails.reason === "keyboard"
        ) {
          setDragging(true);
        }
        onValueChange?.(next, eventDetails);
      }}
      onValueCommitted={(next, eventDetails) => {
        setDragging(false);
        onValueCommitted?.(next, eventDetails);
      }}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(
          "relative flex w-full touch-none items-center select-none data-disabled:opacity-40",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-md bg-input select-none",
            "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              "rounded-md bg-primary select-none",
              "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: values.length }, (_, index) => (
          <SliderThumb
            key={index}
            index={index}
            dragging={dragging}
            preferredSide={preferredSide}
            label={
              formatTooltip
                ? formatTooltip(values[index] ?? min, index)
                : null
            }
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
