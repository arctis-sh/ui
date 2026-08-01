"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Faq02Props = {
  className?: string;
};

const FAQS = [
  {
    value: "1",
    question: "What’s included when I add a block?",
    answer:
      "You get the React component and its local dependencies. Swap the copy, media, and links for your product.",
  },
  {
    value: "2",
    question: "Do I need a design file?",
    answer:
      "No. Blocks ship production-ready. Tweak spacing and tokens in code if you want them tighter or louder.",
  },
  {
    value: "3",
    question: "Can my team use these commercially?",
    answer:
      "Yes — use them in client work and products. Keep the install path and attribution wherever your license requires.",
  },
  {
    value: "4",
    question: "How often are new blocks added?",
    answer:
      "We ship in small batches — marketing first, then app surfaces. Check the blocks index for what’s live.",
  },
] as const;

export function Faq02({ className }: Faq02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div
          data-slot="block-split"
          className="flex flex-col gap-8 rounded-xl bg-muted p-5 @[40rem]:flex-row @[40rem]:gap-10 @[40rem]:p-8"
        >
          <div className="max-w-xs shrink-0">
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Questions & answers
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Still stuck? Reach out and we’ll point you at the right block or
              pattern.
            </p>
          </div>
          <Accordion type="single" collapsible className="min-w-0 flex-1">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value}>
                <AccordionTrigger indicator="plus">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
