import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TideCalendar } from './components/TideCalendar';
import { DivingSection } from './components/DivingSection';
import { InteractiveToursMap } from './components/InteractiveToursMap';
import { FeaturedPackages } from './components/FeaturedPackages';
import { MustSeeToursCarousel } from './components/MustSeeToursCarousel';
import { ReviewsCarouselSection } from './components/ReviewsCarouselSection';
import { InstagramFeedSection } from './components/InstagramFeedSection';
import { NightlifeBlogSection } from './components/NightlifeBlogSection';
import { InfraChecklist } from './components/InfraChecklist';
import { BookingDrawer } from './components/BookingDrawer';
import { AutoAtendimentoModal } from './components/AutoAtendimentoModal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { FollowUpSystem } from './components/FollowUpSystem';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { UserReservationsModal } from './components/UserReservationsModal';
import { AdminToursModal } from './components/AdminToursModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { InAppNotificationToast } from './components/InAppNotificationToast';
import { Footer } from './components/Footer';
import { FixedSupportFooter } from './components/FixedSupportFooter';
import { Breadcrumbs } from './components/Breadcrumbs';
import { TourPackage, StudentProfile } from './types';
import { VIP_TOURS } from './data/toursData';
import { subscribeToTours } from './lib/firebase';
import { getInitialBookingDate } from './lib/dateUtils';
import { useRealTimeTideAndVacancyMonitor } from './hooks/useRealTimeTideAndVacancyMonitor';
import { registerServiceWorker } from './lib/pushNotifications';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string>('maracajau-vip');
  const [selectedDate, setSelectedDate] = useState<string>(() => getInitialBookingDate());
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('08:30 às 10:00');
  const [selectedTideHeight, setSelectedTideHeight] = useState<number>(0.2);

  const [isAutoAtendimentoOpen, setIsAutoAtendimentoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [tours, setTours] = useState<TourPackage[]>(VIP_TOURS);
  const [isLoadingTours, setIsLoadingTours] = useState(false);

  // Objeto 'student' persistido entre sessões para salvar o progresso do InfraChecklist
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('natal_vip_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            id: parsed.id || 'student-default',
            name: parsed.name || 'Viajante VIP',
            checklistProgress: parsed.checklistProgress || {},
            lastActiveTab: parsed.lastActiveTab || 'todos',
            notes: parsed.notes || '',
            updatedAt: parsed.updatedAt || new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Could not load student profile from localStorage:', e);
    }
    return {
      id: 'student-default',
      name: 'Viajante VIP',
      checklistProgress: {},
      lastActiveTab: 'todos',
      notes: '',
      updatedAt: new Date().toISOString(),
    };
  });

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setStudent(updatedStudent);
    try {
      localStorage.setItem('natal_vip_student_profile', JSON.stringify(updatedStudent));
    } catch (e) {
      console.warn('Could not persist student profile to localStorage:', e);
    }
  };

  // Monitora alterações na tábua de marés e novas vagas em tempo real para os clientes
  useRealTimeTideAndVacancyMonitor(tours);

  // Registra Service Worker para suporte à Push API em segundo plano
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Detect URL containing /admin or #admin to open the admin panel
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path === '/admin' ||
        path === '/admin/' ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    const path = window.location.pathname.toLowerCase();
    if (!path.startsWith('/admin')) {
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (
      path === '/admin' ||
      path === '/admin/' ||
      window.location.hash.includes('admin') ||
      window.location.search.includes('admin')
    ) {
      window.history.pushState({}, '', '/');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToTours((allTours) => {
      setTours(allTours);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenBooking = (tourId?: string) => {
    if (tourId) setSelectedTourId(tourId);
    setIsBookingOpen(true);
  };

  const handleSelectDayForBooking = (dayInfo: {
    dateFormatted: string;
    height: number;
    timeWindow: string;
    tourRecommended: 'maracajau-vip' | 'rio-do-fogo-vip';
  }) => {
    setSelectedDate(dayInfo.dateFormatted);
    setSelectedTideHeight(dayInfo.height);
    setSelectedTimeWindow(dayInfo.timeWindow);
    setSelectedTourId(dayInfo.tourRecommended);
    setIsBookingOpen(true);
  };

  const scrollToCalendar = () => {
    const el = document.getElementById('calendario-inteligente');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050C16] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Fixed Header with Preserved Logo */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenCalendar={scrollToCalendar}
        onOpenAutoAtendimento={() => setIsAutoAtendimentoOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenMyReservations={() => setIsReservationsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Sistema de Breadcrumbs (Migalhas de Pão) para SEO e Navegação em Ponta Negra e Praia do Forte */}
      <Breadcrumbs
        currentSection="Parrachos, Maracajaú e Roteiros 2026"
        onSelectArea={(area) => {
          if (area === 'ponta-negra') {
            handleNavigateSection('pacotes-destaque');
          } else if (area === 'praia-do-forte') {
            handleNavigateSection('passeios-indispensaveis');
          }
        }}
        onOpenTour={handleOpenBooking}
      />

      <main>
        {/* 2. Modern Hero with Mental Triggers */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenCalendar={scrollToCalendar}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* 3. Intelligent Tide Calendar 2026 (Maracajaú & Rio do Fogo) */}
        <TideCalendar
          onSelectDayForBooking={handleSelectDayForBooking}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* 4. Roteiros com Mergulho (Maracajaú e Rio do Fogo em destaque) */}
        <DivingSection
          onBookTour={(tourId) => handleOpenBooking(tourId)}
          onScrollToCalendar={scrollToCalendar}
          tours={tours}
        />

        {/* 4.1 Mapa Interativo dos Roteiros de Maracajaú e Rio do Fogo com Busca Instantânea */}
        <InteractiveToursMap
          onOpenBooking={(tourId) => handleOpenBooking(tourId)}
          onOpenCalendar={scrollToCalendar}
        />

        {/* 5. Carrossel Interativo de Passeios Indispensáveis de Natal RN */}
        <MustSeeToursCarousel
          onSelectTour={(tourId) => handleOpenBooking(tourId)}
          onOpenChat={() => setIsChatOpen(true)}
          tours={tours}
          isLoading={isLoadingTours}
        />

        {/* 6. Pacotes VIP em Destaque com Gatilhos Mentais */}
        <FeaturedPackages
          onSelectTour={(tourId) => handleOpenBooking(tourId)}
          tours={tours}
          isLoading={isLoadingTours}
        />

        {/* 6. Carrossel Automático de Avaliações Reais (Google + TripAdvisor) com Slide */}
        <ReviewsCarouselSection onOpenBooking={(tourId) => handleOpenBooking(tourId)} />

        {/* 6.1 Feed do Instagram Oficial (@natalvipturismo) com Fotos Recentes de Clientes nos Passeios */}
        <InstagramFeedSection onOpenBooking={(tourId) => handleOpenBooking(tourId)} />

        {/* 7. Blog Card: Onde Sair à Noite & Gastronomia com Apontamento para a Natal Vip Turismo */}
        <NightlifeBlogSection
          onSelectSuggestedTour={(tourId) => handleOpenBooking(tourId)}
        />

        {/* 8. Checklist Interativo de Infraestrutura (Vistos, Seguro, Conectividade, Finanças) - Salvo no objeto student */}
        <InfraChecklist
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* 8. Comprehensive Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={scrollToCalendar}
        onOpenAutoAtendimento={() => setIsAutoAtendimentoOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCookies={() => {
          localStorage.removeItem('natal_vip_cookie_consent');
          window.location.reload();
        }}
      />

      {/* Rodapé Fixo de Suporte VIP com Atendimento Marcelo & Autoatendimento Seguro */}
      <FixedSupportFooter
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAutoAtendimento={() => setIsAutoAtendimentoOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Modern Booking Drawer with Intuitive Gateway */}
      <BookingDrawer
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedTourId={selectedTourId}
        preselectedDate={selectedDate}
        preselectedTimeWindow={selectedTimeWindow}
        preselectedTideHeight={selectedTideHeight}
        tours={tours}
      />

      {/* Autoatendimento 24h Modal */}
      <AutoAtendimentoModal
        isOpen={isAutoAtendimentoOpen}
        onClose={() => setIsAutoAtendimentoOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Chatbot Flutuante Natal Vip Turismo (Ponta Negra, botão redondo, azul turquesa & dourado, fluxo guiado e WhatsApp) */}
      <FloatingChatbot
        isOpenControlled={isChatOpen}
        onToggleControlled={setIsChatOpen}
        onOpenBookingModal={handleOpenBooking}
      />

      {/* Sistema de Marketing, Captação de Leads Oculta em Segundo Plano */}
      <FollowUpSystem
        onOpenBookingWithTour={(tourId) => handleOpenBooking(tourId)}
      />

      {/* Banner de Consentimento de Cookies & LGPD para Rastreamento e Marketing */}
      <CookieConsentBanner />

      {/* Modal Minhas Reservas sincronizado com Firebase */}
      <UserReservationsModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Painel Administrativo de Gestão de Passeios VIP (Acesso via URL /admin) */}
      <AdminToursModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onTourUpdated={() => {
          // Revalida tours em tempo real
          window.dispatchEvent(new CustomEvent('natal-vip-tours-updated'));
        }}
      />

      {/* Central de Notificações Push (Alertas de Maré e Novas Vagas) */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenBooking={(tourId) => handleOpenBooking(tourId)}
        onOpenCalendar={scrollToCalendar}
      />

      {/* Floating In-App Toast de Notificações em Tempo Real */}
      <InAppNotificationToast
        onOpenBooking={(tourId) => handleOpenBooking(tourId)}
        onOpenCalendar={scrollToCalendar}
        onOpenNotificationCenter={() => setIsNotificationsOpen(true)}
      />
    </div>
  );
}

export default App;
