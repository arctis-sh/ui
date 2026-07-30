"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

type ScrollAreaContextValue = {
  viewportRef: RefObject<HTMLDivElement | null>;
};

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);

function ScrollArea({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollAreaContext.Provider value={{ viewportRef }}>
      <div
        data-slot="scroll-area"
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          className={cn(
            "size-full overflow-auto rounded-[inherit]",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {children}
        </div>
        <ScrollBar />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollAreaContext.Provider>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal";
}) {
  const ctx = useContext(ScrollAreaContext);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ size: 0, offset: 0, needed: false });
  const dragRef = useRef<{
    pointerId: number;
    start: number;
    scrollStart: number;
  } | null>(null);

  const update = useCallback(() => {
    const viewport = ctx?.viewportRef.current;
    const track = trackRef.current;
    if (!viewport) return;

    if (orientation === "vertical") {
      const { clientHeight, scrollHeight, scrollTop } = viewport;
      const needed = scrollHeight > clientHeight + 1;
      if (!needed) {
        setThumb({ size: 0, offset: 0, needed: false });
        return;
      }
      const trackSize = track?.clientHeight || clientHeight;
      const size = Math.max((clientHeight / scrollHeight) * trackSize, 16);
      const maxOffset = Math.max(trackSize - size, 0);
      const offset =
        maxOffset === 0
          ? 0
          : (scrollTop / (scrollHeight - clientHeight)) * maxOffset;
      setThumb({ size, offset, needed: true });
      return;
    }

    const { clientWidth, scrollWidth, scrollLeft } = viewport;
    const needed = scrollWidth > clientWidth + 1;
    if (!needed) {
      setThumb({ size: 0, offset: 0, needed: false });
      return;
    }
    const trackSize = track?.clientWidth || clientWidth;
    const size = Math.max((clientWidth / scrollWidth) * trackSize, 16);
    const maxOffset = Math.max(trackSize - size, 0);
    const offset =
      maxOffset === 0
        ? 0
        : (scrollLeft / (scrollWidth - clientWidth)) * maxOffset;
    setThumb({ size, offset, needed: true });
  }, [ctx, orientation]);

  useEffect(() => {
    const viewport = ctx?.viewportRef.current;
    if (!viewport) return;

    update();
    viewport.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    const content = viewport.firstElementChild;
    if (content) ro.observe(content);
    if (trackRef.current) ro.observe(trackRef.current);

    return () => {
      viewport.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [ctx, update]);

  function onThumbPointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewport = ctx?.viewportRef.current;
    if (!viewport) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: orientation === "vertical" ? event.clientY : event.clientX,
      scrollStart:
        orientation === "vertical" ? viewport.scrollTop : viewport.scrollLeft,
    };
  }

  function onThumbPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const viewport = ctx?.viewportRef.current;
    const track = trackRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !viewport || !track) {
      return;
    }

    if (orientation === "vertical") {
      const maxOffset = track.clientHeight - thumb.size;
      if (maxOffset <= 0) return;
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      const delta = event.clientY - drag.start;
      viewport.scrollTop = drag.scrollStart + (delta / maxOffset) * maxScroll;
      return;
    }

    const maxOffset = track.clientWidth - thumb.size;
    if (maxOffset <= 0) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const delta = event.clientX - drag.start;
    viewport.scrollLeft = drag.scrollStart + (delta / maxOffset) * maxScroll;
  }

  function onThumbPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  return (
    <div
      ref={trackRef}
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      aria-hidden={!thumb.needed}
      className={cn(
        "pointer-events-none absolute z-10 touch-none select-none",
        orientation === "vertical" && "top-1 bottom-1 right-0 w-2.5",
        orientation === "horizontal" && "right-1 bottom-0 left-1 h-2.5",
        !thumb.needed && "invisible",
        className,
      )}
      {...props}
    >
      <div
        data-slot="scroll-area-thumb"
        className="pointer-events-auto absolute rounded-full bg-border"
        style={
          orientation === "vertical"
            ? {
                top: thumb.offset,
                height: thumb.size,
                left: 1,
                right: 1,
              }
            : {
                left: thumb.offset,
                width: thumb.size,
                top: 1,
                bottom: 1,
              }
        }
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
        onPointerCancel={onThumbPointerUp}
      />
    </div>
  );
}

export { ScrollArea, ScrollBar };
