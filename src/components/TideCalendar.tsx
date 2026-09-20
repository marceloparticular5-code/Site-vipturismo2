import React, { useState } from 'react';
import { ALL_2026_MONTHS, TIDE_CATEGORY_LABELS } from '../data/tidesData';
import { TideCategory, TideDayInfo } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Compass,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface TideCalendarProps {
  onSelectDayForBooking: (dayInfo: {
    dateFormatted: string;
    height: number;
    timeWindow: string;
    tourRecommended: 'maracajau-vip' | 'rio-do-fogo-vip';
  }) => void;
}

export const TideCalendar: React.FC<TideCalendarProps> = ({ onSelectDayForBooking }) => {
  // Current month default: current local month or January 2026 for demonstration
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0); // Janeiro 2026
  const [selectedDay, setSelectedDay] = useState<TideDayInfo | null>(
    ALL_2026_MONTHS[0].days[2] // Day 3, 0.2m (Verde)
  );
  const [selectedDivingDestination, setSelectedDivingDestination] = useState<
    'maracajau-vip' | 'rio-do-fogo-vip'
  >('maracajau-vip');
  const [categoryFilter, setCategoryFilter] = useState<TideCategory | 'all'>('all');

  const currentMonthData = ALL_2026_MONTHS[selectedMonthIdx];

  const handlePrevMonth = () => {
    setSelectedMonthIdx((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx((prev) => (prev < 11 ? prev + 1 : 0));
  };

  const filteredDays = currentMonthData.days.filter((d) => {
    if (categoryFilter === 'all') return true;
    return d.category === categoryFilter;
  });

  const getBorderColorClass = (cat: TideCategory) => {
    if (cat === 'melhor') return 'border-emerald-500/80 hover:border-emerald-400 bg-emerald-950/20';
    if (cat === 'atencao') return 'border-amber-500/80 hover:border-amber-400 bg-amber-950/20';
    return 'border-rose-500/60 hover:border-rose-400 bg-rose-950/20 opacity-80';
  };

  const getTideBadge = (cat: TideCategory) => {
    if (cat === 'melhor') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Melhores Dias (0.0 a 0.5)
        </span>
      );
    }
    if (cat === 'atencao') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" /> Ainda Dá Pra Fazer (0.6 a 0.7)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-full">
        <XCircle className="w-3 h-3" /> Não Recomendamos (0.8+)
      </span>
    );
  };

  return (
    <section
      id="calendario-inteligente"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Header & Mental Triggers */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Algoritmo Exclusivo Natal Vip Turismo
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-['Cinzel',serif]">
          Calendário Inteligente de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
            Tábua de Maré 2026
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          O sucesso do seu mergulho nos recifes de corais depende diretamente do ciclo lunar e da
          maré baixa. Nosso sistema analisa a tábua oficial dos Parrachos e indica os dias perfeitos
          para água cristalina tipo piscina.
        </p>
      </div>

      {/* Destination Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setSelectedDivingDestination('maracajau-vip')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
            selectedDivingDestination === 'maracajau-vip'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-105'
              : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          Parrachos de Maracajaú VIP (Caribe Brasileiro)
        </button>

        <button
          onClick={() => setSelectedDivingDestination('rio-do-fogo-vip')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
            selectedDivingDestination === 'rio-do-fogo-vip'
              ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.35)] scale-105'
              : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          Parrachos de Rio do Fogo VIP (Piscinas & Banco de Areia)
        </button>
      </div>

      {/* Official Guidelines Legend (Matches the Instagram mockup precisely) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-sm">
        <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          Classificação Oficial de Mergulho
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Verde */}
          <button
            onClick={() => setCategoryFilter(categoryFilter === 'melhor' ? 'all' : 'melhor')}
            className={`p-3 rounded-xl border text-left transition-all ${
              categoryFilter === 'melhor' ? 'ring-2 ring-emerald-400' : ''
            } ${TIDE_CATEGORY_LABELS.melhor.badgeClass}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-emerald-300">0.0 a 0.5 · Melhor</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-snug">
              Melhores dias. Maré ultra-baixa com piscinas mornas e visibilidade máxima até 15m.
            </p>
          </button>

          {/* Amarelo */}
          <button
            onClick={() => setCategoryFilter(categoryFilter === 'atencao' ? 'all' : 'atencao')}
            className={`p-3 rounded-xl border text-left transition-all ${
              categoryFilter === 'atencao' ? 'ring-2 ring-amber-400' : ''
            } ${TIDE_CATEGORY_LABELS.atencao.badgeClass}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-amber-300">0.6 a 0.7 · Atenção</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
            </div>
            <p className="text-xs text-amber-200/90 leading-snug">
              Ainda dá pra fazer. Maré média, passeio viável e seguro com nível de água agradável.
            </p>
          </button>

          {/* Vermelho */}
          <button
            onClick={() =>
              setCategoryFilter(categoryFilter === 'nao_recomendado' ? 'all' : 'nao_recomendado')
            }
            className={`p-3 rounded-xl border text-left transition-all ${
              categoryFilter === 'nao_recomendado' ? 'ring-2 ring-rose-400' : ''
            } ${TIDE_CATEGORY_LABELS.nao_recomendado.badgeClass}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-rose-300">0.8+ · Não Recomendamos</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f87171]"></span>
            </div>
            <p className="text-xs text-rose-200/90 leading-snug">
              Maré alta ou fechada. Não recomendamos mergulho. Oferecemos Passeio de Buggy ou Pipa.
            </p>
          </button>
        </div>
      </div>

      {/* Main Calendar Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-8 bg-[#091526]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
          {/* Month Bar & Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {currentMonthData.monthName} {currentMonthData.year}
                </h3>
                <span className="text-xs text-slate-400">
                  Horários e alturas de maré oficiais · Parrachos Praia Clube
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-400 transition-colors"
                title="Mês anterior"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-400 transition-colors"
                title="Próximo mês"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Month Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
            {ALL_2026_MONTHS.map((m, idx) => (
              <button
                key={m.monthName}
                onClick={() => {
                  setSelectedMonthIdx(idx);
                  // select first green day of new month if available
                  const firstGreen = m.days.find((d) => d.category === 'melhor') || m.days[0];
                  setSelectedDay(firstGreen);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                  selectedMonthIdx === idx
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {m.monthName.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Days Grid - Faithful reproduction of the requested Instagram design! */}
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3">
            {filteredDays.map((d) => {
              const isSelected = selectedDay?.day === d.day;
              const borderStyle = getBorderColorClass(d.category);

              return (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d)}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all group ${borderStyle} ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10 shadow-lg'
                      : 'hover:scale-[1.03]'
                  }`}
                >
                  {/* Day Number */}
                  <span className="text-base sm:text-xl font-black text-white group-hover:text-amber-300">
                    {d.day}
                  </span>

                  {/* Tide Value formatted with comma (0,3 - 0,5 - 0,8) */}
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      d.category === 'melhor'
                        ? 'text-emerald-400'
                        : d.category === 'atencao'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {d.height.toFixed(1).replace('.', ',')}
                  </span>

                  {/* Small Indicator Dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      d.category === 'melhor'
                        ? 'bg-emerald-400'
                        : d.category === 'atencao'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Alert Note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>* O café da manhã é servido com reserva antecipada quando embarque até 8:30.</span>
            <span className="text-amber-300 font-semibold hidden sm:inline">
              Vagas limitadas pelas cotas do IDEMA
            </span>
          </div>
        </div>

        {/* Selected Day Inspection Panel & 1-Click Booking Action */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#0F1E36] to-[#081220] border border-amber-500/30 rounded-3xl p-6 shadow-2xl sticky top-24">
          {selectedDay ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Condição Selecionada
                </span>
                {getTideBadge(selectedDay.category)}
              </div>

              {/* Day Big Feature */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  Dia {selectedDay.day} de {currentMonthData.monthName}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-slate-400">Maré Mínima:</span>
                  <span className="font-extrabold text-amber-300 text-lg">
                    {selectedDay.height.toFixed(1).replace('.', ',')} metros
                  </span>
                </div>
              </div>

              {/* Embarkation window info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">
                      Janela Recomendada de Embarque
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {selectedDay.timeWindow}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {TIDE_CATEGORY_LABELS[selectedDay.category].desc}
                </div>
              </div>

              {/* Recommendation message */}
              {selectedDay.category === 'melhor' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
                  🌟 <strong>Dia de Ouro:</strong> Visibilidade cristalina máxima nos Parrachos!
                  Recomendamos garantir sua vaga com antecedência pois os catamarãs esgotam rápido.
                </div>
              )}

              {selectedDay.category === 'atencao' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium">
                  ⚖️ <strong>Dia Bom:</strong> O mergulho é realizado com sucesso. Nossos guias levam
                  você às bancadas de corais mais rasas.
                </div>
              )}

              {selectedDay.category === 'nao_recomendado' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-medium">
                  ⚠️ <strong>Atenção:</strong> Por respeito à sua experiência e segurança, não
                  recomendamos os Parrachos neste dia. Que tal agendar o incrível Passeio de Buggy em
                  Genipabu ou o Pipa VIP?
                </div>
              )}

              {/* Action Button */}
              <button
                id="btn-reserve-selected-day"
                onClick={() =>
                  onSelectDayForBooking({
                    dateFormatted: `${selectedDay.day.toString().padStart(2, '0')}/${(
                      selectedMonthIdx + 1
                    )
                      .toString()
                      .padStart(2, '0')}/2026`,
                    height: selectedDay.height,
                    timeWindow: selectedDay.timeWindow,
                    tourRecommended: selectedDivingDestination,
                  })
                }
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>
                  {selectedDay.category === 'nao_recomendado'
                    ? 'Ver Roteiros Alternativos'
                    : `Reservar para o Dia ${selectedDay.day}`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Cancelamento gratuito até 24h antes · Suporte 24h via WhatsApp
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p>Selecione um dia no calendário para conferir o horário da maré e reservar.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
