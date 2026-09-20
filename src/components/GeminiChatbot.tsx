import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Compass,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
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
        'Olá! Sou o Concierge Inteligente da Natal Vip Turismo, equipado com inteligência artificial Gemini. Como posso ajudar você hoje com a nossa tábua de maré 2026, mergulho em Maracajaú ou Rio do Fogo, pacotes VIP e dicas da noite potiguar?',
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
    'Onde jantar frutos do mar hoje à noite?',
    'Como funciona a garantia da tábua de maré?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

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
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui processar no momento. Por favor contate nosso WhatsApp VIP no (84) 98825-6545.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedTourId: data.suggestedTourId || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Graceful fallback concierge response with exact domain knowledge
      let fallback =
        'Para mergulho nos Parrachos, as melhores marés são as de nível 0.0 a 0.5 (Verde), com águas calmas e cristalinas tipo caribenhas! Nos dias de maré 0.6 a 0.7 (Amarelo) ainda é possível fazer o passeio com segurança, e nos dias 0.8+ (Vermelho) sugerimos o Passeio de Buggy em Genipabu.';

      if (query.toLowerCase().includes('noite') || query.toLowerCase().includes('jantar') || query.toLowerCase().includes('restaurante')) {
        fallback =
          'Para a sua noite em Natal, recomendamos o consagrado Camarões Potiguar em Ponta Negra ou curtir o forró no Rastapé na Rua do Salsa. E no dia seguinte, a Natal Vip Turismo busca você no hotel para curtir as piscinas naturais de Maracajaú!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
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
      id="gemini-chatbot-window"
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[600px] max-h-[85vh]'
      } bg-[#091426] border-2 border-amber-400/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#0C1B33] via-[#0E2242] to-[#0A1629] border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Concierge Gemini VIP</h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Online
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Natal Vip Turismo · Especialista em Marés & Roteiros
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title={isExpanded ? 'Reduzir' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Fechar Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#060D18] to-[#081220]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
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
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>Reservar este Passeio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenCalendar();
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver no Calendário</span>
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
          <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>O Concierge Gemini está consultando a tábua de maré e passeios...</span>
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
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 whitespace-nowrap transition-colors"
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
          placeholder="Pergunte sobre maré, mergulho, passeios ou noite..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold transition-colors"
          title="Enviar mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
