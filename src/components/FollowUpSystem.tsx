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

// Check if promo modal has already been dismissed
const isPromoAlreadyDismissed = (): boolean => {
  try {
    return (
      localStorage.getItem('natal_vip_popup_closed') === 'true' ||
      localStorage.getItem('natal_vip_promo_dismissed') === 'true' ||
      sessionStorage.getItem('natal_vip_popup_closed') === 'true' ||
      sessionStorage.getItem('natal_vip_promo_dismissed') === 'true'
    );
  } catch {
    return false;
  }
};

export const FollowUpSystem: React.FC<FollowUpSystemProps> = ({
  onOpenBookingWithTour,
}) => {
  // Exit-intent / Promo pop-up state
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasDismissedPromo, setHasDismissedPromo] = useState(isPromoAlreadyDismissed);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState<number | null>(null);

  // Synchronous ref to prevent any re-trigger loop during dismissal
  const isDismissedRef = React.useRef<boolean>(isPromoAlreadyDismissed());

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
        const initialLeads: LeadFollowUp[] = [
          {
            id: 'lead-101',
            name: 'Fernanda Carvalho',
            phone: '(84) 98872-2044',
            email: 'fernanda.turismo@gmail.com',
            travelMonth: 'Abril/2026',
            tourInterest: 'Parrachos de Maracajaú VIP',
            origin: 'exit_intent',
            createdAt: '19/09/2026 10:14',
            status: 'novo',
            couponCode: 'VIPNATAL30',
            utmSource: 'Instagram Ads / Maré Baixa',
          },
        ];
        setLeadsList(initialLeads);
        localStorage.setItem('natal_vip_leads', JSON.stringify(initialLeads));
      }
    } catch {
      // ignore
    }
  }, []);

  // Safe scroll restoration function
  const restorePageScroll = () => {
    document.body.style.overflow = '';
    document.body.style.removeProperty('overflow');
    document.documentElement.style.overflow = '';
    document.documentElement.style.removeProperty('overflow');
  };

  // Body and HTML scroll lock/unlock management
  useEffect(() => {
    if (showExitModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      restorePageScroll();
    }
    return () => {
      restorePageScroll();
    };
  }, [showExitModal]);

  // Função centralizada para fechar e desativar permanentemente o pop-up
  const handleDismissModal = () => {
    isDismissedRef.current = true;
    setShowExitModal(false);
    setHasDismissedPromo(true);
    restorePageScroll();

    // Salvar em localStorage e sessionStorage para não reaparecer
    try {
      localStorage.setItem('natal_vip_popup_closed', 'true');
      localStorage.setItem('natal_vip_promo_dismissed', 'true');
      sessionStorage.setItem('natal_vip_popup_closed', 'true');
      sessionStorage.setItem('natal_vip_promo_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  // ESC key listener to close modal (Requisito 3)
  useEffect(() => {
    if (!showExitModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault();
        handleDismissModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [showExitModal]);

  // Exit intent detection on desktop (protegido contra re-abertura involuntária)
  useEffect(() => {
    if (isDismissedRef.current || isPromoAlreadyDismissed()) {
      setHasDismissedPromo(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (isDismissedRef.current || isPromoAlreadyDismissed()) return;

      if (e.clientY <= 15 && !showExitModal) {
        setShowExitModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitModal]);

  // Timed trigger: after 45s of browsing if not dismissed
  useEffect(() => {
    if (isDismissedRef.current || isPromoAlreadyDismissed()) {
      setHasDismissedPromo(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!isDismissedRef.current && !isPromoAlreadyDismissed() && !showExitModal) {
        setShowExitModal(true);
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [showExitModal]);

  // Auto-close countdown after successful lead submission
  useEffect(() => {
    if (isSuccess && autoCloseSeconds !== null) {
      if (autoCloseSeconds <= 0) {
        handleDismissModal();
        return;
      }
      const timer = setTimeout(() => {
        setAutoCloseSeconds((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, autoCloseSeconds]);

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

    // Persist to Cloud Firestore leads collection safely
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

    // Marcar como fechado em armazenamento permanente
    try {
      localStorage.setItem('natal_vip_popup_closed', 'true');
      localStorage.setItem('natal_vip_promo_dismissed', 'true');
      sessionStorage.setItem('natal_vip_popup_closed', 'true');
      sessionStorage.setItem('natal_vip_promo_dismissed', 'true');
      localStorage.setItem('natal_vip_lead_captured', 'true');
    } catch {
      // ignore
    }

    setIsSuccess(true);
    setAutoCloseSeconds(2); // Contagem regressiva rápida

    // Requisito 8: Se for captura de lead, fechar automaticamente após envio
    setTimeout(() => {
      handleDismissModal();
    }, 1800);
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
        <div
          id="vip-lead-popup-overlay"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer select-none"
          style={{ touchAction: 'pan-y' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDismissModal();
            }
          }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              handleDismissModal();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Oferta Especial de Boas-Vindas"
        >
          <div
            id="vip-lead-popup-card"
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#0B1A2E] to-[#06101D] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-slate-100 cursor-default select-text"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Requisito 1: Botão "X" visível no canto superior direito do pop-up (área mínima 44x44px touch) */}
            <button
              type="button"
              id="btn-close-lead-popup"
              onClick={handleDismissModal}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-900/95 border-2 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-90 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Fechar pop-up"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
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
                    href={`https://wa.me/5584988722044?text=Ol%C3%A1%20Marcelo!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(
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
WHATSAPP OFICIAL: +55 (84) 98872-2044
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
Fale com o Marcelo no WhatsApp: +55 (84) 98872-2044
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

                {/* Auto-close notification and direct close button */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center gap-1.5">
                  {autoCloseSeconds !== null && (
                    <span className="text-[11px] text-slate-400">
                      Fechando automaticamente em <strong className="text-amber-300">{autoCloseSeconds}s</strong>...
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleDismissModal}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer py-1"
                  >
                    Fechar pop-up agora e continuar no site
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
