"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { showcaseVideos } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_MS = 420;

/** Map showcase cards to real routes / destinations (TZ: no fake video-only CTAs) */
const CARD_LINKS: Record<string, { href: string; kind: "story" | "route" }> = {
  desert: { href: "/journeys/caravan-desert-silk-trail-turkmenistan", kind: "route" },
  mountains: { href: "/journeys/pamir-silk-trail-tajikistan-flagship", kind: "route" },
  cities: { href: "/journeys/golden-cities-silk-trail-uzbekistan", kind: "route" },
};

type VideoCardProps = {
  src: string;
  poster: string;
  title: string;
  location: string;
  index: number;
  kind?: "video" | "image";
  href: string;
  ctaLabel: string;
};

function VideoCard({
  src,
  poster,
  title,
  location,
  index,
  kind = "video",
  href,
  ctaLabel,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(kind === "video");

  const toggle = () => {
    if (kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: EASE }}
      className="group will-change-transform"
    >
      <div
        className={cn(
          "silk-frame relative aspect-[9/16] overflow-hidden rounded-3xl sm:aspect-[4/5]",
          "border border-silk-gold/15 shadow-lg shadow-silk-indigo/20",
          "transition-[transform,box-shadow,border-color] duration-[420ms]",
          "ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          "group-hover:-translate-y-[10px]",
          "group-hover:border-silk-gold/55",
          "group-hover:shadow-[0_28px_56px_-14px_rgba(212,168,42,0.32),0_16px_32px_-8px_rgba(15,18,37,0.45)]",
          "group-hover:ring-1 group-hover:ring-silk-gold/35"
        )}
        style={{ transitionDuration: `${HOVER_MS}ms` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "h-full w-full origin-center",
              "transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
              "group-hover:scale-[1.1]"
            )}
            style={{ transitionDuration: `${HOVER_MS}ms` }}
          >
            {kind === "image" ? (
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={poster}
                className="h-full w-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src={src} type="video/mp4" />
              </video>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-silk-indigo/90 via-silk-indigo/20 to-transparent" />

        {kind === "video" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className={cn(
              "absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full",
              "bg-silk-gold/90 text-silk-indigo shadow-lg shadow-silk-gold/40",
              "transition-[transform,background-color,box-shadow] duration-[420ms]",
              "group-hover:scale-110 group-hover:bg-silk-gold"
            )}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-silk-gold">
            {location}
          </p>
          <p className="silk-headline mt-1 text-xl text-white">{title}</p>
          <Link
            href={href}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-silk-gold transition hover:text-white"
          >
            {ctaLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoShowcase() {
  const t = useTranslations("video");

  return (
    <section className="apple-section relative overflow-hidden bg-silk-indigo silk-pattern-dark">
      <div className="silk-aurora absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <ScrollReveal blur>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} dark />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseVideos.map((video, i) => {
            const link = CARD_LINKS[video.titleKey] ?? {
              href: "/journeys",
              kind: "route" as const,
            };
            return (
              <VideoCard
                key={video.id}
                src={video.src}
                poster={video.poster}
                title={t(`clips.${video.titleKey}.title`)}
                location={t(`clips.${video.locationKey}.location`)}
                index={i}
                kind={video.kind}
                href={link.href}
                ctaLabel={
                  link.kind === "story" ? t("watchStory") : t("exploreRoute")
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
