import React, { useState, useEffect, useRef } from 'react';
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
  Flame,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { saveLeadToFirestore } from '../lib/firebase';
import { getTodayISO } from '../lib/dateUtils';

interface FloatingChatbotProps {
  onOpenBookingModal?: (tourId?: string) => void;
  isOpenControlled?: boolean;
  onToggleControlled?: (open: boolean) => void;
}

type ChatStep = 'welcome' | 'dates' | 'guests' | 'motive' | 'summary' | 'faq_booking' | 'faq_agent';

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  onOpenBookingModal,
  isOpenControlled,
  onToggleControlled,
}) => {
  // Chat open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showReengagementNudge, setShowReengagementNudge] = useState(false);
  const [hasDismissedNudge, setHasDismissedNudge] = useState(false);

  // Form & conversation state
  const [step, setStep] = useState<ChatStep>('welcome');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsCount, setGuestsCount] = useState('');
  const [travelMotive, setTravelMotive] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [selectedTour] = useState('Parrachos de Maracajaú & Rio do Fogo VIP');
  const [isLeadSaved, setIsLeadSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with external controlled state if provided
  useEffect(() => {
    if (typeof isOpenControlled === 'boolean') {
      setIsOpen(isOpenControlled);
      if (isOpenControlled) {
        setHasInteracted(true);
        setShowReengagementNudge(false);
      }
    }
  }, [isOpenControlled]);

  // Automatic popup after 8 seconds if visitor hasn't opened yet
  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyVisited = sessionStorage.getItem('natal_vip_chat_opened');
      if (!alreadyVisited && !isOpen) {
        setIsOpen(true);
        setHasInteracted(true);
        sessionStorage.setItem('natal_vip_chat_opened', 'true');
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to bottom when step changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setShowReengagementNudge(false);
    onToggleControlled?.(true);
    sessionStorage.setItem('natal_vip_chat_opened', 'true');
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    onToggleControlled?.(false);

    // Show re-engagement nudge once if user closes without booking
    if (!hasDismissedNudge && !isLeadSaved) {
      setTimeout(() => {
        setShowReengagementNudge(true);
      }, 1500);
    }
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReengagementNudge(false);
    setHasDismissedNudge(true);
  };

  const handleResetConversation = () => {
    setStep('welcome');
    setCheckInDate('');
    setCheckOutDate('');
    setGuestsCount('');
    setTravelMotive('');
    setVisitorName('');
    setVisitorPhone('');
    setIsLeadSaved(false);
  };

  // Save Lead in background to Firebase & LocalStorage
  const persistLeadData = async () => {
    if (isLeadSaved) return;

    const leadPayload = {
      name: visitorName.trim() || 'Visitante Chatbot Ponta Negra',
      phone: visitorPhone.trim() || '(84) 98872-2044',
      travelMonth: checkInDate ? checkInDate.substring(0, 7) : '2026-10',
      tourInterest: selectedTour,
      couponCode: 'CHATBOT-VIP',
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveLeadToFirestore(leadPayload);
      setIsLeadSaved(true);
    } catch (err) {
      console.warn('Fallback lead storage local:', err);
    }
  };

  // Build WhatsApp reservation link
  const buildWhatsAppReservationUrl = () => {
    const phone = '5584988722044';
    const lines = [
      '🌴 *Olá, Natal Vip Turismo!*',
      'Vim pelo site em Ponta Negra e gostaria de garantir vagas para minha viagem:',
      '',
      `📅 *Data de Entrada:* ${checkInDate || 'A definir'}`,
      `📅 *Data de Saída:* ${checkOutDate || 'A definir'}`,
      `👥 *Hóspedes / Pessoas:* ${guestsCount || 'Casal (2 pessoas)'}`,
      `🎯 *Motivo da Viagem:* ${travelMotive || 'Lazer & Férias'}`,
      `🏖️ *Roteiro de Interesse:* ${selectedTour}`,
      visitorName ? `👤 *Meu Nome:* ${visitorName}` : '',
      '',
      'Aguardo confirmação de disponibilidade da melhor maré baixa!',
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleWhatsAppBooking = () => {
    persistLeadData();
    const url = buildWhatsAppReservationUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDirectAgent = () => {
    const phone = '5584988722044';
    const text = encodeURIComponent(
      'Olá! Gostaria de falar com um atendente humano da Natal Vip Turismo sobre disponibilidade de passeios e tábua de maré.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const todayISO = getTodayISO();

  return (
    <>
      {/* 1. Re-engagement Nudge (Appears once after closing) */}
      {showReengagementNudge && !isOpen && (
        <div
          role="status"
          aria-live="polite"
          onClick={handleOpenChat}
          className="fixed bottom-24 right-4 sm:right-6 z-50 animate-bounce cursor-pointer group"
        >
          <div className="bg-[#050C16]/95 backdrop-blur-xl border border-amber-400/80 rounded-2xl p-3 sm:px-4 py-2.5 shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center gap-3 max-w-xs text-xs">
            <span className="text-xl">⏳</span>
            <div className="min-w-0">
              <p className="font-extrabold text-amber-300 group-hover:text-white transition-colors leading-tight">
                Ainda dá tempo de reservar ⏳
              </p>
              <p className="text-[11px] text-slate-300">Poucas vagas para a maré baixa desta semana!</p>
            </div>
            <button
              type="button"
              onClick={handleDismissNudge}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              title="Dispensar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Round Button in Bottom-Right Corner (Azul Turquesa & Dourado) */}
      {!isOpen && (
        <aside
          aria-label="Abrir Assistente Virtual Natal Vip"
          className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5"
        >
          {/* Subtle invitation tooltip on desktop */}
          <div
            onClick={handleOpenChat}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050C16]/90 border border-teal-500/40 backdrop-blur-md text-xs font-semibold text-slate-200 shadow-xl cursor-pointer hover:border-amber-400 transition-all hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Falar com Agente VIP</span>
          </div>

          <button
            type="button"
            onClick={handleOpenChat}
            aria-label="Abrir Chatbot Natal Vip Turismo"
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 via-teal-600 to-cyan-700 hover:from-cyan-400 hover:to-teal-500 text-white p-0 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] border-2 border-amber-400 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
          >
            {/* Pulsing Outer Ring */}
            <span className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none opacity-40" />

            {/* Chat Icon & Sparkle */}
            <div className="relative">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>

            {/* "Online agora" Floating Pill Badge */}
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-1 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              Online agora
            </span>
          </button>
        </aside>
      )}

      {/* 3. Floating Interactive Chat Window (Minimalist, Modern & Mobile First) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Atendimento Online Natal Vip Turismo"
          className="fixed bottom-4 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[85vh] sm:max-h-[620px] bg-[#050C16] border border-amber-500/40 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-fadeIn backdrop-blur-2xl"
        >
          {/* Header (Azul Turquesa Profundo + Dourado) */}
          <div className="relative bg-gradient-to-r from-[#071F2E] via-[#093245] to-[#0B2538] border-b border-amber-500/30 p-3.5 sm:p-4 flex items-center justify-between text-white shrink-0">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-teal-400" />

            <div className="flex items-center gap-3">
              {/* Agent Avatar with status */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-[#050C16] flex items-center justify-center overflow-hidden">
                  <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#050C16]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white leading-tight">Natal Vip Turismo</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                    VIP
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/90 flex items-center gap-1">
                  <span>Ponta Negra</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">Online agora</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                title="Reiniciar atendimento"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCloseChat}
                className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fechar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
            {/* 1. Welcome Message */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
                <Compass className="w-4 h-4" />
              </div>
              <div className="bg-[#091829] border border-cyan-500/30 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 max-w-[88%] shadow-sm space-y-1.5">
                <p className="font-bold text-cyan-300">Olá! 🌴</p>
                <p className="leading-relaxed">
                  Os melhores atrativos turísticos em <strong className="text-white">Natal-RN</strong> com maré baixa
                  garantida e lanchas VIP.
                </p>
                <div className="pt-1 flex items-center gap-1 text-[11px] text-amber-300 font-extrabold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Poucas vagas disponíveis. Quer garantir a sua?</span>
                </div>
              </div>
            </div>

            {/* Quick Actions / FAQ Buttons for Step 1 */}
            {step === 'welcome' && (
              <div className="space-y-2 pt-1 pl-9 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setStep('dates')}
                  className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all flex items-center justify-between cursor-pointer hover:scale-[1.02]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Garantir Minha Vaga Agora</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('faq_booking')}
                    className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Como reservar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('faq_agent')}
                    className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-amber-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Falar com atendente</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step: FAQ Como Reservar */}
            {step === 'faq_booking' && (
              <div className="space-y-3 pl-9 animate-fadeIn">
                <div className="bg-[#0A1F33] border border-cyan-500/40 rounded-2xl p-3 text-slate-200 space-y-2">
                  <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Como funciona a reserva:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    1. Você seleciona o período e o número de pessoas.
                    <br />
                    2. Nosso time confere a <strong>tábua de maré oficial</strong> para o melhor dia de mergulho.
                    <br />
                    3. Você recebe o voucher oficial por e-mail com <strong>transfer no seu hotel</strong> de Ponta Negra ou Via Costeira.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('dates')}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <span>Continuar para Escolher Datas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Step: FAQ Falar com Atendente */}
            {step === 'faq_agent' && (
              <div className="space-y-3 pl-9 animate-fadeIn">
                <div className="bg-[#0A1F33] border border-amber-500/40 rounded-2xl p-3 text-slate-200 space-y-2">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Atendimento Humano Personalizado:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    Nosso consultor Marcelo e a equipe de plantão em Ponta Negra estão prontos para tirar qualquer dúvida sobre vagas de lancha, buggy e roteiros.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenDirectAgent}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Conversar Agora no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('dates')}
                  className="w-full py-1.5 text-center text-slate-400 hover:text-amber-300 text-[11px] underline cursor-pointer"
                >
                  Ou informar datas de viagem primeiro
                </button>
              </div>
            )}

            {/* Step 2: Pergunta Datas de Entrada e Saída */}
            {(step === 'dates' || step === 'guests' || step === 'motive' || step === 'summary') && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="bg-[#091829] border border-cyan-500/30 rounded-2xl rounded-tl-sm p-3 text-slate-200 max-w-[88%] shadow-sm">
                    <p className="font-bold text-white mb-1">Qual o período da sua viagem a Natal?</p>
                    <p className="text-[11px] text-slate-300">
                      Informe suas datas para cruzarmos com a <strong>tábua de maré baixa</strong>:
                    </p>

                    {step === 'dates' ? (
                      <div className="mt-3 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-cyan-300 font-bold block mb-1">Entrada:</label>
                            <input
                              type="date"
                              min={todayISO}
                              value={checkInDate}
                              onChange={(e) => setCheckInDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-cyan-300 font-bold block mb-1">Saída:</label>
                            <input
                              type="date"
                              min={checkInDate || todayISO}
                              value={checkOutDate}
                              onChange={(e) => setCheckOutDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              const inD = d.toISOString().split('T')[0];
                              d.setDate(d.getDate() + 4);
                              const outD = d.toISOString().split('T')[0];
                              setCheckInDate(inD);
                              setCheckOutDate(outD);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-amber-300 border border-slate-700 cursor-pointer"
                          >
                            Próximos dias
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckInDate('2026-10-10');
                              setCheckOutDate('2026-10-15');
                            }}
                            className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-amber-300 border border-slate-700 cursor-pointer"
                          >
                            Outubro/2026
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!checkInDate) {
                              setCheckInDate(todayISO);
                            }
                            setStep('guests');
                          }}
                          className="w-full mt-2 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                        >
                          <span>Confirmar Datas</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-emerald-300 font-semibold bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          {checkInDate ? `${checkInDate} até ${checkOutDate || '...'} ` : 'Datas flexíveis selecionadas'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pergunta Número de Hóspedes */}
            {(step === 'guests' || step === 'motive' || step === 'summary') && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="bg-[#091829] border border-teal-500/30 rounded-2xl rounded-tl-sm p-3 text-slate-200 max-w-[88%] shadow-sm">
                    <p className="font-bold text-white mb-1">Quantos passageiros / hóspedes?</p>

                    {step === 'guests' ? (
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {[
                          { label: '1 pessoa (Solo)', val: '1 pessoa' },
                          { label: '2 pessoas (Casal)', val: '2 pessoas (Casal)' },
                          { label: '3 a 5 (Família)', val: '3 a 5 pessoas (Família)' },
                          { label: '6+ (Grupo VIP)', val: '6+ pessoas (Grupo VIP)' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => {
                              setGuestsCount(item.val);
                              setStep('motive');
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950/70 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white font-semibold text-[11px] text-left transition-all cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{guestsCount || '2 pessoas'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Pergunta Motivo da Viagem */}
            {(step === 'motive' || step === 'summary') && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="bg-[#091829] border border-amber-500/30 rounded-2xl rounded-tl-sm p-3 text-slate-200 max-w-[88%] shadow-sm">
                    <p className="font-bold text-white mb-1">Qual o motivo da viagem?</p>

                    {step === 'motive' ? (
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {[
                          { label: '🌴 Lazer & Férias', val: 'Lazer & Férias' },
                          { label: '👨‍👩‍👦 Família', val: 'Família' },
                          { label: '💍 Casal / Lua de Mel', val: 'Casal / Romance' },
                          { label: '💼 Trabalho / Negócios', val: 'Trabalho & Turismo' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => {
                              setTravelMotive(item.val);
                              setStep('summary');
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/70 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white font-semibold text-[11px] text-left transition-all cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{travelMotive}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 & 6: Resumo, Urgência e Botão Dourado WhatsApp */}
            {step === 'summary' && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow">
                    ✓
                  </div>
                  <div className="bg-[#08182B] border border-amber-400/50 rounded-2xl rounded-tl-sm p-3.5 text-slate-100 max-w-[88%] shadow-lg space-y-2.5">
                    {/* Urgency & Scarcity Mental Trigger */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 font-extrabold text-[10px] uppercase tracking-wider">
                      <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                      <span>Últimas vagas para essas datas!</span>
                    </div>

                    <p className="text-xs font-bold text-white leading-snug">
                      Ótimo! Temos poucas datas livres com maré favorável. Garanta agora com prioridade:
                    </p>

                    {/* Summary Details Box */}
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">📅 Período:</span>
                        <span className="font-semibold text-white">
                          {checkInDate ? `${checkInDate} ➔ ${checkOutDate || 'Flexível'}` : 'Datas flexíveis'}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">👥 Passageiros:</span>
                        <span className="font-semibold text-white">{guestsCount || '2 pessoas'}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">🎯 Motivo:</span>
                        <span className="font-semibold text-white">{travelMotive || 'Lazer'}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                        <span className="text-slate-400">🏖️ Roteiro:</span>
                        <span className="font-bold text-amber-300">Maracajaú & Rio do Fogo VIP</span>
                      </div>
                    </div>

                    {/* Quick Optional Name / WhatsApp capture for CRM Lead */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] text-slate-400 block font-semibold">
                        Seu nome e contato (para reserva nominal):
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Seu nome completo..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="tel"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="WhatsApp (ex: 84 98872-2044)..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* 6. Botão Dourado RESERVAR NO WHATSAPP */}
                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
                    >
                      <Phone className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
                      <span>RESERVAR NO WHATSAPP</span>
                    </button>

                    <p className="text-[9px] text-center text-slate-400">
                      ⚡ Atendimento VIP direto da base em Ponta Negra com confirmação imediata.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer note & Safe purchase guarantee */}
          <div className="bg-[#040D17] border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Compra 100% Segura · Ponta Negra</span>
            </span>

            <button
              type="button"
              onClick={handleResetConversation}
              className="text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
            >
              Recomeçar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
