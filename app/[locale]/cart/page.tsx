"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckoutCartSummary } from "@/components/cart/checkout-cart-summary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const tCheckout = useTranslations("Checkout");
  const tHome = useTranslations("Home");
  const { isEmpty } = useCart();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{tCheckout("cartTitle")}</h1>

      <CheckoutCartSummary
        labels={{
          cartTitle: tCheckout("cartTitle"),
          emptyCart: tCheckout("emptyCart"),
          subtotal: tCheckout("subtotal"),
          clearCart: tCheckout("clearCart"),
          remove: tCheckout("remove"),
        }}
      />

      <div className="flex items-center gap-3">
        <Link
          href="products"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          {tHome("browseProducts")}
        </Link>
        <Link
          href="checkout"
          className={`inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ${
            isEmpty ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={isEmpty}
          tabIndex={isEmpty ? -1 : undefined}
          onClick={(event) => {
            if (isEmpty) {
              event.preventDefault();
            }
          }}
        >
          {tHome("goToCheckout")}
        </Link>
      </div>
    </main>
  );
}