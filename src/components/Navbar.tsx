import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Prodotti', id: 'prodotti' },
    { label: 'Chi siamo', id: 'chi-siamo' },
    { label: 'Recensioni', id: 'recensioni-clienti' },
    { label: 'Contatti', id: 'contatti' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-20 border-b border-white/5 px-6 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-surface/95 backdrop-blur-xl py-3 shadow-lg shadow-black/20'
          : 'bg-bg-surface/85 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-[88rem] mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <button
          onClick={() => handleItemClick('home')}
          className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
        >
          {/* Paint-drop SVG logo */}
          <svg
            className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="dropGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5A5F" />
                <stop offset="100%" stopColor="#00B4D8" />
              </linearGradient>
            </defs>
            {/* Paint drop shape */}
            <path
              d="M16 3 C16 3, 7 14, 7 20 C7 24.97 11.03 29 16 29 C20.97 29 25 24.97 25 20 C25 14 16 3 16 3Z"
              fill="url(#dropGrad)"
            />
            {/* Shine highlight */}
            <ellipse cx="13" cy="17" rx="2.5" ry="4" fill="white" fillOpacity="0.25" transform="rotate(-15 13 17)" />
          </svg>
          <span
            className={`text-2xl font-medium tracking-tight transition-colors duration-200 ${
              scrolled ? 'text-text-primary' : 'text-text-primary group-hover:text-accent-link'
            }`}
          >
            Colorificio
          </span>
        </button>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`text-base font-medium transition-colors duration-200 cursor-pointer focus:outline-none relative py-1 ${
                  isActive ? 'text-text-primary' : 'text-text-muted hover:text-accent-link'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cta to-accent-link rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => handleItemClick('contatti')}
            className="bg-accent-cta text-bg-main hover:opacity-90 transition-all font-semibold px-7 py-2.5 rounded-full text-base shadow-lg shadow-black/20 focus:outline-none cursor-pointer"
          >
            Contattaci
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-muted hover:text-text-primary focus:outline-none p-1"
            aria-label="Alterna menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-surface/95 backdrop-blur-xl border-b border-white/5 px-6 py-6 space-y-4 flex flex-col shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`text-left text-lg font-medium py-2 border-b border-white/5 focus:outline-none ${
                activeSection === item.id ? 'text-accent-link font-semibold' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleItemClick('contatti')}
            className="bg-accent-cta text-bg-main hover:opacity-90 transition-all font-semibold w-full py-3 rounded-full text-base mt-2 shadow-lg cursor-pointer"
          >
            Contattaci
          </button>
        </div>
      )}
    </nav>
  );
}
