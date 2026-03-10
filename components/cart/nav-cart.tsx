"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/hooks/useCart";
import { APP_CONFIG } from "@/lib/config";

export function NavCart() {
  const locale = useLocale();
  const tHome = useTranslations("Home");
  const tCheckout = useTranslations("Checkout");
  const { items } = useCart();

  return (
    <div className="group relative">
      <Link
        href={`/${locale}/cart`}
        aria-label={tHome("goToCart")}
        className="inline-flex size-9 items-center justify-center rounded-md border"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M2 3h3l2.7 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 6H6" />
        </svg>
      </Link>

      <div className="invisible absolute right-0 z-50 mt-2 w-80 rounded-md border bg-background p-3 opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100">
        <p className="mb-2 text-sm font-medium">{tCheckout("cartTitle")}</p>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tCheckout("emptyCart")}</p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{item.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  ×{item.quantity} · {APP_CONFIG.currency.symbol}
                  {item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}