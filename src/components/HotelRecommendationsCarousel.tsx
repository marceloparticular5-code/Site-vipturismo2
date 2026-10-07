import React, { useState, useRef, useEffect } from 'react';
import {
  Hotel,
  MapPin,
  Compass,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Coffee,
  Sparkles,
  Bus,
  CheckCircle2,
  MessageCircle,
  X,
  Copy,
  Check,
  Calendar,
  Waves,
  ArrowRight,
} from 'lucide-react';
import { HotelPartner } from '../types';
import { PARTNER_HOTELS } from '../data/hotelsData';
import { getWhatsAppLink } from '../config/contact';

interface HotelRecommendationsCarouselProps {
  onOpenBooking?: (tourId?: string) => void;
  onOpenChat?: (initialContext?: string) => void;
}

export const HotelRecommendationsCarousel: React.FC<HotelRecommendationsCarouselProps> = ({
  onOpenBooking,
  onOpenChat,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Todos');
  const [activeHotelModal, setActiveHotelModal] = useState<HotelPartner | null>(null);
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const regions = [
    'Todos',
    'Via Costeira',
    'Ponta Negra',
    'Litoral Norte',
    'Pipa / Litoral Sul',
  ];

  const filteredHotels =
    selectedRegion === 'Todos'
      ? PARTNER_HOTELS
      : PARTNER_HOTELS.filter((hotel) => hotel.region === selectedRegion);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

    // Calculate approximate active card index
    const cardWidth = 380;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, filteredHotels.length - 1));
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [filteredHotels.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 380;
    scrollContainerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handleCopyAddress = (hotel: HotelPartner) => {
    navigator.clipboard.writeText(hotel.address);
    setCopiedAddressId(hotel.id);
    setTimeout(() => setCopiedAddressId(null), 2500);
  };

  const handleTalkToMarcelo = (hotel: HotelPartner) => {
    const text = `Olá Marcelo! Vou me hospedar no *${hotel.name}* em Natal e gostaria de verificar a logística de embarque para os Parrachos de Maracajaú e reservar os passeios da Natal Vip Turismo!`;
    window.open(getWhatsAppLink(text), '_blank');
  };

  return (
    <section
      id="hospedagem-natal"
      className="py-16 md:py-24 bg-gradient-to-b from-[#050C16] via-[#091526] to-[#050C16] relative overflow-hidden border-t border-slate-800/60"
    >
      {/* Elementos decorativos sutis */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3.5">
            <Hotel className="w-3.5 h-3.5 text-amber-400" />
            <span>Onde Ficar com Embarque Facilitado</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-['Cinzel',serif] tracking-tight">
            Dicas de Hospedagem em Natal & Rota dos Passeios
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Hotéis parceiros e resorts estrategicamente localizados nos pontos de embarque
            prioritário da van VIP. Menos tempo no trânsito, café da manhã antecipado nos dias de
            maré baixa e saída pontual para os Parrachos de Maracajaú e Rio do Fogo.
          </p>

          {/* Destaque da Logística VIP */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Bus className="w-4 h-4 text-amber-400" />
              Transfer busca na guarita do seu hotel
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Coffee className="w-4 h-4 text-emerald-400" />
              Early breakfast alinhado à tábua de maré
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Parceria oficial de receptivo
            </span>
          </div>
        </div>

        {/* Barra de Filtros por Região */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            {regions.map((region) => {
              const isSelected = selectedRegion === region;
              const count =
                region === 'Todos'
                  ? PARTNER_HOTELS.length
                  : PARTNER_HOTELS.filter((h) => h.region === region).length;

              return (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedRegion(region);
                    setActiveIndex(0);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{region}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Botões de Navegação do Carrossel (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-full border transition-all ${
                canScrollLeft
                  ? 'bg-slate-900/90 text-white border-slate-700 hover:border-amber-400/80 hover:bg-slate-800 cursor-pointer shadow-md'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-full border transition-all ${
                canScrollRight
                  ? 'bg-slate-900/90 text-white border-slate-700 hover:border-amber-400/80 hover:bg-slate-800 cursor-pointer shadow-md'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carrossel Interativo de Hotéis */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredHotels.map((hotel, index) => {
            return (
              <div
                key={hotel.id}
                className="w-[85vw] sm:w-[360px] md:w-[380px] shrink-0 snap-start flex flex-col rounded-3xl bg-[#091526] border border-slate-800/80 hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden group"
              >
                {/* Imagem do Hotel com Badges */}
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091526] via-transparent to-black/40" />

                  {/* Badge de Destaque / Categoria */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {hotel.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md">
                        {hotel.badge}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-amber-200 border border-slate-800 backdrop-blur-sm">
                      {hotel.category}
                    </span>
                  </div>

                  {/* Avaliação em Estrelas */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-xs font-bold text-amber-300 shadow-md backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">({hotel.reviewsCount})</span>
                  </div>

                  {/* Indicador de Proximidade e Embarque */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/90 text-slate-950 font-bold backdrop-blur-sm shadow-md">
                      <Bus className="w-3.5 h-3.5" />
                      <span>{hotel.distanceToDeparture}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {hotel.region}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Nome do Hotel e Tagline */}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {hotel.tagline}
                    </p>

                    {/* Proximidade com Ponto de Partida */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-300 leading-snug">
                          <strong className="text-amber-300 font-semibold">
                            Logística de Saída:{' '}
                          </strong>
                          {hotel.departurePointProximity}
                        </span>
                      </div>
                    </div>

                    {/* Benefícios Exclusivos da Natal Vip Turismo */}
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Vantagens para Clientes da Agência:
                      </p>
                      {hotel.perksForVipClients.slice(0, 2).map((perk, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{perk}</span>
                        </div>
                      ))}
                    </div>

                    {/* Box Dica do Marcelo */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-300 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dica do Marcelo (Consultor VIP)</span>
                      </div>
                      <p className="text-[11px] text-amber-100/90 line-clamp-2 italic leading-relaxed">
                        "{hotel.marceloTip.replace('Dica do Marcelo: ', '')}"
                      </p>
                    </div>
                  </div>

                  {/* Preço e Ações de Reserva */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Tarifa Estimada
                        </span>
                        <span className="text-xs font-black text-amber-300">
                          {hotel.priceEstimate}
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveHotelModal(hotel)}
                        className="text-xs text-slate-300 hover:text-amber-300 font-bold underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        + Ver Logística Completa
                      </button>
                    </div>

                    {/* Botões de Ação Direta */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={hotel.directBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] active:scale-95 text-center"
                        title={`Acessar site oficial de reservas do ${hotel.name}`}
                      >
                        <span>Reservar Hotel</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleTalkToMarcelo(hotel)}
                        className="py-2.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        title="Agendar transfer do hotel com o Consultor Marcelo"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Agendar Transfer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicadores de Paginação do Carrossel */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {filteredHotels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleScrollToCard(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 bg-gradient-to-r from-amber-400 to-yellow-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Ir para o hotel ${idx + 1}`}
            />
          ))}
        </div>

        {/* Banner Informativo sobre Logística de Transfer */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#0c1c36] via-[#09172c] to-[#0c1c36] border border-amber-400/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
              <Bus className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-['Cinzel',serif]">
                Vai se hospedar em outro hotel, pousada ou Airbnb em Natal?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Nossas vans executivas climatizadas realizam o recolhimento em qualquer endereço na
                orla de Ponta Negra, Via Costeira e Praia do Meio. Informe o seu hotel ao Consultor
                Marcelo e receba a confirmação do horário exato de embarque para o seu passeio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat('Gostaria de verificar se a van passa no meu hotel em Natal');
                } else {
                  window.open(
                    getWhatsAppLink('Olá Marcelo! Gostaria de saber o horário de embarque no meu hotel em Natal.'),
                    '_blank'
                  );
                }
              }}
              className="w-full md:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>Consultar Horário do Meu Hotel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes & Logística do Hotel */}
      {activeHotelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#091526] border border-amber-400/40 shadow-2xl flex flex-col text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner com Foto */}
            <div className="relative h-56 sm:h-64 shrink-0">
              <img
                src={activeHotelModal.imageUrl}
                alt={activeHotelModal.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091526] via-transparent to-black/60" />

              <button
                onClick={() => setActiveHotelModal(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    {activeHotelModal.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {activeHotelModal.distanceToDeparture}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif]">
                  {activeHotelModal.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{activeHotelModal.tagline}</p>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Localização & Endereço */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Endereço do Hotel:</span>
                      <p className="text-xs text-slate-300 mt-0.5">{activeHotelModal.address}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyAddress(activeHotelModal)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                    title="Copiar endereço completo"
                  >
                    {copiedAddressId === activeHotelModal.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Logística de Embarque dos Passeios */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                  <Bus className="w-4 h-4 text-amber-400" />
                  <span>Logística de Embarque · Natal Vip Turismo</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <strong className="text-white font-semibold block mb-1">
                      Parrachos de Maracajaú & Rio do Fogo
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Horário sincronizado com a tábua de maré 2026. A van executiva recolhe
                      diretamente no lobby entre 06:00 e 08:30 (conforme o pico da maré baixa).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <strong className="text-white font-semibold block mb-1">
                      Buggy em Genipabu & Litoral Norte
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Bugueiro credenciado busca na porta do hotel às 08:30. Rota expressa pela
                      Ponte Newton Navarro com parada nas dunas móveis e lagoas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vantagens Exclusivas para Hóspedes */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Benefícios Exclusivos da Agência</span>
                </h4>
                <div className="space-y-2">
                  {activeHotelModal.perksForVipClients.map((perk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comodidades do Hotel */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Estrutura & Comodidades</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeHotelModal.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dica do Marcelo Completa */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-100 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Recomendação Pessoal do Marcelo:</span>
                </div>
                <p className="italic">"{activeHotelModal.marceloTip}"</p>
              </div>

              {/* Ações Finais */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={activeHotelModal.directBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  <span>Reservar no Site Oficial do Hotel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    handleTalkToMarcelo(activeHotelModal);
                    setActiveHotelModal(null);
                  }}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Agendar Transfers com Marcelo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
