import React from 'react';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Compass,
  ArrowRight,
  Anchor,
  Flame,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenCalendar: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenChat,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Image with Deep Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80"
          alt="Parrachos de Maracajaú e Piscinas Naturais"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform animate-pulse duration-[10000ms]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050C16]/95 via-[#050C16]/80 to-[#050C16]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.12),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Proof Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
            <img
              src="/imagens/logo01.png"
              alt="Selo Oficial Natal VIP"
              className="w-5 h-5 rounded-full object-contain drop-shadow"
              referrerPolicy="no-referrer"
            />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Empresa Nº 1 em Satisfação no RN · Mais de 12.000 Turistas VIP
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Certificação Cadastur Oficial
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] font-['Cinzel',serif] mb-6">
            A Experiência Mais Exclusiva de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-sm">
              Mergulho & Passeios VIP
            </span>{' '}
            em Natal
          </h1>

          <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto font-normal">
            Navegue pelos <strong className="text-white font-semibold">Parrachos de Maracajaú</strong> e{' '}
            <strong className="text-white font-semibold">Rio do Fogo</strong> com o único sistema com{' '}
            <span className="text-amber-300 font-semibold underline decoration-amber-400/50 underline-offset-4">
              Calendário Inteligente de Tábua de Maré
            </span>
            , garantindo águas cristalinas com segurança e atendimento executivo de ponta a ponta.
          </p>
        </div>

        {/* Mental Trigger Scarcity Live Box */}
        <div className="max-w-2xl mx-auto mb-10 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-amber-300 font-medium">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse shrink-0" />
            <span>
              <strong>Alerta de Maré Baixa:</strong> Dias com maré 0.0 a 0.5 possuem lotação máxima
              antecipada devido às cotas ambientais do IDEMA.
            </span>
          </div>
          <button
            onClick={onOpenCalendar}
            className="shrink-0 text-xs font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded-xl transition-all"
          >
            Ver Dias
          </button>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-16">
          <button
            id="hero-btn-reserve"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
          >
            <span>Reservar Passeio VIP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-btn-calendar"
            onClick={onOpenCalendar}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/80 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Tábua de Maré 2026</span>
          </button>

          <button
            id="hero-btn-ai-chat"
            onClick={onOpenChat}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl font-bold text-xs text-sky-200 hover:text-white bg-gradient-to-r from-blue-950/80 to-indigo-950/80 hover:from-blue-900/90 hover:to-indigo-900/90 border border-indigo-500/30 hover:border-indigo-400/70 transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Chatbot Gemini</span>
          </button>
        </div>

        {/* Feature Highlights Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
            <Anchor className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-black text-white">7 km</div>
            <div className="text-xs text-slate-400 mt-0.5">Embarque Oceânico VIP</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
            <Compass className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-black text-white">0.0 a 0.5</div>
            <div className="text-xs text-slate-400 mt-0.5">Melhores Dias de Maré</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-black text-white">4.98 / 5.0</div>
            <div className="text-xs text-slate-400 mt-0.5">Satisfação Comprovada</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
            <ShieldCheck className="w-6 h-6 text-sky-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-black text-white">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Garantia ou Reembolso</div>
          </div>
        </div>
      </div>
    </section>
  );
};
