"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 18V6l8 7 8-7v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink href={href} className="items-start gap-0.5">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-medium text-foreground">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </div>
      </NavigationMenuLink>
    </li>
  );
}

const productLinks = [
  {
    title: "Overview",
    href: "#",
    description: "What Acme is and who it is for.",
  },
  {
    title: "Pricing",
    href: "#",
    description: "Plans for teams of every size.",
  },
  {
    title: "Changelog",
    href: "#",
    description: "What shipped this month.",
  },
] as const;

const resourceLinks = [
  {
    title: "Docs",
    href: "#",
    description: "Guides and API reference.",
  },
  {
    title: "Blog",
    href: "#",
    description: "Notes from the team.",
  },
  {
    title: "Customers",
    href: "#",
    description: "Stories from production.",
  },
] as const;

export function Navbar06() {
  const [open, setOpen] = useState(false);

  return (
    <header className="@container w-full bg-background">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-foreground"
        >
          <Mark className="size-4" />
          <span className="text-sm tracking-wide">Acme</span>
        </a>

        <div className="hidden min-w-0 flex-1 justify-center @[40rem]:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[18rem] gap-0.5">
                    {productLinks.map((link) => (
                      <ListItem
                        key={link.title}
                        title={link.title}
                        href={link.href}
                      >
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[14rem] gap-0.5">
                    {resourceLinks.map((link) => (
                      <ListItem
                        key={link.title}
                        title={link.title}
                        href={link.href}
                      >
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            className="hidden @[40rem]:inline-flex"
          >
            Get started
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className={
              open
                ? "bg-accent text-accent-foreground @[40rem]:hidden"
                : "@[40rem]:hidden"
            }
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="px-4 pb-3 @[40rem]:hidden">
          <Accordion type="multiple" collapsible className="w-full">
            <AccordionItem value="product" className="border-b-0">
              <AccordionTrigger className="py-2.5 text-sm font-normal">
                Product
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-0.5 pb-2">
                  {productLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="rounded-md px-2 py-2 text-sm tracking-wide text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="resources" className="border-b-0">
              <AccordionTrigger className="py-2.5 text-sm font-normal">
                Resources
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-0.5 pb-2">
                  {resourceLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="rounded-md px-2 py-2 text-sm tracking-wide text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <a
            href="#"
            className="flex items-center rounded-md py-2.5 text-sm tracking-wide text-foreground"
          >
            Pricing
          </a>
          <Button type="button" size="sm" className="mt-2 w-full">
            Get started
          </Button>
        </div>
      ) : null}
    </header>
  );
}
