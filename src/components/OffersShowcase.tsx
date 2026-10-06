import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Loader2,
  Waves,
  Compass,
  Anchor,
  RotateCcw,
} from 'lucide-react';
import { TourPackage } from '../types';

export type OfferFilterCategory = 'todos' | 'mergulho' | 'buggy' | 'lancha';

interface FilterOption {
  id: OfferFilterCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'todos',
    label: 'Todos os Passeios',
    icon: Sparkles,
    tagline: 'Catálogo completo',
  },
  {
    id: 'mergulho',
    label: 'Mergulho',
    icon: Waves,
    tagline: 'Parrachos & Piscinas Naturais',
  },
  {
    id: 'buggy',
    label: 'Passeios de Buggy',
    icon: Compass,
    tagline: 'Genipabu & Dunas 4x4',
  },
  {
    id: 'lancha',
    label: 'Lanchas VIP',
    icon: Anchor,
    tagline: 'Lancha Rápida & Náutico',
  },
];

const matchesFilter = (tour: TourPackage, filter: OfferFilterCategory): boolean => {
  if (filter === 'todos') return true;

  const textToSearch = [
    tour.title,
    tour.subtitle,
    tour.description,
    tour.category,
    tour.badge,
    ...(tour.highlights || []),
    ...(tour.included || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (filter === 'mergulho') {
    return (
      tour.includesDiving === true ||
      textToSearch.includes('mergulho') ||
      textToSearch.includes('snorkel') ||
      textToSearch.includes('parrachos') ||
      textToSearch.includes('piscinas naturais') ||
      textToSearch.includes('corais')
    );
  }

  if (filter === 'buggy') {
    return (
      textToSearch.includes('buggy') ||
      textToSearch.includes('bugueiro') ||
      textToSearch.includes('genipabu') ||
      textToSearch.includes('dunas') ||
      textToSearch.includes('4x4') ||
      textToSearch.includes('quadriciclo') ||
      textToSearch.includes('off-road')
    );
  }

  if (filter === 'lancha') {
    return (
      textToSearch.includes('lancha') ||
      textToSearch.includes('náutico') ||
      textToSearch.includes('catamarã') ||
      textToSearch.includes('plataforma flutuante') ||
      textToSearch.includes('embarcação') ||
      textToSearch.includes('maracajaú') ||
      textToSearch.includes('rio do fogo')
    );
  }

  return true;
};

interface OffersShowcaseProps {
  tours: TourPackage[];
  isLoading?: boolean;
  onSelectTour: (tourId: string) => void;
  onOpenBooking: (tourId?: string) => void;
}

export const TourCardSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-md flex flex-col select-none"
    >
      {/* Image Skeleton with Shimmer */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 animate-shimmer">
        {/* Placeholder Badge Top Left */}
        <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-slate-300/80 animate-pulse" />
        {/* Placeholder Duration Bottom Left */}
        <div className="absolute bottom-2.5 left-3 w-16 h-4 rounded-md bg-slate-400/50 animate-pulse" />
      </div>

      {/* Card Content Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Location row */}
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 animate-pulse" />
            <div className="w-28 h-3 rounded-md bg-slate-200 animate-shimmer" />
          </div>

          {/* Title */}
          <div className="w-4/5 h-5 rounded-md bg-slate-200 animate-shimmer" />

          {/* Subtitle / Description 2 lines */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3 rounded-md bg-slate-200 animate-shimmer" />
            <div className="w-3/5 h-3 rounded-md bg-slate-200 animate-shimmer" />
          </div>
        </div>

        {/* Highlights bullets */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="w-4/5 h-3 rounded-md bg-slate-200 animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="w-3/4 h-3 rounded-md bg-slate-200 animate-shimmer" />
          </div>
        </div>

        {/* Pricing Box & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="space-y-1.5">
            <div className="w-16 h-2.5 rounded bg-slate-200 animate-pulse" />
            <div className="w-28 h-6 rounded-md bg-slate-200 animate-shimmer" />
            <div className="w-36 h-2.5 rounded bg-slate-200 animate-pulse" />
          </div>

          {/* Button skeleton */}
          <div className="w-24 h-9 rounded-xl bg-amber-300/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const OffersShowcase: React.FC<OffersShowcaseProps> = ({
  tours,
  isLoading = false,
  onSelectTour: _onSelectTour,
  onOpenBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<OfferFilterCategory>('todos');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Computa a contagem de tours por categoria de filtro
  const countMap = useMemo(() => {
    return {
      todos: tours.length,
      mergulho: tours.filter((t) => matchesFilter(t, 'mergulho')).length,
      buggy: tours.filter((t) => matchesFilter(t, 'buggy')).length,
      lancha: tours.filter((t) => matchesFilter(t, 'lancha')).length,
    };
  }, [tours]);

  // Lista de tours filtrados conforme a categoria ativa
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => matchesFilter(tour, activeFilter));
  }, [tours, activeFilter]);

  const handleFilterChange = (filterId: OfferFilterCategory) => {
    setActiveFilter(filterId);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Section Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A192F]/15 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F59E0B]">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span>Preços Imbatíveis & Vagas Limitadas</span>
              {isLoading && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                  <span>Sincronizando Firebase...</span>
                </span>
              )}
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

        {/* Sistema de Filtros: Mergulho, Passeios de Buggy, Lanchas VIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {FILTER_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const count = countMap[opt.id] ?? 0;
              const isActive = activeFilter === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleFilterChange(opt.id)}
                  className={`group relative shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? 'bg-[#0A192F] text-[#FBBF24] border-2 border-[#FBBF24] shadow-md shadow-[#FBBF24]/15'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0A192F] border border-slate-200/90 shadow-sm'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#FBBF24]' : 'text-slate-500'
                    }`}
                  />
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#FBBF24] text-[#0A192F]'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeFilter !== 'todos' && (
            <button
              type="button"
              onClick={() => handleFilterChange('todos')}
              className="text-xs font-semibold text-slate-500 hover:text-[#0A192F] flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mostrar todos ({tours.length})</span>
            </button>
          )}
        </div>

        {/* Horizontal Carousel of Tours (CVC Style with Boutique Palette) */}
        <div
          ref={carouselRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-5 sm:gap-6"
                role="status"
                aria-label="Carregando passeios em destaque..."
              >
                {Array.from({ length: 4 }).map((_, idx) => (
                  <TourCardSkeleton key={idx} />
                ))}
              </motion.div>
            ) : filteredTours.length === 0 ? (
              <motion.div
                key="empty-filter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full min-w-[300px] sm:min-w-[450px] py-12 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 flex flex-col items-center justify-center my-2"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A192F]">
                    Nenhum passeio encontrado
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Não encontramos roteiros cadastrados especificamente para este filtro no momento.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange('todos')}
                  className="px-4 py-2 rounded-xl bg-[#0A192F] text-[#FBBF24] font-bold text-xs hover:bg-[#132A4B] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ver Todos os Passeios</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`tours-list-${activeFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex gap-5 sm:gap-6"
              >
                {filteredTours.map((tour, index) => {
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
                          alt={`Roteiro VIP ${tour.title} em Natal e Litoral Potiguar RN`}
                          width="400"
                          height="250"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/maracajau/maracajau-mergulho-peixes.webp';
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
                            className="btn-pulse-hover group/btn px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Reservar</span>
                            <ArrowRight className="w-3.5 h-3.5 btn-icon-pulse transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
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
              className="btn-pulse-hover w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow transition-transform active:scale-95 cursor-pointer text-center"
            >
              Falar com Concierge VIP
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
