"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Hero05Props = {
  className?: string;
};

const LEFT_LOGOS = [
  { src: "/assets/icons/logos/slack.svg", x: "6%", y: "14%", s: "3.4rem" },
  { src: "/assets/icons/logos/notion.svg", x: "15%", y: "52%", s: "2.9rem" },
  { src: "/assets/icons/logos/linear.svg", x: "4%", y: "74%", s: "3.1rem" },
  { src: "/assets/icons/logos/github.svg", x: "24%", y: "22%", s: "2.7rem" },
  { src: "/assets/icons/logos/figma.svg", x: "21%", y: "78%", s: "2.9rem" },
  { src: "/assets/icons/logos/stripe.svg", x: "11%", y: "33%", s: "2.6rem" },
  { src: "/assets/icons/logos/intercom.svg", x: "26%", y: "58%", s: "2.5rem" },
] as const;

const RIGHT_LOGOS = [
  { src: "/assets/icons/logos/hubspot.svg", x: "88%", y: "16%", s: "3.3rem" },
  { src: "/assets/icons/logos/jira.svg", x: "79%", y: "48%", s: "2.8rem" },
  { src: "/assets/icons/logos/zendesk.svg", x: "91%", y: "70%", s: "3rem" },
  { src: "/assets/icons/logos/asana.svg", x: "72%", y: "20%", s: "2.6rem" },
  { src: "/assets/icons/logos/dropbox.svg", x: "72%", y: "76%", s: "2.9rem" },
  { src: "/assets/icons/logos/snowflake.svg", x: "84%", y: "34%", s: "2.5rem" },
  { src: "/assets/icons/logos/airtable.svg", x: "74%", y: "58%", s: "2.5rem" },
] as const;

const MARQUEE_A = [
  "slack",
  "notion",
  "linear",
  "github",
  "figma",
  "stripe",
  "intercom",
  "airtable",
  "hubspot",
  "jira",
  "zendesk",
  "asana",
  "dropbox",
  "snowflake",
] as const;

const MARQUEE_B = [
  "hubspot",
  "jira",
  "zendesk",
  "asana",
  "dropbox",
  "snowflake",
  "slack",
  "notion",
  "linear",
  "github",
  "figma",
  "stripe",
  "intercom",
  "airtable",
] as const;

function LogoTile({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      data-slot="hero-logo-tile"
      className={cn(
        "flex items-center justify-center rounded-xl bg-card shadow-sm",
        className,
      )}
      style={style}
    >
      <img
        src={src}
        alt=""
        className="size-[52%] object-contain brightness-0 dark:invert"
      />
    </span>
  );
}

export function Hero05({ className }: Hero05Props) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const tiles = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-slot=hero-logo-tile]"),
    ).filter((tile) => tile.offsetParent !== null);

    const depths = tiles.map((_, i) => 0.008 + (i % 5) * 0.005);
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf: number | null = null;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      tiles.forEach((tile, i) => {
        const d = depths[i];
        const dir = i % 2 === 0 ? 1 : -1;
        tile.style.transform = `translate(${currentX * d * dir}px, ${currentY * d * dir}px)`;
      });

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = event.clientX - (rect.left + rect.width / 2);
      targetY = event.clientY - (rect.top + rect.height / 2);
      schedule();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);

    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={cn(
        "@container flex w-full items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <style>{`
        @keyframes hero-05-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
      <div
        ref={stageRef}
        className="relative flex h-full min-h-[28rem] w-full flex-col items-center justify-center gap-10 px-0 py-16 @[40rem]:min-h-[34rem] @[40rem]:gap-0 @[40rem]:px-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden @[40rem]:block"
        >
          {LEFT_LOGOS.map((logo) => (
            <LogoTile
              key={`${logo.src}-${logo.x}`}
              src={logo.src}
              className="absolute will-change-transform"
              style={{
                top: logo.y,
                left: logo.x,
                width: logo.s,
                height: logo.s,
              }}
            />
          ))}
          {RIGHT_LOGOS.map((logo) => (
            <LogoTile
              key={`${logo.src}-${logo.x}`}
              src={logo.src}
              className="absolute will-change-transform"
              style={{
                top: logo.y,
                left: logo.x,
                width: logo.s,
                height: logo.s,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center">
          <h1 className="text-balance text-2xl font-medium tracking-wide text-foreground @[40rem]:text-3xl">
            Plays nice with your whole stack
          </h1>
          <p className="mt-3 max-w-sm text-pretty text-sm tracking-wide text-muted-foreground">
            Drop in blocks that already speak the tools your team uses every day.
          </p>
          <Button type="button" size="sm" className="mt-6">
            Get started
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="flex w-full flex-col gap-3 overflow-hidden @[40rem]:hidden"
        >
          <div className="flex w-max" style={{ animation: "hero-05-scroll 32s linear infinite" }}>
            {[...MARQUEE_A, ...MARQUEE_A, ...MARQUEE_A].map((name, i) => (
              <LogoTile
                key={`a-${name}-${i}`}
                src={`/assets/icons/logos/${name}.svg`}
                className="mr-3 size-11 shrink-0"
              />
            ))}
          </div>
          <div
            className="flex w-max"
            style={{
              animation: "hero-05-scroll 32s linear infinite reverse",
            }}
          >
            {[...MARQUEE_B, ...MARQUEE_B, ...MARQUEE_B].map((name, i) => (
              <LogoTile
                key={`b-${name}-${i}`}
                src={`/assets/icons/logos/${name}.svg`}
                className="mr-3 size-11 shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
