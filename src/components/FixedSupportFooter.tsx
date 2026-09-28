import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserCheck,
  MessageSquareText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface FixedSupportFooterProps {
  onOpenChat: () => void;
  onOpenAutoAtendimento: () => void;
  onOpenBooking: () => void;
}

export const FixedSupportFooter: React.FC<FixedSupportFooterProps> = ({
  onOpenChat,
  onOpenAutoAtendimento,
  onOpenBooking,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      aria-label="Área de Suporte Fixo e Autoatendimento VIP"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#050C16]/95 backdrop-blur-xl border-t border-amber-500/30 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all duration-300"
    >
      {/* Decorative Golden Ambient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

      {/* Toggle Minimize/Maximize Button for Mobile Convenience */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 relative">
        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -top-6 right-4 sm:right-6 px-3 py-1 rounded-t-xl bg-[#050C16] border-t border-x border-amber-500/30 text-[10px] font-bold text-amber-300/90 hover:text-amber-200 flex items-center gap-1 shadow-md transition-colors cursor-pointer"
          title={isMinimized ? 'Expandir área de suporte' : 'Recolher área de suporte'}
        >
          {isMinimized ? (
            <>
              <ChevronUp className="w-3 h-3 text-amber-400" />
              <span>Suporte & Autoatendimento VIP</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 text-amber-400" />
              <span>Recolher</span>
            </>
          )}
        </button>

        {isMinimized ? (
          /* Minimized Compact Bar */
          <div className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-white font-bold text-[11px] sm:text-xs">
                Autoatendimento 24h & Suporte Marcelo VIP
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAutoAtendimento}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow cursor-pointer hover:scale-105 transition-transform"
              >
                Autoatendimento Seguro
              </button>
              <button
                type="button"
                onClick={onOpenChat}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/40 text-amber-300 font-bold text-[11px] cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Chat com Marcelo
              </button>
            </div>
          </div>
        ) : (
          /* Full Persuasive VIP Support Bar */
          <div className="py-3 sm:py-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              {/* Persuasive Safe Purchase & Email Confirmation Notification Pitch */}
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      Compra 100% Segura
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-200/90">
                      <Mail className="w-3 h-3 text-amber-400" />
                      Voucher Oficial com Notificações por E-mail
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs mt-0.5 line-clamp-2 leading-tight">
                    Utilize o nosso <strong className="text-white font-extrabold">Autoatendimento Inteligente</strong> para
                    garantir sua vaga sem filas. Confirmação instantânea e você recebe todos os vouchers, QR Codes e atualizações sobre a maré diretamente na sua caixa de entrada!
                  </p>
                </div>
              </div>

              {/* Action Buttons: 1. Autoatendimento Seguro (Primary) | 2. Chat Agente Virtual Marcelo | 3. WhatsApp (Última Opção) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                {/* 1. Primary Option: Autoatendimento & Compra Segura */}
                <button
                  type="button"
                  onClick={onOpenAutoAtendimento}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                  <div className="text-left leading-none">
                    <div className="text-[11px] font-black">Autoatendimento VIP</div>
                    <div className="text-[8px] opacity-80 uppercase tracking-tight">Compra Segura & E-mail</div>
                  </div>
                </button>

                {/* 2. Secondary Option: Chat com Suporte VIP do Agente Pessoal Marcelo */}
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#09172B] hover:bg-[#0E223D] border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-[11px] font-black text-white group-hover:text-amber-200">
                      Chat Suporte VIP
                    </div>
                    <div className="text-[8px] text-amber-300/80">Agente Pessoal Marcelo</div>
                  </div>
                </button>

                {/* 3. Third Option: WhatsApp da Empresa - ÚLTIMA OPÇÃO */}
                <div className="relative group/wp">
                  <a
                    href="https://wa.me/5584988256545?text=Ol%C3%A1%20Natal%20Vip%20Turismo!%20Verifiquei%20o%20autoatendimento%20e%20gostaria%20de%20um%20suporte%20adicional%20para%20minha%20reserva."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-[11px] font-semibold transition-all cursor-pointer"
                    title="WhatsApp da Empresa (Última opção - Priorize o autoatendimento seguro acima)"
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Empresa</span>
                    <span className="text-[9px] uppercase font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                      Última opção
                    </span>
                  </a>

                  {/* Clarification Tooltip */}
                  <div className="absolute bottom-full right-0 mb-2 pointer-events-none hidden group-hover/wp:block w-64 p-2.5 rounded-xl bg-[#091527] border border-slate-700 shadow-2xl text-[10px] text-slate-300 leading-snug">
                    <p className="font-bold text-amber-300 mb-0.5">⚠️ Direcionamento WhatsApp:</p>
                    Recomendamos o <strong>Autoatendimento Online</strong> acima para emissão instantânea com confirmação imediata no seu e-mail. Utilize o WhatsApp apenas para suporte complementar.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
