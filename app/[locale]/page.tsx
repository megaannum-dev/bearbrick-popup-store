import { getTranslations } from "next-intl/server";
import { LuxuryHeroCarousel } from "@/components/luxury-hero-carousel";

type LocalizedHomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedHomePage({
  params,
}: LocalizedHomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  const heroSlides = [
    {
      id: "atelier",
      eyebrow: t("hero.slides.atelier.eyebrow"),
      title: t("hero.slides.atelier.title"),
      description: t("hero.slides.atelier.description"),
      ctaLabel: t("hero.slides.atelier.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#d9c293]",
    },
    {
      id: "midnight",
      eyebrow: t("hero.slides.midnight.eyebrow"),
      title: t("hero.slides.midnight.title"),
      description: t("hero.slides.midnight.description"),
      ctaLabel: t("hero.slides.midnight.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#8aa9c5]",
    },
    {
      id: "salon",
      eyebrow: t("hero.slides.salon.eyebrow"),
      title: t("hero.slides.salon.title"),
      description: t("hero.slides.salon.description"),
      ctaLabel: t("hero.slides.salon.cta"),
      href: `/${locale}/products`,
      imageSrc:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80",
      accent: "bg-[#f3ead5]",
    },
  ];

  return (
    <main>
      <LuxuryHeroCarousel heroSlides={heroSlides} />
    </main>
  );
}
