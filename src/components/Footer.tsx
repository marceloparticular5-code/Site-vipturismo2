import React from 'react';
import { NatalVipLogo } from './NatalVipLogo';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
  onOpenAutoAtendimento: () => void;
  onOpenCrm?: () => void;
  onOpenCookies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenAutoAtendimento,
  onOpenCrm,
  onOpenCookies,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030811] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand & Preserved Logo */}
          <div className="lg:col-span-2 space-y-4">
            <NatalVipLogo size={52} />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Agência de turismo receptivo de alto padrão em Natal/RN. Especialistas em mergulho nos
              Parrachos de Maracajaú e Rio do Fogo com análise inteligente da tábua de maré e
              atendimento VIP humanizado.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Empresa Nº 1 em Satisfação · Cadastur Homologado
            </div>
          </div>

          {/* Col 3: Passeios & Roteiros */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Roteiros de Elite
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onOpenBooking('maracajau-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Parrachos de Maracajaú VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('rio-do-fogo-vip')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  Parrachos de Rio do Fogo VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('genipabu-buggy-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Dunas de Genipabu Com Emoção
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pipa-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Pipa VIP & Pôr do Sol
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('sao-miguel-gostoso-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  São Miguel do Gostoso VIP
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ferramentas & Suporte */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Autoatendimento
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onOpenCalendar} className="hover:text-amber-300 transition-colors">
                  Tábua de Maré Inteligente 2026
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAutoAtendimento}
                  className="hover:text-amber-300 transition-colors"
                >
                  Consultar Reserva & 2ª Via
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAutoAtendimento}
                  className="hover:text-amber-300 transition-colors"
                >
                  Políticas de Cancelamento & Maré
                </button>
              </li>
              <li>
                <a
                  href="#depoimentos-vip"
                  className="hover:text-amber-300 transition-colors block text-amber-400 font-semibold"
                >
                  ★ Depoimentos de Clientes VIP
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCrm}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  <span>Central de Leads & Follow-up</span>
                  <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">CRM</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCookies}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Cookies & LGPD (Marketing)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contato Oficial */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Atendimento VIP
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a href="tel:84981882828" className="hover:text-white block font-medium">
                    (84) 98188-2828
                  </a>
                  <a href="https://wa.me/5584988256545" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 block font-semibold text-emerald-400">
                    WhatsApp: (84) 98825-6545
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:reservas@natalvipturismo.com" className="hover:text-white block text-amber-300 font-semibold">
                    reservas@natalvipturismo.com
                  </a>
                  <span className="text-[10px] text-slate-500 block">Envio automático de vouchers</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Ponta Negra / Via Costeira, Natal - RN, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Natal Vip Turismo Agency · Todos os direitos reservados.</span>
            <span>•</span>
            <span>CNPJ & Cadastur Regular</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
