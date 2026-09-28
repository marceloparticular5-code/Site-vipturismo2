import { useEffect, useRef } from 'react';
import { TourPackage } from '../types';
import {
  getSavedNotificationSettings,
  triggerTideChangeAlert,
  triggerVacancyAlert,
} from '../lib/pushNotifications';

export const useRealTimeTideAndVacancyMonitor = (tours: TourPackage[]) => {
  const alertedToursRef = useRef<Set<string>>(new Set());
  const hasTriggeredInitialTideRef = useRef(false);

  useEffect(() => {
    const settings = getSavedNotificationSettings();
    if (!settings.enabled) return;

    // 1. Checagem de Maré Baixa Especial (Parrachos com maré <= 0.2m)
    if (settings.tideAlerts && !hasTriggeredInitialTideRef.current) {
      // Simula detecção em tempo real de maré caribenha para o período
      const timer = setTimeout(() => {
        const currentSettings = getSavedNotificationSettings();
        if (currentSettings.enabled && currentSettings.tideAlerts) {
          triggerTideChangeAlert(
            0.1,
            'Parrachos de Maracajaú & Rio do Fogo',
            'Próximo Fim de Semana'
          );
          hasTriggeredInitialTideRef.current = true;
        }
      }, 8000); // 8s após entrar no site

      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Monitoramento de Vagas em Tempo Real
  useEffect(() => {
    const settings = getSavedNotificationSettings();
    if (!settings.enabled || !settings.vacancyAlerts) return;

    tours.forEach((tour) => {
      // Se vagas restantes <= 4 e ainda não alertamos nesta sessão
      if (
        tour.remainingSlots &&
        tour.remainingSlots <= 4 &&
        !alertedToursRef.current.has(tour.id)
      ) {
        alertedToursRef.current.add(tour.id);
        const timer = setTimeout(() => {
          const currentSettings = getSavedNotificationSettings();
          if (currentSettings.enabled && currentSettings.vacancyAlerts) {
            triggerVacancyAlert(tour.title, tour.remainingSlots || 3);
          }
        }, 15000); // Espaço de tempo orgânico

        return () => clearTimeout(timer);
      }
    });
  }, [tours]);
};
