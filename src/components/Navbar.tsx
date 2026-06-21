import { useState, useEffect } from 'react';
import minibel from '../assets/minibel.svg';

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 px-6 transition-all duration-300 ${
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
              <path
                d="M16 3 C16 3, 7 14, 7 20 C7 24.97 11.03 29 16 29 C20.97 29 25 24.97 25 20 C25 14 16 3 16 3Z"
                fill="url(#dropGrad)"
              />
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-text-muted hover:text-text-primary focus:outline-none p-2 flex items-center justify-center cursor-pointer"
            aria-label="Apri menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-6 bg-current rounded-full" />
              <span className="block h-0.5 w-6 bg-current rounded-full" />
              <span className="block h-0.5 w-4 bg-current rounded-full" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu — z-[60] covers the navbar */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background: pure black + radial glow */}
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_65%,_rgba(255,255,255,0.06)_0%,_transparent_100%)]" />

        {/* Top bar: X + logo */}
        <div className="relative flex items-center gap-4 px-5 pt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label="Chiudi menu"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={minibel}
            alt="Minibel"
            className="w-11 h-11 rounded-full object-cover border border-white/15"
          />
        </div>

        {/* Nav items — centered vertically */}
        <div className="relative flex flex-col items-center justify-center h-full pb-20 gap-2">
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`uppercase font-black tracking-[0.12em] py-3 px-4 transition-all duration-500 transform focus:outline-none cursor-pointer ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              } ${
                activeSection === item.id
                  ? 'text-white'
                  : 'text-white/65 hover:text-white/90'
              }`}
              style={{
                fontSize: 'clamp(28px, 9vw, 42px)',
                transitionDelay: isOpen ? `${idx * 65}ms` : '0ms',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
