import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Compass,
  MapPin,
} from 'lucide-react';
import { getInitialBookingDate } from '../lib/dateUtils';

export interface PrivateServiceItem {
  id: string;
  name: string;
  priceBRL: number;
  priceInCents: number;
  vehicleType: string;
  maxPassengers: number;
  capacityText: string;
  duration: string;
  location: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

export const PRIVATE_SERVICES: PrivateServiceItem[] = [
  {
    id: 'buggy-litoral-norte-sunset',
    name: 'Litoral Norte Buggy VIP Premium + Pôr do Sol',
    priceBRL: 1300,
    priceInCents: 130000,
    vehicleType: 'Buggy Privativo Exclusivo',
    maxPassengers: 4,
    capacityText: 'Até 4 passageiros no buggy',
    duration: 'Dia inteiro + Pôr do Sol (aprox. 8h)',
    location: 'Genipabu, Lagoas de Pitangui, Jacumã e Dunas Douradas',
    description:
      'Buggy 100% exclusivo com bugueiro credenciado, dunas móveis com emoção dosada por você, lagoas com banho e o pôr do sol inesquecível nas dunas.',
    highlights: [
      'Veículo exclusivo (sem dividir com estranhos)',
      'Travessia de balsa ecológica inclusa',
      'Parada especial para o pôr do sol nas dunas',
    ],
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
  },
  {
    id: 'litoral-sul-4x4-vip-premium',
    name: 'Litoral Sul 4x4 VIP Premium',
    priceBRL: 1000,
    priceInCents: 100000,
    vehicleType: 'Mitsubishi Pajero Dakar 4x4 Climatizado',
    maxPassengers: 6,
    capacityText: 'Até 6 passageiros no 4x4',
    duration: 'Dia inteiro privativo (aprox. 8h)',
    location: 'Litoral Sul (Nísia Floresta, Camurupim e Lagoa do Carcará)',
    description:
      'Expedição exclusiva em 4x4 com ar-condicionado. Banho na cristalina Lagoa do Carcará, mirante dos golfinhos, falésias e praias desertas.',
    highlights: [
      'Veículo 4x4 moderno e climatizado',
      'Roteiro no ritmo exclusivo da sua família',
      'Lagoa do Carcará e arrecifes de Camurupim',
    ],
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
  },
  {
    id: 'pipa-praia-do-amor-vip-premium',
    name: 'Pipa + Praia do Amor VIP Premium',
    priceBRL: 550,
    priceInCents: 55000,
    vehicleType: 'Chevrolet Spin Executiva (6 lugares)',
    maxPassengers: 6,
    capacityText: 'Spin executiva até 6 passageiros',
    duration: 'Dia inteiro privativo (aprox. 9h)',
    location: 'Praia da Pipa, Mirante do Chapadão e Baía dos Golfinhos',
    description:
      'Transporte executivo privativo só para seu grupo até a praia mais famosa do RN. Conforto absoluto, falésias do Chapadão e tempo livre na charmosa vila de Pipa.',
    highlights: [
      'Veículo executivo Spin privativo climatizado',
      'Horário flexível de saída e retorno no hotel',
      'Mirante do Chapadão e Praia do Amor',
    ],
    imageUrl: '/images/pipa/pipa-falesias-amor.webp',
  },
  {
    id: 'pipa-by-night-vip-premium',
    name: 'Pipa By-Night VIP Premium',
    priceBRL: 650,
    priceInCents: 65000,
    vehicleType: 'Chevrolet Spin Executiva (6 lugares)',
    maxPassengers: 6,
    capacityText: 'Spin executiva até 6 passageiros',
    duration: 'Noite privativa (17:30 às 23:30)',
    location: 'Vila de Pipa / Rua do Céu e Av. Baía dos Golfinhos',
    description:
      'Viva a noite vibrante e gastronômica de Pipa com a segurança e tranquilidade de um motorista privativo dedicado esperando pelo seu grupo.',
    highlights: [
      'Transporte noturno exclusivo de ida e volta',
      'Desfrute de drinks e gastronomia sem preocupação',
      'Desembarque seguro direto na porta do hotel',
    ],
    imageUrl: '/images/pipa-by-night/pipa-night-village.webp',
  },
  {
    id: 'city-tour-historico-vip-premium',
    name: 'City-Tour Histórico',
    priceBRL: 550,
    priceInCents: 55000,
    vehicleType: 'Chevrolet Spin Executiva (6 lugares)',
    maxPassengers: 6,
    capacityText: 'Spin executiva até 6 passageiros',
    duration: 'Tarde e pôr do sol privativo (aprox. 6h)',
    location: 'Fortaleza dos Reis Magos, Centro Histórico e Rio Potengi',
    description:
      'Roteiro cultural e histórico privativo pelos principais cartões postais de Natal, com visitação guiada e contemplação do pôr do sol no Rio Potengi.',
    highlights: [
      'Veículo executivo privativo com ar-condicionado',
      'Visita guiada na secular Fortaleza dos Reis Magos',
      'Pôr do sol cinematográfico no Rio Potengi',
    ],
    imageUrl: '/images/city-tour/fortaleza-magos-sunset.webp',
  },
];

interface PrivateServicesSectionProps {
  onOpenBooking: (
    tourId?: string,
    prefill?: {
      date?: string;
      adults?: number;
      children?: number;
    }
  ) => void;
}

export const PrivateServicesSection: React.FC<PrivateServicesSectionProps> = ({ onOpenBooking }) => {
  const defaultDate = getInitialBookingDate();

  // Local state for each card's selected date and passengers count
  const [formData, setFormData] = useState<
    Record<
      string,
      {
        date: string;
        passengers: number;
      }
    >
  >(() => {
    const initial: Record<string, { date: string; passengers: number }> = {};
    for (const service of PRIVATE_SERVICES) {
      initial[service.id] = {
        date: defaultDate,
        passengers: service.id === 'buggy-litoral-norte-sunset' ? 4 : 4,
      };
    }
    return initial;
  });

  const handleDateChange = (id: string, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { date: defaultDate, passengers: 2 }),
        date,
      },
    }));
  };

  const handlePassengersChange = (id: string, passengers: number, max: number) => {
    const valid = Math.min(max, Math.max(1, passengers));
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { date: defaultDate, passengers: 2 }),
        passengers: valid,
      },
    }));
  };

  const handleReserve = (service: PrivateServiceItem) => {
    const current = formData[service.id] || { date: defaultDate, passengers: 2 };
    onOpenBooking(service.id, {
      date: current.date,
      adults: current.passengers,
      children: 0,
    });
  };

  return (
    <section id="servicos-privativos" className="py-16 sm:py-20 bg-[#060D17] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#FBBF24] text-xs font-black uppercase tracking-wider shadow-sm">
            <Crown className="w-4 h-4 text-[#FBBF24]" />
            <span>Exclusividade & Conforto Total</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Playfair_Display',serif]">
            Serviços Privados <span className="text-[#FBBF24]">Premium</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Veículos 100% exclusivos para o seu grupo familiar ou casal. Roteiros personalizados sem pressa,
            com valor fechado por veículo (não por pessoa) em até <strong>3x sem juros no cartão ou Pix com confirmação imediata</strong>.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PRIVATE_SERVICES.map((service, index) => {
            const current = formData[service.id] || { date: defaultDate, passengers: 2 };
            const installmentAmount = (service.priceBRL / 3).toFixed(2).replace('.', ',');

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A192F] rounded-3xl overflow-hidden border border-[#1E3A5F] hover:border-[#FBBF24]/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image and Badges */}
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      width="400"
                      height="250"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/buggy/buggy-praia-dunas.webp';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />

                    {/* Badge: Selo Privativo Premium */}
                    <div className="absolute top-3 left-3 px-3.5 py-1 rounded-full bg-[#FBBF24] text-[#0A192F] text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-[#F59E0B]">
                      <Crown className="w-3.5 h-3.5 fill-[#0A192F]" />
                      <span>Privativo Premium</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-slate-200 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Vehicle Type & Capacity */}
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Car className="w-4 h-4 shrink-0 text-[#FBBF24]" />
                        <span className="truncate">{service.vehicleType}</span>
                      </div>
                      <span className="shrink-0 text-slate-300 font-medium ml-2">
                        {service.capacityText}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#FBBF24] transition-colors leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                      {service.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Preço por Veículo */}
                    <div className="p-3.5 rounded-2xl bg-[#061224] border border-[#1E3A5F] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          Valor Fechado por Veículo:
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          Preço Único
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          R$ {service.priceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          / veículo
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#FBBF24] pt-0.5">
                        Pix com confirmação imediata ou 3x de R$ {installmentAmount} sem juros
                      </div>
                    </div>

                    {/* Inputs: Data e Nº de Passageiros */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FBBF24]" />
                          Data
                        </label>
                        <input
                          type="text"
                          value={current.date}
                          onChange={(e) => handleDateChange(service.id, e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className="w-full bg-[#061224] border border-[#1E3A5F] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#FBBF24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#FBBF24]" />
                          Passageiros
                        </label>
                        <select
                          value={current.passengers}
                          onChange={(e) =>
                            handlePassengersChange(service.id, Number(e.target.value), service.maxPassengers)
                          }
                          className="w-full bg-[#061224] border border-[#1E3A5F] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#FBBF24]"
                        >
                          {Array.from({ length: service.maxPassengers }, (_, idx) => idx + 1).map((n) => (
                            <option key={n} value={n} className="bg-slate-900 text-white">
                              {n} {n === 1 ? 'pessoa' : 'pessoas'} (máx {service.maxPassengers})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleReserve(service)}
                    className="btn-pulse-hover w-full py-3.5 px-4 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Reservar agora</span>
                    <ArrowRight className="w-4 h-4 btn-icon-pulse" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                    🛡️ Pagamento seguro via InfinitePay · Confirmação garantida
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
