import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: string;
  numericEnd: number;
  prefix: string;
  suffix: string;
  label: string;
  delay: number;
}

const STATS: StatItem[] = [
  { value: '30+', numericEnd: 30, prefix: '', suffix: '+', label: 'Anni di Esperienza', delay: 0 },
  { value: '5.000+', numericEnd: 5000, prefix: '', suffix: '+', label: 'Clienti Serviti', delay: 150 },
  { value: '200+', numericEnd: 200, prefix: '', suffix: '+', label: 'Colori Disponibili', delay: 300 },
  { value: '4.9★', numericEnd: 49, prefix: '', suffix: '★', label: 'Valutazione Media', delay: 450 },
];

function useCountUp(end: number, duration: number, active: boolean, isRating: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (end - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, active]);

  if (isRating) {
    const val = (count / 10).toFixed(1);
    return val;
  }
  return count >= 1000 ? count.toLocaleString('it-IT') : count.toString();
}

function StatCard({ stat, active }: { stat: StatItem; active: boolean }) {
  const isRating = stat.suffix === '★';
  const displayCount = useCountUp(stat.numericEnd, 1800, active, isRating);

  return (
    <div
      className={`reveal ${active ? 'visible' : ''} flex flex-col items-center text-center px-6 py-8 group`}
      style={{ transitionDelay: `${stat.delay}ms` }}
    >
      <div className="flex items-baseline gap-1">
        <span className="gradient-text text-5xl md:text-6xl font-bold tracking-tight tabular-nums">
          {stat.prefix}{displayCount}{stat.suffix}
        </span>
      </div>
      <span className="text-text-muted text-sm font-medium uppercase tracking-wider mt-3">
        {stat.label}
      </span>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-bg-surface border-y border-white/5 overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-cta/5 via-transparent to-accent-link/5 pointer-events-none" />

      <div className="max-w-[88rem] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            let borderClasses = "border-white/5";
            if (i === 0) {
              borderClasses += " border-r border-b lg:border-b-0";
            } else if (i === 1) {
              borderClasses += " border-b lg:border-r lg:border-b-0";
            } else if (i === 2) {
              borderClasses += " border-r border-b-0 lg:border-r";
            } else if (i === 3) {
              borderClasses += " border-b-0";
            }
            return (
              <div key={i} className={borderClasses}>
                <StatCard stat={stat} active={visible} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
