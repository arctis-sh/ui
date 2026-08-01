"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Faq01Props = {
  className?: string;
};

const FAQS = [
  {
    value: "1",
    question: "Can I restyle blocks with my own theme?",
    answer:
      "Yes. Every block uses your theme tokens for color, radius, and type — swap the theme and the section follows.",
  },
  {
    value: "2",
    question: "How do I install a block?",
    answer:
      "Run the CLI add command for the block you want, then import it into a page. No extra setup beyond your existing UI kit.",
  },
  {
    value: "3",
    question: "Do blocks work in light and dark mode?",
    answer:
      "They do. Surfaces and text pull from semantic tokens, so both modes stay consistent without a second stylesheet.",
  },
  {
    value: "4",
    question: "Can I mix blocks freely?",
    answer:
      "That’s the point. Heroes, pricing, FAQs, and the rest are independent sections — compose them in any order.",
  },
] as const;

export function Faq01({ className }: Faq01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-2xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Quick answers about install, theming, and how blocks fit together.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger indicator="plus">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
