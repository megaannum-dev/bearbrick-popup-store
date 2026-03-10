import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavCart } from "@/components/cart/nav-cart";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale}>
        <header className="border-b">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="text-lg font-semibold">BE@RBRICK</div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <NavCart />
            </div>
          </div>
        </header>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
