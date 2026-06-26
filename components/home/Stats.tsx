"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/shared/ScrollReveal";

const stats = [
  { value: 4200, suffix: "+", key: "travelers" },
  { value: 28, suffix: "", key: "tours" },
  { value: 14, suffix: "", key: "countries" },
  { value: 14, suffix: "", key: "years" },
] as const;

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className="apple-headline text-5xl text-apple-black sm:text-6xl md:text-7xl"
    >
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="apple-section bg-apple-gray">
      <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-12 px-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.key} delay={i * 0.08} className="text-center">
            <Counter target={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-sm text-apple-muted">{t(stat.key)}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}