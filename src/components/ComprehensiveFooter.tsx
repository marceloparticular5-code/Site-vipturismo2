import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Instagram,
  Heart,
  Calendar,
  CreditCard,
  QrCode,
  ArrowUp,
} from 'lucide-react';

interface ComprehensiveFooterProps {
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
  onOpenMyReservations: () => void;
}

export const ComprehensiveFooter: React.FC<ComprehensiveFooterProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenMyReservations,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contato" className="bg-[#08252B] text-slate-300 border-t border-[#165662]/60 pt-14 pb-24 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFC857]/80 bg-slate-950 shadow">
                <img
                  src="/imagens/logovip.jpg"
                  alt="Natal VIP Turismo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wide block font-['Playfair_Display',serif]">
                  NATAL <span className="text-[#FFC857]">VIP</span>
                </span>
                <span className="text-[10px] font-bold text-[#F6EBDD]/80 tracking-widest uppercase block -mt-1">
                  Turismo Boutique em Natal-RN
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Agência de turismo boutique especializada em experiências de alto padrão no Rio Grande do Norte:
              Parrachos de Maracajaú com lancha rápida, Buggy em Genipabu, Pipa VIP e Pacotes Casal.
            </p>

            {/* Cadastur Official Seal */}
            <div className="p-3 rounded-2xl bg-[#0E3B43]/60 border border-[#165662] space-y-1">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#FFC857]" />
                <span>Ministério do Turismo · Cadastur</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Certificado Nacional: <strong>39.456.551/0001-08</strong>
              </p>
              <p className="text-[10px] text-slate-400">
                Pessoa Jurídica regularizada para agenciamento e transporte turístico.
              </p>
            </div>
          </div>

          {/* Column 2: Roteiros Mais Procurados */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#FFC857]">
              Passeios Oficiais
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenBooking('maracajau-vip')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Passeio Maracajaú (R$ 170)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('rio-do-fogo-vip')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Passeio Rio do Fogo (R$ 170)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pipa-praia-do-amor')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pipa + Praia do Amor (R$ 80)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pipa-by-night')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pipa By Night (R$ 100)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('buggy-vip-privativo')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Buggy VIP Privativo (Genipabu)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('off-road-litoral-sul')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Off-Road Litoral Sul 4x4
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('transfer-vip-aeroporto')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Transfer Aeroporto de Natal (R$ 160)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Pacotes & Autoatendimento */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#FFC857]">
              Autoatendimento
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenMyReservations}
                  className="hover:text-white transition-colors cursor-pointer text-left font-bold text-[#F28C28]"
                >
                  🎟️ Consultar Minhas Reservas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pacote-casal-vip')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-white"
                >
                  ❤️ Pacote Casal VIP (R$ 1.320)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalendar}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  🌊 Tábua de Maré Inteligente 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  💳 Formas de Pagamento & Parcelamento
                </button>
              </li>
              <li>
                <a
                  href="#dicas-viagem"
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  🎒 Dicas de Viagem & O que Levar
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Atendimento & Horários */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#FFC857]">
              Atendimento VIP
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">(84) 98872-2044</span>
                  <span className="text-[11px] text-slate-400">WhatsApp oficial para reservas</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">07:00 às 22:00</span>
                  <span className="text-[11px] text-slate-400">Todos os dias (inclusive feriados)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">Ponta Negra, Natal - RN</span>
                  <span className="text-[11px] text-slate-400">Av. Eng. Roberto Freire</span>
                </div>
              </li>
            </ul>

            {/* Social Link */}
            <div className="pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#F28C28]" />
                <span>@natalvipturismo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Security Strip */}
        <div className="pt-8 border-t border-[#165662]/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-semibold">Formas de Pagamento:</span>
            <div className="flex items-center gap-2 bg-[#0E3B43] px-3 py-1.5 rounded-xl border border-[#165662] text-[11px]">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Pix à vista com desconto</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0E3B43] px-3 py-1.5 rounded-xl border border-[#165662] text-[11px]">
              <CreditCard className="w-4 h-4 text-[#FFC857]" />
              <span>Cartão de Crédito em até 3x sem juros (Visa, Master, Elo, Hiper, Amex)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#FFC857] hover:text-white font-bold cursor-pointer transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Natal VIP Turismo. Todos os direitos reservados. CNPJ: 39.456.551/0001-08.
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Privacidade & LGPD</span>
            <span>·</span>
            <span>Termos de Reserva</span>
            <span>·</span>
            <span>Cancelamento & Reembolso</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
