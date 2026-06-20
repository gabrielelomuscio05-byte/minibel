import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Mock API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      // Reset success state after a few seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <section id="contatti" className="bg-bg-main px-6 py-28 border-t border-bg-surface">
      <div className="max-w-[88rem] mx-auto">
        <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-3">
          Contatti
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-6">
                Vieni a trovarci o contattaci
              </h2>
              <p className="text-text-muted text-base leading-relaxed max-w-md">
                Siamo a tua completa disposizione per consulenze personalizzate, informazioni sui prodotti o supporto per i tuoi progetti di ristrutturazione.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center border border-white/5">
                  <MapPin className="w-5 h-5 text-accent-link" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase">Sede Principale</span>
                  <span className="text-sm font-medium text-text-primary">Via dell'Artigianato, 42 - 20100 Milano (MI)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center border border-white/5">
                  <Phone className="w-5 h-5 text-accent-link" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase">Telefono</span>
                  <span className="text-sm font-medium text-text-primary">+39 02 1234567 / +39 333 9876543</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center border border-white/5">
                  <Mail className="w-5 h-5 text-accent-link" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase">Email</span>
                  <span className="text-sm font-medium text-text-primary">info@colorificiorossi.it</span>
                </div>
              </div>
            </div>

            {/* Stylized Google Map Placeholder */}
            <div className="relative w-full h-64 bg-bg-surface rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center group">
              {/* Abstract Vector Map Layout */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:32px_32px]" />
              
              {/* Mock Roads */}
              <div className="absolute inset-x-0 top-1/3 h-6 bg-bg-main/40 transform -rotate-6" />
              <div className="absolute inset-y-0 left-1/3 w-6 bg-bg-main/40 transform rotate-12" />
              <div className="absolute inset-x-0 bottom-1/4 h-8 bg-bg-main/40" />
              <div className="absolute inset-y-0 right-1/4 w-8 bg-bg-main/40" />

              {/* Pin Indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-accent-cta flex items-center justify-center shadow-lg border-2 border-bg-main animate-bounce">
                  <MapPin className="w-5 h-5 text-bg-main" />
                </div>
                <div className="bg-bg-main text-text-primary font-semibold text-xs py-1.5 px-3 rounded-lg border border-white/5 shadow-sm mt-2">
                  Colorificio Rossi
                </div>
              </div>

              {/* Etichetta decorativa */}
              <div className="absolute bottom-4 left-4 text-[10px] uppercase font-mono tracking-widest text-text-muted select-none">
                [Visualizzatore Mappa Google]
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="bg-bg-surface p-8 md:p-10 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-medium text-text-primary mb-8">
              Invia un messaggio
            </h3>

            {isSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-250 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <div>
                  <h4 className="font-semibold text-base text-emerald-100">Messaggio inviato con successo!</h4>
                  <p className="text-xs text-emerald-400 mt-1">Ti risponderemo entro 24 ore lavorative all'indirizzo email fornito.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-bg-main border border-white/5 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-link focus:ring-1 focus:ring-accent-link transition-all"
                    placeholder="Esempio: Marco Rossi"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">
                    Indirizzo Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-bg-main border border-white/5 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-link focus:ring-1 focus:ring-accent-link transition-all"
                    placeholder="Esempio: marco@esempio.it"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">
                    Il tuo Messaggio / Richiesta Informazioni
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-bg-main border border-white/5 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-link focus:ring-1 focus:ring-accent-link transition-all resize-none"
                    placeholder="Descrivi brevemente il tuo progetto, i materiali o i chiarimenti di cui hai bisogno..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent-cta text-bg-main hover:opacity-90 font-semibold w-full py-4 rounded-full text-base flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-bg-main/20 border-t-bg-main rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Invia Messaggio</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
