"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  accent: string;
};

type LuxuryHeroCarouselProps = {
  heroSlides: HeroSlide[];
  autoPlayMs?: number;
};

const SWIPE_THRESHOLD = 56;

export function LuxuryHeroCarousel({
  heroSlides: heroSlides,
  autoPlayMs = 6500,
}: LuxuryHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const autoplayRef = useRef<gsap.core.Tween | null>(null);
  const initializedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const queuedIndexRef = useRef<number | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerDeltaXRef = useRef(0);

  const wrapIndex = useCallback(
    (index: number) => {
      const length = heroSlides.length;
      return ((index % length) + length) % length;
    },
    [heroSlides.length],
  );

  const restartAutoplay = useCallback(() => {
    autoplayRef.current?.kill();
    autoplayRef.current = gsap.delayedCall(autoPlayMs / 1000, () => {
      const nextIndex = wrapIndex(activeIndexRef.current + 1);
      if (nextIndex !== activeIndexRef.current) {
        if (isAnimating) {
          queuedIndexRef.current = nextIndex;
          return;
        }
        setActiveIndex(nextIndex);
      }
    });
  }, [autoPlayMs, isAnimating, wrapIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index);
      if (nextIndex === activeIndexRef.current && !isAnimating) {
        restartAutoplay();
        return;
      }

      if (isAnimating) {
        queuedIndexRef.current = nextIndex;
        return;
      }

      setActiveIndex(nextIndex);
    },
    [isAnimating, restartAutoplay, wrapIndex],
  );

  useLayoutEffect(() => {
    const slideElements = slideRefs.current.filter(Boolean);
    const contentElements = contentRefs.current.filter(Boolean);

    if (!slideElements.length || !contentElements.length) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(slideElements, { autoAlpha: 0, scale: 1.08, xPercent: 0 });
      gsap.set(contentElements, { autoAlpha: 0, y: 48 });
      gsap.set(slideElements[0], { autoAlpha: 1, scale: 1, zIndex: 1 });
      gsap.set(contentElements[0], { autoAlpha: 1, y: 0 });
      initializedRef.current = true;
      activeIndexRef.current = 0;
    }, viewportRef);

    return () => {
      context.revert();
      autoplayRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    const previousIndex = activeIndexRef.current;
    const nextIndex = wrapIndex(activeIndex);

    if (previousIndex === nextIndex) {
      restartAutoplay();
      return;
    }

    const previousSlide = slideRefs.current[previousIndex];
    const nextSlide = slideRefs.current[nextIndex];
    const previousContent = contentRefs.current[previousIndex];
    const nextContent = contentRefs.current[nextIndex];

    if (!previousSlide || !nextSlide || !previousContent || !nextContent) {
      activeIndexRef.current = nextIndex;
      restartAutoplay();
      return;
    }

    const rawDirection = nextIndex > previousIndex ? 1 : -1;
    const shortestForward = wrapIndex(previousIndex + 1) === nextIndex;
    const shortestBackward = wrapIndex(previousIndex - 1) === nextIndex;
    const direction = shortestForward ? 1 : shortestBackward ? -1 : rawDirection;

    autoplayRef.current?.kill();
    setIsAnimating(true);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(previousSlide, { autoAlpha: 0, xPercent: 0, scale: 1.08, zIndex: 0 });
        gsap.set(nextSlide, { autoAlpha: 1, xPercent: 0, scale: 1, zIndex: 1 });
        activeIndexRef.current = nextIndex;
        setIsAnimating(false);
        restartAutoplay();

        if (queuedIndexRef.current !== null && queuedIndexRef.current !== nextIndex) {
          const queued = queuedIndexRef.current;
          queuedIndexRef.current = null;
          setActiveIndex(queued);
          return;
        }

        queuedIndexRef.current = null;
      },
    });

    gsap.set(nextSlide, { autoAlpha: 1, zIndex: 2, xPercent: direction * 10, scale: 1.16 });
    gsap.set(nextContent, { autoAlpha: 0, y: 48 });

    timeline
      .to(previousContent, { autoAlpha: 0, y: -28, duration: 0.28 }, 0)
      .to(
        previousSlide,
        {
          autoAlpha: 0,
          xPercent: direction * -6,
          scale: 1.02,
          duration: 1.05,
        },
        0,
      )
      .to(
        nextSlide,
        {
          xPercent: 0,
          scale: 1,
          duration: 1.1,
        },
        0,
      )
      .to(nextContent, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.28);
  }, [activeIndex, restartAutoplay, wrapIndex]);

  useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    restartAutoplay();

    return () => {
      autoplayRef.current?.kill();
    };
  }, [restartAutoplay]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartXRef.current = event.clientX;
    pointerDeltaXRef.current = 0;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartXRef.current === null) {
      return;
    }

    pointerDeltaXRef.current = event.clientX - pointerStartXRef.current;
  };

  const handlePointerEnd = () => {
    if (pointerStartXRef.current === null) {
      return;
    }

    if (Math.abs(pointerDeltaXRef.current) > SWIPE_THRESHOLD) {
      goToSlide(activeIndexRef.current + (pointerDeltaXRef.current < 0 ? 1 : -1));
    }

    pointerStartXRef.current = null;
    pointerDeltaXRef.current = 0;
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f1ea] text-slate-950">
      <div
        ref={viewportRef}
        className="relative min-h-[calc(100svh-73px)] w-full touch-pan-y"
        onMouseEnter={() => autoplayRef.current?.kill()}
        onMouseLeave={restartAutoplay}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              className="absolute inset-0"
            >
              <Image
                src={slide.imageSrc}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="hero-vignette absolute inset-0" />
              <div className="hero-grid absolute inset-0 opacity-50" />
              <div className="hero-noise absolute inset-0 opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(182,211,231,0.34),transparent_22%),radial-gradient(circle_at_38%_62%,rgba(195,174,128,0.26),transparent_18%),linear-gradient(115deg,rgba(9,14,20,0.72),rgba(9,14,20,0.18)_45%,rgba(9,14,20,0.6))]" />
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-end px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1.1fr)_360px]">
            <div className="max-w-4xl pb-6 sm:pb-10 lg:pb-16">
              {heroSlides.map((slide, index) => (
                <div
                  key={`${slide.id}-content`}
                  ref={(element) => {
                    contentRefs.current[index] = element;
                  }}
                  className="pointer-events-none absolute inset-x-6 bottom-32 max-w-4xl sm:inset-x-8 lg:inset-x-10"
                >
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[0.68rem] font-medium tracking-[0.36em] text-white/82 uppercase backdrop-blur-md">
                    <span className={`h-2 w-2 rounded-full ${slide.accent}`} />
                    {slide.eyebrow}
                  </div>
                  <h1 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_20px_80px_rgba(0,0,0,0.32)] sm:text-6xl lg:text-7xl xl:text-[5.8rem]">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7 lg:text-lg">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.href}
                      className="pointer-events-auto inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {slide.ctaLabel}
                    </Link>
                    <div className="pointer-events-none inline-flex items-center gap-3 text-sm text-white/66">
                      <span className="h-px w-12 bg-white/26" />
                      {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="relative ml-auto hidden w-full max-w-sm lg:block">
              <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 text-white shadow-[0_30px_120px_rgba(10,14,20,0.28)] backdrop-blur-2xl">
                <p className="text-xs font-medium tracking-[0.32em] text-white/72 uppercase">
                  Curated drop
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                  Gallery-scale landing experience with GSAP-driven transitions.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  Full-height visuals, autoplay motion, tactile navigation, and swipe-ready slide control for premium campaign storytelling.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 text-left text-xs text-white/72">
                  <div className="rounded-2xl border border-white/12 bg-black/10 px-4 py-3">
                    <p className="text-[0.68rem] tracking-[0.24em] uppercase">Motion</p>
                    <p className="mt-2 text-base font-medium text-white">GSAP timeline</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-black/10 px-4 py-3">
                    <p className="text-[0.68rem] tracking-[0.24em] uppercase">Loop</p>
                    <p className="mt-2 text-base font-medium text-white">Autoplay + wrap</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="relative z-20 mt-auto flex items-center justify-between gap-4 pb-2 pt-4 text-white sm:pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goToSlide(activeIndexRef.current - 1)}
                className="inline-flex size-12 items-center justify-center rounded-full border border-white/24 bg-white/10 backdrop-blur-md transition hover:bg-white/16"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goToSlide(activeIndexRef.current + 1)}
                className="inline-flex size-12 items-center justify-center rounded-full border border-white/24 bg-white/10 backdrop-blur-md transition hover:bg-white/16"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {heroSlides.map((slide, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${slide.id}-dot`}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={isActive}
                    onClick={() => goToSlide(index)}
                    className="group flex items-center gap-2"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-500 ${
                        isActive ? "w-10 bg-white" : "w-2 bg-white/42 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
