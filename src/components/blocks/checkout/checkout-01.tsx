"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Checkout01Props = {
  className?: string;
};

const ITEMS = [
  {
    name: "Arctis Pro seat",
    detail: "Annual billing",
    price: "$348",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Blocks pack",
    detail: "Marketing kit",
    price: "$49",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&q=80",
  },
] as const;

export function Checkout01({ className }: Checkout01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-10 @[40rem]:grid-cols-2 @[40rem]:gap-12 @[40rem]:px-6 @[40rem]:py-14"
      >
        <div>
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Order summary
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Review your cart before paying.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {ITEMS.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium tracking-wide text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs tracking-wide text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <p className="shrink-0 text-sm tracking-wide text-foreground tabular-nums">
                  {item.price}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-4 text-sm tracking-wide">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">$397</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="tabular-nums">$31.76</span>
            </div>
            <div className="flex justify-between font-medium text-foreground">
              <span>Total</span>
              <span className="tabular-nums">$428.76</span>
            </div>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3 className="text-lg font-medium tracking-wide text-foreground">
            Payment
          </h3>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-01-email">Email</Label>
            <Input
              id="checkout-01-email"
              name="email"
              type="email"
              placeholder="maya@northline.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-01-card">Card number</Label>
            <Input
              id="checkout-01-card"
              name="card"
              inputMode="numeric"
              placeholder="ACCT-000015"
              className="border-0 bg-muted"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-01-expiry">Expiry</Label>
              <Input
                id="checkout-01-expiry"
                name="expiry"
                placeholder="MM / YY"
                className="border-0 bg-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-01-cvc">CVC</Label>
              <Input
                id="checkout-01-cvc"
                name="cvc"
                placeholder="123"
                className="border-0 bg-muted"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-01-name">Name on card</Label>
            <Input
              id="checkout-01-name"
              name="name"
              placeholder="Maya Chen"
              className="border-0 bg-muted"
            />
          </div>
          <Button type="submit" size="sm" className="mt-2 w-full">
            Pay $428.76
          </Button>
          <p className="text-center text-xs tracking-wide text-muted-foreground">
            Secured checkout. You won’t be charged in this demo.
          </p>
        </form>
      </div>
    </section>
  );
}
