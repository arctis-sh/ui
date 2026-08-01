"use client";

import { cn } from "@/lib/utils";

type Blog02Props = {
  className?: string;
};

const FEATURED = {
  title: "Shipping a full marketing kit",
  excerpt: "Patterns that held up when teams started installing blocks.",
  category: "Product",
  date: "Mar 18, 2026",
  image: "/assets/brand/demos/attachments/attachment-4.png",
} as const;

const POSTS = [
  {
    title: "Token-ready defaults",
    excerpt: "Restyle every section without a second design pass.",
    category: "Design",
    date: "Mar 10, 2026",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    title: "Keep the CLI boring",
    excerpt: "Install, import, ship — no ceremony required.",
    category: "Engineering",
    date: "Mar 2, 2026",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    title: "Compose without fights",
    excerpt: "Mix heroes, pricing, and FAQs in any order.",
    category: "Guides",
    date: "Feb 24, 2026",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
] as const;

export function Blog02({ className }: Blog02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Latest writing
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            A featured story up top, then three recent posts underneath.
          </p>
        </div>

        <article className="relative mt-8 aspect-[21/9] overflow-hidden rounded-xl bg-muted @[32rem]:aspect-[2.4/1]">
          <img
            src={FEATURED.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 @[32rem]:p-6">
            <p className="text-[11px] tracking-wide text-white/75">
              {FEATURED.category}
              <span className="mx-1.5 text-white/40">·</span>
              {FEATURED.date}
            </p>
            <h3 className="mt-1.5 line-clamp-2 text-sm font-medium tracking-wide text-white @[32rem]:text-base">
              {FEATURED.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 max-w-xl text-xs tracking-wide text-white/75">
              {FEATURED.excerpt}
            </p>
          </div>
        </article>

        <ul className="mt-8 grid grid-cols-1 gap-6 @[40rem]:grid-cols-3 @[40rem]:gap-4">
          {POSTS.map((post) => (
            <li key={post.title} className="flex min-w-0 flex-col">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                <img
                  src={post.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] tracking-wide text-muted-foreground">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="mt-1.5 line-clamp-2 text-sm font-medium tracking-wide text-foreground">
                {post.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs tracking-wide text-muted-foreground">
                {post.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
