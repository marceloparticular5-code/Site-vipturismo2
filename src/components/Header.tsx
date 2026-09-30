import React, { useState, useEffect } from 'react';
import { NatalVipLogo } from './NatalVipLogo';
import {
  Calendar,
  Compass,
  Headphones,
  Phone,
  Menu,
  X,
  ShieldCheck,
  Flame,
  User,
  Ticket,
  LogOut,
  LogIn,
  Shield,
  Bell,
  Sparkles,
  Luggage,
  MapPin,
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, isUserAdmin } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
  onOpenAutoAtendimento: () => void;
  onOpenChat: () => void;
  onOpenMyReservations: () => void;
  onOpenNotifications: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenAutoAtendimento,
  onOpenChat,
  onOpenMyReservations,
  onOpenNotifications,
  onNavigateSection,
  onOpenAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top micro bar with mental trigger & emergency contact */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0C1A30] to-slate-950 border-b border-amber-500/20 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
              Alta Procura de Maré 0.0 - 0.2
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Empresa Nº 1 em Satisfação em Natal/RN · Cadastur Regular
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium ml-auto">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              Central: (84) 98188-2828
            </span>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenChat}
              className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Atendimento Online (Chatbot 24h)
            </button>
          </div>
        </div>
      </div>

      {/* Main Fixed Header */}
      <header
        id="main-fixed-header"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#070E1A]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] border-b border-amber-500/25 py-2.5'
            : 'bg-[#070E1A]/85 backdrop-blur-sm border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Preserved Logo */}
          <button
            onClick={() => onNavigateSection('hero')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg group"
            title="Natal Vip Turismo - Página Inicial"
          >
            <NatalVipLogo size={scrolled ? 48 : 60} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => onNavigateSection('passeios-indispensaveis')}
              className="text-amber-300 hover:text-white font-bold transition-colors flex items-center gap-1.5 py-1"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Indispensáveis</span>
            </button>

            <button
              onClick={() => onNavigateSection('pacotes-vip')}
              className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              Pacotes VIP
            </button>

            <button
              onClick={onOpenCalendar}
              className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1 group"
            >
              <Calendar className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Tábua de Maré Inteligente</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                2026
              </span>
            </button>

            <button
              onClick={() => onNavigateSection('roteiros-mergulho')}
              className="text-slate-200 hover:text-amber-300 transition-colors py-1"
            >
              Maracajaú & Rio do Fogo
            </button>

            <button
              onClick={() => onNavigateSection('mapa-interativo')}
              className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Mapa de Roteiros</span>
            </button>

            <button
              onClick={() => onNavigateSection('blog-noite')}
              className="text-slate-200 hover:text-amber-300 transition-colors py-1"
            >
              Dicas & Noite em Natal
            </button>

            <button
              onClick={() => onNavigateSection('infra-checklist')}
              className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <Luggage className="w-4 h-4 text-amber-400" />
              <span>Checklist Viagem</span>
            </button>

            <button
              onClick={onOpenAutoAtendimento}
              className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <Headphones className="w-4 h-4 text-sky-400" />
              Autoatendimento
            </button>

            <button
              id="header-marcelo-btn"
              onClick={onOpenChat}
              className="text-amber-200 hover:text-white transition-all flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 hover:border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] text-xs font-semibold cursor-pointer group"
              title="Falar com Marcelo (Consultor VIP)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Consultor Marcelo</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* User Reservations / Auth button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Usuário'}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-300" />
                )}
                <button
                  onClick={onOpenMyReservations}
                  className="font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1"
                  title="Ver meus vouchers e reservas VIP"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Minhas Reservas</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                title="Entrar com Google para sincronizar suas reservas"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Entrar</span>
              </button>
            )}

            {/* Notifications Bell CTA */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-all flex items-center justify-center group cursor-pointer"
              title="Alertas de Vagas & Marés em Tempo Real"
            >
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-950" />
            </button>

            {/* Direct Booking Drawer CTA */}
            <button
              id="header-reserve-btn"
              onClick={() => onOpenBooking()}
              className="relative px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 uppercase tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-amber-200"
            >
              Reservar Agora
            </button>

            {/* Admin Quick Access Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2 rounded-xl text-xs font-medium bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-amber-300 hover:border-amber-400/40 transition-all flex items-center justify-center"
                title="Painel de Controle Admin"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>

          {/* Mobile menu hamburger & quick buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="header-mobile-notifications-btn"
              onClick={onOpenNotifications}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 relative"
              title="Alertas & Notificações"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute 1 top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            </button>
            <button
              id="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-400"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#070E1A] px-4 pt-3 pb-6 space-y-3 mt-2">
            <button
              onClick={() => {
                onOpenNotifications();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Alertas de Marés & Novas Vagas (Push)</span>
            </button>
            <button
              onClick={() => {
                onNavigateSection('passeios-indispensaveis');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-amber-300 font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Passeios Indispensáveis
            </button>

            <button
              onClick={() => {
                onNavigateSection('pacotes-vip');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              Pacotes VIP em Destaque
            </button>

            <button
              onClick={() => {
                onOpenCalendar();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              Tábua de Maré Inteligente 2026
            </button>

            <button
              onClick={() => {
                onNavigateSection('roteiros-mergulho');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Roteiros com Mergulho (Maracajaú & Rio do Fogo)
            </button>

            <button
              onClick={() => {
                onNavigateSection('mapa-interativo');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Mapa Interativo (Maracajaú & Rio do Fogo)</span>
            </button>

            <button
              onClick={() => {
                onNavigateSection('blog-noite');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Blog: Dicas Noturnas & Gastronomia
            </button>

            <button
              onClick={() => {
                onNavigateSection('infra-checklist');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2"
            >
              <Luggage className="w-4 h-4 text-amber-400" />
              <span>Checklist de Infraestrutura (Vistos, Seguro, etc.)</span>
            </button>

            <button
              id="mobile-nav-marcelo-btn"
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/50 text-amber-300 font-bold flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>Falar com Consultor Marcelo</span>
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Online
              </span>
            </button>

            <button
              onClick={() => {
                onOpenAutoAtendimento();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-sky-400" />
              Autoatendimento & Consultar Reserva
            </button>

            <button
              onClick={() => {
                onOpenMyReservations();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-amber-300 font-semibold flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              Minhas Reservas VIP
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-amber-400 font-semibold flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Painel Administrativo VIP
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="font-semibold truncate max-w-[160px]">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  loginWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                Entrar com Google
              </button>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl font-bold text-center text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 uppercase tracking-wider text-sm shadow-md"
              >
                Reservar Passeio VIP
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
