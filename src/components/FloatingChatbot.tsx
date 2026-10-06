import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Calendar,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Heart,
  Flame,
  Camera,
  Sun,
  Award,
  Waves,
  Car,
  Check,
  Info,
} from 'lucide-react';
import { VIP_TOURS } from '../data/toursData';
import { saveLeadToFirestore } from '../lib/firebase';
import { getTodayISO } from '../lib/dateUtils';
import { TourPackage } from '../types';
import { trackWhatsAppClick, trackLeadGeneration } from '../lib/tracking';

interface FloatingChatbotProps {
  onOpenBookingModal?: (tourId?: string) => void;
  isOpenControlled?: boolean;
  onToggleControlled?: (open: boolean) => void;
}

// Memory structure across the session
interface UserSessionMemory {
  name: string;
  guestsCount: string;
  travelDate: string;
  experienceType: string;
  hotelLocation: string;
  phone: string;
  selectedTour: TourPackage | null;
  indecisoPreference?: string;
}

// Conversation step
type FlowStep =
  | 'welcome'
  | 'experience_select'
  | 'guests_select'
  | 'date_select'
  | 'recommendations'
  | 'tour_detail'
  | 'indeciso_quiz'
  | 'budget_collection'
  | 'budget_complete'
  | 'faq_list'
  | 'faq_answer'
  | 'all_tours_list'
  | 'custom_chat';

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  onOpenBookingModal,
  isOpenControlled,
  onToggleControlled,
}) => {
  // Modal visibility
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [hasDismissedTeaser, setHasDismissedTeaser] = useState(false);

  // Active step and history for Back button
  const [step, setStep] = useState<FlowStep>('welcome');
  const [stepHistory, setStepHistory] = useState<FlowStep[]>([]);

  // Session Memory
  const [memory, setMemory] = useState<UserSessionMemory>(() => {
    try {
      const saved = sessionStorage.getItem('natal_vip_chat_memory');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: '',
      guestsCount: '',
      travelDate: '',
      experienceType: '',
      hotelLocation: '',
      phone: '',
      selectedTour: null,
    };
  });

  // Selected tour for details/expanded view
  const [focusedTour, setFocusedTour] = useState<TourPackage | null>(null);
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

  // Active FAQ item
  const [activeFaqKey, setActiveFaqKey] = useState<string | null>(null);

  // Free text input
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save session memory
  useEffect(() => {
    try {
      sessionStorage.setItem('natal_vip_chat_memory', JSON.stringify(memory));
    } catch {
      // ignore
    }
  }, [memory]);

  // Sync with external controlled state
  useEffect(() => {
    if (typeof isOpenControlled === 'boolean') {
      setIsOpen(isOpenControlled);
      if (isOpenControlled) {
        setHasInteracted(true);
        setShowTeaser(false);
      }
    }
  }, [isOpenControlled]);

  // Auto teaser after 8 seconds if visitor hasn't opened yet
  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyOpened = sessionStorage.getItem('natal_vip_chat_opened');
      if (!alreadyOpened && !isOpen && !hasDismissedTeaser) {
        setShowTeaser(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen, hasDismissedTeaser]);

  // Auto-scroll inside chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, isTyping, chatMessages, focusedTour, activeFaqKey]);

  // Navigate to step with history tracking
  const navigateTo = (newStep: FlowStep) => {
    setStepHistory((prev) => [...prev, step]);
    setStep(newStep);
  };

  const handleGoBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setStepHistory((prev) => prev.slice(0, -1));
      setStep(previousStep);
    } else {
      setStep('welcome');
    }
  };

  const handleResetChat = () => {
    setStep('welcome');
    setStepHistory([]);
    setFocusedTour(null);
    setExpandedTourId(null);
    setActiveFaqKey(null);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setShowTeaser(false);
    onToggleControlled?.(true);
    sessionStorage.setItem('natal_vip_chat_opened', 'true');
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    onToggleControlled?.(false);
    if (!hasDismissedTeaser) {
      setTimeout(() => {
        setShowTeaser(true);
        setHasDismissedTeaser(true);
      }, 15000);
    }
  };

  // WhatsApp generation helper
  const handleOpenWhatsApp = (tourTitle?: string, customText?: string) => {
    const currentTour = tourTitle || memory.selectedTour?.title || 'Passeios VIP em Natal';
    const guestLabel = memory.guestsCount ? `${memory.guestsCount} pessoa(s)` : 'minha família/grupo';
    const dateLabel = memory.travelDate || 'próximos dias';
    const nameLabel = memory.name.trim() || 'Cliente VIP';

    const defaultMsg = `Olá, Natal VIP Turismo! 👋\n\nMeu nome é ${nameLabel}.\n\nTenho interesse no passeio *${currentTour}* para *${guestLabel}*, na data *${dateLabel}*.\n\nGostaria de confirmar disponibilidade e finalizar minha reserva. 🌴☀️`;

    const finalMsg = customText || defaultMsg;
    const whatsappUrl = `https://wa.me/5584988722044?text=${encodeURIComponent(finalMsg)}`;

    // Track conversion event (GA4 / GTM / Meta Pixel)
    trackWhatsAppClick(currentTour, memory.selectedTour?.priceDiscounted || 189);

    // Save lead record in background
    saveLeadToFirestore({
      name: memory.name.trim() || 'Visitante Chatbot VIP',
      phone: memory.phone.trim() || '(84) 98872-2044',
      travelMonth: memory.travelDate ? memory.travelDate.substring(0, 7) : '2026-10',
      tourInterest: currentTour,
      status: 'new',
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter tours dynamically based on experience and preferences
  const recommendedTours = useMemo(() => {
    const exp = memory.experienceType.toLowerCase();
    const pref = memory.indecisoPreference?.toLowerCase() || '';

    // 1. By Indeciso Preference
    if (pref) {
      if (pref.includes('completo')) {
        return VIP_TOURS.filter((t) => t.id === 'pacote-vip-premium' || t.id === 'litoral-sul-4x4-vip');
      }
      if (pref.includes('economizar')) {
        return VIP_TOURS.filter((t) => t.id === 'auto-do-potengi-vip' || t.id === 'litoral-norte-buggy');
      }
      if (pref.includes('romantico')) {
        return VIP_TOURS.filter((t) => t.id === 'pipa-vip' || t.id === 'maracajau-vip' || t.id === 'auto-do-potengi-vip');
      }
      if (pref.includes('aventura')) {
        return VIP_TOURS.filter((t) => t.id === 'litoral-norte-buggy' || t.id === 'quadriciclo-vip');
      }
      if (pref.includes('familia')) {
        return VIP_TOURS.filter((t) => t.id === 'maracajau-vip' || t.id === 'litoral-sul-4x4-vip' || t.id === 'pacote-vip-premium');
      }
      if (pref.includes('fotos')) {
        return VIP_TOURS.filter((t) => t.id === 'pipa-vip' || t.id === 'litoral-sul-4x4-vip' || t.id === 'litoral-norte-buggy');
      }
    }

    // 2. By Experience Selection
    if (exp) {
      if (exp.includes('praias') || exp.includes('lagoas')) {
        return VIP_TOURS.filter((t) => t.id === 'litoral-sul-4x4-vip' || t.id === 'pipa-vip');
      }
      if (exp.includes('dunas') || exp.includes('aventura')) {
        return VIP_TOURS.filter((t) => t.id === 'litoral-norte-buggy' || t.id === 'quadriciclo-vip');
      }
      if (exp.includes('4x4')) {
        return VIP_TOURS.filter((t) => t.id === 'litoral-sul-4x4-vip');
      }
      if (exp.includes('buggy')) {
        return VIP_TOURS.filter((t) => t.id === 'litoral-norte-buggy');
      }
      if (exp.includes('piscinas') || exp.includes('mergulho')) {
        return VIP_TOURS.filter((t) => t.id === 'maracajau-vip' || t.includesDiving);
      }
      if (exp.includes('por do sol') || exp.includes('pôr do sol')) {
        return VIP_TOURS.filter((t) => t.id === 'auto-do-potengi-vip' || t.id === 'pipa-vip');
      }
      if (exp.includes('privativo')) {
        return VIP_TOURS.filter((t) => t.isVip);
      }
    }

    // Fallback: top 3 best-sellers
    return VIP_TOURS.slice(0, 3);
  }, [memory.experienceType, memory.indecisoPreference]);

  // Intelligent text parser to detect dates, guests, intents
  const handleSendTextMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: query, time }]);
    setInputText('');
    setIsTyping(true);

    const lower = query.toLowerCase();

    // Natural Language Extraction: guests
    const guestMatch = lower.match(/(\d+)\s*(pessoas?|adultos?|lugares?|passageiros?)/i) || lower.match(/somos\s*(\d+)/i);
    let detectedGuests = memory.guestsCount;
    if (guestMatch && guestMatch[1]) {
      detectedGuests = guestMatch[1];
    }

    // Natural Language Extraction: dates
    const dateMatch = lower.match(/(\d{1,2})[\/\-](\d{1,2})/i) || lower.match(/dia\s*(\d{1,2})/i);
    let detectedDate = memory.travelDate;
    if (dateMatch) {
      detectedDate = dateMatch[0];
    } else if (lower.includes('amanhã') || lower.includes('amanha')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      detectedDate = tomorrow.toLocaleDateString('pt-BR');
    } else if (lower.includes('hoje')) {
      detectedDate = new Date().toLocaleDateString('pt-BR');
    }

    // Update memory
    setMemory((prev) => ({
      ...prev,
      guestsCount: detectedGuests,
      travelDate: detectedDate,
    }));

    setTimeout(() => {
      setIsTyping(false);

      // Check intent matching
      if (lower.includes('preço') || lower.includes('valor') || lower.includes('quanto custa')) {
        navigateTo('all_tours_list');
      } else if (lower.includes('dúvida') || lower.includes('indeciso') || lower.includes('qual escolher') || lower.includes('ajuda')) {
        navigateTo('indeciso_quiz');
      } else if (lower.includes('atendente') || lower.includes('humano') || lower.includes('marcelo') || lower.includes('falar')) {
        handleOpenWhatsApp(undefined, `Olá! Gostaria de falar com um atendente da Natal VIP Turismo sobre passeios e roteiros.`);
      } else if (lower.includes('maracajaú') || lower.includes('maracajau') || lower.includes('mergulho')) {
        const tour = VIP_TOURS.find((t) => t.id === 'maracajau-vip') || VIP_TOURS[0];
        setFocusedTour(tour);
        setMemory((prev) => ({ ...prev, selectedTour: tour }));
        navigateTo('tour_detail');
      } else if (lower.includes('buggy') || lower.includes('genipabu')) {
        const tour = VIP_TOURS.find((t) => t.id === 'litoral-norte-buggy') || VIP_TOURS[1];
        setFocusedTour(tour);
        setMemory((prev) => ({ ...prev, selectedTour: tour }));
        navigateTo('tour_detail');
      } else if (lower.includes('pipa')) {
        const tour = VIP_TOURS.find((t) => t.id === 'pipa-vip') || VIP_TOURS[3];
        setFocusedTour(tour);
        setMemory((prev) => ({ ...prev, selectedTour: tour }));
        navigateTo('tour_detail');
      } else if (lower.includes('4x4') || lower.includes('litoral sul')) {
        const tour = VIP_TOURS.find((t) => t.id === 'litoral-sul-4x4-vip') || VIP_TOURS[2];
        setFocusedTour(tour);
        setMemory((prev) => ({ ...prev, selectedTour: tour }));
        navigateTo('tour_detail');
      } else if (lower.includes('cancelar') || lower.includes('remarcar') || lower.includes('hotel') || lower.includes('horário') || lower.includes('criança')) {
        navigateTo('faq_list');
      } else {
        // If they provided guests and date, guide straight to recommendations
        if (detectedGuests && detectedDate) {
          navigateTo('recommendations');
        } else if (!memory.experienceType) {
          navigateTo('experience_select');
        } else {
          navigateTo('recommendations');
        }
      }
    }, 600);
  };

  // Comprehensive 15 FAQs with clear, humanized, concise answers
  const FAQ_ITEMS: Record<string, { q: string; a: string }> = {
    passeios: {
      q: 'Quais passeios vocês oferecem?',
      a: 'Oferecemos os passeios mais cobiçados de Natal: Parrachos de Maracajaú com lancha rápida, Litoral Norte de Buggy (Genipabu), Litoral Sul 4x4 Rota dos Nativos, Pipa VIP com pôr do sol, Quadriciclo e Passeio no Rio Potengi.',
    },
    valores: {
      q: 'Quais são os valores?',
      a: 'Valores oficiais com desconto: Pipa + Praia do Amor por R$ 80 (Van); Pipa by-Night por R$ 100; Litoral Sul 4x4 por R$ 150; Rio do Fogo + Punaú por R$ 170; Maracajaú + Dayuse por R$ 170; Litoral Norte de Buggy por R$ 820 privativo (ou divide para 2 casais); Quadriciclo por R$ 280 (até 2 pessoas) e Transfer Aeroporto por R$ 160 (2 trajetos na contratação de 1 passeio)!',
    },
    hotel: {
      q: 'Vocês buscam no hotel?',
      a: 'Sim! Todos os nossos passeios realizam embarques diretamente na recepção dos hotéis localizados em: Ponta Negra, Via Costeira e Praia dos Artistas.',
    },
    privativo: {
      q: 'O passeio é privativo?',
      a: 'Temos o Litoral Norte de Buggy por R$ 820 privativo (que pode ser dividido para até 2 casais / 4 pessoas) e opções compartilhadas executivas como Pipa em van por apenas R$ 80 por pessoa.',
    },
    buggy_vagas: {
      q: 'Quantas pessoas cabem no buggy?',
      a: 'Cada buggy oficial credenciado comporta com total conforto e segurança até 4 passageiros mais o bugueiro profissional credenciado pelo Cadastur.',
    },
    emocao: {
      q: 'O passeio tem opção com emoção?',
      a: 'Com certeza! No Litoral Norte de Buggy você escolhe na hora: com emoção (manobras seguras nas dunas móveis) ou sem emoção (passeio suave e contemplativo). Você está no comando!',
    },
    criancas: {
      q: 'Quais passeios são indicados para crianças?',
      a: 'Para famílias com crianças, recomendamos: Maracajaú + Dayuse (piscinas naturais calmas e dayuse com estrutura), Rio do Fogo + Punaú e o Litoral Sul 4x4 em veículo Pajero Dakar climatizado.',
    },
    casal: {
      q: 'Quais passeios são indicados para casal?',
      a: 'Para casais: Pipa + Praia do Amor, Pipa by-Night para jantar romântico, Maracajaú VIP com lancha rápida e o Buggy privativo dividido a dois.',
    },
    reserva: {
      q: 'Como funciona a reserva?',
      a: 'Super simples: você escolhe o passeio, reserva sua vaga no Pix (com entrada e o restante no dia do passeio) ou no cartão pelo link seguro da InfinitePay (https://loja.infinitepay.io/natalvipturismo).',
    },
    pagamento: {
      q: 'Quais formas de pagamento?',
      a: 'PIX (com entrada para reserva da vaga e o restante pago nos dias dos respectivos passeios) ou Cartão de crédito pelo link oficial da InfinitePay: https://loja.infinitepay.io/natalvipturismo',
    },
    levar: {
      q: 'O que levar no passeio?',
      a: 'Recomendamos protetor solar, óculos de sol, chapéu ou boné, roupa de banho, toalha e um documento com foto. Leve também dinheiro ou cartão para almoço e fotos opcionais.',
    },
    horario: {
      q: 'Qual horário de saída?',
      a: 'As saídas dos hotéis acontecem geralmente entre 07:00 e 08:30 da manhã. Para passeios náuticos como Maracajaú, o horário exato é sincronizado diariamente com o pico da maré baixa para garantir a melhor água!',
    },
    embarque: {
      q: 'Como funciona o embarque?',
      a: 'Nosso guia ou motorista chama nominalmente você na recepção do seu hotel no horário combinado. O veículo é climatizado, higienizado e identificado com a logomarca da agência.',
    },
    cancelamento: {
      q: 'Posso cancelar ou remarcar?',
      a: 'Sim! Remarcações são totalmente gratuitas com até 24h de antecedência. Em caso de condições climáticas adversas ou maré desfavorável para mergulho, reagendamos ou reembolsamos sem burocracia.',
    },
    atendente: {
      q: 'Como falar com um atendente?',
      a: 'Você pode falar diretamente com o consultor Marcelo e nossa equipe de atendimento agora mesmo pelo WhatsApp (84) 98872-2044. O atendimento é rápido, cordial e humanizado!',
    },
  };

  // Budget submission handler
  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memory.name.trim()) return;

    // Track lead generation in GA4 & Meta Pixel
    trackLeadGeneration({
      name: memory.name.trim(),
      tour: memory.selectedTour?.title || 'Roteiro Personalizado VIP',
      phone: memory.phone.trim(),
      guests: memory.guestsCount,
      date: memory.travelDate,
      value: memory.selectedTour?.priceDiscounted || 189,
    });

    // Save lead
    saveLeadToFirestore({
      name: memory.name.trim(),
      phone: memory.phone.trim() || '(84) 98872-2044',
      travelMonth: memory.travelDate ? memory.travelDate.substring(0, 7) : '2026-10',
      tourInterest: memory.selectedTour?.title || 'Roteiro Personalizado VIP',
      status: 'new',
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    navigateTo('budget_complete');
  };

  return (
    <>
      {/* 1. DISCREET FLOATING TEASER (After 8s or when user wanders) */}
      {!isOpen && showTeaser && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-xs animate-bounce duration-1000">
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-r from-[#0C2238] to-[#0A3047] border border-amber-400/50 shadow-2xl text-white">
            <button
              onClick={() => setShowTeaser(false)}
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow"
            >
              ✕
            </button>
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0">🌴</span>
              <div className="text-xs">
                <p className="font-bold text-amber-300">Posso te ajudar com sua viagem?</p>
                <p className="text-slate-300 mt-0.5">Preços, disponibilidade e roteiros imperdíveis em Natal.</p>
                <button
                  onClick={handleOpenChat}
                  className="mt-2 text-[11px] font-black text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Iniciar autoatendimento</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ROUND FLOATING BUTTON (Bottom Right - Turquoise + Gold) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50">
          <button
            onClick={handleOpenChat}
            className="group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-amber-400 text-white shadow-[0_10px_30px_rgba(6,182,212,0.45)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.55)] border-2 border-amber-300/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Abrir Chatbot VIP de Autoatendimento"
          >
            {/* Pulsing ring animation */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-40 blur-sm group-hover:opacity-75 animate-pulse" />

            <div className="relative flex flex-col items-center justify-center">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* "Online agora" badge */}
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[9px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Online</span>
            </span>
          </button>
        </div>
      )}

      {/* 3. MAIN CHAT WINDOW (Mobile Full Sheet / Desktop Floating Panel) */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px] md:w-[440px] z-50 flex flex-col max-h-[92vh] sm:max-h-[640px] rounded-t-3xl sm:rounded-3xl bg-[#071322] border border-cyan-500/30 sm:border-amber-400/40 shadow-2xl overflow-hidden animate-fadeIn">
          
          {/* Top Bar Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#0C1E36] via-[#0D2A44] to-[#0A1A2F] border-b border-amber-500/30 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/70 bg-slate-900 shadow">
                    <img
                      src="/imagens/logovip.jpg"
                      alt="Natal VIP Turismo"
                      width="40"
                      height="40"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white tracking-wide">
                      Agente VIP · Autoatendimento
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-cyan-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ponta Negra, Natal-RN · Resposta em segundos</span>
                  </p>
                </div>
              </div>

              {/* Header action controls */}
              <div className="flex items-center gap-1 text-slate-300">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
                  title="Reiniciar autoatendimento"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Fechar conversa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Persistent Sub-Navigation Bar */}
            <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {step !== 'welcome' && (
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Voltar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigateTo('welcome')}
                  className="px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 font-semibold"
                >
                  🏠 Menu Principal
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('indeciso_quiz')}
                  className="px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-semibold"
                >
                  💡 Em dúvida?
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Main Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm text-slate-200">
            
            {/* STEP 1: ABERTURA & BEM-VINDO */}
            {step === 'welcome' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-[#091D33] border border-cyan-500/30 space-y-2 shadow-sm">
                  <p className="font-bold text-white text-sm sm:text-base">
                    👋 Olá! Seja muito bem-vindo(a) à Natal VIP Turismo!
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Que tal encontrar o passeio perfeito para suas férias em Natal-RN? 🌴☀️
                  </p>
                  <p className="text-amber-300 font-medium text-xs">
                    Posso te ajudar com preços, roteiros, disponibilidade e reservas.
                  </p>
                </div>

                {/* Opening Quick Action Buttons */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Selecione uma opção rápida:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('experience_select')}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950 hover:to-slate-800 border border-slate-700 hover:border-cyan-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">🌴</span>
                      <span>Ver passeios</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('all_tours_list')}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-950 hover:to-slate-800 border border-slate-700 hover:border-amber-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">💰</span>
                      <span>Consultar valores</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('date_select')}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950 hover:to-slate-800 border border-slate-700 hover:border-cyan-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">📅</span>
                      <span>Ver disponibilidade</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, experienceType: 'Passeio Privativo' }));
                        navigateTo('recommendations');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-950 hover:to-slate-800 border border-slate-700 hover:border-amber-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">🚐</span>
                      <span>Passeios privativos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, indecisoPreference: 'familia', guestsCount: '4' }));
                        navigateTo('recommendations');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950 hover:to-slate-800 border border-slate-700 hover:border-cyan-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">👨‍👩‍👧‍👦</span>
                      <span>Passeios para família</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, indecisoPreference: 'romantico', guestsCount: '2' }));
                        navigateTo('recommendations');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-rose-950 hover:to-slate-800 border border-slate-700 hover:border-rose-400/60 font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="text-base">❤️</span>
                      <span>Passeio para casal</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(undefined, 'Olá! Gostaria de conversar com um atendente da Natal VIP Turismo.')}
                    className="w-full mt-2 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow cursor-pointer"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>📲 Falar com atendente no WhatsApp</span>
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => navigateTo('faq_list')}
                      className="text-xs text-slate-400 hover:text-amber-300 underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Dúvidas frequentes (FAQ)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EXPERIENCE SELECT */}
            {step === 'experience_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Para começar, qual experiência você procura? 🏖️
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Selecione o estilo de passeio que mais combina com suas férias em Natal:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'Praias e lagoas', label: 'Praias e lagoas', icon: '🏖️' },
                    { id: 'Dunas e aventura', label: 'Dunas e aventura', icon: '🏜️' },
                    { id: '4x4', label: 'Expedição 4x4', icon: '🚙' },
                    { id: 'Buggy', label: 'Passeio de Buggy', icon: '🏎️' },
                    { id: 'Piscinas naturais', label: 'Piscinas naturais', icon: '🐬' },
                    { id: 'Pôr do sol', label: 'Pôr do sol', icon: '🌅' },
                    { id: 'Passeio privativo', label: 'Passeio privativo', icon: '⭐' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, experienceType: item.id }));
                        if (!memory.guestsCount) {
                          navigateTo('guests_select');
                        } else if (!memory.travelDate) {
                          navigateTo('date_select');
                        } else {
                          navigateTo('recommendations');
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/80 font-bold text-white text-left flex items-center gap-2.5 transition-all cursor-pointer"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: GUESTS COUNT */}
            {step === 'guests_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Quantas pessoas irão viajar? 👥
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Assim podemos dimensionar os melhores veículos e valores para seu grupo:
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {['1', '2', '3', '4', '5+'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, guestsCount: num }));
                        if (!memory.travelDate) {
                          navigateTo('date_select');
                        } else {
                          navigateTo('recommendations');
                        }
                      }}
                      className={`py-3 rounded-xl font-black text-sm transition-all border cursor-pointer ${
                        memory.guestsCount === num
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 border-slate-700 text-white hover:border-amber-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Crianças até 5 anos no colo possuem condições especiais!</span>
                </div>
              </div>
            )}

            {/* STEP 4: DATE SELECT */}
            {step === 'date_select' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Você já sabe a data do passeio? 📅
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Consultamos a tábua de maré e vagas em tempo real para seu roteiro:
                  </p>
                </div>

                {/* Quick chip options */}
                <div className="grid grid-cols-3 gap-2">
                  {['Hoje', 'Amanhã', 'Esta semana'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, travelDate: label }));
                        navigateTo('recommendations');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-white font-semibold text-xs text-center cursor-pointer transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Manual date input */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <label className="text-xs font-semibold text-amber-300 block">
                    Ou selecione a data no calendário:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      min={getTodayISO()}
                      value={memory.travelDate.includes('-') ? memory.travelDate : ''}
                      onChange={(e) => setMemory((prev) => ({ ...prev, travelDate: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!memory.travelDate) {
                          setMemory((prev) => ({ ...prev, travelDate: 'A definir' }));
                        }
                        navigateTo('recommendations');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMemory((prev) => ({ ...prev, travelDate: 'Datas flexíveis' }));
                      navigateTo('recommendations');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Ainda não sei a data exata (ver opções gerais)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PERSONALIZED TOUR RECOMMENDATIONS (CARDS) */}
            {step === 'recommendations' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0C2238] to-[#0A2E44] border border-cyan-500/40 text-white space-y-1">
                  <p className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Perfeito! Encontrei as melhores opções para você 😊</span>
                  </p>
                  <p className="text-slate-300 text-xs">
                    {memory.experienceType ? `Filtro: ${memory.experienceType}` : 'Passeios mais bem avaliados'} ·{' '}
                    {memory.guestsCount ? `${memory.guestsCount} pessoa(s)` : ''} {memory.travelDate ? `· Data: ${memory.travelDate}` : ''}
                  </p>
                </div>

                {/* Tour Cards List (Limited to 1-3 highly relevant) */}
                <div className="space-y-3">
                  {recommendedTours.map((tour) => {
                    const isExpanded = expandedTourId === tour.id;

                    return (
                      <div
                        key={tour.id}
                        className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 shadow-lg transition-all"
                      >
                        {/* Card Image Banner */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                          <img
                            src={tour.imageUrl}
                            alt={`Passeio ${tour.title} Natal RN`}
                            width="360"
                            height="202"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/imagens/maracajau-mergulho.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                          {/* Badge */}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                            {tour.badge || 'VIP'}
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 text-white font-medium text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{tour.duration}</span>
                          </div>

                          {/* Price Tag */}
                          <div className="absolute bottom-2.5 right-2.5 text-right bg-slate-900/90 border border-amber-400/40 px-2.5 py-1 rounded-xl shadow">
                            <span className="text-[10px] text-slate-400 line-through mr-1">R$ {tour.priceOriginal}</span>
                            <span className="text-xs font-black text-amber-300">R$ {tour.priceDiscounted}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 space-y-2.5">
                          <div>
                            <h4 className="font-bold text-white text-sm leading-snug">
                              {tour.title}
                            </h4>
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                              {tour.description}
                            </p>
                          </div>

                          {/* Highlights Preview */}
                          <div className="space-y-1">
                            {tour.highlights.slice(0, 2).map((hl, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{hl}</span>
                              </div>
                            ))}
                          </div>

                          {/* Expandable Itinerary */}
                          {isExpanded && (
                            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs animate-fadeIn">
                              <div>
                                <span className="font-bold text-amber-300 block mb-1">Roteiro Completo:</span>
                                <ul className="space-y-1 text-slate-300">
                                  {tour.highlights.map((h, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-amber-400">•</span>
                                      <span>{h}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <span className="font-bold text-cyan-300 block mb-1">O que está incluso:</span>
                                <ul className="space-y-1 text-slate-300">
                                  {tour.included.map((inc, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span>{inc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setExpandedTourId(isExpanded ? null : tour.id)}
                              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>{isExpanded ? 'Ocultar roteiro' : 'Ver roteiro'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setMemory((prev) => ({ ...prev, selectedTour: tour }));
                                setFocusedTour(tour);
                                navigateTo('budget_collection');
                              }}
                              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 shadow"
                            >
                              <span>Quero reservar</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Persuasive Follow-Up Box */}
                <div className="p-3.5 rounded-2xl bg-[#0A1F35] border border-amber-400/40 space-y-2 text-center">
                  <p className="text-white text-xs font-bold">
                    Essa experiência combina bastante com o que você procura. 🌴✨
                  </p>
                  <p className="text-slate-300 text-xs">
                    Quer que eu verifique os detalhes para sua data?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateTo('budget_collection')}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow"
                    >
                      📅 Continuar atendimento
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp()}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <Phone className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Falar no WhatsApp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('all_tours_list')}
                    className="text-xs text-slate-400 hover:text-white underline mt-1 inline-block cursor-pointer"
                  >
                    ↩️ Ver outros passeios disponíveis
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: CLIENTE INDECISO (Quiz & Guidance) */}
            {step === 'indeciso_quiz' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Está em dúvida entre alguns passeios? Posso te ajudar a escolher 😊
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Qual é a sua maior prioridade para essa viagem?
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'completo', label: '🏆 Quero conhecer o mais completo', desc: 'Roteiros integrados que reúnem praias, dunas e lagoas' },
                    { id: 'economizar', label: '💰 Quero economizar', desc: 'Melhor custo-benefício mantendo qualidade VIP' },
                    { id: 'romantico', label: '❤️ Quero algo romântico', desc: 'Pôr do sol paradisíaco e praias cinematográficas' },
                    { id: 'aventura', label: '🔥 Quero aventura', desc: 'Dunas móveis, manobras de buggy e quadriciclo 4x4' },
                    { id: 'familia', label: '👨‍👩‍👧‍👦 Quero algo para família', desc: 'Águas calmas, segurança infantil e conforto total' },
                    { id: 'fotos', label: '📸 Quero lugares incríveis para fotos', desc: 'Mirantes de falésias, lagoas cristalinas e corais' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, indecisoPreference: option.id }));
                        navigateTo('recommendations');
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-white transition-all cursor-pointer group shadow-sm"
                    >
                      <p className="font-bold text-xs sm:text-sm group-hover:text-amber-300 transition-colors">
                        {option.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: ORÇAMENTO AUTOMÁTICO (Data Collection) */}
            {step === 'budget_collection' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Quase lá! Vamos preparar seu orçamento personalizado 🚐✨
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Preencha os dados abaixo para receber os horários exatos da tábua de maré e confirmar seu voucher:
                  </p>
                </div>

                <form onSubmit={handleBudgetSubmit} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  {/* Passeio Selecionado */}
                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      Passeio Escolhido:
                    </label>
                    <select
                      value={memory.selectedTour?.id || ''}
                      onChange={(e) => {
                        const tour = VIP_TOURS.find((t) => t.id === e.target.value) || null;
                        setMemory((prev) => ({ ...prev, selectedTour: tour }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {VIP_TOURS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} (R$ {t.priceDiscounted})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nome */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Seu Nome Completo: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mariana Silva"
                      value={memory.name}
                      onChange={(e) => setMemory((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Número de pessoas & Data */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Pessoas:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 2 adultos"
                        value={memory.guestsCount}
                        onChange={(e) => setMemory((prev) => ({ ...prev, guestsCount: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Data Pretendida:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 15/10 ou Amanhã"
                        value={memory.travelDate}
                        onChange={(e) => setMemory((prev) => ({ ...prev, travelDate: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Hotel / Localização */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Hotel ou Bairro em Natal:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Hotel em Ponta Negra ou Via Costeira"
                      value={memory.hotelLocation}
                      onChange={(e) => setMemory((prev) => ({ ...prev, hotelLocation: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      WhatsApp para Envio do Orçamento:
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (84) 99999-9999"
                      value={memory.phone}
                      onChange={(e) => setMemory((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-transform active:scale-95 shadow cursor-pointer mt-2"
                  >
                    Gerar Atendimento e Disponibilidade
                  </button>
                </form>
              </div>
            )}

            {/* STEP 8: BUDGET COMPLETE (Condução para WhatsApp) */}
            {step === 'budget_complete' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-[#0A2E3D] border border-emerald-500/50 text-white space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="font-extrabold text-sm sm:text-base text-white">
                    Perfeito, {memory.name.trim() || 'Viajante'}! Já tenho as informações necessárias para preparar seu atendimento. 🚐✨
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Sua solicitação para <strong>{memory.selectedTour?.title || 'Passeio VIP'}</strong> foi estruturada com sucesso.
                  </p>
                </div>

                {/* Resumo do Pedido */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Passeio:</span>
                    <span className="font-bold text-amber-300">{memory.selectedTour?.title || 'Passeios VIP'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Viajantes:</span>
                    <span className="font-bold text-white">{memory.guestsCount || '1'} pessoa(s)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Data:</span>
                    <span className="font-bold text-cyan-300">{memory.travelDate || 'A confirmar'}</span>
                  </div>
                  {memory.hotelLocation && (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Local de Embarque:</span>
                      <span className="font-bold text-white">{memory.hotelLocation}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Valor Cadastrado:</span>
                    <span className="font-black text-emerald-400">
                      R$ {memory.selectedTour ? memory.selectedTour.priceDiscounted : 169} por pessoa
                    </span>
                  </div>
                </div>

                {/* WhatsApp Primary Call To Action */}
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp()}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                >
                  <Phone className="w-5 h-5 fill-slate-950" />
                  <span>📲 Continuar pelo WhatsApp</span>
                </button>

                {/* Self-service online booking fallback */}
                {onOpenBookingModal && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenBookingModal(memory.selectedTour?.id)}
                      className="text-xs text-cyan-300 hover:text-white underline cursor-pointer"
                    >
                      Ou finalizar reserva online pelo site com Pix / Cartão
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 9: ALL TOURS LIST (Consulta de Valores) */}
            {step === 'all_tours_list' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Tabela Oficial de Passeios & Valores 🌴💰
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Valores com desconto para reserva antecipada via agência oficial:
                  </p>
                </div>

                <div className="space-y-2">
                  {VIP_TOURS.map((tour) => (
                    <div
                      key={tour.id}
                      onClick={() => {
                        setMemory((prev) => ({ ...prev, selectedTour: tour }));
                        setFocusedTour(tour);
                        navigateTo('tour_detail');
                      }}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 flex items-center justify-between gap-2 transition-all cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-white text-xs truncate">{tour.title}</h5>
                          {tour.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold shrink-0">
                              {tour.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{tour.duration}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-slate-400 line-through">R$ {tour.priceOriginal}</div>
                        <div className="text-xs font-black text-amber-300">R$ {tour.priceDiscounted}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('experience_select')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center cursor-pointer"
                >
                  Filtrar por estilo de passeio
                </button>
              </div>
            )}

            {/* STEP 10: TOUR DETAIL VIEW */}
            {step === 'tour_detail' && focusedTour && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="rounded-2xl overflow-hidden bg-slate-900 border border-amber-400/40 shadow-xl">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={focusedTour.imageUrl}
                      alt={`Detalhes do passeio ${focusedTour.title} em Natal RN`}
                      width="380"
                      height="214"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/imagens/maracajau-mergulho.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                        {focusedTour.badge || 'VIP'}
                      </span>
                      <h4 className="text-base font-black text-white mt-1">{focusedTour.title}</h4>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3 text-xs">
                    <p className="text-slate-300 leading-relaxed">{focusedTour.description}</p>

                    <div>
                      <span className="font-bold text-amber-300 block mb-1">Destaques do Roteiro:</span>
                      <ul className="space-y-1 text-slate-300">
                        {focusedTour.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Valor promocional:</span>
                        <span className="text-base font-black text-amber-300">R$ {focusedTour.priceDiscounted}</span>
                        <span className="text-[11px] text-slate-400 ml-1">por pessoa</span>
                      </div>

                      <span className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{focusedTour.duration}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('budget_collection')}
                        className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow"
                      >
                        Quero Reservar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(focusedTour.title)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow"
                      >
                        <Phone className="w-3.5 h-3.5 fill-slate-950" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: FAQ LIST & ANSWERS */}
            {step === 'faq_list' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#091D33] border border-cyan-500/30">
                  <p className="font-bold text-white text-sm">
                    Perguntas Frequentes (FAQ) 💡
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    Tire suas dúvidas instantaneamente com respostas diretas:
                  </p>
                </div>

                <div className="space-y-1.5">
                  {Object.entries(FAQ_ITEMS).map(([key, item]) => {
                    const isSelected = activeFaqKey === key;

                    return (
                      <div
                        key={key}
                        className="rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveFaqKey(isSelected ? null : key)}
                          className="w-full p-3 text-left font-semibold text-xs sm:text-sm text-white hover:text-amber-300 flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span>{item.q}</span>
                          {isSelected ? (
                            <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isSelected && (
                          <div className="p-3 pt-0 text-xs text-slate-300 border-t border-slate-800/80 bg-slate-950/50 leading-relaxed animate-fadeIn">
                            <p>{item.a}</p>
                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleOpenWhatsApp(undefined, `Olá! Tenho uma dúvida sobre: ${item.q}`)}
                                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Falar com atendente sobre isso</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Messages history if user typed */}
            {chatMessages.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                          : 'bg-slate-800 text-white rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 text-amber-300 text-xs w-max animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Agente VIP digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Fixed Text Input Form */}
          <div className="p-3 bg-[#0A1A2F] border-t border-slate-800 shrink-0">
            <form onSubmit={handleSendTextMessage} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Digite sua dúvida ou preferência..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shadow shrink-0"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
