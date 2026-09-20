import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { Moon, Sparkles, MapPin, Clock, ArrowRight, Compass, Heart } from 'lucide-react';

interface NightlifeBlogSectionProps {
  onSelectSuggestedTour: (tourId: string) => void;
}

export const NightlifeBlogSection: React.FC<NightlifeBlogSectionProps> = ({
  onSelectSuggestedTour,
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(BLOG_POSTS[0].id);

  const activePost = BLOG_POSTS.find((p) => p.id === selectedPostId) || BLOG_POSTS[0];

  return (
    <section
      id="blog-noite"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 relative"
    >
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Moon className="w-3.5 h-3.5 text-indigo-300" />
          Guia Noturno Potiguar · Edição Especial
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cinzel',serif] mb-4">
          Onde Sair à Noite em{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
            Natal/RN
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Viva a boemia, alta gastronomia de frutos do mar e o autêntico forró pé-de-serra. E para o
          dia seguinte, deixe a sua programação de praia com quem é a agência nº 1 em satisfação do
          estado.
        </p>
      </div>

      {/* Interactive Card Blog Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: List of Attractions */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 px-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Escolha uma atração para explorar
          </span>

          <div className="space-y-3">
            {BLOG_POSTS.map((post) => {
              const isSelected = post.id === selectedPostId;
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0F223D] to-[#0A1628] border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                      {post.tag}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300">
                      {post.title}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {post.location}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
            <Heart className="w-5 h-5 text-amber-400 shrink-0 fill-amber-400" />
            <span>
              <strong>Dica de Ouro:</strong> A Natal Vip Turismo cuida do seu translado matinal com
              conforto absoluto para você aproveitar a noite sem preocupações.
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Blog Card Highlighting Natal Vip Connection */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0B1A30] to-[#071120] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Image banner inside the card */}
            <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                  {activePost.tag}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200 font-semibold">
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {activePost.location}
                </span>
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {activePost.timing}
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
              {activePost.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {activePost.description}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-amber-300 font-medium mb-6">
              💡 {activePost.highlight}
            </div>

            {/* Crucial Requirement: Natal Vip Turismo Recommendation Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-transparent border-2 border-amber-400/60 shadow-inner mb-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-300 mb-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                Como aproveitar o dia seguinte com a Natal Vip Turismo:
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                {activePost.natalVipTip}
              </p>
            </div>
          </div>

          {/* Action to book suggested daytime tour directly */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Passeio recomendado para a manhã seguinte:
              <span className="block font-bold text-white text-sm">
                {activePost.suggestedTourName}
              </span>
            </div>

            <button
              id={`btn-blog-tour-${activePost.suggestedTourId}`}
              onClick={() => onSelectSuggestedTour(activePost.suggestedTourId)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Agendar Passeio do Dia Seguinte</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
