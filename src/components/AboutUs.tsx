import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Users } from 'lucide-react';

const MILESTONES = [
  { year: '1993', label: 'Fondazione', active: false },
  { year: '2005', label: 'Prima espansione', active: false },
  { year: '2015', label: 'Linea ecologica', active: false },
  { year: '2024', label: 'Simulatore 3D', active: true },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const founders = [
    {
      name: 'Gabriele Rossi',
      role: 'Fondatore & Consulente Tecnico',
      bio: 'Esperto in vernici industriali e chimica dei materiali. Da oltre 30 anni aiuta architetti e privati a trovare la soluzione ideale per ogni cantiere.',
      initials: 'GR',
      gradient: 'from-stone-500 to-stone-700',
    },
    {
      name: 'Francesca Neri',
      role: 'Co-Fondatrice & Interior Designer',
      bio: 'Specializzata in armocromia, finiture decorative e arredamento d\'interni. Cura la selezione dei marchi e l\'accostamento delle palette cromatiche.',
      initials: 'FN',
      gradient: 'from-zinc-500 to-zinc-700',
    },
  ];

  return (
    <section id="chi-siamo" ref={sectionRef} className="bg-bg-main px-6 py-28 border-t border-bg-surface">
      <div className="max-w-[88rem] mx-auto">

        {/* Timeline Strip */}
        <div className={`reveal ${visible ? 'visible' : ''} mb-16`}>
          <div className="relative flex items-start justify-between max-w-2xl">
            {/* Connecting line */}
            <div className="absolute top-3.5 left-4 right-4 h-px bg-gradient-to-r from-accent-cta via-accent-link to-accent-link/30" />

            {MILESTONES.map((m, i) => (
              <div key={i} className="relative flex flex-col items-center text-center z-10" style={{ flex: 1 }}>
                {/* Dot */}
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mb-3 transition-colors ${
                    m.active
                      ? 'bg-accent-cta border-accent-cta shadow-lg shadow-accent-cta/30'
                      : 'bg-bg-surface border-white/20'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${m.active ? 'bg-white' : 'bg-text-muted'}`} />
                </div>
                <span className={`text-sm font-bold ${m.active ? 'gradient-text' : 'text-text-primary'}`}>
                  {m.year}
                </span>
                <span className="text-xs text-text-muted mt-0.5 leading-tight max-w-[80px]">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-3">
          Chi Siamo
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: History */}
          <div className={`reveal ${visible ? 'visible' : ''} space-y-6`}>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-8">
              La Nostra Storia
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Il nostro Colorificio nasce nel cuore di una passione di famiglia, con il desiderio di portare colore, qualità e design in ogni abitazione. Nel corso degli anni, ci siamo evoluti da semplice rivenditore di vernici a punto di riferimento per finiture d'interni, offrendo consulenze specializzate per privati ed imprese.
            </p>
            <p className="text-text-muted text-base leading-relaxed">
              Crediamo che una casa non sia fatta solo di pareti, ma di atmosfere. Per questo ricerchiamo costantemente materiali ecologici a basso impatto ambientale, senza mai scendere a compromessi sulla qualità tecnica e la resa cromatica dei nostri prodotti.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-bg-surface rounded-lg border border-white/5 shadow-sm mt-1">
                  <ShieldCheck className="w-5 h-5 text-accent-link" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">Garanzia di Qualità</h4>
                  <p className="text-sm text-text-muted mt-1">Selezioniamo solo i brand leader sul mercato.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-bg-surface rounded-lg border border-white/5 shadow-sm mt-1">
                  <Users className="w-5 h-5 text-accent-link" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">Supporto in Cantiere</h4>
                  <p className="text-sm text-text-muted mt-1">Consulenze tecniche in loco per imprese e posatori.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founders */}
          <div className={`reveal reveal-delay-2 ${visible ? 'visible' : ''} space-y-8`}>
            <h3 className="text-2xl font-medium text-text-primary mb-8 lg:text-right">
              I Nostri Fondatori
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {founders.map((founder, idx) => (
                <div
                  key={idx}
                  className="bg-bg-surface p-6 rounded-3xl border border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-white/10"
                >
                  <div className={`aspect-square rounded-2xl bg-gradient-to-tr ${founder.gradient} mb-6 flex items-center justify-center relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <span className="text-4xl font-light tracking-wider text-text-primary select-none">
                      {founder.initials}
                    </span>
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                  </div>

                  <h4 className="text-xl font-medium text-text-primary">{founder.name}</h4>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-link mt-1 mb-3">
                    {founder.role}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">{founder.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
