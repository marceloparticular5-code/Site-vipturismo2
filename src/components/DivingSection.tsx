import React from 'react';
import { Sparkles, Anchor, Waves, CheckCircle2, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { VIP_TOURS } from '../data/toursData';
import { TourPackage } from '../types';

interface DivingSectionProps {
  onBookTour: (tourId: string) => void;
  onScrollToCalendar: () => void;
  tours?: TourPackage[];
}

export const DivingSection: React.FC<DivingSectionProps> = ({ onBookTour, onScrollToCalendar, tours }) => {
  const tourList = tours && tours.length > 0 ? tours : VIP_TOURS;
  const maracajau = tourList.find((t) => t.id === 'maracajau-vip') || VIP_TOURS[0];
  const rioDoFogo = tourList.find((t) => t.id === 'rio-do-fogo-vip') || VIP_TOURS[1];

  return (
    <section id="roteiros-mergulho" className="py-20 bg-[#050C16] relative overflow-hidden scroll-mt-20">
      {/* Glow backgrounds */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Anchor className="w-3.5 h-3.5 text-amber-400" />
            Experiências Subaquáticas de Elite
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-['Cinzel',serif]">
            Roteiros de Mergulho nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
              Parrachos Potiguares
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            As águas mornas do Rio Grande do Norte abrigam duas das mais extraordinárias barreiras de
            corais do planeta. Escolha o seu estilo e confira a maré no nosso calendário integrado.
          </p>
        </div>

        {/* 2 Big Spotlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Maracajaú Card */}
          <div className="bg-gradient-to-b from-[#0A182E] to-[#061020] border-2 border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-amber-400 transition-all duration-300">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={maracajau.imageUrl}
                alt="Parrachos de Maracajaú"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A182E] via-transparent to-black/40" />

              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                O Caribe Brasileiro
              </span>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5 text-sm font-bold bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.98 (1.840 avaliações)</span>
                </div>
                <div className="text-xs font-semibold bg-blue-900/80 backdrop-blur-md px-3 py-1 rounded-full text-sky-200">
                  7km da Costa
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Maxaranguape / Maracajaú
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Parrachos de Maracajaú VIP
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Piscinas naturais oceânicas profundas com formações coralíneas impressionantes.
                  Embarque em lancha rápida exclusiva até o flutuante com infraestrutura completa,
                  snorkel de alta tecnologia e opção de mergulho com cilindro PADI.
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 mb-6">
                  {maracajau.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    De R$ {maracajau.priceOriginal},00
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">
                      R$ {maracajau.priceDiscounted},00
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ passageiro</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Em até 12x no cartão ou 5% OFF no PIX
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onScrollToCalendar}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    Ver Tábua de Maré
                  </button>
                  <button
                    onClick={() => onBookTour('maracajau-vip')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Reservar Maracajaú</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rio do Fogo Card */}
          <div className="bg-gradient-to-b from-[#0A182E] to-[#061020] border-2 border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-teal-400 transition-all duration-300">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={rioDoFogo.imageUrl}
                alt="Parrachos de Rio do Fogo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A182E] via-transparent to-black/40" />

              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950 shadow-md">
                Piscinas & Banco de Areia
              </span>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5 text-sm font-bold bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.95 (1.220 avaliações)</span>
                </div>
                <div className="text-xs font-semibold bg-teal-900/80 backdrop-blur-md px-3 py-1 rounded-full text-teal-200">
                  Águas Mais Rasas & Calmas
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Rio do Fogo (Litoral Norte)
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Parrachos de Rio do Fogo VIP
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Ideal para casais, famílias com crianças e quem busca tranquilidade exclusiva. As
                  piscinas têm profundidade suave, banco de areia cinematográfico e um número menor
                  de embarcações permitidas por dia.
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 mb-6">
                  {rioDoFogo.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    De R$ {rioDoFogo.priceOriginal},00
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-teal-300">
                      R$ {rioDoFogo.priceDiscounted},00
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ passageiro</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Em até 12x no cartão ou 5% OFF no PIX
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onScrollToCalendar}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-teal-400 text-xs font-bold text-slate-200 hover:text-teal-300 transition-colors"
                  >
                    Ver Tábua de Maré
                  </button>
                  <button
                    onClick={() => onBookTour('rio-do-fogo-vip')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-teal-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Reservar Rio do Fogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table Mini Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Waves className="w-4 h-4 text-amber-400" />
            Qual escolher entre Maracajaú e Rio do Fogo?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-amber-400 block mb-1">
                Escolha Maracajaú VIP se você busca:
              </strong>
              Grandiosidade coralínea, maior variedade de vida marinha, batismo de mergulho com
              cilindro, lanchas velozes e o famoso visual do &quot;Caribe Brasileiro&quot;.
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-teal-400 block mb-1">
                Escolha Rio do Fogo VIP se você busca:
              </strong>
              Águas rasas para caminhar sobre o banco de areia no meio do oceano, tranquilidade
              absoluta sem aglomeração e mergulho seguro com crianças e idosos.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
