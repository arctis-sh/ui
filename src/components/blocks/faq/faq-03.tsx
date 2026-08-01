"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Faq03Props = {
  className?: string;
};

const GROUPS = [
  {
    title: "Product",
    items: [
      {
        value: "p1",
        question: "Can I restyle blocks with my theme?",
        answer:
          "Yes. Colors, radii, and type come from your tokens — change the theme and every block updates.",
      },
      {
        value: "p2",
        question: "Do blocks support dark mode?",
        answer:
          "They use semantic surfaces and text, so light and dark both work without a second stylesheet.",
      },
      {
        value: "p3",
        question: "Can I mix blocks freely?",
        answer:
          "They’re independent sections. Drop heroes, pricing, and FAQs in any order on a page.",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        value: "b1",
        question: "Is there a free plan?",
        answer:
          "Hobby covers side projects. Upgrade when you need more seats, SSO, or priority support.",
      },
      {
        value: "b2",
        question: "Can I change plans later?",
        answer:
          "Anytime. Upgrades apply immediately; downgrades take effect on the next billing cycle.",
      },
      {
        value: "b3",
        question: "Do you offer invoices?",
        answer:
          "Business and Enterprise plans support invoicing and custom contracts. Talk to us if you need one.",
      },
    ],
  },
] as const;

export function Faq03({ className }: Faq03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            FAQ by topic
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Product and billing answers side by side.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 @[40rem]:grid-cols-2">
          {GROUPS.map((group) => (
            <div
              key={group.title}
              className="min-w-0 rounded-xl bg-muted p-5 @[32rem]:p-6"
            >
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground">
                {group.title}
              </h3>
              <Accordion type="single" collapsible className="mt-3">
                {group.items.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value}>
                    <AccordionTrigger indicator="plus">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
