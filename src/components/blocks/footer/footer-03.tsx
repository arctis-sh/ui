"use client";

import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Footer03Props = {
  className?: string;
};

const LINKS = ["Blocks", "Components", "Docs", "Pricing"] as const;

export function Footer03({ className }: Footer03Props) {
  return (
    <footer className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="relative min-h-[22rem] overflow-hidden rounded-xl @[32rem]:min-h-[26rem]">
          <img
            src="/assets/brand/demos/card-cover.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-between px-6 py-6 @[32rem]:min-h-[26rem] @[32rem]:px-10 @[32rem]:py-8">
            <Logo className="block h-4 w-auto self-start text-white" />

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 @[40rem]:flex-row @[40rem]:items-end @[40rem]:justify-between">
                <div className="max-w-md">
                  <h2 className="text-2xl font-medium tracking-wide text-white @[32rem]:text-3xl">
                    Ship pages that feel finished
                  </h2>
                  <p className="mt-3 text-sm tracking-wide text-white/75">
                    Drop in blocks, restyle with your tokens, and keep moving.
                  </p>
                </div>
                <Button type="button" size="sm">
                  Get started
                </Button>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/20 pt-6 @[40rem]:flex-row @[40rem]:items-center @[40rem]:justify-between">
                <nav className="flex flex-wrap gap-x-5 gap-y-2">
                  {LINKS.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-sm tracking-wide text-white/80"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
                <p className="text-xs tracking-wide text-white/60">
                  © 2026 Arctis. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
