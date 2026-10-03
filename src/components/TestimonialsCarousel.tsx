import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  ThumbsUp,
} from 'lucide-react';
import { PLATFORM_REVIEWS, PlatformReview } from '../data/reviewsData';

interface TestimonialsCarouselProps {
  onOpenBooking?: (tourId?: string) => void;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  onOpenBooking,
}) => {
  const [reviews] = useState<PlatformReview[]>(PLATFORM_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = reviews.length;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total]);

  const currentReview = reviews[currentIndex];

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <div
      className="w-full space-y-6"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 1. Header com Selos Oficiais Google & TripAdvisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selo Google Reviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A192F] to-[#071224] text-white border border-[#1E3A5F] shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Ícone oficial Google */}
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base">Google Avaliações</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verificado
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-[#FBBF24]">4.9</span>
                <div className="flex items-center text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24]" />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium">(480+ notas 5 estrelas)</span>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#FBBF24] hover:text-[#F59E0B] transition-colors"
          >
            <span>Ver no Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Selo TripAdvisor Travellers' Choice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A192F] to-[#071224] text-white border border-[#1E3A5F] shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Ícone oficial TripAdvisor */}
            <div className="w-12 h-12 rounded-xl bg-[#00AA6C] flex items-center justify-center shadow-md shrink-0">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6.5" cy="13.5" r="2.5" fill="white" />
                <circle cx="17.5" cy="13.5" r="2.5" fill="white" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.7.53-3.27 1.43-4.57.29-.42.92-.3 1.05.18.23.86.82 1.58 1.6 1.99.7.37 1.51.46 2.29.24.49-.14.97-.4 1.37-.77.16-.15.42-.15.58 0 .4.37.88.63 1.37.77.78.22 1.59.13 2.29-.24.78-.41 1.37-1.13 1.6-1.99.13-.48.76-.6 1.05-.18.9 1.3 1.43 2.87 1.43 4.57 0 4.41-3.59 8-8 8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base">TripAdvisor</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#00AA6C]/20 text-[#34E0A1] border border-[#00AA6C]/40">
                  Travellers' Choice 2026
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-[#FBBF24]">5.0</span>
                <div className="flex items-center text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24]" />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium">Excelência Recomendada</span>
              </div>
            </div>
          </div>

          <a
            href="https://www.tripadvisor.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#34E0A1] hover:text-[#00AA6C] transition-colors"
          >
            <span>Ver perfil</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Área do Carrossel de Depoimentos com Framer-Motion */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xl p-6 sm:p-8 lg:p-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentReview.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          >
            {/* Coluna Esquerda: Texto do Depoimento */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                {/* Badge da Plataforma e Selo Verificado */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      currentReview.platform === 'google'
                        ? 'bg-[#4285F4]/10 text-[#1E4E85] border border-[#4285F4]/30'
                        : 'bg-[#00AA6C]/10 text-[#00875A] border border-[#00AA6C]/30'
                    }`}
                  >
                    {currentReview.platform === 'google' ? 'Google Review' : 'TripAdvisor'}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Passeio Concluído</span>
                  </span>
                </div>

                {/* Estrelas */}
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>
              </div>

              {/* Citação */}
              <div className="relative">
                <Quote className="absolute -top-3 -left-3 w-8 h-8 text-[#0A192F]/10 pointer-events-none" />
                <p className="text-base sm:text-lg lg:text-xl text-[#0A192F] font-medium leading-relaxed italic pl-3 sm:pl-4 border-l-2 border-[#FBBF24]">
                  "{currentReview.comment}"
                </p>
              </div>

              {/* Informações de Roteiro e Data */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1 text-[#D97706] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{currentReview.tourMentioned}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentReview.date}</span>
                </span>
                {currentReview.likesCount && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <ThumbsUp className="w-3 h-3 text-slate-500" />
                      <span>{currentReview.likesCount} pessoas acharam útil</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Coluna Direita: Autor & Ação */}
            <div className="w-full lg:w-72 shrink-0 p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                {currentReview.authorAvatar ? (
                  <img
                    src={currentReview.authorAvatar}
                    alt={currentReview.authorName}
                    width="52"
                    height="52"
                    loading="lazy"
                    decoding="async"
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#FBBF24]/80 shadow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-13 h-13 rounded-full bg-[#0A192F] text-[#FBBF24] font-black text-lg flex items-center justify-center border-2 border-[#FBBF24]">
                    {currentReview.authorInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[#0A192F] truncate">
                    {currentReview.authorName}
                  </h4>
                  {currentReview.authorLocation && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{currentReview.authorLocation}</span>
                    </div>
                  )}
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Viajante VIP Autêntico
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {onOpenBooking && (
                  <button
                    onClick={() => onOpenBooking()}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow transition-transform active:scale-95 cursor-pointer text-center"
                  >
                    Quero Esta Experiência
                  </button>
                )}

                <a
                  href={currentReview.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs text-center border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver avaliação original</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3. Controles do Carrossel (Setas e Marcadores) */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          {/* Indicadores de bolinhas */}
          <div className="flex items-center gap-1.5">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Ir para depoimento ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-[#F59E0B]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Botões Próximo / Anterior */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="p-2.5 rounded-full bg-white hover:bg-[#0A192F] text-[#0A192F] hover:text-white border border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-500 px-1">
              {currentIndex + 1} / {total}
            </span>

            <button
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="p-2.5 rounded-full bg-white hover:bg-[#0A192F] text-[#0A192F] hover:text-white border border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
