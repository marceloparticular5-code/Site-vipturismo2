import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { subscribeToInAppNotifications } from '../lib/pushNotifications';
import { Waves, Compass, Sparkles, X, ExternalLink, Bell } from 'lucide-react';

interface InAppNotificationToastProps {
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
  onOpenNotificationCenter: () => void;
}

export const InAppNotificationToast: React.FC<InAppNotificationToastProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenNotificationCenter,
}) => {
  const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToInAppNotifications((notif) => {
      setCurrentNotification(notif);
      setVisible(true);

      // Auto dismiss after 7 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 7000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  if (!visible || !currentNotification) return null;

  const handleAction = () => {
    setVisible(false);
    if (currentNotification.type === 'tide') {
      onOpenCalendar();
    } else if (currentNotification.type === 'vacancy') {
      onOpenBooking();
    } else {
      onOpenNotificationCenter();
    }
  };

  return (
    <div
      id="in-app-notification-toast"
      className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#071324]/95 border-2 border-amber-400/50 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in slide-in-from-top-4 duration-300 text-slate-100"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
            currentNotification.type === 'tide'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : currentNotification.type === 'vacancy'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}
        >
          {currentNotification.type === 'tide' ? (
            <Waves className="w-5 h-5 animate-pulse" />
          ) : currentNotification.type === 'vacancy' ? (
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 pr-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
              <span>Alerta em Tempo Real</span>
            </span>
            <span className="text-[10px] text-slate-500">{currentNotification.timestamp}</span>
          </div>

          <h4 className="text-xs font-black text-white mt-0.5 leading-snug">
            {currentNotification.title}
          </h4>

          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
            {currentNotification.body}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAction}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow transition-all hover:scale-105 cursor-pointer"
            >
              <span>
                {currentNotification.type === 'tide'
                  ? 'Ver Tábua de Maré'
                  : currentNotification.type === 'vacancy'
                  ? 'Ver Vagas & Reservar'
                  : 'Conferir Detalhes'}
              </span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => setVisible(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-medium transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
