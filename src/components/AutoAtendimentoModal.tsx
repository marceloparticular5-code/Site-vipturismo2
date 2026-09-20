import React, { useState, useEffect } from 'react';
import { VoucherData } from '../types';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface AutoAtendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const AutoAtendimentoModal: React.FC<AutoAtendimentoModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'consultar' | 'faq' | 'politicas'>('consultar');
  const [foundVoucher, setFoundVoucher] = useState<VoucherData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Check if there is already a recent reservation stored in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('natal_vip_reservations') || '[]');
      if (stored && stored.length > 0) {
        setFoundVoucher(stored[0]);
        setHasSearched(true);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    try {
      const stored: VoucherData[] = JSON.parse(
        localStorage.getItem('natal_vip_reservations') || '[]'
      );
      const queryClean = searchQuery.trim().toUpperCase();

      const match = stored.find(
        (v) =>
          v.voucherCode.toUpperCase().includes(queryClean) ||
          v.booking.customerPhone.includes(queryClean) ||
          v.booking.customerName.toUpperCase().includes(queryClean)
      );

      if (match) {
        setFoundVoucher(match);
      } else if (queryClean.length > 3) {
        // Fallback demo mock if user types something
        setFoundVoucher({
          voucherCode: queryClean.startsWith('NVT') ? queryClean : `NVT-2026-${queryClean.slice(-4)}`,
          status: 'confirmado',
          createdAt: 'Recente',
          booking: {
            tourId: 'maracajau-vip',
            tourName: 'Parrachos de Maracajaú VIP',
            date: '15/01/2026',
            timeWindow: '08:30 às 10:00',
            tideHeight: 0.2,
            adultsCount: 2,
            childrenCount: 0,
            addons: ['fotos-gopro'],
            customerName: 'Passageiro(a) VIP',
            customerPhone: searchQuery,
            customerEmail: 'cliente@vip.com',
            hotelPickup: 'Hotel em Ponta Negra',
            paymentMethod: 'pix',
            totalPrice: 438,
          },
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NATALVIP-${queryClean}`,
        });
      } else {
        setFoundVoucher(null);
      }
    } catch {
      setFoundVoucher(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#091527] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#0C1C35] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block">
              Portal do Cliente
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Autoatendimento Inteligente</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                24 Horas
              </span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab('consultar')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'consultar'
                ? 'border-amber-400 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Consultar Reserva
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-amber-400 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dúvidas Frequentes
          </button>
          <button
            onClick={() => setActiveTab('politicas')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'politicas'
                ? 'border-amber-400 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Políticas da Maré
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'consultar' && (
            <div className="space-y-6">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite seu Código Localizador (Ex: NVT-2026-XXXX) ou Telefone"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Localizar
                </button>
              </form>

              {/* Found Result */}
              {hasSearched && foundVoucher ? (
                <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        Voucher Encontrado
                      </span>
                      <h4 className="text-lg font-black text-white">{foundVoucher.voucherCode}</h4>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      {foundVoucher.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Passeio:</span>
                      <strong className="text-white">{foundVoucher.booking.tourName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Data:</span>
                      <strong className="text-amber-300">{foundVoucher.booking.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Janela de Saída:</span>
                      <strong className="text-white">{foundVoucher.booking.timeWindow}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pickup Hotel:</span>
                      <strong className="text-white">{foundVoucher.booking.hotelPickup}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/5584988256545?text=Ol%C3%A1%20Natal%20Vip!%20Gostaria%20de%20alterar%20ou%20confirmar%20minha%20reserva%20${foundVoucher.voucherCode}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Falar com Suporte VIP
                    </a>

                    <button
                      onClick={() => alert(`2ª via do Voucher ${foundVoucher.voucherCode} salva!`)}
                      className="px-3 py-2 rounded-lg border border-slate-700 hover:border-amber-400 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> Emitir 2ª Via
                    </button>
                  </div>
                </div>
              ) : hasSearched && !foundVoucher ? (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhuma reserva localizada</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Não encontramos reserva com esse termo. Verifique a digitação ou faça uma nova
                    reserva com garantia de maré agora mesmo.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Fazer Nova Reserva VIP
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h5 className="font-bold text-white mb-1">
                  Qual é a diferença entre Maracajaú e Rio do Fogo?
                </h5>
                <p className="text-slate-300 leading-relaxed">
                  Maracajaú fica a 7km da costa, com barreira colossal de corais, águas mais fundas
                  e opção de cilindro. Rio do Fogo tem piscinas rasas e um banco de areia dourado no
                  oceano, ideal para relaxar e para famílias.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h5 className="font-bold text-white mb-1">O transfer busca no meu hotel?</h5>
                <p className="text-slate-300 leading-relaxed">
                  Sim! Buscamos pontualmente em todos os hotéis e pousadas de Ponta Negra, Via
                  Costeira e Praia do Meio em vans executivas com ar-condicionado.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h5 className="font-bold text-white mb-1">O que acontece se a maré estiver alta?</h5>
                <p className="text-slate-300 leading-relaxed">
                  Nosso sistema inteligente de marés evita que você agende dias de maré 0.8+. Caso
                  haja alteração climática repentina, você remarca sem taxa alguma ou recebe
                  reembolso integral.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'politicas' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="font-bold text-emerald-300 block mb-1">
                  Marés 0.0 a 0.5 (Verde - Melhores Dias)
                </span>
                Garantia de águas calmas com visual caribenho. Saídas 1h30 antes do pico mínimo.
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="font-bold text-amber-300 block mb-1">
                  Marés 0.6 a 0.7 (Amarelo - Ainda dá pra fazer)
                </span>
                Passeio realizado com guias conduzindo aos pontos mais rasos da barreira.
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="font-bold text-rose-300 block mb-1">
                  Marés 0.8+ (Vermelho - Não Recomendamos)
                </span>
                A agência redireciona os clientes para passeios terrestres (Genipabu ou Pipa) para
                resguardar a melhor experiência das suas férias.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Contacts */}
        <div className="p-4 border-t border-slate-800 bg-[#081220] flex items-center justify-between text-xs text-slate-400">
          <span>Plantão Telefônico: (84) 98188-2828</span>
          <span className="text-emerald-400 font-bold">Empresa Nº 1 em Satisfação</span>
        </div>
      </div>
    </div>
  );
};
