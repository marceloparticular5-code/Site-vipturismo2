import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { TourPackage } from '../types';

interface OffersShowcaseProps {
  tours: TourPackage[];
  onSelectTour: (tourId: string) => void;
  onOpenBooking: (tourId?: string) => void;
}

export const OffersShowcase: React.FC<OffersShowcaseProps> = ({
  tours,
  onSelectTour,
  onOpenBooking,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="ofertas-vitrine" className="py-14 sm:py-20 bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A192F]/15 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F59E0B]">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span>Preços Imbatíveis & Vagas Limitadas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-['Playfair_Display',serif]">
              Vitrine de Ofertas em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Roteiros autênticos operados com veículos confortáveis, guias experientes e saídas diárias em Ponta Negra.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-white hover:bg-[#0A192F] text-[#0A192F] hover:text-white border border-[#0A192F]/20 shadow-md transition-all cursor-pointer active:scale-95"
              aria-label="Voltar carrossel de ofertas"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-white hover:bg-[#0A192F] text-[#0A192F] hover:text-white border border-[#0A192F]/20 shadow-md transition-all cursor-pointer active:scale-95"
              aria-label="Avançar carrossel de ofertas"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of Tours (CVC Style with Boutique Palette) */}
        <div
          ref={carouselRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
        >
          {tours.map((tour, index) => {
            const hasPrice = tour.priceDiscounted > 0;
            const installmentPrice = hasPrice ? (tour.priceDiscounted / 3).toFixed(2) : null;

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.4) }}
                whileHover={{ y: -5 }}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-[#FBBF24] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={tour.imageUrl}
                    alt={`Passeio ${tour.title} em Natal RN`}
                    width="400"
                    height="250"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A192F] text-[#FBBF24] text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 border border-[#FBBF24]/30">
                    <Sparkles className="w-3 h-3 text-[#FBBF24]" />
                    <span>{tour.badge || 'VIP'}</span>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FBBF24]" />
                    <span>{tour.duration}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <MapPin className="w-3 h-3 text-[#F59E0B]" />
                      <span className="truncate">{tour.location}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#0A192F] group-hover:text-[#D97706] transition-colors leading-snug line-clamp-1">
                      {tour.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {tour.subtitle || tour.description}
                    </p>
                  </div>

                  {/* Key Highlights (Bullet points) */}
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-700">
                    {tour.highlights.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Box (CVC Style: "A partir de R$ X" + Parcelamento) */}
                  <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                    <div>
                      {hasPrice ? (
                        <>
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">A partir de</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-black text-[#0A192F]">
                              R$ {tour.priceDiscounted}
                            </span>
                            <span className="text-[11px] text-slate-500">/ pessoa</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#F59E0B] block">
                            ou 3x de R$ {installmentPrice} sem juros
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Valores Exclusivos</span>
                          <span className="text-lg font-black text-[#0A192F] block">Sob Consulta</span>
                          <span className="text-[10px] text-slate-500">Veículo privativo</span>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={() => onOpenBooking(tour.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Reservar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Banner de Garantia & Vantagens */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-[#1E3A5F]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">
                Garantia de Melhor Experiência em Natal-RN
              </h4>
              <p className="text-xs text-slate-300">
                Cancelamento gratuito em até 24h · Transfer executivo incluso direto da recepção do seu hotel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenBooking()}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow transition-transform active:scale-95 cursor-pointer text-center"
            >
              Falar com Concierge VIP
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
