import React from 'react';
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
    <section id="pacote-casal-vip" className="py-14 sm:py-20 bg-white text-[#1F2A2E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0E3B43] via-[#0B2E35] to-[#08252B] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-[#165662]">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F28C28]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FFC857]/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#FFC857] text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-[#F28C28] text-[#F28C28]" />
                <span>Oferta Especial para Casais · Temporada 2026</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-['Playfair_Display',serif]">
                Pacote Casal VIP{' '}
                <span className="text-[#FFC857] block sm:inline">
                  · 4 Dias de Roteiros + Transfer Incluso
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#F6EBDD]/90 leading-relaxed font-light">
                Esqueça filas e preocupações de logística. Nós cuidamos de tudo desde o desembarque
                no Aeroporto de Natal até os momentos mais mágicos em Maracajaú, Pipa e Litoral Sul.
              </p>

              {/* What's Included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <span>Transfer Aeroporto ⇄ Hotel ida e volta privativo</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <span>Parrachos de Maracajaú com Lancha Rápida</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <span>Pipa VIP: Chapadão, Baía dos Golfinhos e Pôr do Sol</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <span>Litoral Sul 4x4 ou Buggy pelas dunas e lagoas</span>
                </div>
              </div>

              {/* Price & Guarantee Callout */}
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-[#F6EBDD]">
                  <CreditCard className="w-4 h-4 text-[#FFC857]" />
                  <span>Em até <strong>3x sem juros</strong> no cartão</span>
                </div>
                <span className="text-white/30 hidden sm:inline">|</span>
                <div className="flex items-center gap-2 text-xs text-[#F6EBDD]">
                  <Flame className="w-4 h-4 text-[#F28C28]" />
                  <span>Desconto adicional no <strong>Pix à vista</strong></span>
                </div>
              </div>
            </div>

            {/* Right Card / CTA Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 text-[#1F2A2E] shadow-2xl space-y-5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Valor Fechado para 2 Pessoas
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Economia de R$ 330
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-400 line-through">De R$ 1.650,00</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#0E3B43]">
                      R$ 1.320,00
                    </span>
                    <span className="text-xs font-semibold text-slate-500">total casal</span>
                  </div>
                  <div className="text-xs font-bold text-[#F28C28] mt-1">
                    Ou 3x de R$ 440,00 sem juros no cartão
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F6EBDD]/60 border border-[#F6EBDD] space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-[#0E3B43] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F28C28]" />
                    <span>Benefícios Exclusivos do Casal VIP:</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Horários flexíveis alinhados à tábua de maré, assentos reservados com vista panorâmica e atendimento concierge diário.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onOpenBooking('pacote-casal-vip')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#F28C28] hover:bg-[#D97514] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Garantir Pacote Casal VIP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://wa.me/5584988722044?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Pacote%20Casal%20VIP%20de%20R%24%201.320%20com%20transfer!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0E3B43] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dúvidas? Fale com o Consultor no WhatsApp</span>
                  </a>
                </div>

                <div className="text-center text-[10px] text-slate-400">
                  🛡️ Agência homologada Cadastur · 100% de avaliações positivas no Google
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
