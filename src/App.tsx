import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import ColorDetailView from './components/ColorDetailView';
import type { PaintColor } from './components/ColorDetailView';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import { Sparkles } from 'lucide-react';
import { ScrollReelTestimonials } from '@/components/ui/scroll-reel-testimonials';
import Stats from './components/Stats';

const TESTIMONIALS = [
  {
    quote: "Vernici spettacolari! La copertura del Rosso Cardinale è incredibile. Ho ridipinto la parete principale del mio studio con una sola mano. Veramente consigliato!",
    author: "Marco Valenti (Architetto)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    quote: "Ho acquistato il prato sintetico per il mio terrazzo. Sembra erba vera, morbidissimo al calpestio e drena l'acqua in modo impeccabile. Servizio clienti super!",
    author: "Elena Radice (Privato)",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    quote: "Le porte filomuro acquistate sono di altissima precisione. Assistenza tecnica in cantiere eccellente durante le fasi di posa. Professionisti seri.",
    author: "Roberto Tosi (Impresa Edile)",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    quote: "Consulenza fantastica sull'armocromia degli interni. Il Verde Salvia consigliato ha trasformato la mia camera da letto in un'oasi di relax e design.",
    author: "Giulia Scotti (Designer d'Interni)",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    quote: "Ottimi prezzi e una gamma infinita di attrezzature professionali. Il personale in negozio mi ha consigliato i rulli perfetti per la finitura.",
    author: "Alessandro Muti (Decoratore)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
  {
    quote: "Trovato tutto il necessario per rifare il giardino. Il prato sintetico da 40mm è fantastico ed i bambini ci giocano benissimo in sicurezza.",
    author: "Chiara Belli (Privato)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
  },
];

const PAINT_COLORS: PaintColor[] = [
  {
    id: 'rosso-cardinale',
    name: 'Rosso Cardinale',
    hex: '#991b1b',
    description: 'Un rosso intenso ed elegante, dalla personalità spiccata. Caldo, profondo e sofisticato, ideale per dare carattere a pareti d\'accento, ingressi o studi professionali.',
    properties: {
      coverage: '10-12 mq/L per mano',
      dilution: '10-15% con acqua potabile',
      drying: 'Al tatto 2h, sovraverniciabile dopo 6h',
      voc: 'A+ (Bassissime emissioni)',
    }
  },
  {
    id: 'verde-salvia',
    name: 'Verde Salvia',
    hex: '#708a73',
    description: 'Tonalità salvia rilassante, ispirata alla macchia mediterranea. Perfetta per camere da letto, bagni e spazi living moderni improntati al benessere e alla luce naturale.',
    properties: {
      coverage: '12-14 mq/L per mano',
      dilution: '15-20% con acqua potabile',
      drying: 'Al tatto 1.5h, sovraverniciabile dopo 4h',
      voc: 'A+ (Bassissime emissioni)',
    }
  },
  {
    id: 'blu-oltremare',
    name: 'Blu Oltremare',
    hex: '#1e3a8a',
    description: 'Un blu marino profondo e nobile. Trasmette stabilità e tranquillità. Raccomandato in abbinamento con arredi in legno chiaro, rovere naturale o dettagli metallici ottonati.',
    properties: {
      coverage: '11-13 mq/L per mano',
      dilution: '10-15% con acqua potabile',
      drying: 'Al tatto 2h, sovraverniciabile dopo 5h',
      voc: 'A+ (Bassissime emissioni)',
    }
  },
  {
    id: 'ocra-sabbia',
    name: 'Ocra Sabbia',
    hex: '#ca8a04',
    description: 'Una tonalità ocra calda ed accogliente, che richiama le terre cotte toscane ed i caldi tramonti estivi. Ottima per scaldare ambienti esposti a nord e cucine rustiche.',
    properties: {
      coverage: '10-12 mq/L per mano',
      dilution: '20% con acqua potabile',
      drying: 'Al tatto 1.5h, sovraverniciabile dopo 5h',
      voc: 'A+ (Bassissime emissioni)',
    }
  },
  {
    id: 'grigio-siliceo',
    name: 'Grigio Siliceo',
    hex: '#4b5563',
    description: 'Grigio medio, neutro e materico. Perfetto per ambientazioni minimaliste, loft e pareti in stile industrial o cementizio. Altamente coprente e resistente all\'usura.',
    properties: {
      coverage: '12-15 mq/L per mano',
      dilution: '15% con acqua potabile',
      drying: 'Al tatto 1h, sovraverniciabile dopo 4h',
      voc: 'A+ (Bassissime emissioni)',
    }
  },
  {
    id: 'bianco-calce',
    name: 'Bianco Calce',
    hex: '#f1f5f9',
    description: 'Un bianco puro ma leggermente riscaldato da una punta di ocra. Estremamente luminoso, allarga otticamente gli spazi regalando un senso di purezza architettonica e ariosità.',
    properties: {
      coverage: '13-16 mq/L per mano',
      dilution: '20-30% con acqua potabile',
      drying: 'Al tatto 1h, sovraverniciabile dopo 4h',
      voc: 'A+ (Bassissime emissioni)',
    }
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [viewState, setViewState] = useState<'main' | 'vernici-detail'>(() => {
    return window.location.hash === '#vernici' ? 'vernici-detail' : 'main';
  });
  const [selectedColor, setSelectedColor] = useState<PaintColor>(PAINT_COLORS[0]);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<string | null>(null);
  const [contactPrefilledMessage, setContactPrefilledMessage] = useState('');

  const hasNavigatedFromMain = useRef(false);

  const handleContactColor = (colorName: string) => {
    setContactPrefilledMessage(`Salve, vorrei ricevere maggiori informazioni o un preventivo per l'idropittura colore ${colorName}.`);
    handleNavigation('contatti');
  };

  // Sync viewState with browser history / popstate
  useEffect(() => {
    // Set initial state representation in history if hash exists on load
    if (window.location.hash === '#vernici') {
      window.history.replaceState({ view: 'vernici-detail' }, '', '#vernici');
    } else {
      window.history.replaceState({ view: 'main' }, '', ' ');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view === 'vernici-detail') {
        setViewState('vernici-detail');
      } else if (window.location.hash === '#vernici') {
        setViewState('vernici-detail');
      } else {
        setViewState('main');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Monitor scroll for Scroll-Spy
  useEffect(() => {
    const handleScroll = () => {
      if (viewState === 'vernici-detail') {
        setActiveSection('prodotti');
        return;
      }

      // Scroll spy logic
      const sections = ['home', 'prodotti', 'chi-siamo', 'recensioni-clienti', 'contatti'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewState]);

  // Navigate to sections smoothly
  const handleNavigation = (sectionId: string) => {
    if (viewState === 'vernici-detail') {
      // Transition back to main page
      setViewState('main');
      // Clean up hash/state in history
      if (window.location.hash === '#vernici') {
        window.history.pushState({ view: 'main' }, '', window.location.pathname + window.location.search);
      }
      // Wait for React to render main page before scrolling
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveSection(sectionId);
  };

  const handleSelectVernici = () => {
    setViewState('vernici-detail');
    setSelectedCategoryInfo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    hasNavigatedFromMain.current = true;
    window.history.pushState({ view: 'vernici-detail' }, '', '#vernici');
  };

  const handleBackToMain = () => {
    if (hasNavigatedFromMain.current) {
      window.history.back();
    } else {
      setViewState('main');
      window.history.pushState({ view: 'main' }, '', window.location.pathname + window.location.search);
    }
  };

  const handleSelectOtherCategory = (catId: string) => {
    let message = '';
    if (catId === 'prati') {
      message = 'I nostri prati sintetici presentano un filato a 4 tonalità di verde con effetto "erba secca" alla base per un realismo ineguagliabile. Spessore da 30mm a 50mm, 100% drenanti.';
    } else if (catId === 'porte') {
      message = 'Porte filomuro verniciabili, porte in legno massello spazzolato o cristallo temperato. Telai in alluminio estruso e cerniere a scomparsa registrabili su 3 assi.';
    } else if (catId === 'accessori') {
      message = 'Pennellame professionale Cinghiale, rulli antigoccia in microfibra, nastri adesivi professionali Washi resistenti ai raggi UV e colle specifiche per posa erba sintetica.';
    }
    setSelectedCategoryInfo(message);
    
    // Auto scroll down to the category info banner
    setTimeout(() => {
      const el = document.getElementById('category-info-banner');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-stone-200 font-sans antialiased selection:bg-white selection:text-black">
      {/* 1. Navbar */}
      <Navbar onNavigate={handleNavigation} activeSection={activeSection} />

      {/* Main Content Area */}
      {viewState === 'main' ? (
        <main className="flex-grow">
          {/* 2. Hero Section */}
          <Hero onExploreProducts={() => handleNavigation('prodotti')} />

          {/* 2b. Stats Bar */}
          <Stats />

          {/* 3. Prodotti Section */}
          <Products
            onSelectVernici={handleSelectVernici} 
            onSelectCategory={handleSelectOtherCategory} 
          />

          {/* Category Details Banner (Dynamic Reveal) */}
          {selectedCategoryInfo && (
            <div id="category-info-banner" className="bg-stone-900/40 border-y border-stone-850 py-12 px-6 backdrop-blur-md animate-fade-in">
              <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 shadow-sm flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Dettagli Linea Prodotto</h4>
                    <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
                      {selectedCategoryInfo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategoryInfo(null)}
                  className="text-stone-450 hover:text-white text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer flex-shrink-0"
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}

          {/* 5. Chi Siamo Section */}
          <AboutUs />

          {/* Recensione Clienti Section */}
          <section id="recensioni-clienti" className="bg-bg-main px-6 py-28 border-t border-white/5 overflow-hidden flex flex-col items-center justify-center">
            <div className="max-w-[88rem] w-full mx-auto text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-3 animate-fade-in">
                Opinioni
              </span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-4 animate-fade-in">
                Recensione Clienti
              </h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
                Leggete le esperienze dirette di chi si è affidato alla nostra consulenza e ai nostri prodotti premium.
              </p>
            </div>
            <ScrollReelTestimonials testimonials={TESTIMONIALS} className="animate-fade-in" />
          </section>

          {/* 6. Contatti Section */}
          <Contact prefilledMessage={contactPrefilledMessage} />
        </main>
      ) : (
        <main className="flex-grow pt-16">
          {/* 4. Vernici Detail View (Interactive Color Page) */}
          <ColorDetailView
            onBack={handleBackToMain}
            colors={PAINT_COLORS}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            onContact={handleContactColor}
          />
        </main>
      )}

    </div>
  );
}
