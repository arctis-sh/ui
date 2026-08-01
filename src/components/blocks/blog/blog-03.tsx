"use client";

import { cn } from "@/lib/utils";

type Blog03Props = {
  className?: string;
};

const POSTS = [
  {
    title: "Shipping blocks that match your tokens",
    excerpt: "Keep every section restylable without a second design pass.",
    category: "Product",
    date: "Mar 12, 2026",
    author: "Maya Chen",
    avatar: "/assets/brand/demos/avatars/avatar-1.png",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    title: "A boring install story on purpose",
    excerpt: "Why the path to first paint should feel uneventful.",
    category: "Engineering",
    date: "Mar 4, 2026",
    author: "Priya Nair",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    title: "Light, dark, and everything between",
    excerpt: "Semantic surfaces so night mode isn’t a rewrite.",
    category: "Design",
    date: "Feb 21, 2026",
    author: "Jordan Hale",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
  {
    title: "Composing pages without layout fights",
    excerpt: "Mix heroes, pricing, and FAQs without nesting wars.",
    category: "Guides",
    date: "Feb 14, 2026",
    author: "Chris Ortega",
    avatar: "/assets/brand/demos/avatars/avatar-4.png",
    image: "/assets/brand/demos/attachments/attachment-5.png",
  },
] as const;

export function Blog03({ className }: Blog03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            All posts
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            A simple reading list with author and cover on each row.
          </p>
        </div>
        <ul className="mt-8 flex flex-col gap-3">
          {POSTS.map((post) => (
            <li
              key={post.title}
              className="flex gap-4 rounded-xl bg-muted p-3 @[32rem]:p-4"
            >
              <div className="hidden size-24 shrink-0 overflow-hidden rounded-lg bg-background @[32rem]:block">
                <img
                  src={post.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center justify-between gap-3 text-[11px] tracking-wide text-muted-foreground">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-1 line-clamp-2 text-sm font-medium tracking-wide text-foreground">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs tracking-wide text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <img
                    src={post.avatar}
                    alt=""
                    className="size-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] tracking-wide text-muted-foreground">
                    {post.author}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
