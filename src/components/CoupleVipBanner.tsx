import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Flame,
  Phone,
  Car,
} from 'lucide-react';

interface CoupleVipBannerProps {
  onOpenBooking: (tourId?: string) => void;
}

export const CoupleVipBanner: React.FC<CoupleVipBannerProps> = ({ onOpenBooking }) => {
  return (
    <section id="pacote-casal-vip" className="py-14 sm:py-20 bg-white text-[#0F172A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0F2744] to-[#060D17] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-[#1E3A5F]"
        >
          {/* Real Photo Background with Luxury Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/pacote-casal/casal-vip-buggy-praia.webp"
              alt="Pacote Casal VIP em passeio privativo de buggy nas praias de Natal RN"
              className="w-full h-full object-cover object-center opacity-20 pointer-events-none"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/95 via-[#0A192F]/85 to-[#060D17]/90" />
          </div>

          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FBBF24]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-[#0A192F] text-xs font-black uppercase tracking-wider shadow">
                <Heart className="w-4 h-4 fill-[#0A192F] text-[#0A192F]" />
                <span>Oferta Especial: R$ 1.320 Total para o Casal (2 Pessoas)</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display',serif]">
                Pacote Casal VIP{' '}
                <span className="text-[#FBBF24] block sm:inline">
                  · 4 Dias de Roteiros + Transfer Incluso
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                Esqueça filas e preocupações de logística. Nós cuidamos de tudo desde o desembarque
                no Aeroporto de Natal até os momentos mais mágicos em Maracajaú, Pipa e Litoral Sul.
              </p>

              {/* What's Included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-white">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-100">Transfer Aeroporto ⇄ Hotel privativo (2 pessoas)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-100">Parrachos de Maracajaú com Lancha Rápida</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-100">Pipa VIP: Chapadão, Golfinhos e Pôr do Sol</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-100">Litoral Sul 4x4 ou Buggy privativo pelas dunas</span>
                </div>
              </div>

              {/* Price & Guarantee Callout */}
              <div className="pt-3 border-t border-white/20 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-100">
                  <CreditCard className="w-4 h-4 text-[#FBBF24]" />
                  <span>Em até <strong>3x sem juros</strong> no cartão (R$ 440/mês)</span>
                </div>
                <span className="text-white/40 hidden sm:inline">|</span>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-100">
                  <Flame className="w-4 h-4 text-[#FBBF24]" />
                  <span>Pix com <strong>confirmação imediata</strong> e aprovação segura</span>
                </div>
              </div>
            </div>

            {/* Right Card / CTA Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 text-[#0F172A] shadow-2xl space-y-5 border-2 border-amber-300/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                    Preço Fechado para o Casal
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase">
                    Economia de R$ 330
                  </span>
                </div>

                <div>
                  <div className="text-xs sm:text-sm text-slate-500 line-through font-semibold">De R$ 1.650,00</div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-[#0A192F]">
                      R$ 1.320,00
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      VALOR TOTAL P/ 2 PESSOAS (CASAL)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-900 bg-amber-50/90 border border-amber-200 p-2 rounded-lg mt-2">
                    ⚠️ <strong>Atenção:</strong> Este valor é fechado para o casal (2 pessoas juntas), <strong>NÃO é por pessoa!</strong>
                  </p>
                  <div className="text-xs sm:text-sm font-bold text-[#B45309] mt-2">
                    Pague com Pix ou cartão em até 3x de R$ 440,00 sem juros
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-800">
                  <div className="font-bold text-[#0A192F] flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>Benefícios Exclusivos do Casal VIP:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    Horários flexíveis alinhados à tábua de maré, assentos reservados com vista panorâmica, lancha rápida exclusiva e atendimento concierge diário.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenBooking('pacote-casal-vip')}
                    className="btn-pulse-hover group/couple w-full py-4 px-6 rounded-2xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-sm sm:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Garantir Pacote Casal VIP Online</span>
                    <ArrowRight className="w-4 h-4 btn-icon-pulse transition-transform duration-300 group-hover/couple:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBooking('pacote-casal-vip')}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Personalizar Data e Opcionais Online</span>
                  </button>
                </div>

                <div className="text-center text-xs text-slate-600 font-medium">
                  🛡️ Agência homologada Cadastur · 100% de avaliações positivas no Google
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
