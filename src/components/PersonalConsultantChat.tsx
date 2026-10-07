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
  CreditCard,
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
        'Olá! Sou o Marcelo, consultor de vendas virtual da Natal VIP Turismo 🌴\nPara eu te indicar o roteiro perfeito e cuidar de tudo sem complicação, quando você vem a Natal e o que procura na viagem?',
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
    'Quais os passeios e valores?',
    'Buscam no meu hotel?',
    'Litoral Norte de Buggy (Genipabu)',
    'Como funciona o pagamento no Pix?',
    'Falar com atendente humano',
  ];

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá Marcelo! Estou no site da Natal Vip Turismo e gostaria de atendimento para os passeios da minha viagem!'
    );
    window.open(`https://wa.me/5584988722044?text=${text}`, '_blank');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    if (query.toLowerCase().includes('atendente') || query.toLowerCase().includes('humano')) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      const botMessage: ChatMessage = {
        id: `marcelo-${Date.now()}`,
        role: 'assistant',
        content:
          'Com certeza! Vou te transferir agora para o atendimento humano no nosso WhatsApp oficial: (84) 98872-2044.\nNossa equipe já está a postos para te receber!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
      setInputPrompt('');
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
        content: data.reply || 'Estou à disposição! Se preferir, pode também me chamar diretamente no WhatsApp (84) 98872-2044.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedTourId: data.suggestedTourId || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Graceful fallback from Marcelo with exact domain knowledge
      let fallback =
        'Temos opções incríveis como Maracajaú por R$ 170, Pipa por R$ 80 e o Buggy no Litoral Norte por R$ 820 privativo (ou divide para 2 casais). Todos buscam no seu hotel!\nQual desses estilos você prefere: praia, aventura ou piscinas naturais?';

      if (query.toLowerCase().includes('hotel') || query.toLowerCase().includes('busca')) {
        fallback =
          'Sim! Buscamos na porta do seu hotel em Ponta Negra, Via Costeira e Praia dos Artistas, sem custo extra 🚐\nEm qual hotel você vai ficar?';
      } else if (query.toLowerCase().includes('pagar') || query.toLowerCase().includes('pix') || query.toLowerCase().includes('cartão')) {
        fallback =
          'No Pix você só paga uma entrada para reservar e o restante no dia do passeio! Ou no cartão pelo link seguro: https://loja.infinitepay.io/natalvipturismo\nVocê prefere Pix ou cartão?';
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
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {msg.suggestedTourId && (
                    <button
                      onClick={() => {
                        onOpenBooking(msg.suggestedTourId);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Reservar este Passeio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {msg.content.includes('infinitepay.io') && (
                    <a
                      href="https://loja.infinitepay.io/natalvipturismo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>💳 Pagar no Cartão (InfinitePay)</span>
                    </a>
                  )}

                  {(msg.content.includes('98872-2044') || msg.content.includes('WhatsApp')) && (
                    <a
                      href="https://wa.me/5584988722044?text=Ol%C3%A1%20Marcelo!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20e%20confirmar%20meu%20passeio."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Chamar no WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      onOpenCalendar();
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tábua de Maré 2026</span>
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

export const AssistenteNatalVipChatbot = PersonalConsultantChat;
export default PersonalConsultantChat;
