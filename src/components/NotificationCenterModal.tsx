import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  CheckCircle2,
  X,
  Waves,
  Sparkles,
  Flame,
  Volume2,
  ExternalLink,
  Trash2,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { NotificationSettings, AppNotification } from '../types';
import {
  getSavedNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  getNotificationHistory,
  markAllNotificationsAsRead,
  triggerTideChangeAlert,
  triggerVacancyAlert,
  triggerPromoAlert,
  sendPushAlert,
} from '../lib/pushNotifications';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenCalendar,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(getSavedNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [history, setHistory] = useState<AppNotification[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSavedNotificationSettings());
      setPermission(getNotificationPermission());
      setHistory(getNotificationHistory());
      markAllNotificationsAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const supported = isNotificationSupported();

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    setStatusMessage(null);

    const result = await requestNotificationPermission();
    setPermission(result.permission);
    setIsRequesting(false);

    if (result.granted) {
      setStatusMessage('Notificações no navegador ativadas com sucesso!');
      setSettings((prev) => {
        const next = { ...prev, enabled: true };
        saveNotificationSettings(next);
        return next;
      });

      // Dispara notificação de boas-vindas imediatamente
      sendPushAlert({
        title: '🔔 Alertas VIP Ativados!',
        body: 'Você agora receberá avisos em tempo real sobre marés perfeitas e abertura de novas vagas.',
        type: 'general',
      });
      setHistory(getNotificationHistory());
    } else {
      setStatusMessage(
        result.error ||
          'Permissão não concedida. Se estiver bloqueada, clique no ícone de cadeado do seu navegador ao lado do endereço e permita as Notificações.'
      );
    }
  };

  const handleToggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveNotificationSettings(next);
      return next;
    });
  };

  const handleTestTideAlert = () => {
    triggerTideChangeAlert(0.1, 'Parrachos de Maracajaú VIP', 'Próximo Sábado');
    setTestSent(true);
    setTimeout(() => {
      setHistory(getNotificationHistory());
      setTestSent(false);
    }, 400);
  };

  const handleTestVacancyAlert = () => {
    triggerVacancyAlert('Lancha Rápida VIP (Rio do Fogo)', 3);
    setTestSent(true);
    setTimeout(() => {
      setHistory(getNotificationHistory());
      setTestSent(false);
    }, 400);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('natal_vip_notification_history');
    setHistory([]);
  };

  const handleNotificationAction = (notif: AppNotification) => {
    onClose();
    if (notif.type === 'tide') {
      onOpenCalendar();
    } else {
      onOpenBooking();
    }
  };

  return (
    <div
      id="notification-center-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#071324] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Notificações & Alertas em Tempo Real</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Push API
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Receba avisos instantâneos de marés perfeitas e vagas antes de esgotarem.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
          {/* Status Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  permission === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : permission === 'denied'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {permission === 'granted' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : permission === 'denied' ? (
                  <BellOff className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Status no Navegador:</span>
                  <span
                    className={`font-semibold ${
                      permission === 'granted'
                        ? 'text-emerald-400'
                        : permission === 'denied'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {permission === 'granted'
                      ? 'Ativado (Permitido)'
                      : permission === 'denied'
                      ? 'Bloqueado no Navegador'
                      : 'Pendente de Permissão'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {permission === 'granted'
                    ? 'Seu navegador está sincronizado com a central de vagas e marés da agência.'
                    : permission === 'denied'
                    ? 'Notificações foram bloqueadas. Habilite nas configurações do navegador (ícone de cadeado).'
                    : 'Clique no botão ao lado para autorizar o recebimento de alertas sonoros e visuais.'}
                </p>
              </div>
            </div>

            {permission !== 'granted' && supported && (
              <button
                id="btn-permitir-push"
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-slate-950" />
                <span>{isRequesting ? 'Ativando...' : 'Ativar no Navegador'}</span>
              </button>
            )}
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Preferences Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Tipos de Alertas que Você Deseja Receber
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Tide Alert */}
              <div
                onClick={() => handleToggleSetting('tideAlerts')}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Mudanças & Dias de Maré Excelente (0.0m a 0.3m)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Avisa quando os Parrachos de Maracajaú e Rio do Fogo atingem transparência máxima tipo Caribe.
                    </span>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    settings.tideAlerts ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transition-transform ${
                      settings.tideAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Vacancy Alert */}
              <div
                onClick={() => handleToggleSetting('vacancyAlerts')}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Novas Vagas & Últimas Vagas nas Lanchas VIP
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Alerta quando novas vagas são disponibilizadas ou quando restam menos de 4 assentos.
                    </span>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    settings.vacancyAlerts ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transition-transform ${
                      settings.vacancyAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Promo Alert */}
              <div
                onClick={() => handleToggleSetting('promoAlerts')}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Ofertas Relâmpago & Cupons VIP
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Receba cupons de R$ 30 a R$ 50 OFF e condições exclusivas de baixa temporada.
                    </span>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    settings.promoAlerts ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transition-transform ${
                      settings.promoAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Testar Notificação Agora</span>
              </span>
              <span className="text-[10px] text-slate-400">Verifique o som e o alerta visual</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                id="btn-testar-alerta-mare"
                onClick={handleTestTideAlert}
                className="px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Simular Alerta de Maré</span>
              </button>

              <button
                id="btn-testar-alerta-vagas"
                onClick={handleTestVacancyAlert}
                className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Simular Novas Vagas</span>
              </button>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Histórico de Alertas Recebidos ({history.length})</span>
              </h4>

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">Nenhum alerta recebido recentemente.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ative as notificações para receber avisos automáticos de marés e vagas.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'tide'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : item.type === 'vacancy'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {item.type === 'tide' ? (
                          <Waves className="w-3.5 h-3.5" />
                        ) : item.type === 'vacancy' ? (
                          <Compass className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {item.body}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Recebido às {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNotificationAction(item)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      <span>Acessar</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>✨ Alertas seguros protegidos pela Push API</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
