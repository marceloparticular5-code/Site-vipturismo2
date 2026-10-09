import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  DollarSign,
  Heart,
  Flame,
  Check,
  CreditCard,
  QrCode,
  Tag,
  AlertCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { VIP_TOURS, AVAILABLE_ADDONS, getTourPricing } from '../data/toursData';
import { saveLeadToFirestore } from '../lib/firebase';
import { getTodayISO } from '../lib/dateUtils';
import { TourPackage } from '../types';
import {
  trackWhatsAppClick,
  trackLeadGeneration,
  trackChatStart,
  trackCheckoutStart,
} from '../lib/tracking';
import {
  PHONE_DISPLAY,
  PHONE_WA,
  CADASTUR_NUMBER,
  getWhatsAppLink,
  HELP_TEXT,
} from '../config/contact';

interface FloatingChatbotProps {
  onOpenBookingModal?: (
    tourId?: string,
    prefill?: {
      date?: string;
      adults?: number;
      children?: number;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      addons?: string[];
      initialStep?: 'details' | 'gateway' | 'voucher';
    }
  ) => void;
  isOpenControlled?: boolean;
  onToggleControlled?: (open: boolean) => void;
}

// Conversation step
type FlowStep =
  | 'welcome'
  | 'interest_select'
  | 'tour_select'
  | 'date_select'
  | 'guests_select'
  | 'addons_select'
  | 'customer_data'
  | 'order_summary'
  | 'custom_quote'
  | 'objections'
  | 'faq'
  | 'whatsapp_handoff';

interface ChatBookingDraft {
  interest: 'passeio' | 'transfer' | 'pacote';
  tourId: string;
  tourTitle: string;
  basePrice: number;
  date: string;
  adults: number;
  children: number;
  selectedAddons: string[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelPickup: string;
  isCustomQuote?: boolean;
  customNotes?: string;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  onOpenBookingModal,
  isOpenControlled,
  onToggleControlled,
}) => {
  // Modal visibility
  const [isOpen, setIsOpen] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  // Active step and navigation history
  const [step, setStep] = useState<FlowStep>('welcome');
  const [stepHistory, setStepHistory] = useState<FlowStep[]>([]);

  // Unresolved queries counter (Rule 4: WhatsApp after 2 failed attempts)
  const [failedAttemptsCount, setFailedAttemptsCount] = useState(0);
  const [whatsappReason, setWhatsappReason] = useState<string>('');

  // Booking Draft state
  const [draft, setDraft] = useState<ChatBookingDraft>(() => {
    try {
      const saved = sessionStorage.getItem('natal_vip_chat_draft');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      interest: 'passeio',
      tourId: 'maracajau-vip',
      tourTitle: 'Passeio Maracajaú + Dayuse (Caribe Brasileiro)',
      basePrice: 170,
      date: getTodayISO(),
      adults: 2,
      children: 0,
      selectedAddons: ['fotos-gopro'],
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      hotelPickup: 'Ponta Negra',
    };
  });

  // Free text chat input
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist draft in session
  useEffect(() => {
    try {
      sessionStorage.setItem('natal_vip_chat_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft]);

  // Sync external controlled state
  useEffect(() => {
    if (typeof isOpenControlled === 'boolean') {
      setIsOpen(isOpenControlled);
      if (isOpenControlled && !hasTrackedStart) {
        trackChatStart();
        setHasTrackedStart(true);
      }
    }
  }, [isOpenControlled, hasTrackedStart]);

  // Auto-scroll on content updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, isTyping, chatLog, isOpen]);

  // RULE 2: Auto-open after 10s or 40% scroll (once per session)
  useEffect(() => {
    const alreadyAutoOpened = sessionStorage.getItem('natal_vip_chat_auto_opened');
    if (alreadyAutoOpened || isOpen) return;

    let timer: NodeJS.Timeout;

    // Trigger A: 10 seconds timer
    timer = setTimeout(() => {
      if (!sessionStorage.getItem('natal_vip_chat_auto_opened') && !isOpen) {
        sessionStorage.setItem('natal_vip_chat_auto_opened', 'true');
        setIsOpen(true);
        onToggleControlled?.(true);
        trackChatStart();
        setHasTrackedStart(true);
      }
    }, 10000);

    // Trigger B: 40% scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolledPercent = (window.scrollY / scrollHeight) * 100;
        if (scrolledPercent >= 40 && !sessionStorage.getItem('natal_vip_chat_auto_opened') && !isOpen) {
          sessionStorage.setItem('natal_vip_chat_auto_opened', 'true');
          setIsOpen(true);
          onToggleControlled?.(true);
          trackChatStart();
          setHasTrackedStart(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onToggleControlled]);

  const navigateTo = (newStep: FlowStep) => {
    setStepHistory((prev) => [...prev, step]);
    setStep(newStep);
  };

  const handleGoBack = () => {
    if (stepHistory.length > 0) {
      const prevStep = stepHistory[stepHistory.length - 1];
      setStepHistory((prev) => prev.slice(0, -1));
      setStep(prevStep);
    } else {
      setStep('welcome');
    }
  };

  const handleResetChat = () => {
    setStep('welcome');
    setStepHistory([]);
    setFailedAttemptsCount(0);
    setChatLog([]);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    onToggleControlled?.(true);
    sessionStorage.setItem('natal_vip_chat_auto_opened', 'true');
    if (!hasTrackedStart) {
      trackChatStart();
      setHasTrackedStart(true);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    onToggleControlled?.(false);
  };

  // Official Tour Selection
  const selectedTour = useMemo(() => {
    return VIP_TOURS.find((t) => t.id === draft.tourId) || VIP_TOURS[0];
  }, [draft.tourId]);

  // Price Calculation using getTourPricing
  const pricing = useMemo(() => {
    return getTourPricing(selectedTour, draft.adults, draft.children);
  }, [selectedTour, draft.adults, draft.children]);

  const tourTotal = pricing.tourTotal;

  const addonsTotal = draft.selectedAddons.reduce((sum, addonId) => {
    const found = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotal = tourTotal + addonsTotal;
  const cardInstallment3x = (subtotal / 3).toFixed(2);
  const cardInstallment12x = (subtotal / 12).toFixed(2);

  // Trigger Online Booking Checkout (Pre-filled)
  const handleProceedToCheckout = () => {
    // 1. Track begin_checkout
    trackCheckoutStart(draft.tourTitle, subtotal, draft.adults + draft.children);

    // 2. Save lead in background if not already saved
    if (draft.customerName || draft.customerPhone) {
      saveLeadToFirestore({
        name: draft.customerName || 'Cliente Autoatendimento VIP',
        phone: draft.customerPhone || PHONE_DISPLAY,
        travelMonth: draft.date,
        tourInterest: draft.tourTitle,
        status: 'checkout_started',
        createdAt: new Date().toISOString(),
      }).catch(() => {});
    }

    // 3. Open BookingDrawer pre-filled
    if (onOpenBookingModal) {
      onOpenBookingModal(draft.tourId, {
        date: draft.date,
        adults: draft.adults,
        children: draft.children,
        customerName: draft.customerName,
        customerPhone: draft.customerPhone,
        customerEmail: draft.customerEmail,
        addons: draft.selectedAddons,
        initialStep: 'gateway', // Takes user directly to payment choice
      });
      handleCloseChat();
    }
  };

  // Rule 4: Trigger WhatsApp ONLY as last resort
  const handleTriggerWhatsApp = (reason: string) => {
    setWhatsappReason(reason);
    trackWhatsAppClick(draft.tourTitle, subtotal);

    // Save lead
    if (draft.customerName || draft.customerPhone) {
      saveLeadToFirestore({
        name: draft.customerName || 'Cliente WhatsApp Chat',
        phone: draft.customerPhone || PHONE_DISPLAY,
        travelMonth: draft.date,
        tourInterest: draft.tourTitle,
        status: 'whatsapp_escalated',
        createdAt: new Date().toISOString(),
      }).catch(() => {});
    }

    navigateTo('whatsapp_handoff');
  };

  // Free text NLP analyzer
  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatLog((prev) => [...prev, { sender: 'user', text: query, time }]);
    setInputText('');
    setIsTyping(true);

    const lower = query.toLowerCase();

    // Check if customer explicitly wants a human (Condition 4.1)
    if (
      lower.includes('humano') ||
      lower.includes('atendente') ||
      lower.includes('pessoa') ||
      lower.includes('whatsapp') ||
      lower.includes('falar com')
    ) {
      setTimeout(() => {
        setIsTyping(false);
        handleTriggerWhatsApp('Solicitação expressa de atendimento humano');
      }, 500);
      return;
    }

    // Check payment issue (Condition 4.4)
    if (lower.includes('erro no pagamento') || lower.includes('não consigo pagar') || lower.includes('recusado')) {
      setTimeout(() => {
        setIsTyping(false);
        handleTriggerWhatsApp('Suporte com pagamento ou checkout');
      }, 500);
      return;
    }

    // Check large group (Condition 4.3)
    if (lower.includes('grupo') || lower.includes('empresa') || lower.includes('excursão') || lower.includes('15 pessoas') || lower.includes('20 pessoas')) {
      setTimeout(() => {
        setIsTyping(false);
        handleTriggerWhatsApp('Orçamento para grupo grande / evento corporativo');
      }, 500);
      return;
    }

    // Intelligent match to official tours
    setTimeout(() => {
      setIsTyping(false);

      if (lower.includes('maracajaú') || lower.includes('maracajau') || lower.includes('parrachos')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'maracajau-vip',
          tourTitle: 'Passeio Maracajaú + Dayuse (Caribe Brasileiro)',
          basePrice: 170,
        }));
        navigateTo('date_select');
      } else if (lower.includes('rio do fogo') || lower.includes('punau') || lower.includes('punaú')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'rio-do-fogo-vip',
          tourTitle: 'Passeio Rio do Fogo + Punaú',
          basePrice: 170,
        }));
        navigateTo('date_select');
      } else if (lower.includes('buggy') || lower.includes('genipabu') || lower.includes('dunas')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'genipabu-buggy-vip',
          tourTitle: 'Buggy VIP Premium Privativo nas Dunas de Genipabu',
          basePrice: 820,
        }));
        navigateTo('date_select');
      } else if (lower.includes('litoral sul') || lower.includes('4x4') || lower.includes('pajero')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'litoral-sul-4x4-vip',
          tourTitle: 'Off-Road Litoral Sul 4x4 Premium',
          basePrice: 150,
        }));
        navigateTo('date_select');
      } else if (lower.includes('pipa by night') || lower.includes('noite em pipa') || lower.includes('vila')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'pipa-by-night',
          tourTitle: 'Pipa By Night',
          basePrice: 100,
        }));
        navigateTo('date_select');
      } else if (lower.includes('pipa') || lower.includes('praia do amor')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'passeio',
          tourId: 'pipa-praia-do-amor',
          tourTitle: 'Passeio Pipa + Praia do Amor',
          basePrice: 80,
        }));
        navigateTo('date_select');
      } else if (lower.includes('casal') || lower.includes('lua de mel') || lower.includes('romântico')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'pacote',
          tourId: 'pacote-casal-vip',
          tourTitle: 'Pacote Casal VIP (Roteiro Completo)',
          basePrice: 1320,
        }));
        navigateTo('date_select');
      } else if (lower.includes('transfer') || lower.includes('aeroporto')) {
        setDraft((prev) => ({
          ...prev,
          interest: 'transfer',
          tourId: 'transfer-aeroporto-vip',
          tourTitle: 'Transfer VIP Aeroporto (Ida e Volta Promocional)',
          basePrice: 160,
        }));
        navigateTo('date_select');
      } else if (lower.includes('preço') || lower.includes('valor') || lower.includes('quanto custa')) {
        navigateTo('tour_select');
      } else if (lower.includes('segurança') || lower.includes('cancelamento') || lower.includes('incluso') || lower.includes('chuva')) {
        navigateTo('objections');
      } else {
        // Unknown query: increment failed attempts counter
        const nextFailed = failedAttemptsCount + 1;
        setFailedAttemptsCount(nextFailed);

        if (nextFailed >= 2) {
          // Condition 4.2: Fails after 2 attempts -> trigger WhatsApp handoff
          handleTriggerWhatsApp('Não compreendi sua dúvida após 2 tentativas');
        } else {
          setChatLog((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: 'Não compreendi totalmente. Você deseja ver nossos passeios oficiais, transfer de aeroporto ou tirar dúvidas de segurança e cancelamento?',
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      }
    }, 400);
  };

  // WhatsApp Message Composer
  const getPreparedWhatsAppMessage = () => {
    return `Olá, Natal VIP Turismo! 👋\n\nEstava conversando com o Assistente Natal VIP no site e gostaria de atendimento sobre:\n\n*Roteiro:* ${draft.tourTitle}\n*Data desejada:* ${draft.date}\n*Pessoas:* ${draft.adults} adulto(s)${draft.children ? `, ${draft.children} criança(s)` : ''}\n*Motivo:* ${whatsappReason || 'Atendimento personalizado'}\n*Titular:* ${draft.customerName || 'Cliente VIP'}\n\nPoderiam me ajudar a concluir minha reserva? 🌴☀️`;
  };

  return (
    <>
      {/* 1. PRIORITY FLOATING BUTTON (Rule 2: High contrast gold over blue, subtle pulse, clear label) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center justify-end">
          <button
            type="button"
            onClick={handleOpenChat}
            className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black shadow-[0_10px_35px_rgba(245,158,11,0.55)] hover:shadow-[0_14px_45px_rgba(245,158,11,0.7)] border-2 border-yellow-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Fale com a gente e reserve agora"
          >
            {/* Subtle radar pulse glow */}
            <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-40 blur-sm group-hover:opacity-75 animate-pulse" />

            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950 flex items-center justify-center shrink-0 border border-amber-300/60 shadow">
              <MessageCircle className="w-5 h-5 text-amber-400" />
            </div>

            <div className="relative text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-950 leading-tight tracking-tight uppercase">
                  Fale com a gente e reserve agora
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900/80 block leading-none">
                Assistente VIP · Autoatendimento 24h
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. MAIN CHAT WINDOW */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[440px] md:w-[460px] z-50 flex flex-col max-h-[92vh] sm:max-h-[660px] rounded-t-3xl sm:rounded-3xl bg-[#071322] border-2 border-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden animate-fadeIn">
          
          {/* Top Bar Header (Rule 1: Brand Logo, Assistente Natal VIP, Cadastur) */}
          <div className="p-4 bg-gradient-to-r from-[#0C1E36] via-[#0E2847] to-[#0A1A2F] border-b border-amber-500/30 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400/80 bg-slate-950 shadow-md">
                    <img
                      src="/images/brand/logo-natal-vip.webp"
                      alt="Assistente Natal VIP"
                      width="44"
                      height="44"
                      className="w-full h-full object-cover scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/brand/favicon.png';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                      Assistente Natal VIP
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <span>Cadastur: {CADASTUR_NUMBER}</span>
                    <span>·</span>
                    <span className="text-emerald-400">Online agora</span>
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1 text-slate-300">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Reiniciar conversa"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Fechar conversa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-nav / Breadcrumb */}
            <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-2">
                {step !== 'welcome' && (
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Voltar</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigateTo('welcome')}
                  className="text-slate-400 hover:text-amber-300 cursor-pointer font-semibold"
                >
                  Início
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-amber-300 font-bold capitalize">
                  {step.replace('_', ' ')}
                </span>
              </div>

              <span className="text-[10px] text-slate-400">
                Autoatendimento 100% Seguro
              </span>
            </div>
          </div>

          {/* Main Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm text-slate-200">
            
            {/* ETAPA 1: BEM-VINDO & SELEÇÃO DE INTERESSE */}
            {step === 'welcome' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0A223B] to-[#071728] border border-amber-400/40 shadow-sm space-y-2">
                  <p className="font-extrabold text-white text-base">
                    👋 Olá! Seja muito bem-vindo à Natal VIP Turismo!
                  </p>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    Sou o seu <strong>Assistente Natal VIP</strong>. Posso te conduzir na reserva direta do seu passeio com cálculo instantâneo, vaga travada na maré e confirmação em minutos.
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Agência Oficial Cadastur {CADASTUR_NUMBER} · Mais de 12.000 clientes satisfeitos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Qual é o seu objetivo para esta viagem?
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, interest: 'passeio' }));
                        navigateTo('tour_select');
                      }}
                      className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F233B] hover:from-[#112D4E] hover:to-[#173A63] border border-slate-700 hover:border-amber-400/70 font-bold text-white transition-all flex items-center justify-between cursor-pointer shadow group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌊</span>
                        <div>
                          <span className="block text-sm text-white group-hover:text-amber-300">
                            Passeios de Barco, Buggy & 4x4
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Maracajaú, Rio do Fogo, Pipa, Genipabu (a partir de R$ 80)
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          interest: 'pacote',
                          tourId: 'pacote-casal-vip',
                          tourTitle: 'Pacote Casal VIP (Roteiro Completo)',
                          basePrice: 1320,
                        }));
                        navigateTo('date_select');
                      }}
                      className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F233B] hover:from-[#112D4E] hover:to-[#173A63] border border-slate-700 hover:border-amber-400/70 font-bold text-white transition-all flex items-center justify-between cursor-pointer shadow group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💑</span>
                        <div>
                          <span className="block text-sm text-white group-hover:text-amber-300">
                            Pacote Casal VIP
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Experiência romântica completa com transfer exclusivo (R$ 1.320)
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          interest: 'transfer',
                          tourId: 'transfer-aeroporto-vip',
                          tourTitle: 'Transfer VIP Aeroporto (Ida e Volta Promocional)',
                          basePrice: 160,
                        }));
                        navigateTo('date_select');
                      }}
                      className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F233B] hover:from-[#112D4E] hover:to-[#173A63] border border-slate-700 hover:border-amber-400/70 font-bold text-white transition-all flex items-center justify-between cursor-pointer shadow group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚐</span>
                        <div>
                          <span className="block text-sm text-white group-hover:text-amber-300">
                            Transfer VIP Aeroporto
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            2 trajetos in/out com ar-condicionado por R$ 160 promocional
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('objections')}
                      className="text-xs text-slate-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Segurança, maré & cancelamento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerWhatsApp('Dúvida específica não listada')}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 cursor-pointer font-medium"
                    >
                      Precisa de suporte humano?
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: CATÁLOGO DE ROTEIROS OFICIAIS */}
            {step === 'tour_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30">
                  <p className="font-bold text-white text-sm">
                    Escolha um dos nossos Roteiros Oficiais Registrados:
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Preços tabelados com transfer incluso saindo do hotel em Ponta Negra e Via Costeira.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'maracajau-vip', title: 'Passeio Maracajaú + Dayuse', price: 170, badge: 'Mais Procurado', desc: 'Piscinas naturais a 7km em lancha rápida com kit snorkel incluso.' },
                    { id: 'rio-do-fogo-vip', title: 'Passeio Rio do Fogo + Punaú', price: 170, badge: 'Águas Virgens', desc: 'Piscinas preservadas com parada na Lagoa do Teiú e Rio Punaú.' },
                    { id: 'litoral-sul-4x4-vip', title: 'Off-Road Litoral Sul 4x4 Premium', price: 150, badge: 'Aventura 4x4', desc: 'Rota dos nativos em Pajero Dakar com praias secretas e falésias.' },
                    { id: 'pipa-praia-do-amor', title: 'Passeio Pipa + Praia do Amor', price: 80, badge: 'Melhor Custo', desc: 'Van executiva, Chapadão, Baía dos Golfinhos e centrinho de Pipa.' },
                    { id: 'pipa-by-night', title: 'Pipa By Night', price: 100, badge: 'Noite Romântica', desc: 'Vila charmosa, bistrôs, bares ao ar livre e gastronomia potiguar.' },
                    { id: 'genipabu-buggy-vip', title: 'Litoral Norte de Buggy Privativo Premium', price: 820, badge: 'Privativo 4 Pessoas', desc: 'Dunas de Genipabu com emoção, lagoas de Pitangui e Jacumã (divide até 4 pessoas).' },
                    { id: 'transfer-aeroporto-vip', title: 'Transfer VIP Aeroporto', price: 160, badge: 'Promocional', desc: 'Busca pontual no aeroporto com ar-condicionado (ida e volta).' },
                    { id: 'pacote-casal-vip', title: 'Pacote Casal VIP', price: 1320, badge: 'Pacote Completo', desc: 'Mergulho em Maracajaú + Buggy privativo + Transfer exclusivo para o casal.' },
                  ].map((tour) => (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          tourId: tour.id,
                          tourTitle: tour.title,
                          basePrice: tour.price,
                        }));
                        navigateTo('date_select');
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-[#0E243D] border border-slate-800 hover:border-amber-400/70 transition-all flex items-start justify-between gap-3 cursor-pointer group"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-white text-xs sm:text-sm group-hover:text-amber-300">
                            {tour.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {tour.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {tour.desc}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">por apenas</span>
                        <span className="text-sm font-black text-amber-300">
                          R$ {tour.price}
                        </span>
                      </div>
                    </button>
                  ))}

                  {/* Opção sob consulta para grupos grandes */}
                  <button
                    type="button"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        tourId: 'personalizado-grupo',
                        tourTitle: 'Roteiro Exclusivo / Grupo Grande (Sob Consulta)',
                        basePrice: 0,
                        isCustomQuote: true,
                      }));
                      handleTriggerWhatsApp('Orçamento de grupo grande ou roteiro sob medida');
                    }}
                    className="w-full p-2.5 rounded-xl border border-dashed border-amber-400/40 text-amber-300 text-xs font-bold text-center hover:bg-amber-400/10 cursor-pointer transition-colors"
                  >
                    ✨ Grupo grande ou Roteiro personalizado sob consulta? Clique aqui
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3: DATA DESEJADA */}
            {step === 'date_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30 space-y-2">
                  <p className="font-bold text-white text-sm">
                    📅 Para qual data você planeja o passeio <strong>{draft.tourTitle}</strong>?
                  </p>
                  <p className="text-amber-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Poucas vagas disponíveis nas marés ideais deste mês. Travamos seu horário!</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400">Escolha uma data rápida ou digite abaixo:</p>

                  <div className="grid grid-cols-2 gap-2">
                    {['Amanhã', 'Próxima sexta-feira', 'Neste sábado', 'Neste domingo'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setDraft((prev) => ({ ...prev, date: chip }));
                          navigateTo('guests_select');
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 font-bold text-white text-xs text-center cursor-pointer hover:bg-slate-800 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Ou selecione a data no calendário:
                    </label>
                    <input
                      type="date"
                      value={draft.date.includes('/') ? '' : draft.date}
                      onChange={(e) => {
                        if (e.target.value) {
                          setDraft((prev) => ({ ...prev, date: e.target.value }));
                        }
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('guests_select')}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow mt-2"
                  >
                    <span>Continuar para quantidade de pessoas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 4: NÚMERO DE PESSOAS */}
            {step === 'guests_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30">
                  <p className="font-bold text-white text-sm">
                    👥 Quantas pessoas irão no passeio?
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Crianças até 2 anos: Free! Crianças de 3 a 11 anos possuem valor diferenciado em roteiros selecionados.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="font-bold text-white block text-xs">Adultos (12 anos ou mais)</span>
                      <span className="text-[10px] text-slate-400">
                        {pricing.isCouple
                          ? 'Incluso no pacote casal (2 pessoas)'
                          : pricing.isVehicle
                          ? 'Incluso no veículo privativo'
                          : `R$ ${pricing.adultPrice.toFixed(2)} por adulto`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={draft.adults <= 1}
                        onClick={() => setDraft((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-base cursor-pointer flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="font-black text-amber-300 text-sm w-4 text-center">
                        {draft.adults}
                      </span>
                      <button
                        type="button"
                        disabled={draft.adults + draft.children >= pricing.maxCapacity}
                        onClick={() => setDraft((p) => ({ ...p, adults: p.adults + 1 }))}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-base cursor-pointer flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="font-bold text-white block text-xs">Crianças (3 a 11 anos)</span>
                      <span className="text-[10px] text-amber-300">
                        {pricing.isCouple
                          ? 'Crianças no pacote casal'
                          : pricing.isVehicle
                          ? 'Incluso no veículo'
                          : `R$ ${pricing.childPrice.toFixed(2)} por criança`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={draft.children <= 0}
                        onClick={() => setDraft((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-base cursor-pointer flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="font-black text-amber-300 text-sm w-4 text-center">
                        {draft.children}
                      </span>
                      <button
                        type="button"
                        disabled={draft.adults + draft.children >= pricing.maxCapacity}
                        onClick={() => setDraft((p) => ({ ...p, children: p.children + 1 }))}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-base cursor-pointer flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
                    <span>Total: {draft.adults + draft.children} passageiro(s)</span>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Crianças até 2 anos: Free
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('addons_select')}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>Ver Opcionais Disponíveis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 5: OPCIONAIS DISPONÍVEIS */}
            {step === 'addons_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30">
                  <p className="font-bold text-white text-sm">
                    ✨ Deseja adicionar opcionais de experiência?
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Equipamentos profissionais e fotos subaquáticas podem ser garantidos já com desconto:
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'fotos-gopro', title: 'Fotos Subaquáticas GoPro', price: 70, desc: 'Pacote com 30+ fotos e vídeos em alta resolução na maré.' },
                    { id: 'batismo-mergulho', title: 'Batismo de Mergulho com Cilindro', price: 140, desc: 'Instrutor PADI individual por 20 minutos nos corais.' },
                    { id: 'transfer-hotel', title: 'Transfer Ida e Volta Hotel', price: 0, desc: 'Embarque e desembarque direto no hotel (Incluso Grátis!).' },
                  ].map((addon) => {
                    const isSelected = draft.selectedAddons.includes(addon.id) || addon.price === 0;

                    return (
                      <div
                        key={addon.id}
                        onClick={() => {
                          if (addon.price === 0) return;
                          setDraft((prev) => ({
                            ...prev,
                            selectedAddons: prev.selectedAddons.includes(addon.id)
                              ? prev.selectedAddons.filter((id) => id !== addon.id)
                              : [...prev.selectedAddons, addon.id],
                          }));
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-400/15 border-amber-400/80 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs block text-white">
                            {addon.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {addon.desc}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-amber-300 block">
                            {addon.price === 0 ? 'GRÁTIS' : `+ R$ ${addon.price}`}
                          </span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isSelected ? '✓ Selecionado' : '+ Adicionar'}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => navigateTo('customer_data')}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow mt-2"
                  >
                    <span>Avançar para Dados do Titular</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 6: DADOS DO CLIENTE (LEAD CAPTURE) */}
            {step === 'customer_data' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30 space-y-1">
                  <p className="font-bold text-white text-sm">
                    👤 Para quem emitimos o resumo e voucher da reserva?
                  </p>
                  <p className="text-slate-300 text-xs">
                    Coleta rápida em 1 passo. Seus dados estão protegidos por criptografia de ponta a ponta.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Nome Completo do Titular:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Mariana Silva"
                      value={draft.customerName}
                      onChange={(e) => setDraft((p) => ({ ...p, customerName: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      WhatsApp com DDD (para envio do voucher e embarque):
                    </label>
                    <input
                      type="tel"
                      placeholder="(84) 99999-9999"
                      value={draft.customerPhone}
                      onChange={(e) => setDraft((p) => ({ ...p, customerPhone: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      E-mail (para confirmação digital):
                    </label>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={draft.customerEmail}
                      onChange={(e) => setDraft((p) => ({ ...p, customerEmail: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!draft.customerName.trim()}
                    onClick={() => {
                      // Lead Captured event
                      trackLeadGeneration({
                        name: draft.customerName.trim(),
                        tour: draft.tourTitle,
                        phone: draft.customerPhone.trim(),
                        guests: draft.adults + draft.children,
                        date: draft.date,
                        value: subtotal,
                      });

                      // Save lead in background
                      saveLeadToFirestore({
                        name: draft.customerName.trim(),
                        phone: draft.customerPhone.trim() || PHONE_DISPLAY,
                        travelMonth: draft.date,
                        tourInterest: draft.tourTitle,
                        status: 'lead_captured',
                        createdAt: new Date().toISOString(),
                      }).catch(() => {});

                      navigateTo('order_summary');
                    }}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer transition-all ${
                      draft.customerName.trim()
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Calcular Total e Ver Resumo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 7: RESUMO DO PEDIDO & CHECKOUT DIRETO */}
            {step === 'order_summary' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B2544] to-[#071728] border-2 border-amber-400/50 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
                      Resumo da Reserva VIP
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      Vaga Pré-Aprovada
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-extrabold text-white text-sm">{draft.tourTitle}</p>
                    <p className="text-slate-300">
                      📅 <strong>Data:</strong> {draft.date}
                    </p>
                    <p className="text-slate-300">
                      👥 <strong>Passageiros:</strong> {draft.adults} adulto(s)
                      {draft.children > 0 && ` + ${draft.children} criança(s)`}
                    </p>
                    {draft.selectedAddons.length > 0 && (
                      <p className="text-slate-300">
                        ✨ <strong>Opcionais:</strong> {draft.selectedAddons.length} selecionado(s)
                      </p>
                    )}
                    {draft.customerName && (
                      <p className="text-slate-300">
                        👤 <strong>Titular:</strong> {draft.customerName}
                      </p>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Subtotal:</span>
                      <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-t border-slate-800 pt-1.5">
                      <span className="flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        Total (Pix ou Cartão em até 3x):
                      </span>
                      <span className="text-base font-black text-amber-300">
                        R$ {subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-[#FBBF24]" />
                        Parcelamento sem juros:
                      </span>
                      <span className="font-semibold text-emerald-400">3x de R$ {cardInstallment3x} sem juros (ou até 12x)</span>
                    </div>
                  </div>

                  {/* Mental Triggers Guarantee */}
                  <div className="text-[10px] text-slate-400 space-y-1 bg-black/30 p-2 rounded-lg">
                    <p className="flex items-center gap-1 text-slate-300 font-medium">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Cancelamento gratuito e remarcação sem taxa até 24h antes.
                    </p>
                    <p className="flex items-center gap-1 text-slate-300 font-medium">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Transfer executivo com ar-condicionado na porta do hotel.
                    </p>
                    <p className="flex items-center gap-1 text-slate-300 font-medium">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Cadastur Oficial {CADASTUR_NUMBER}.
                    </p>
                  </div>
                </div>

                {/* Primary CTA: Send client straight to checkout */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(245,158,11,0.45)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>Confirmar Reserva & Ir Para Pagamento</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => navigateTo('date_select')}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Alterar data/pessoas
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('objections')}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Tirar dúvidas
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTORNO DE OBJEÇÕES COMUNS */}
            {step === 'objections' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-amber-400/30">
                  <p className="font-bold text-white text-sm">
                    🛡️ Perguntas Frequentes & Garantias Natal VIP
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Transparência total para você reservar com máxima tranquilidade:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 text-xs block">
                      💰 "E se eu encontrar mais barato em agência de rua?"
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Nossos passeios incluem transfer executivo com ar-condicionado na porta do hotel (sem você ter que caminhar no sol), lanchas homologadas pela Capitania e guias credenciados Cadastur. Sem taxas surpresa!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 text-xs block">
                      🌧️ "E se chover ou a maré estiver ruim?"
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Monitoramos a tábua de marés da Marinha diariamente. Se as condições não estiverem seguras ou ideais, reagendamos para outro dia sem qualquer custo ou estornamos 100% do seu pagamento.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 text-xs block">
                      🚐 "Onde é o ponto de embarque?"
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Buscamos e deixamos você diretamente na recepção de todos os hotéis e pousadas de Ponta Negra, Via Costeira e Praia dos Artistas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('order_summary')}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow mt-2"
                  >
                    <span>Perfeito! Quero Confirmar Minha Reserva</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* RULE 4: WHATSAPP ESCALATION (ONLY UNDER 4 SPECIFIC CONDITIONS) */}
            {step === 'whatsapp_handoff' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#062417] to-[#0A1A2F] border-2 border-emerald-500/50 shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Phone className="w-4 h-4" />
                    <span className="font-extrabold text-sm uppercase tracking-wide">
                      Plantão VIP WhatsApp
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Para atender seu caso com atenção dedicada ({whatsappReason || 'Atendimento personalizado'}), vou te transferir agora para nosso canal direto.
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    Número oficial: {PHONE_DISPLAY}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 block">Resumo que será enviado:</span>
                  <p className="text-slate-400 italic">"{getPreparedWhatsAppMessage()}"</p>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(getPreparedWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Continuar no WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigateTo('order_summary')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Voltar para reserva online no site
                  </button>
                </div>
              </div>
            )}

            {/* CHAT LOG FOR CUSTOM MESSAGES */}
            {chatLog.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mt-0.5 border border-amber-400/50">
                        <img
                          src="/images/brand/logo-natal-vip.webp"
                          alt="Assistente"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/brand/favicon.png';
                          }}
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-amber-400 text-slate-950 font-medium'
                          : 'bg-slate-900 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-amber-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span>Assistente Natal VIP digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Interactive Text Input Bar */}
          <form
            onSubmit={handleSendText}
            className="p-3 bg-[#0A182B] border-t border-slate-800 shrink-0 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida ou roteiro desejado..."
              className="flex-1 py-2 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
