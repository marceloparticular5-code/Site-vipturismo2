import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TourPackage } from '../types';
import { VIP_TOURS } from '../data/toursData';
import { TourShowcaseSkeleton } from './TourShowcaseSkeleton';
import { TourVacancyIndicator } from './TourVacancyIndicator';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Pause,
  Play,
  ArrowRight,
  Info,
  CalendarCheck,
  Camera,
  Compass,
  MessageCircle,
  Scale,
} from 'lucide-react';

interface MustSeeToursCarouselProps {
  onSelectTour: (tourId: string) => void;
  onOpenCompare?: (tourId: string) => void;
  onOpenChat?: () => void;
  tours?: TourPackage[];
  isLoading?: boolean;
}

type FilterCategory = 'todos' | 'mar' | 'aventura' | 'por-do-sol';

export const MustSeeToursCarousel: React.FC<MustSeeToursCarouselProps> = ({
  onSelectTour,
  onOpenCompare,
  onOpenChat,
  tours,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('todos');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter only active tours and enhance with "Indispensável" rankings
  const rawTours = (tours && tours.length > 0 ? tours : VIP_TOURS).filter(
    (t) => t.active !== false
  );

  const categorizedTours = rawTours.filter((tour) => {
    if (activeCategory === 'mar') {
      return tour.includesDiving || tour.id.includes('fogo') || tour.id.includes('maracajau');
    }
    if (activeCategory === 'aventura') {
      return tour.id.includes('buggy') || tour.id.includes('4x4') || tour.id.includes('genipabu');
    }
    if (activeCategory === 'por-do-sol') {
      return (
        tour.id.includes('pipa') ||
        tour.id.includes('gostoso') ||
        tour.id.includes('4x4') ||
        tour.title.toLowerCase().includes('pôr do sol')
      );
    }
    return true;
  });

  const totalItems = categorizedTours.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  }, [totalItems]);

  // Autoplay management
  useEffect(() => {
    if (isAutoplay && !isHovered && totalItems > 1) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 5500);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplay, isHovered, handleNext, totalItems]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (isLoading) {
    return (
      <section
        id="passeios-indispensaveis"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 relative"
      >
        <TourShowcaseSkeleton />
      </section>
    );
  }

  const currentTour = categorizedTours[currentIndex] || categorizedTours[0];

  if (!currentTour) return null;

  return (
    <section
      id="passeios-indispensaveis"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 relative"
    >
      {/* Background Atmosphere Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Seleção Oficial Potiguar · Roteiros 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Cinzel',serif]">
            Passeios{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Indispensáveis
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Se você vai a Natal pela primeira vez ou deseja a experiência definitiva, estes são os
            roteiros que <strong className="text-white">não podem faltar</strong> na sua viagem.
            Navegue interativamente, consulte horários ideais de maré e garanta sua vaga VIP.
          </p>
        </div>

        {/* Categories & Autoplay Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeCategory === 'todos'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Todos ({rawTours.length})
            </button>
            <button
              onClick={() => setActiveCategory('mar')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeCategory === 'mar'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mergulho & Mar
            </button>
            <button
              onClick={() => setActiveCategory('aventura')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeCategory === 'aventura'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Buggy & 4x4
            </button>
            <button
              onClick={() => setActiveCategory('por-do-sol')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeCategory === 'por-do-sol'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Pôr do Sol
            </button>
          </div>

          {/* Autoplay Pause/Play button */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 transition-all flex items-center gap-1.5 text-xs font-bold"
            title={isAutoplay ? 'Pausar rotação automática' : 'Ativar rotação automática'}
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Pausado</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Carousel */}
      <div
        ref={carouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-3xl bg-gradient-to-b from-[#0B172A] to-[#060D1A] border border-amber-500/20 shadow-2xl shadow-black/80 overflow-hidden"
        >
          {/* Progress Bar for Autoplay */}
          {isAutoplay && !isHovered && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30">
              <div
                key={currentIndex}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-[5500ms] ease-linear w-full"
                style={{ animation: 'progress-line 5.5s linear forwards' }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Visual Showcase (Left Column - 7 Cols) */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden group">
              <img
                src={currentTour.imageUrl}
                alt={currentTour.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/imagens/maracajau-mergulho.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-black/25 to-black/40 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0B172A]" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-20 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Indispensável #{currentIndex + 1}</span>
                  </span>

                  <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-200 border border-amber-400/30">
                    {currentTour.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Indicador de Vagas Limitadas Badge */}
                  <TourVacancyIndicator
                    remainingSlots={currentTour.remainingSlots || 3}
                    variant="badge"
                  />

                  {/* Rating Pill */}
                  <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-white border border-white/10 shadow-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{currentTour.rating}</span>
                    <span className="text-slate-400 text-[10px] hidden sm:inline">
                      ({currentTour.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Overlay Urgency bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentTour.urgencyText}</span>
                </div>

                {currentTour.includesDiving && (
                  <span className="shrink-0 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    Mergulho Homologado
                  </span>
                )}
              </div>
            </div>

            {/* Information & Action Column (Right Column - 5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#0B172A]/80 backdrop-blur-md">
              <div>
                {/* Meta Info: Duration & Location */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {currentTour.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentTour.location}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-['Cinzel',serif] leading-tight">
                  {currentTour.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-300/90 font-medium mb-4">
                  {currentTour.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                  {currentTour.description}
                </p>

                {/* Key Inclusions / Highlights Checklist */}
                <div className="space-y-2 mb-5">
                  <div className="text-[11px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Por que este passeio é imperdível:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(currentTour.highlights || currentTour.included).slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicador Visual de Vagas Limitadas com Urgência */}
                <div className="mb-4">
                  <TourVacancyIndicator
                    remainingSlots={currentTour.remainingSlots || 3}
                    variant="full"
                  />
                </div>
              </div>

              {/* Pricing, Economia & Conversion CTAs */}
              <div className="pt-4 border-t border-slate-800/80 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-2">
                      De R$ {currentTour.priceOriginal},00
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-amber-400">Por</span>
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        R$ {currentTour.priceDiscounted}
                      </span>
                      <span className="text-xs text-slate-400">/pessoa</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Economize R$ {currentTour.priceOriginal - currentTour.priceDiscounted},00
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Até 12x no cartão ou PIX
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id={`btn-reservar-indispensavel-${currentTour.id}`}
                  onClick={() => onSelectTour(currentTour.id)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Garantir Minha Vaga VIP</span>
                </button>

                {onOpenCompare && (
                  <button
                    type="button"
                    onClick={() => onOpenCompare(currentTour.id)}
                    className="py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/40 hover:border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Comparar especificações técnicas deste roteiro"
                  >
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Comparar</span>
                  </button>
                )}

                {onOpenChat && (
                  <button
                    onClick={onOpenChat}
                    className="py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-emerald-400/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    title="Perguntar ao Consultor Marcelo sobre este passeio"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Dúvidas com Marcelo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        {/* Carousel Navigation Arrows */}
        <button
          id="btn-carousel-indispensaveis-prev"
          onClick={handlePrev}
          aria-label="Passeio anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-30 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          id="btn-carousel-indispensaveis-next"
          onClick={handleNext}
          aria-label="Próximo passeio"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-30 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Interactive Thumbnails & Slide Counter */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Slide Counter */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="text-amber-400 font-mono text-base font-black">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span>/</span>
          <span className="font-mono">{String(totalItems).padStart(2, '0')}</span>
          <span className="text-slate-500 ml-1">· Use as setas ou deslize</span>
        </div>

        {/* Interactive Navigation Dots / Mini Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          {categorizedTours.map((tour, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={tour.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative flex items-center gap-2 py-1.5 px-3 rounded-full text-xs transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400/20 border-amber-400 text-white font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={tour.title}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive ? 'bg-amber-400 scale-125' : 'bg-slate-600 group-hover:bg-slate-400'
                  }`}
                />
                <span className="truncate max-w-[110px] sm:max-w-[140px] text-[11px]">
                  {tour.title.split('·')[0].split('VIP')[0].trim()}
                </span>
                {tour.remainingSlots && tour.remainingSlots <= 4 && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      tour.remainingSlots <= 2
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {tour.remainingSlots} vagas
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Help Tip */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Atendimento VIP e suporte direto via WhatsApp</span>
        </div>
      </div>
    </section>
  );
};
