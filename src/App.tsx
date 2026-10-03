import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Header } from './components/Header';
import { CvcHeroSection } from './components/CvcHeroSection';
import { OffersShowcase } from './components/OffersShowcase';
import { CoupleVipBanner } from './components/CoupleVipBanner';
import { IncredibleDestinations } from './components/IncredibleDestinations';
import { SocialProofSection } from './components/SocialProofSection';
import { TravelTipsSection } from './components/TravelTipsSection';
import { TideCalendar } from './components/TideCalendar';
import { InteractiveToursMap } from './components/InteractiveToursMap';
import { FaqSection } from './components/FaqSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ComprehensiveFooter } from './components/ComprehensiveFooter';
import { BookingDrawer } from './components/BookingDrawer';
import { AutoAtendimentoModal } from './components/AutoAtendimentoModal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { FollowUpSystem } from './components/FollowUpSystem';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { UserReservationsModal } from './components/UserReservationsModal';
import { AdminToursModal } from './components/AdminToursModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { InAppNotificationToast } from './components/InAppNotificationToast';
import { TourPackage } from './types';
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

  // Monitor real-time tide and vacancy alerts
  useRealTimeTideAndVacancyMonitor(tours);

  // Register Service Worker for Push notifications
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Sync tours from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToTours((allTours) => {
      setTours(allTours);
    });
    return () => unsubscribe();
  }, []);

  // Admin route detection
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

  const handleHeroSearch = (criteria: { tourId: string; date: string; guests: string; category: string }) => {
    if (criteria.tourId) setSelectedTourId(criteria.tourId);
    if (criteria.date) setSelectedDate(criteria.date);
    setIsBookingOpen(true);
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FBBF24] selection:text-[#0A192F]">
      {/* 1. Header Fixo com Logo e Categorias CVC-Style */}
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

      <main>
        {/* 2. Hero Grande com Título Forte e Busca em Linha CVC */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <CvcHeroSection
            onSearch={handleHeroSearch}
            onOpenBooking={handleOpenBooking}
            onOpenCalendar={scrollToCalendar}
          />
        </motion.div>

        {/* 3. Vitrine de Ofertas em Cards Horizontais */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <OffersShowcase
            tours={tours}
            onSelectTour={handleOpenBooking}
            onOpenBooking={handleOpenBooking}
          />
        </motion.div>

        {/* 4. Pacote Casal VIP em Destaque Especial */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <CoupleVipBanner onOpenBooking={handleOpenBooking} />
        </motion.div>

        {/* 5. Conheça Destinos Incríveis */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <IncredibleDestinations
            onSelectDestination={(_name, tourId) => handleOpenBooking(tourId)}
          />
        </motion.div>

        {/* 6. Prova Social (Avaliações Reais, Selo Google/TripAdvisor) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <SocialProofSection onOpenBooking={() => handleOpenBooking()} />
        </motion.div>

        {/* 7. Dicas de Viagem & Conteúdo Útil */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <TravelTipsSection
            onOpenBooking={() => handleOpenBooking()}
            onOpenCalendar={scrollToCalendar}
          />
        </motion.div>

        {/* 7.1 Tábua de Maré Inteligente 2026 Integrada */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <TideCalendar
            onSelectDayForBooking={handleSelectDayForBooking}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        </motion.div>

        {/* 7.2 Mapa Interativo de Roteiros */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <InteractiveToursMap
            onOpenBooking={(tourId) => handleOpenBooking(tourId)}
            onOpenCalendar={scrollToCalendar}
          />
        </motion.div>

        {/* 8. FAQ com Sanfona Interativa */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <FaqSection />
        </motion.div>

        {/* 9. Newsletter com Selo de Desconto VIP */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
        >
          <NewsletterSection />
        </motion.div>
      </main>

      {/* 10. Rodapé Completo */}
      <ComprehensiveFooter
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={scrollToCalendar}
        onOpenMyReservations={() => setIsReservationsOpen(true)}
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

      {/* Banner de Consentimento de Cookies & LGPD */}
      <CookieConsentBanner />

      {/* Modal Minhas Reservas sincronizado com Firebase */}
      <UserReservationsModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Central de Notificações Push & Alertas de Maré */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenBooking={(tourId) => handleOpenBooking(tourId)}
        onOpenCalendar={scrollToCalendar}
      />

      {/* Toast flutuante de novidades e maré baixa em tempo real */}
      <InAppNotificationToast
        onOpenBooking={(tourId?: string) => handleOpenBooking(tourId)}
        onOpenCalendar={scrollToCalendar}
        onOpenNotificationCenter={() => setIsNotificationsOpen(true)}
      />

      {/* Modal Painel Administrativo */}
      {isAdminOpen && (
        <AdminToursModal
          isOpen={isAdminOpen}
          onClose={handleCloseAdmin}
          onTourUpdated={() => {}}
        />
      )}
    </div>
  );
}

export default App;
