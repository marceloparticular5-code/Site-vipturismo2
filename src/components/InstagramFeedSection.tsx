import React, { useState } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  Play,
  Share2,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { INSTAGRAM_POSTS, InstagramPost } from '../data/instagramData';

interface InstagramFeedSectionProps {
  onOpenBooking: (tourId?: string) => void;
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({ onOpenBooking }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [activeModalPost, setActiveModalPost] = useState<InstagramPost | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const filteredPosts = INSTAGRAM_POSTS.filter((post) => {
    if (selectedFilter === 'todos') return true;
    return post.hashtagCategory === selectedFilter;
  });

  const handleShare = (post: InstagramPost) => {
    if (navigator.share) {
      navigator.share({
        title: `Passeio Natal Vip Turismo - ${post.tourName}`,
        text: post.caption,
        url: 'https://www.instagram.com/natalvipturismo',
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText('https://www.instagram.com/natalvipturismo');
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  return (
    <section
      id="instagram-feed"
      aria-label="Feed do Instagram da Natal Vip Turismo"
      className="py-16 sm:py-24 bg-[#050C16] border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Fotos Reais de Quem Viveu o VIP</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Galeria no{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 font-['Cinzel',serif]">
                Instagram @natalvipturismo
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Veja a experiência autêntica dos nossos clientes nas águas cristalinas de Maracajaú e Rio do Fogo,
              nas dunas de Genipabu e em Pipa. Marque <strong className="text-amber-300">#NatalVipTurismo</strong> para aparecer aqui!
            </p>
          </div>

          {/* Instagram Account Stat Badge & Follow Button */}
          <div className="flex flex-wrap items-center gap-3 bg-[#0A1729]/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-pink-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white">@natalvipturismo</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-200">28.4K</span> seguidores
                  <span>·</span>
                  <span className="font-bold text-slate-200">4.9 ★</span> avaliação
                </div>
              </div>
            </div>

            <a
              href="https://www.instagram.com/natalvipturismo"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all hover:scale-105 cursor-pointer"
            >
              <span>Seguir Perfil</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Hashtag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos os Momentos' },
            { id: 'maracajau', label: '#MaracajauVIP' },
            { id: 'rio-do-fogo', label: '#RioDoFogoVIP' },
            { id: 'genipabu', label: '#GenipabuComEmocao' },
            { id: 'pipa', label: '#PipaVIP' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedFilter(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === item.id
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Responsive Feed Grid (2 cols mobile, 3 cols tablet, 6 cols desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveModalPost(post)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-400/60 shadow-lg aspect-square cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            >
              {/* Photo */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/maracajau/maracajau-mergulho-peixes.webp';
                }}
              />

              {/* Video / Reel Indicator Badge */}
              {post.isVideo && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-950/80 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center shadow">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
              )}

              {/* Hover Dark Gradient Overlay with Likes & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold text-amber-300 truncate max-w-[100px]">
                    @{post.authorUsername}
                  </span>
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                </div>

                <div>
                  <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight mb-2 font-medium">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-white pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount}</span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-slate-300">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071F2E] via-[#093245] to-[#0B2538] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/40">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">
                Vai fazer passeio com a Natal Vip Turismo?
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Marque nosso perfil nos seus stories e concorra a um ensaio fotográfico subaquático gratuito!
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/natalvipturismo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition-all hover:scale-105 shrink-0"
          >
            Ver Feed Completo
          </a>
        </div>
      </div>

      {/* Lightbox Modal for Selected Instagram Post */}
      {activeModalPost && (
        <div
          role="dialog"
          aria-label="Publicação do Instagram ampliada"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActiveModalPost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#091527] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Full Photo Display */}
            <div className="md:w-1/2 bg-black flex items-center justify-center relative min-h-[260px] md:min-h-[460px]">
              <img
                src={activeModalPost.imageUrl}
                alt={activeModalPost.caption}
                className="w-full h-full object-cover max-h-[480px]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/maracajau/maracajau-mergulho-peixes.webp';
                }}
              />
              {activeModalPost.isVideo && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Instagram Details & Actions */}
            <div className="md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header with Author */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeModalPost.authorAvatar}
                      alt={activeModalPost.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white">
                          @{activeModalPost.authorUsername}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-300">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{activeModalPost.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalPost(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Caption & Story */}
                <div className="py-4 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-white mr-1.5 font-bold">
                      {activeModalPost.authorName}
                    </strong>
                    {activeModalPost.caption}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Publicado {activeModalPost.timeAgo}</span>
                  </div>

                  {/* Highlighted Tour Tag */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Roteiro Realizado:
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {activeModalPost.tourName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-bold text-rose-400">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      {activeModalPost.likesCount} curtidas
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-4 h-4" />
                      {activeModalPost.commentsCount} comentários
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShare(activeModalPost)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {copiedNotification && (
                  <p className="text-[10px] text-emerald-400 font-semibold text-center">
                    Link do Instagram copiado para a área de transferência!
                  </p>
                )}

                {/* Primary Action Button: Book this Tour */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBooking(activeModalPost.tourId);
                      setActiveModalPost(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <span>Reservar Este Roteiro</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="https://www.instagram.com/natalvipturismo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-pink-400 transition-colors flex items-center justify-center"
                    title="Abrir no Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
