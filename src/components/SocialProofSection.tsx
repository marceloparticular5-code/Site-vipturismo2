import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageCircle, Award, Sparkles } from 'lucide-react';
import { TestimonialsCarousel } from './TestimonialsCarousel';

interface SocialProofSectionProps {
  onOpenBooking: () => void;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="avaliacoes-clientes" className="py-14 sm:py-20 bg-white text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#D97706] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Reputação 5 Estrelas · Turismo VIP em Natal-RN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] font-['Playfair_Display',serif] tracking-tight">
            O que nossos clientes dizem após viverem as praias do RN
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Mais de 1.850 turistas atendidos com pontualidade executiva, lanchas rápidas exclusivas, buggies credenciados e suporte 24h.
          </p>
        </div>

        {/* Rating Summary Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#0A192F] text-white shadow-xl border border-[#1E3A5F]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FBBF24] text-[#0A192F] flex flex-col items-center justify-center font-black shadow shrink-0">
              <span className="text-2xl leading-none">4.98</span>
              <span className="text-[10px] tracking-wider uppercase font-bold">de 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#FBBF24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBF24]" />
                ))}
                <span className="text-xs font-bold text-white ml-1">Excepcional</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Playfair_Display',serif]">
                Agência Número #1 em Satisfação em Ponta Negra
              </h3>
              <p className="text-xs text-slate-300">
                Avaliações verificadas de clientes reais no Google Maps e TripAdvisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#FBBF24] block">Cadastur Regular</span>
              <span className="text-[11px] text-slate-300">39.456.551/0001-08</span>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow cursor-pointer transition-transform active:scale-95"
            >
              Garantir Meu Passeio
            </button>
          </div>
        </div>

        {/* Carrossel de Depoimentos com Framer-Motion, Selos Google & TripAdvisor */}
        <TestimonialsCarousel onOpenBooking={onOpenBooking} />

        {/* Rodapé de Confiança Social */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-center">
          <div className="p-3">
            <span className="text-xl sm:text-2xl font-black text-[#0A192F] block">100%</span>
            <span className="text-xs text-slate-500 font-medium">Buggies Credenciados</span>
          </div>
          <div className="p-3">
            <span className="text-xl sm:text-2xl font-black text-[#0A192F] block">Zero</span>
            <span className="text-xs text-slate-500 font-medium">Fila com Lancha Rápida</span>
          </div>
          <div className="p-3">
            <span className="text-xl sm:text-2xl font-black text-[#0A192F] block">Transfer</span>
            <span className="text-xs text-slate-500 font-medium">Incluso na Porta do Hotel</span>
          </div>
          <div className="p-3">
            <span className="text-xl sm:text-2xl font-black text-[#0A192F] block">Nota 4.98</span>
            <span className="text-xs text-slate-500 font-medium">No Google e TripAdvisor</span>
          </div>
        </div>
      </div>
    </section>
  );
};

