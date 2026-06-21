import { ArrowRight } from 'lucide-react';
import { ShaderAnimation } from './ui/spiral-shader';

interface HeroProps {
  onExploreProducts: () => void;
}


export default function Hero({ onExploreProducts }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center min-h-screen w-full overflow-hidden z-10"
    >
      {/* Three.js Spiral Shader Background */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>

      {/* Dark premium glass overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-10" />

      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg-main z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center animate-fade-in text-text-primary">

        {/* Animated Rating Badge */}
        <div className="animate-pulse-border mb-6 sm:mb-8 inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs sm:text-sm font-medium text-text-primary">
          <span className="text-yellow-400 text-sm sm:text-base leading-none">★</span>
          <span>4.9 · Oltre 5.000 Clienti Soddisfatti</span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-light leading-[1.15] sm:leading-tight mb-6 sm:mb-8 tracking-tight text-text-primary text-center"
          style={{ letterSpacing: '-0.04em' }}
        >
          L'arte di{' '}
          <span className="gradient-text font-medium">colorare</span>
          <br className="hidden sm:inline" />
          {' '}i tuoi spazi
        </h1>

        <p className="text-text-muted text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light">
          Da oltre trent'anni selezioniamo le migliori vernici, porte interne, prati sintetici e accessori per la casa. Soluzioni d'arredo e finiture di pregio progettate per dare nuova luce e carattere ad ogni vostro ambiente.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreProducts}
            className="bg-accent-cta text-bg-main hover:opacity-90 transition-all font-semibold w-full sm:w-auto px-8 py-3.5 rounded-full text-base flex items-center justify-center space-x-2 group focus:outline-none shadow-lg cursor-pointer"
          >
            <span>Esplora i Prodotti</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <a
            href="#chi-siamo"
            className="btn-glass w-full sm:w-auto px-8 py-3.5 text-base text-text-primary text-center"
          >
            La nostra storia
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 opacity-60">
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">Scorri</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent-link to-transparent animate-pulse" />
      </div>
    </section>
  );
}
