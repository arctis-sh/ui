"use client";

import { cn } from "@/lib/utils";

type Blog01Props = {
  className?: string;
};

const POSTS = [
  {
    title: "Shipping blocks that match your tokens",
    excerpt: "How we keep every section restylable without a second design pass.",
    category: "Product",
    date: "Mar 12, 2026",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    title: "A boring install story on purpose",
    excerpt: "CLI, drop-in, ship — why the path to first paint should feel uneventful.",
    category: "Engineering",
    date: "Mar 4, 2026",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    title: "Light, dark, and everything between",
    excerpt: "Semantic surfaces so marketing pages don’t need a night-mode rewrite.",
    category: "Design",
    date: "Feb 21, 2026",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
] as const;

export function Blog01({ className }: Blog01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            From the blog
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Notes on product, design, and shipping interfaces that feel finished.
          </p>
        </div>
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
