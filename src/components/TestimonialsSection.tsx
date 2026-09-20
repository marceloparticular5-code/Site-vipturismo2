import React from 'react';
import { VIP_TESTIMONIALS } from '../data/testimonialsData';
import { Star, ShieldCheck, CheckCircle2, Award, Heart, MessageSquare } from 'lucide-react';

interface TestimonialsSectionProps {
  onOpenBooking?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="depoimentos-vip" className="py-20 bg-[#06101D] border-t border-b border-slate-800 relative overflow-hidden">
      {/* Background Subtle Highlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mais de 4.800 Viajantes Encantados em Natal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Depoimentos de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Clientes VIP
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Avaliações 100% verificadas de quem já viveu a melhor experiência náutica, os passeios de 4x4 e as dunas com a{' '}
            <strong className="text-slate-200">Natal Vip Turismo</strong>.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIP_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-b from-[#09172B] to-[#06101D] border border-amber-400/20 hover:border-amber-400/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Stars and Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {testimonial.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      {testimonial.badge}
                    </span>
                  )}
                </div>

                {/* Tour Name Tag */}
                <div className="text-xs font-bold text-amber-300/90 border-b border-slate-800 pb-2.5">
                  {testimonial.tourName}
                </div>

                {/* Review Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Info with Photo */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={testimonial.photoUrl}
                  alt={testimonial.authorName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40 shrink-0 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {testimonial.authorName}
                  </h4>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {testimonial.authorLocation} · {testimonial.date}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {testimonial.verifiedTag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Nota média de <strong>4.97 de 5.0</strong> no TripAdvisor e Google Reviews</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">Empresa Cadastrada no <strong>Cadastur</strong> pelo Ministério do Turismo</span>
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md"
              >
                Garantir Minha Vaga VIP
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
