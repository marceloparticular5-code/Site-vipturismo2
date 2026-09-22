import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TideCalendar } from './components/TideCalendar';
import { DivingSection } from './components/DivingSection';
import { FeaturedPackages } from './components/FeaturedPackages';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NightlifeBlogSection } from './components/NightlifeBlogSection';
import { BookingDrawer } from './components/BookingDrawer';
import { AutoAtendimentoModal } from './components/AutoAtendimentoModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { FollowUpSystem } from './components/FollowUpSystem';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { UserReservationsModal } from './components/UserReservationsModal';
import { AdminToursModal } from './components/AdminToursModal';
import { Footer } from './components/Footer';
import { Sparkles, MessageCircle, Users } from 'lucide-react';
import { TourPackage } from './types';
import { VIP_TOURS } from './data/toursData';
import { subscribeToTours } from './lib/firebase';
import { getInitialBookingDate } from './lib/dateUtils';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string>('maracajau-vip');
  const [selectedDate, setSelectedDate] = useState<string>(() => getInitialBookingDate());
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('08:30 às 10:00');
  const [selectedTideHeight, setSelectedTideHeight] = useState<number>(0.2);

  const [isAutoAtendimentoOpen, setIsAutoAtendimentoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [tours, setTours] = useState<TourPackage[]>(VIP_TOURS);

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
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* 2. Modern Hero with Mental Triggers */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenCalendar={scrollToCalendar}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* 3. Intelligent Tide Calendar 2026 (Maracajaú & Rio do Fogo) */}
        <TideCalendar onSelectDayForBooking={handleSelectDayForBooking} />

        {/* 4. Roteiros com Mergulho (Maracajaú e Rio do Fogo em destaque) */}
        <DivingSection
          onBookTour={(tourId) => handleOpenBooking(tourId)}
          onScrollToCalendar={scrollToCalendar}
          tours={tours}
        />

        {/* 5. Pacotes VIP em Destaque com Gatilhos Mentais */}
        <FeaturedPackages
          onSelectTour={(tourId) => handleOpenBooking(tourId)}
          tours={tours}
        />

        {/* 6. Depoimentos de Clientes VIP (Avaliações Reais com Fotos e Estrelas) */}
        <TestimonialsSection onOpenBooking={() => handleOpenBooking()} />

        {/* 7. Blog Card: Onde Sair à Noite & Gastronomia com Apontamento para a Natal Vip Turismo */}
        <NightlifeBlogSection
          onSelectSuggestedTour={(tourId) => handleOpenBooking(tourId)}
        />
      </main>

      {/* 8. Comprehensive Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={scrollToCalendar}
        onOpenAutoAtendimento={() => setIsAutoAtendimentoOpen(true)}
        onOpenCrm={() => setIsCrmOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCookies={() => {
          localStorage.removeItem('natal_vip_cookie_consent');
          window.location.reload();
        }}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {/* CRM Marketing / Follow-up Agency Quick Button */}
        <button
          onClick={() => setIsCrmOpen(true)}
          className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          title="Central de Leads & Follow-up de Marketing"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* WhatsApp VIP Quick Direct */}
        <a
          href="https://wa.me/5584988256545?text=Ol%C3%A1%20Natal%20Vip%20Turismo!%20Gostaria%20de%20consultar%20a%20t%C3%A1bua%20de%20mar%C3%A9%20e%20fazer%20uma%20reserva."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          title="WhatsApp VIP (84) 98825-6545"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>

        {/* Gemini AI Bot Floating Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-[0_4px_25px_rgba(245,158,11,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group cursor-pointer border border-amber-200"
          title="Abrir Chatbot Gemini"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050C16] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050C16]" />
          <Sparkles className="w-6 h-6 text-slate-950" />
        </button>
      </div>

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

      {/* Gemini AI Concierge Window */}
      <GeminiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={scrollToCalendar}
      />

      {/* Sistema de Marketing, Captação de Leads & Follow-up CRM */}
      <FollowUpSystem
        onOpenBookingWithTour={(tourId) => handleOpenBooking(tourId)}
        isCrmOpen={isCrmOpen}
        setIsCrmOpen={setIsCrmOpen}
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
      />
    </div>
  );
}

export default App;
