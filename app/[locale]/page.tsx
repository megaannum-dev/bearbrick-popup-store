import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LocalizedHomePage() {
  const t = useTranslations();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("Home.title")}</h1>
      <p className="text-muted-foreground">{t("Home.description")}</p>
      <div className="flex items-center gap-3">
        <Link
          href="products"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("Home.browseProducts")}
        </Link>
        {/* for debugging purpose remove this link later and the associate json key translation */}
        <Link
          href="checkout"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          {t("Home.goToCheckout")}
        </Link>
      </div>
    </main>
  );
}
