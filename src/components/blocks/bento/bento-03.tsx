"use client";

import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Bento03Props = {
  className?: string;
};

const CELLS = [
  {
    title: "Token ready",
    description: "Restyle every block with your theme tokens.",
    image: "/assets/brand/demos/attachments/attachment-1.png",
    className: "@[32rem]:col-span-2 @[32rem]:row-span-2",
  },
  {
    title: "Copy and ship",
    description: "Install a block and drop it into a page.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
    className: "@[32rem]:col-span-2",
  },
  {
    title: "Compose",
    description: "Mix sections freely.",
    image: "/assets/brand/demos/attachments/attachment-3.png",
    className: "",
  },
  {
    title: "Accessible",
    description: "Keyboard-first defaults.",
    image: "/assets/brand/demos/attachments/attachment-4.png",
    className: "",
  },
  {
    title: "Rapid development",
    description: "Ship interfaces that feel finished.",
    image: "/assets/brand/demos/attachments/attachment-5.png",
    className: "@[32rem]:col-span-2",
  },
  {
    title: "Theme sync",
    description: "Light and dark out of the box.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
    className: "@[32rem]:col-span-2",
  },
] as const;

/** Visual reach past each tile so gaps between cards can light neighbors. */
const GLOW_REACH_PX = 160;
const GLOW_RADIUS = "16rem";

function GlowTile({
  className,
  title,
  description,
  image,
}: {
  className?: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <li
      data-glow-tile
      data-glow="off"
      className={cn(
        "relative min-h-[12rem] rounded-xl p-px @[32rem]:min-h-0",
        "data-[glow=off]:![background:var(--border)]",
        className,
      )}
      style={{
        background: `radial-gradient(${GLOW_RADIUS} circle at var(--glow-x, 50%) var(--glow-y, 50%), rgb(120 200 255), rgb(190 140 255 / 0.85), rgb(255 180 140 / 0.4), var(--border) 55%)`,
      }}
    >
      <div className="flex size-full flex-col rounded-[calc(var(--radius-xl)-1px)] bg-background p-2">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-muted">
          <img
            src={image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="px-1 pt-3 pb-1">
          <h3 className="text-sm font-medium tracking-wide text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-xs tracking-wide text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </li>
  );
}

export function Bento03({ className }: Bento03Props) {
  const gridRef = useRef<HTMLUListElement>(null);

  function syncGlow(clientX: number, clientY: number) {
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = grid.querySelectorAll<HTMLElement>("[data-glow-tile]");
    for (const el of tiles) {
      const rect = el.getBoundingClientRect();
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * w;
      const y = ((clientY - rect.top) / Math.max(rect.height, 1)) * h;
      el.style.setProperty("--glow-x", `${x}px`);
      el.style.setProperty("--glow-y", `${y}px`);
      const near =
        clientX >= rect.left - GLOW_REACH_PX &&
        clientX <= rect.right + GLOW_REACH_PX &&
        clientY >= rect.top - GLOW_REACH_PX &&
        clientY <= rect.bottom + GLOW_REACH_PX;
      el.dataset.glow = near ? "on" : "off";
    }
  }

  function onMove(event: MouseEvent<HTMLUListElement>) {
    syncGlow(event.clientX, event.clientY);
  }

  function onLeave() {
    const grid = gridRef.current;
    if (!grid) return;
    for (const el of grid.querySelectorAll<HTMLElement>("[data-glow-tile]")) {
      el.dataset.glow = "off";
    }
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <ul
          ref={gridRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="grid grid-cols-1 gap-3 @[32rem]:grid-cols-4 @[32rem]:auto-rows-[12.5rem]"
        >
          {CELLS.map((cell) => (
            <GlowTile
              key={cell.title}
              className={cell.className}
              title={cell.title}
              description={cell.description}
              image={cell.image}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
