"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type Checkout03Props = {
  className?: string;
};

const SHIPPING = [
  {
    value: "standard",
    label: "Standard",
    detail: "4–6 business days",
    price: 0,
  },
  {
    value: "express",
    label: "Express",
    detail: "1–2 business days",
    price: 18,
  },
] as const;

export function Checkout03({ className }: Checkout03Props) {
  const [shipping, setShipping] = useState("standard");
  const shippingCost =
    SHIPPING.find((option) => option.value === shipping)?.price ?? 0;
  const subtotal = 129;
  const total = subtotal + shippingCost;

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-10 @[40rem]:grid-cols-[1.2fr_0.8fr] @[40rem]:items-start @[40rem]:gap-12 @[40rem]:px-6 @[40rem]:py-14"
      >
        <form
          className="flex flex-col gap-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Shipping
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Where should we send your order?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 @[32rem]:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-03-first">First name</Label>
              <Input
                id="checkout-03-first"
                name="firstName"
                placeholder="Jordan"
                className="border-0 bg-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-03-last">Last name</Label>
              <Input
                id="checkout-03-last"
                name="lastName"
                placeholder="Hale"
                className="border-0 bg-muted"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checkout-03-address">Address</Label>
            <Input
              id="checkout-03-address"
              name="address"
              placeholder="184 Market Street"
              className="border-0 bg-muted"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 @[32rem]:grid-cols-3">
            <div className="flex flex-col gap-1.5 @[32rem]:col-span-1">
              <Label htmlFor="checkout-03-city">City</Label>
              <Input
                id="checkout-03-city"
                name="city"
                placeholder="Austin"
                className="border-0 bg-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-03-state">State</Label>
              <Input
                id="checkout-03-state"
                name="state"
                placeholder="TX"
                className="border-0 bg-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-03-zip">ZIP</Label>
              <Input
                id="checkout-03-zip"
                name="zip"
                placeholder="78701"
                className="border-0 bg-muted"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium tracking-wide text-foreground">
              Shipping method
            </p>
            <RadioGroup
              value={shipping}
              onValueChange={setShipping}
              className="mt-3 flex flex-col gap-2"
            >
              {SHIPPING.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3"
                >
                  <RadioGroupItem
                    id={`checkout-03-${option.value}`}
                    value={option.value}
                  />
                  <label
                    htmlFor={`checkout-03-${option.value}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="block text-sm font-medium tracking-wide text-foreground">
                      {option.label}
                    </span>
                    <span className="block text-xs tracking-wide text-muted-foreground">
                      {option.detail}
                    </span>
                  </label>
                  <span className="shrink-0 text-sm tracking-wide text-foreground tabular-nums">
                    {option.price === 0 ? "Free" : `$${option.price}`}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" size="sm" className="w-full @[40rem]:w-auto">
            Continue to payment
          </Button>
        </form>

        <aside className="rounded-xl bg-muted p-5">
          <h3 className="text-sm font-medium tracking-wide text-foreground">
            Order summary
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm tracking-wide">
            <li className="flex justify-between gap-3">
              <span className="text-muted-foreground">Canvas tote</span>
              <span className="tabular-nums text-foreground">$89.00</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-muted-foreground">Marking kit</span>
              <span className="tabular-nums text-foreground">$40.00</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm tracking-wide">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="tabular-nums">
                {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-medium text-foreground">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
