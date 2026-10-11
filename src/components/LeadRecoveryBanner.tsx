import React, { useState, useEffect } from 'react';
import { RotateCcw, X, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface LeadRecoveryBannerProps {
  onOpenBooking: (
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
  isDrawerOpen?: boolean;
}

export const LeadRecoveryBanner: React.FC<LeadRecoveryBannerProps> = ({
  onOpenBooking,
  isDrawerOpen = false,
}) => {
  const [draft, setDraft] = useState<any | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('natal_vip_active_draft');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only show if customer has provided at least name or phone, but not confirmed
        if (
          parsed &&
          (parsed.customerName || parsed.customerPhone) &&
          parsed.status !== 'CONFIRMADA' &&
          parsed.status !== 'pago'
        ) {
          setDraft(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [isDrawerOpen]);

  if (!draft || dismissed || isDrawerOpen) return null;

  const handleResume = () => {
    onOpenBooking(draft.tourId, {
      date: draft.date,
      adults: draft.adults,
      children: draft.children,
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      customerEmail: draft.customerEmail,
      addons: draft.addons,
      initialStep: 'details',
    });
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0B1E38]/95 border-2 border-amber-400/70 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
              Reserva Pendente Salva
            </span>
            <p className="text-xs font-bold text-white truncate">
              Olá, {draft.customerName ? draft.customerName.split(' ')[0] : 'Visitante'}! Retome seu {draft.tourTitle || 'passeio VIP'}.
            </p>
            <span className="text-[11px] text-slate-300 block">
              {draft.adults} adulto(s) · {draft.date || 'Data escolhida'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResume}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retomar</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
