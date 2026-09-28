import React, { useState, useEffect } from 'react';
import { LeadFollowUp } from '../types';
import { saveLeadToFirestore } from '../lib/firebase';
import {
  Sparkles,
  Gift,
  Send,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Flame,
  ArrowRight,
  Copy,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Download,
} from 'lucide-react';

interface FollowUpSystemProps {
  onOpenBookingWithTour?: (tourId: string) => void;
}

// Gera dinamicamente a lista dos próximos meses a partir do mês e ano atuais
export const getAvailableTravelMonths = (totalMonths = 12): { value: string; label: string }[] => {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  for (let i = 0; i < totalMonths; i++) {
    const futureDate = new Date(currentYear, currentMonthIndex + i, 1);
    const mIndex = futureDate.getMonth();
    const year = futureDate.getFullYear();
    const monthName = monthNames[mIndex];
    const value = `${monthName}/${year}`;
    const label = i === 0 ? `${monthName}/${year} (Mês Atual)` : `${monthName}/${year}`;
    months.push({ value, label });
  }

  return months;
};

export const FollowUpSystem: React.FC<FollowUpSystemProps> = ({
  onOpenBookingWithTour,
}) => {
  // Exit-intent / Promo pop-up state
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasDismissedPromo, setHasDismissedPromo] = useState(false);

  // Lista dinâmica de meses válidos a partir do mês atual
  const availableTravelMonths = React.useMemo(() => getAvailableTravelMonths(12), []);

  // Form fields
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [travelMonth, setTravelMonth] = useState<string>(() => availableTravelMonths[0]?.value || '');
  const [tourInterest, setTourInterest] = useState('maracajau-vip');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Leads list in localStorage for seamless persistence
  const [leadsList, setLeadsList] = useState<LeadFollowUp[]>([]);

  // Load leads from storage or initialize sample data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('natal_vip_leads');
      if (stored) {
        setLeadsList(JSON.parse(stored));
      } else {
        // Seed initial high-value leads for realism and agency demo
        const initialLeads: LeadFollowUp[] = [
          {
            id: 'lead-101',
            name: 'Fernanda Carvalho',
            phone: '(11) 98722-4411',
            email: 'fernanda.turismo@gmail.com',
            travelMonth: 'Abril/2026',
            tourInterest: 'Parrachos de Maracajaú VIP',
            origin: 'exit_intent',
            createdAt: '19/09/2026 10:14',
            status: 'novo',
            couponCode: 'VIPNATAL30',
            utmSource: 'Instagram Ads / Maré Baixa',
          },
          {
            id: 'lead-102',
            name: 'Ricardo Nogueira & Família',
            phone: '(31) 99182-5520',
            email: 'ricardo.bh@yahoo.com.br',
            travelMonth: 'Maio/2026',
            tourInterest: 'Pacote VIP · Os 4 Principais Passeios',
            origin: 'abandoned_cart',
            createdAt: '19/09/2026 09:30',
            status: 'followup_enviado',
            lastFollowUpDate: '19/09/2026 09:45',
            couponCode: 'VIPNATAL30',
            notes: 'Cliente simulou 4 adultos no carrinho e pausou no PIX.',
          },
          {
            id: 'lead-103',
            name: 'Mariana Duarte',
            phone: '(81) 98220-1199',
            email: 'mariana.duarte@hotmail.com',
            travelMonth: 'Julho/2026',
            tourInterest: 'Litoral Sul 4x4 & Dunas de Búzios',
            origin: 'tide_guide',
            createdAt: '18/09/2026 17:20',
            status: 'convertido',
            lastFollowUpDate: '18/09/2026 18:00',
            couponCode: 'VIPNATAL30',
            notes: 'Fechou reserva após receber o guia em PDF!',
          },
        ];
        setLeadsList(initialLeads);
        localStorage.setItem('natal_vip_leads', JSON.stringify(initialLeads));
      }
    } catch {
      // ignore
    }
  }, []);

  // Exit intent detection on desktop
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasDismissedPromo && !showExitModal) {
        const dismissed = sessionStorage.getItem('natal_vip_promo_dismissed');
        if (!dismissed) {
          setShowExitModal(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasDismissedPromo, showExitModal]);

  // Timed trigger: after 45s of browsing if not dismissed
  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('natal_vip_promo_dismissed');
      if (!dismissed && !hasDismissedPromo && !showExitModal) {
        setShowExitModal(true);
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [hasDismissedPromo, showExitModal]);

  const handleDismissModal = () => {
    setShowExitModal(false);
    setHasDismissedPromo(true);
    sessionStorage.setItem('natal_vip_promo_dismissed', 'true');
  };

  const handleCaptureLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    const newLead: LeadFollowUp = {
      id: `lead-${Date.now()}`,
      name: leadName,
      phone: leadPhone,
      email: leadEmail || 'cliente@contato.com',
      travelMonth,
      tourInterest:
        tourInterest === 'maracajau-vip'
          ? 'Parrachos de Maracajaú VIP'
          : tourInterest === 'rio-do-fogo-vip'
          ? 'Parrachos de Rio do Fogo VIP'
          : tourInterest === 'litoral-sul-4x4-vip'
          ? 'Litoral Sul 4x4 VIP'
          : 'Pacote VIP 4 Dias',
      origin: 'exit_intent',
      createdAt: new Date().toLocaleString('pt-BR'),
      status: 'novo',
      couponCode: 'VIPNATAL30',
      utmSource: 'Campanha Tábua de Maré 2026',
    };

    const updated = [newLead, ...leadsList];
    setLeadsList(updated);
    try {
      localStorage.setItem('natal_vip_leads', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist to Cloud Firestore leads collection
    try {
      saveLeadToFirestore({
        name: newLead.name,
        phone: newLead.phone,
        tourInterest: newLead.tourInterest || 'Passeio VIP',
        travelMonth: newLead.travelMonth || '2026',
        couponCode: newLead.couponCode || 'VIPNATAL30',
        status: 'new',
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Firestore lead save warning:', err);
      });
    } catch (err) {
      console.warn('Firestore lead error:', err);
    }

    setIsSuccess(true);
    sessionStorage.setItem('natal_vip_promo_dismissed', 'true');
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('VIPNATAL30');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <>
      {/* 1. EXIT-INTENT / PROMOTIONAL LEAD CAPTURE MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0B1A2E] to-[#06101D] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismissModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div className="space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Oferta Relâmpago VIP · Natal/RN</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Não viaje para Natal sem a{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200">
                      Tábua de Maré 2026
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Cadastre-se agora e receba no seu WhatsApp o <strong>Guia Secreto dos Parrachos em PDF</strong> + um <strong>Cupom Imediato de R$ 30 OFF</strong> para qualquer passeio VIP.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleCaptureLead} className="space-y-3.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Seu Nome Completo
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ana Silva"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        WhatsApp (com DDD)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="(84) 99999-9999"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        E-mail para Envio do PDF
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="seuemail@exemplo.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Mês da Sua Viagem
                      </label>
                      <select
                        id="select-mes-viagem-oferta"
                        value={travelMonth}
                        onChange={(e) => setTravelMonth(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {availableTravelMonths.map((item) => (
                          <option key={item.value} value={item.value} className="bg-slate-900 text-white">
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Passeio de Maior Interesse
                    </label>
                    <select
                      value={tourInterest}
                      onChange={(e) => setTourInterest(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="maracajau-vip">Parrachos de Maracajaú VIP (Lancha Rápida)</option>
                      <option value="rio-do-fogo-vip">Parrachos de Rio do Fogo VIP (Piscinas & Banco de Areia)</option>
                      <option value="litoral-sul-4x4-vip">Litoral Sul 4x4 (Pajero Dakar + Dunas de Búzios)</option>
                      <option value="pacote-vip-4-dias">Pacote VIP 4 Dias (Os 4 Principais da Cidade)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Liberar Cupom R$ 30 + Baixar Guia de Maré</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    🔒 Seus dados estão protegidos pela LGPD. Não enviamos spam. Apenas suporte e cupons da Natal Vip Turismo.
                  </p>
                </form>
              </div>
            ) : (
              /* Success State */
              <div className="text-center py-4 space-y-5 relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block mb-1">
                    Parabéns, {leadName}!
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Seu Cupom VIP foi Liberado com Sucesso
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                    Nossa equipe de Concierge da <strong>Natal Vip Turismo</strong> já registrou seu contato para enviar o roteiro coordenado com a melhor maré.
                  </p>
                </div>

                {/* Coupon Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-400/40 max-w-sm mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">
                      Código do Cupom de Desconto
                    </span>
                    <span className="text-xl font-black text-white font-mono tracking-wider">
                      VIPNATAL30
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Válido para reservas em 2026
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCoupon}
                    className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 transition-all"
                  >
                    {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCoupon ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`https://wa.me/5584988256545?text=Ol%C3%A1%20Marcelo!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(
                      leadName
                    )}.%20Acabei%20de%20ativar%20meu%20cupom%20VIPNATAL30%20para%20${encodeURIComponent(
                      tourInterest
                    )}%20em%20${encodeURIComponent(travelMonth)}.%20Pode%20me%20ajudar%20a%20planejar%20na%20melhor%20mar%C3%A9?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar com Marcelo no WhatsApp</span>
                  </a>

                  <button
                    id="btn-baixar-guia-pdf"
                    onClick={() => {
                      try {
                        const guideText = `NATAL VIP TURISMO - GUIA EXCLUSIVO DE MARÉ & PARRACHOS
=====================================================
CONSULTOR VIP: Marcelo - Agente de Turismo Pessoal
WHATSAPP DIRETO: (84) 98825-6545
SITE OFICIAL: https://www.natalvipturismo.com.br
=====================================================
CUPOM DE DESCONTO ATIVADO: VIPNATAL30 (R$ 30,00 OFF)
CLIENTE: ${leadName || 'Viajante VIP'}
MÊS PREVISTO: ${travelMonth}
PASSEIO SELECIONADO: ${tourInterest}

REGRAS DE OURO DA MARÉ BAIXA:
1. Os melhores dias para mergulho nos Parrachos (Maracajaú e Rio do Fogo) ocorrem nas luas Nova e Cheia.
2. Níveis de maré entre 0.0m e 0.4m garantem águas cristalinas estilo Caribe.
3. Reserve com a lancha rápida VIP para navegar com segurança e chegar antes dos grupos grandes.

ATENDIMENTO E AGENDAMENTOS:
Fale com o Marcelo no WhatsApp: (84) 98825-6545
Natal / Rio Grande do Norte - Brasil
=====================================================`;

                        const blob = new Blob([guideText], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const tempLink = document.createElement('a');
                        tempLink.href = url;
                        tempLink.download = `Guia-Mare-Natal-Vip-${travelMonth.replace(/[/ ]/g, '-')}.txt`;
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                        URL.revokeObjectURL(url);
                      } catch {
                        // fallback
                      }

                      setDownloadNotice(true);
                      setTimeout(() => {
                        handleDismissModal();
                        if (onOpenBookingWithTour) onOpenBookingWithTour(tourInterest);
                      }, 1200);
                    }}
                    className="py-3 px-4 rounded-xl border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {downloadNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Download Iniciado!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Baixar Guia em PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
