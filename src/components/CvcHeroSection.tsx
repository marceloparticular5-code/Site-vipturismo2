import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Flame,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Heart,
  Car,
} from 'lucide-react';
import { VIP_TOURS } from '../data/toursData';
import { getTodayISO } from '../lib/dateUtils';

interface CvcHeroSectionProps {
  onSearch: (criteria: { tourId: string; date: string; guests: string; category: string }) => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const CvcHeroSection: React.FC<CvcHeroSectionProps> = ({
  onSearch,
  onOpenBooking,
  onOpenCalendar,
}) => {
  const [activeTab, setActiveTab] = useState<'passeios' | 'pacotes' | 'transfer' | 'personalizado'>('passeios');
  const [selectedTour, setSelectedTour] = useState('maracajau-vip');
  const [travelDate, setTravelDate] = useState(() => getTodayISO());
  const [guestsCount, setGuestsCount] = useState('2');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      tourId: selectedTour,
      date: travelDate,
      guests: guestsCount,
      category: activeTab,
    });
    onOpenBooking(selectedTour);
  };

  const handleQuickChip = (tourId: string, category: 'passeios' | 'pacotes' | 'transfer' = 'passeios') => {
    setSelectedTour(tourId);
    setActiveTab(category);
    onOpenBooking(tourId);
  };

  return (
    <section className="relative w-full bg-[#0A192F] pt-6 pb-16 sm:pb-20 text-white overflow-hidden">
      {/* Background Image & Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/hero-natal-paradise.webp"
          alt="Paisagem aérea paradisíaca do litoral de Natal e dunas de Genipabu RN"
          className="w-full h-full object-cover object-center opacity-25 scale-105 pointer-events-none"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060D17]/90 via-[#0A192F]/95 to-[#0A192F]" />
      </div>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FBBF24]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Kicker & Main Headline (CVC Style with Boutique Tone) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FBBF24] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turismo Boutique em Ponta Negra · Natal - RN</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display',serif]">
            Passeios em promoção pra você conhecer{' '}
            <span className="text-[#FBBF24] underline decoration-[#F59E0B] decoration-wavy decoration-2">
              Natal e o Litoral do RN!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
            Mergulho nos Parrachos de Maracajaú com lancha rápida, Buggy com emoção em Genipabu,
            Pipa VIP e Litoral Sul 4x4 com conforto de agência credenciada Cadastur.
          </p>
        </div>

        {/* CVC-Style Search Box with In-line Filter Engine */}
        <div className="max-w-5xl mx-auto">
          {/* Tabs Acima da Busca: Passeios | Pacotes | Transfer | Personalizado */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'passeios', label: 'Passeios', icon: Compass },
              { id: 'pacotes', label: 'Pacotes', icon: Heart },
              { id: 'transfer', label: 'Transfer Aeroporto', icon: Car },
              { id: 'personalizado', label: 'Personalizado VIP', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'pacotes') setSelectedTour('pacote-casal-vip');
                    else if (tab.id === 'transfer') setSelectedTour('transfer-vip-aeroporto');
                    else setSelectedTour('maracajau-vip');
                  }}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-t-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#0A192F] shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-[#FBBF24]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* In-Line Search Container (White Card with Smooth Shadows) */}
          <div className="bg-white rounded-b-2xl rounded-tr-2xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 text-[#0F172A]">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              
              {/* 1. Destino / Passeio */}
              <div className="lg:col-span-5 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Qual passeio ou destino você deseja?</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#FBBF24] text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/30 transition-all cursor-pointer"
                  >
                    <optgroup label="Passeios em Destaque">
                      <option value="maracajau-vip">Passeio Maracajaú (R$ 170 · Caribe Brasileiro)</option>
                      <option value="rio-do-fogo-vip">Passeio Rio do Fogo (R$ 170 · Banco de Areia)</option>
                      <option value="pipa-praia-do-amor">Passeio Pipa + Praia do Amor (R$ 80)</option>
                      <option value="pipa-by-night">Pipa By Night (R$ 100 · Sextas e Sábados)</option>
                      <option value="buggy-vip-privativo">Buggy VIP Premium Privativo (Genipabu · Sob Consulta)</option>
                      <option value="off-road-litoral-sul">Off-Road Litoral Sul 4x4 (Pajero · Sob Consulta)</option>
                    </optgroup>
                    <optgroup label="Pacotes & Transfer">
                      <option value="pacote-casal-vip">Pacote Casal VIP (R$ 1.320 total para 2 pessoas / casal · 4 Dias + Transfer)</option>
                      <option value="transfer-vip-aeroporto">Transfer VIP Aeroporto de Natal (R$ 160 até 4 pessoas)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 2. Data da Viagem */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0A192F]" />
                  <span>Quando deseja ir?</span>
                </label>
                <input
                  type="date"
                  min={getTodayISO()}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0A192F] text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 transition-all cursor-pointer"
                />
              </div>

              {/* 3. Número de Pessoas */}
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0A192F]" />
                  <span>Viajantes</span>
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0A192F] text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 transition-all cursor-pointer"
                >
                  <option value="1">1 Pessoa</option>
                  <option value="2">2 Pessoas (Casal)</option>
                  <option value="3">3 Pessoas</option>
                  <option value="4">4 Pessoas (Família)</option>
                  <option value="5+">5+ Pessoas (Grupo)</option>
                </select>
              </div>

              {/* 4. Botão "Buscar" (Amarelo Solar #FBBF24 & Dark Blue #0A192F) */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="btn-pulse-hover w-full py-3.5 px-5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4 stroke-[3] btn-icon-pulse transition-transform duration-300" />
                  <span>Buscar</span>
                </button>
              </div>
            </form>

            {/* Quick Chips dos Mais Buscados */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-[#0A192F] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Mais buscados:</span>
              </span>
              <button
                type="button"
                onClick={() => handleQuickChip('maracajau-vip')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-[#0A192F] font-medium transition-colors cursor-pointer"
              >
                Parrachos de Maracajaú (R$ 170)
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip('pipa-praia-do-amor')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-[#0A192F] font-medium transition-colors cursor-pointer"
              >
                Pipa + Praia do Amor (R$ 80)
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip('pacote-casal-vip', 'pacotes')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#0A192F] font-bold border border-amber-200 transition-colors cursor-pointer"
              >
                Pacote Casal VIP (R$ 1.320 / 2 pessoas)
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip('transfer-vip-aeroporto', 'transfer')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-[#0A192F] font-medium transition-colors cursor-pointer"
              >
                Transfer Aeroporto (R$ 160)
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges (Mental Triggers: Segurança, Facilidade, Cadastur) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto pt-2 text-slate-200 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-[#FBBF24] shrink-0" />
            <div>
              <div className="font-bold text-white">Cadastur Oficial</div>
              <div className="text-[11px] text-slate-300">Reg. 39.456.551/0001-08</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <CreditCard className="w-5 h-5 text-[#FBBF24] shrink-0" />
            <div>
              <div className="font-bold text-white">Até 3x Sem Juros</div>
              <div className="text-[11px] text-slate-300">Ou 5% de desconto no Pix</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Clock className="w-5 h-5 text-[#FBBF24] shrink-0" />
            <div>
              <div className="font-bold text-white">Tábua de Maré 2026</div>
              <div className="text-[11px] text-slate-300">Saídas no momento ideal</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Cancelamento Grátis</div>
              <div className="text-[11px] text-slate-300">Até 24h antes do passeio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
