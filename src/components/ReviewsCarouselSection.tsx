import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquarePlus,
  X,
  Send,
  Sparkles,
  Award,
  ThumbsUp,
} from 'lucide-react';
import { PLATFORM_REVIEWS, PlatformReview } from '../data/reviewsData';

interface ReviewsCarouselSectionProps {
  onOpenBooking?: (tourId?: string) => void;
}

export const ReviewsCarouselSection: React.FC<ReviewsCarouselSectionProps> = ({
  onOpenBooking,
}) => {
  const [reviews, setReviews] = useState<PlatformReview[]>(PLATFORM_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'google' | 'tripadvisor'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState('');
  const [formTour, setFormTour] = useState('Parrachos de Maracajaú VIP');
  const [formPlatform, setFormPlatform] = useState<'google' | 'tripadvisor'>('google');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);

  // Fetch reviews from 24h cache API or fallback
  useEffect(() => {
    let isMounted = true;
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews.filter((r: PlatformReview) => r.rating >= 4));
        }
      })
      .catch((err) => {
        console.warn('Using local reviews fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filterPlatform === 'all') return true;
    return r.platform === filterPlatform;
  });

  const totalSlides = filteredReviews.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? Math.max(0, totalSlides - 1) : prev - 1));
  }, [totalSlides]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }

    touchStartX.current = null;
    setIsPaused(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: formName,
          rating: formRating,
          comment: formComment,
          tourMentioned: formTour,
          platform: formPlatform,
        }),
      });

      const res = await response.json();
      if (res.success && res.review) {
        setReviews((prev) => [res.review, ...prev]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsModalOpen(false);
          setFormName('');
          setFormComment('');
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visible window of reviews: 1 on mobile, 2 on tablet, 3 on desktop
  const getVisibleReviews = () => {
    if (totalSlides === 0) return [];
    const list: PlatformReview[] = [];
    for (let i = 0; i < Math.min(3, totalSlides); i++) {
      const index = (currentIndex + i) % totalSlides;
      list.push(filteredReviews[index]);
    }
    return list;
  };

  const visibleReviews = getVisibleReviews();

  return (
    <section
      id="avaliacoes-google-tripadvisor"
      aria-label="Avaliações de Clientes do Google e TripAdvisor"
      className="py-16 sm:py-24 bg-[#050C16] border-t border-slate-800/80 relative overflow-hidden"
    >
      <div id="depoimentos-vip" className="absolute -top-24 pointer-events-none" />
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mais de 2.840 Clientes Satisfeitos em Natal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Avaliações Reais no{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-['Cinzel',serif]">
              Google & TripAdvisor
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Depoimentos auditados de viajantes de todo o Brasil que viveram o melhor mergulho nos Parrachos, as dunas de Genipabu e o pôr do sol em Pipa com a <strong className="text-white">Natal Vip Turismo</strong>.
          </p>
        </div>

        {/* Consolidated Rating Summary Bar */}
        <div className="bg-[#091527]/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Rating stats */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">4.9</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-300 font-semibold">
                  Nota máxima consolidada (4 e 5 estrelas)
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700 hidden md:block" />

            <div className="flex items-center gap-3">
              {/* Google Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 shadow-sm">
                <span className="text-[#4285F4] font-black text-sm">G</span>
                <span>Google Reviews</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              {/* TripAdvisor Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 shadow-sm">
                <span className="text-base leading-none">🦉</span>
                <span>TripAdvisor 2026</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Action: Leave review & platform filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setFilterPlatform('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterPlatform === 'all' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterPlatform('google')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterPlatform === 'google' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterPlatform('tripadvisor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterPlatform === 'tripadvisor' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>TripAdvisor</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer transition-transform hover:scale-105"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Deixar Avaliação</span>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Avaliação anterior"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próxima avaliação"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </button>

          {/* Cards Grid / Slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-500">
            {visibleReviews.map((review, idx) => {
              const isGoogle = review.platform === 'google';

              return (
                <div
                  key={`${review.id}-${idx}`}
                  className="bg-gradient-to-b from-[#09172B] to-[#06101D] border border-amber-400/20 hover:border-amber-400/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-3.5">
                    {/* Header: Platform Badge + Verified Check */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isGoogle ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            <span className="font-extrabold text-[#4285F4]">G</span>
                            <span>Google Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <span>🦉</span>
                            <span>TripAdvisor</span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verificada
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400">{review.relativeTime}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Comment text */}
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-4 italic">
                      &quot;{review.comment}&quot;
                    </p>

                    {/* Tour Mention Tag */}
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {review.tourMentioned}
                      </span>
                    </div>
                  </div>

                  {/* Author footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.authorAvatar ? (
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center">
                          {review.authorInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{review.authorName}</p>
                        {review.authorLocation && (
                          <p className="text-[10px] text-slate-400 truncate">{review.authorLocation}</p>
                        )}
                      </div>
                    </div>

                    {review.likesCount && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <ThumbsUp className="w-3 h-3 text-amber-400" />
                        <span>{review.likesCount}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Pagination */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            {filteredReviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Ir para slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom External Links CTAs */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <span className="text-[#4285F4] font-black text-sm">G</span>
            <span>Ver todas as avaliações no Google (4.9 ★)</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
          </a>

          <a
            href="https://www.tripadvisor.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <span className="text-base">🦉</span>
            <span>Ver perfil e depoimentos no TripAdvisor</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
          </a>
        </div>
      </div>

      {/* Modal: Deixe sua Avaliação */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-label="Deixe sua avaliação"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#091527] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Deixar Avaliação VIP</h3>
                  <p className="text-[11px] text-slate-400">Sua opinião ajuda outros viajantes</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Avaliação Enviada com Sucesso!</h4>
                <p className="text-xs text-slate-300">
                  Muito obrigado por compartilhar sua experiência com a Natal Vip Turismo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Seu Nome Completo:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="ex: Mariana Duarte"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sua Nota:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-amber-300 font-bold text-xs ml-2">
                      {formRating} de 5 estrelas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Plataforma:</label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value as 'google' | 'tripadvisor')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="google">Google Avaliações</option>
                      <option value="tripadvisor">TripAdvisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Passeio Realizado:</label>
                    <select
                      value={formTour}
                      onChange={(e) => setFormTour(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Parrachos de Maracajaú VIP">Parrachos de Maracajaú VIP</option>
                      <option value="Parrachos de Rio do Fogo VIP">Parrachos de Rio do Fogo VIP</option>
                      <option value="Dunas de Genipabu Com Emoção">Dunas de Genipabu Com Emoção</option>
                      <option value="Pipa VIP & Pôr do Sol">Pipa VIP & Pôr do Sol</option>
                      <option value="São Miguel do Gostoso VIP">São Miguel do Gostoso VIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Seu Depoimento:</label>
                  <textarea
                    rows={3}
                    required
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Conte como foi sua experiência, o atendimento do guia, o barco ou o buggy..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar Avaliação'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
