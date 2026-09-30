import { NotificationSettings, AppNotification } from '../types';

const SETTINGS_KEY = 'natal_vip_notification_settings';
const HISTORY_KEY = 'natal_vip_notification_history';

// Configurações padrão
export const getDefaultSettings = (): NotificationSettings => ({
  enabled: false,
  tideAlerts: true,
  vacancyAlerts: true,
  promoAlerts: true,
  lastUpdated: new Date().toISOString(),
});

// Recupera as configurações salvas no dispositivo
export const getSavedNotificationSettings = (): NotificationSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erro ao ler configurações de notificação:', err);
  }
  return getDefaultSettings();
};

// Salva as preferências de notificação
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Erro ao salvar preferências de notificação:', err);
  }
};

// Histórico de notificações recebidas
export const getNotificationHistory = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
};

export const saveNotificationToHistory = (notification: AppNotification): void => {
  try {
    const current = getNotificationHistory();
    const updated = [notification, ...current].slice(0, 30); // Mantém as últimas 30
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

export const markAllNotificationsAsRead = (): void => {
  try {
    const current = getNotificationHistory();
    const updated = current.map((item) => ({ ...item, read: true }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

// Verifica suporte do navegador
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

// Registra o Service Worker para Push
let swRegistration: ServiceWorkerRegistration | null = null;

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;
    return reg;
  } catch (err) {
    console.warn('Registro de Service Worker indisponível:', err);
    return null;
  }
};

// Solicita permissão do navegador para notificações (Push API)
export const requestNotificationPermission = async (): Promise<{
  granted: boolean;
  permission: NotificationPermission;
  error?: string;
}> => {
  if (!isNotificationSupported()) {
    return {
      granted: false,
      permission: 'denied',
      error: 'Seu navegador atual não suporta a API de Notificações nativas.',
    };
  }

  try {
    // Registra Service Worker se ainda não estiver ativo
    await registerServiceWorker();

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';

    const currentSettings = getSavedNotificationSettings();
    saveNotificationSettings({
      ...currentSettings,
      enabled: granted,
      lastUpdated: new Date().toISOString(),
    });

    return { granted, permission };
  } catch (err: any) {
    console.warn('Erro ao solicitar permissão de notificações:', err);
    return {
      granted: false,
      permission: 'denied',
      error: err?.message || 'Permissão de notificação negada ou restrita pelo navegador.',
    };
  }
};

// Ouvintes para alertas in-app (Toasts visuais em tempo real)
type NotificationListener = (notification: AppNotification) => void;
const inAppListeners: Set<NotificationListener> = new Set();

export const subscribeToInAppNotifications = (listener: NotificationListener): (() => void) => {
  inAppListeners.add(listener);
  return () => inAppListeners.delete(listener);
};

// Envia uma Notificação Push Real + Toast In-App
export const sendPushAlert = async (payload: {
  title: string;
  body: string;
  type?: 'tide' | 'vacancy' | 'promo' | 'general';
  url?: string;
  tag?: string;
}): Promise<boolean> => {
  const fullNotification: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: payload.title,
    body: payload.body,
    type: payload.type || 'general',
    url: payload.url || '/',
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    read: false,
  };

  // Salva no histórico local
  saveNotificationToHistory(fullNotification);

  // Notifica ouvintes in-app imediatamente (floating toast)
  inAppListeners.forEach((listener) => {
    try {
      listener(fullNotification);
    } catch (e) {
      console.warn('Erro no ouvinte de notificação in-app:', e);
    }
  });

  // Dispara a Notificação de Sistema via Navegador (Push / Notification API)
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(payload.title, {
            body: payload.body,
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: payload.tag || fullNotification.id,
            renotify: true,
            data: { url: payload.url || '/' },
          } as any);
          return true;
        }
      }

      // Fallback para Notification API nativa direta
      new Notification(payload.title, {
        body: payload.body,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: payload.tag || fullNotification.id,
      });
      return true;
    } catch (err) {
      console.warn('Erro ao disparar notificação do navegador:', err);
    }
  }

  return false;
};

// Alertas pré-formatados de alta conversão
export const triggerTideChangeAlert = (height: number, location: string, dateFormatted?: string) => {
  return sendPushAlert({
    title: `🌊 Alerta de Maré Perfeita: ${height.toFixed(1)}m`,
    body: `Condição caribenha confirmada para ${location}${dateFormatted ? ` em ${dateFormatted}` : ''}. Excelente visibilidade para mergulho!`,
    type: 'tide',
    url: '/#calendario-inteligente',
    tag: 'tide-alert',
  });
};

export const triggerVacancyAlert = (tourTitle: string, remainingSlots: number) => {
  return sendPushAlert({
    title: `🚤 Novas Vagas Abertas: ${tourTitle}`,
    body: `Restam apenas ${remainingSlots} vagas disponíveis para a Lancha Rápida VIP. Garanta a sua antes de esgotar!`,
    type: 'vacancy',
    url: '/',
    tag: 'vacancy-alert',
  });
};

export const triggerPromoAlert = (discount: string, tourTitle?: string) => {
  return sendPushAlert({
    title: `🔥 Oferta Relâmpago VIP · ${discount}`,
    body: `Cupom exclusivo liberado para ${tourTitle || 'passeios em Natal/RN'}. Válido para reservas hoje!`,
    type: 'promo',
    url: '/',
    tag: 'promo-alert',
  });
};