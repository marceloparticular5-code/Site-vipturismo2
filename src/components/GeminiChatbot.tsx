import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  X,
  Send,
  User,
  Compass,
  ArrowRight,
  Maximize2,
  Minimize2,
  UserCheck,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface PersonalConsultantChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const PersonalConsultantChat: React.FC<PersonalConsultantChatProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenCalendar,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Olá! Muito prazer, sou o Marcelo, seu agente de turismo pessoal na Natal Vip Turismo 🌴.\n\nComo posso planejar o seu roteiro perfeito hoje? Posso analisar a tábua de maré oficial 2026 para o melhor mergulho em Maracajaú e Rio do Fogo, indicar as vagas em lancha rápida VIP, buggy em Genipabu e as melhores dicas de gastronomia potiguar!',
      timestamp: 'Agora',
      suggestedTourId: 'maracajau-vip',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Qual o melhor dia de maré para mergulho?',
    'Diferença entre Maracajaú e Rio do Fogo',
    'Melhores passeios para fazer com a família',
    'Onde jantar frutos do mar hoje à noite?',
    'Como funciona a garantia da maré baixa?',
  ];

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá Marcelo! Estou no site da Natal Vip Turismo e gostaria de uma consultoria pessoal para os passeios da minha viagem!'
    );
    window.open(`https://wa.me/5584988256545?text=${text}`, '_blank');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    if (query.toLowerCase().includes('whatsapp') || query.toLowerCase().includes('zap')) {
      handleOpenWhatsApp();
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `marcelo-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Estou à disposição! Se preferir, pode também me chamar diretamente no WhatsApp (84) 98825-6545.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedTourId: data.suggestedTourId || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Graceful fallback from Marcelo with exact domain knowledge
      let fallback =
        'Para mergulho nos Parrachos, minha orientação pessoal é priorizar marés de 0.0 a 0.5 (Verde no nosso calendário), quando as piscinas naturais ficam cristalinas e mornas como uma piscina caribenha! De 0.6 a 0.7 ainda aproveitamos muito bem. Se a maré for mais alta (0.8+), eu recomendo agendarmos o Passeio de Buggy em Genipabu com emoção!';

      if (query.toLowerCase().includes('noite') || query.toLowerCase().includes('jantar') || query.toLowerCase().includes('restaurante')) {
        fallback =
          'Para sua noite, recomendo com certeza o Camarões Potiguar em Ponta Negra ou o forró do Rastapé! Só recomendo jantar em bom horário, pois no dia seguinte nosso transfer busca você cedinho no hotel para a maré baixa dos Parrachos!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `marcelo-${Date.now()}`,
          role: 'assistant',
          content: fallback,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestedTourId: 'maracajau-vip',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="marcelo-consultant-chat-window"
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[610px] max-h-[85vh]'
      } bg-[#091426] border-2 border-amber-400/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl`}
    >
      {/* Header com Identidade Marcelo - Agente de Turismo Pessoal */}
      <div className="p-4 bg-gradient-to-r from-[#0C1B33] via-[#0E2242] to-[#0A1629] border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-lg border-2 border-amber-300">
              <UserCheck className="w-5 h-5 text-slate-950" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0C1B33]"
              title="Online agora"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Marcelo · Agente de Turismo Pessoal
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Online
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Consultor Especialista · Natal Vip Turismo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Reduzir' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Quick Direct Contact Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-medium">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px]">Precisa de atendimento direto?</span>
        </div>
        <button
          onClick={handleOpenWhatsApp}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all hover:scale-105"
        >
          <Phone className="w-2.5 h-2.5" />
          <span>WhatsApp do Marcelo</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#060D18] to-[#081220]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-black text-xs"
                title="Marcelo"
              >
                M
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {/* Action buttons embedded in assistant answer */}
              {msg.suggestedTourId && msg.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onOpenBooking(msg.suggestedTourId);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>Reservar este Passeio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenCalendar();
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver no Calendário de Maré</span>
                  </button>
                </div>
              )}

              <span
                className={`block text-[9px] mt-1 text-right ${
                  msg.role === 'user' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 p-2 bg-slate-900/60 rounded-xl border border-amber-400/20 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Marcelo está analisando as marés e preparando sua resposta...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-[#0A1629] border-t border-slate-800 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 whitespace-nowrap transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-[#081220] border-t border-slate-800/80 flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Pergunte ao Marcelo sobre maré, mergulho, buggy ou roteiro..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold transition-colors cursor-pointer"
          title="Enviar para o Marcelo"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export const GeminiChatbot = PersonalConsultantChat;
