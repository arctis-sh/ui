"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Checkout02Props = {
  className?: string;
};

type CartItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
  image: string;
};

const INITIAL: CartItem[] = [
  {
    id: "seat",
    name: "Studio license",
    detail: "1 seat",
    price: 79,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "theme",
    name: "Theme add-on",
    detail: "Dark kit",
    price: 24,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=160&q=80",
  },
];

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function Checkout02({ className }: Checkout02Props) {
  const [items, setItems] = useState(INITIAL);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );
  const discount = applied ? 15 : 0;
  const total = Math.max(0, subtotal - discount);

  function setQty(id: string, next: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, next) } : item,
      ),
    );
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div>
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Your cart
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Adjust quantities, then continue to payment.
          </p>
        </div>

        <ul className="mt-8 flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3"
            >
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
                  {item.detail} · {formatMoney(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Decrease ${item.name}`}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-sm text-foreground/50 transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground"
                  onClick={() => setQty(item.id, item.qty - 1)}
                >
                  −
                </button>
                <span className="w-4 text-center text-sm tracking-wide text-foreground tabular-nums">
                  {item.qty}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name}`}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-sm text-foreground/50 transition-colors duration-200 ease-out hover:bg-surface-hover hover:text-foreground"
                  onClick={() => setQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        {items.length === 0 ? (
          <p className="mt-8 text-sm tracking-wide text-muted-foreground">
            Your cart is empty.
          </p>
        ) : (
          <>
            <form
              className="mt-6 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setApplied(promo.trim().toLowerCase() === "arctis");
              }}
            >
              <Input
                name="promo"
                value={promo}
                onChange={(event) => {
                  setPromo(event.target.value);
                  setApplied(false);
                }}
                placeholder="Promo code"
                className="border-0 bg-muted"
              />
              <Button type="submit" size="sm" variant="secondary" className="h-9">
                Apply
              </Button>
            </form>
            {applied ? (
              <p className="mt-2 text-xs tracking-wide text-muted-foreground">
                Code ARCTIS applied (−$15.00)
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 text-sm tracking-wide">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatMoney(subtotal)}</span>
              </div>
              {applied ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="tabular-nums">−{formatMoney(discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-medium text-foreground">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(total)}</span>
              </div>
            </div>

            <Button type="button" size="sm" className="mt-6 w-full">
              Checkout · {formatMoney(total)}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
