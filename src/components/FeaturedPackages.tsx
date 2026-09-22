import React, { useState } from 'react';
import { VIP_TOURS } from '../data/toursData';
import { TourPackage } from '../types';
import {
  Star,
  Check,
  Clock,
  ShieldAlert,
  Flame,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FeaturedPackagesProps {
  onSelectTour: (tourId: string) => void;
  tours?: TourPackage[];
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({ onSelectTour, tours }) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'mergulho' | 'dunas-praias'>('todos');

  const tourList = (tours && tours.length > 0 ? tours : VIP_TOURS).filter((t) => t.active !== false);

  const filteredTours = tourList.filter((tour) => {
    if (activeTab === 'mergulho') return tour.includesDiving;
    if (activeTab === 'dunas-praias') return !tour.includesDiving;
    return true;
  });

  return (
    <section id="pacotes-vip" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header with Mental Triggers */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Experiências Selecionadas
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cinzel',serif]">
            Pacotes VIP em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Destaque
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Roteiros planejados minuto a minuto pela agência nº 1 em satisfação em Natal. Frota
            própria homologada, guias Cadastur e garantia total de experiência inesquecível.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'todos'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Todos os Pacotes
          </button>
          <button
            onClick={() => setActiveTab('mergulho')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'mergulho'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Parrachos & Mergulho
          </button>
          <button
            onClick={() => setActiveTab('dunas-praias')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dunas-praias'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Buggy & Praias
          </button>
        </div>
      </div>

      {/* Grid of VIP Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="group relative bg-[#091527] border border-slate-800 hover:border-amber-400/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Image & Badges */}
            <div>
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091527] via-transparent to-black/30" />

                {/* Badge Top Left */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40">
                  {tour.badge}
                </span>

                {/* Rating Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{tour.rating}</span>
                </div>

                {/* Mental Trigger: Urgency Bar on bottom of image */}
                <div className="absolute bottom-2 left-3 right-3 bg-amber-950/85 border border-amber-500/40 backdrop-blur-md rounded-xl px-3 py-1 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                  <span className="truncate">{tour.urgencyText}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {tour.duration}
                  </span>
                  <span>•</span>
                  <span>{tour.location}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
                  {tour.description}
                </p>

                {/* Inclusions checklist */}
                <div className="space-y-1.5 mb-6 text-xs text-slate-300">
                  {tour.included.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Price & CTA */}
            <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 line-through block">
                  R$ {tour.priceOriginal},00
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-300">
                    R$ {tour.priceDiscounted},00
                  </span>
                  <span className="text-[10px] text-slate-400">à vista</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  ou 12x de R$ {(tour.priceDiscounted / 10).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                id={`btn-book-${tour.id}`}
                onClick={() => onSelectTour(tour.id)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-md transition-all flex items-center gap-1 group-hover:scale-105 cursor-pointer"
              >
                <span>Reservar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mental Trigger Assurance Strip */}
      <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Garantia Maré & Tempo</h4>
            <p className="text-xs text-slate-400 mt-1">
              Se as condições marítimas impossibilitarem a navegação, você remarca grátis ou recebe
              reembolso imediato integral.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-400/10 text-emerald-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Segurança & Cadastur 100%</h4>
            <p className="text-xs text-slate-400 mt-1">
              Embarcações revisadas pela Capitania dos Portos e bugueiros credenciados com seguro
              turismo de passageiro incluso.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-sky-400/10 text-sky-400 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Transfer Hotel Porta a Porta</h4>
            <p className="text-xs text-slate-400 mt-1">
              Buscamos e deixamos você com pontualidade na recepção do seu hotel em Ponta Negra, Via
              Costeira e Praia do Meio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
