import React, { useEffect, useRef, useState } from 'react';
import { Paintbrush, TreePine, DoorClosed, Construction, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  description: string;
  bgClass: string;
  icon: React.ReactNode;
  badge?: string;
  accent: React.ReactNode;
}

interface ProductsProps {
  onSelectVernici: () => void;
  onSelectCategory: (catId: string) => void;
}

const COLOR_DOTS = ['#991b1b', '#708a73', '#1e3a8a', '#ca8a04', '#4b5563'];

export default function Products({ onSelectVernici, onSelectCategory }: ProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const categories: Category[] = [
    {
      id: 'vernici',
      title: 'Vernici',
      description: 'Idropitture premium, smalti e finiture decorative su misura.',
      bgClass: 'bg-bg-surface border border-white/5',
      icon: <Paintbrush className="w-8 h-8 text-accent-link" />,
      badge: 'Nuovo',
      accent: (
        <div className="flex items-center gap-2 mt-6">
          {COLOR_DOTS.map((hex, i) => (
            <span
              key={i}
              className="w-6 h-6 rounded-full border border-white/10 shadow-inner flex-shrink-0"
              style={{ backgroundColor: hex }}
              title="Colore campione"
            />
          ))}
          <span className="text-text-muted text-xs ml-1">+195</span>
        </div>
      ),
    },
    {
      id: 'prati',
      title: 'Prati Sintetici',
      description: 'Erba sintetica di alta gamma per giardini e terrazzi sempre verdi.',
      bgClass: 'bg-bg-surface border border-white/5',
      icon: <TreePine className="w-8 h-8 text-accent-link" />,
      accent: (
        <div
          className="mt-6 w-full h-8 rounded-xl opacity-40"
          style={{
            background: 'linear-gradient(90deg, #14532d 0%, #166534 40%, #15803d 70%, #16a34a 100%)',
          }}
        />
      ),
    },
    {
      id: 'porte',
      title: 'Porte',
      description: 'Porte interne e blindati tra estetica, sicurezza e funzionalità.',
      bgClass: 'bg-bg-surface border border-white/5',
      icon: <DoorClosed className="w-8 h-8 text-accent-link" />,
      accent: (
        <div
          className="mt-6 w-full h-8 rounded-xl opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #a16207 0px, #a16207 2px, transparent 2px, transparent 18px)',
            backgroundColor: '#78350f',
          }}
        />
      ),
    },
    {
      id: 'accessori',
      title: 'Accessori',
      description: 'Attrezzatura professionale per tinteggiatura e posa.',
      bgClass: 'bg-bg-surface border border-white/5',
      icon: <Construction className="w-8 h-8 text-accent-link" />,
      accent: (
        <div
          className="mt-6 w-full h-8 rounded-xl opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #9ca3af 1px, transparent 1px), linear-gradient(to bottom, #9ca3af 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
      ),
    },
  ];

  return (
    <section
      id="prodotti"
      ref={sectionRef}
      className="bg-bg-main px-6 py-28 border-b border-bg-surface"
    >
      <div className="max-w-[88rem] mx-auto">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 reveal ${visible ? 'visible' : ''}`}>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-3">
              Soluzioni d'Arredo
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
              I Nostri Prodotti
            </h2>
          </div>
          <p className="text-text-muted text-lg max-w-md mt-4 md:mt-0 leading-relaxed">
            Una gamma completa di materiali d'eccellenza, selezionati dai migliori produttori per garantire durata, resa estetica e sostenibilità.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.id === 'vernici') onSelectVernici();
                else onSelectCategory(category.id);
              }}
              className={`card-glow reveal ${visible ? 'visible' : ''} flex flex-col justify-between text-left p-8 rounded-3xl min-h-[20rem] transition-all duration-300 group cursor-pointer border focus:outline-none ${category.bgClass}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top: Icon + Arrow + Badge */}
              <div className="flex items-start justify-between w-full">
                <div className="p-3 bg-bg-main rounded-2xl shadow-sm border border-white/5">
                  {category.icon}
                </div>
                <div className="flex items-center gap-2">
                  {category.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-cta/15 text-accent-cta border border-accent-cta/25">
                      {category.badge}
                    </span>
                  )}
                  <div className="w-9 h-9 rounded-full bg-bg-main flex items-center justify-center border border-white/5 opacity-0 transform translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shadow-sm">
                    <ArrowRight className="w-4 h-4 text-accent-link" />
                  </div>
                </div>
              </div>

              {/* Bottom: Title, text, texture accent */}
              <div className="mt-6">
                <h3 className="text-2xl font-medium text-text-primary mb-3">
                  {category.title}
                </h3>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  {category.description}
                </p>
                {category.accent}
                {category.id === 'vernici' ? (
                  <span className="inline-flex items-center text-xs font-semibold text-accent-link uppercase mt-4 gap-1 tracking-wider">
                    Esplora palette →
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-text-muted uppercase mt-4 gap-1 tracking-wider group-hover:text-text-primary transition-colors duration-200">
                    Vedi dettagli
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
