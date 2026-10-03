import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Compass,
  Phone,
  Menu,
  X,
  ShieldCheck,
  Ticket,
  LogOut,
  User,
  Shield,
  Tag,
  Car,
  Heart,
  ChevronDown,
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

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Micro-Bar: Cadastur, Localização & Contato */}
      <div className="bg-[#08252B] border-b border-[#165662]/50 text-xs py-1.5 px-4 text-[#F6EBDD]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#FFC857] font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cadastur: 39.456.551/0001-08 · Agência Regular Oficial</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-[11px] text-slate-300">
              Ponta Negra, Natal - RN · Saídas diárias com transfer incluso
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium ml-auto">
            <a
              href="https://wa.me/5584988722044"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFC857] hover:text-[#F28C28] transition-colors flex items-center gap-1 font-bold"
            >
              <Phone className="w-3 h-3 text-[#F28C28]" />
              <span>(84) 98872-2044</span>
            </a>

            {/* Admin Access Indicator if Admin */}
            {isUserAdmin(currentUser) && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-2 py-0.5 rounded-md bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28] hover:bg-[#F28C28] hover:text-white transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3" />
                <span>Painel Admin VIP</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar (CVC Structure with Boutique Aesthetics) */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0E3B43]/95 backdrop-blur-md shadow-xl border-b border-[#165662]'
            : 'bg-[#0E3B43] border-b border-[#165662]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo à Esquerda */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-[#FFC857]/80 bg-slate-950 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/imagens/logovip.jpg"
                alt="Natal VIP Turismo"
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-white tracking-wide block font-['Playfair_Display',serif]">
                NATAL <span className="text-[#FFC857]">VIP</span>
              </span>
              <span className="text-[10px] font-bold text-[#F6EBDD]/80 tracking-widest uppercase block -mt-1">
                Turismo Boutique · RN
              </span>
            </div>
          </div>

          {/* Menu Horizontal de Categorias (CVC-Style) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-white">
            <button
              onClick={() => handleNavClick('ofertas-vitrine')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              Passeios
            </button>
            <button
              onClick={() => handleNavClick('pacote-casal-vip')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Pacotes Casal</span>
            </button>
            <button
              onClick={() => onOpenBooking('transfer-vip-aeroporto')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              <Car className="w-3.5 h-3.5 text-cyan-300" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => handleNavClick('destinos-incriveis')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              Destinos
            </button>
            <button
              onClick={() => handleNavClick('promocoes')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              <Tag className="w-3.5 h-3.5 text-[#FFC857]" />
              <span>Promoções</span>
            </button>
            <button
              onClick={() => handleNavClick('dicas-viagem')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              Dicas & Maré
            </button>
            <button
              onClick={() => handleNavClick('contato')}
              className="hover:text-[#FFC857] transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFC857] hover:after:w-full after:transition-all"
            >
              Contato
            </button>
          </nav>

          {/* Botões à Direita: Minhas Reservas + Atendimento */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão "Minhas Reservas" (Estilo CVC) */}
            <button
              type="button"
              onClick={onOpenMyReservations}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Acessar histórico de vouchers e reservas"
            >
              <Ticket className="w-4 h-4 text-[#FFC857]" />
              <span className="hidden sm:inline">Minhas Reservas</span>
            </button>

            {/* CTA WhatsApp / Reserva Rápida */}
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#E07B17] hover:from-[#E07B17] hover:to-[#D46E0D] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Monte Seu Roteiro</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:text-[#FFC857] transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#08252B] border-t border-[#165662] px-4 py-5 space-y-3 text-white text-sm animate-fadeIn">
            <button
              onClick={() => handleNavClick('ofertas-vitrine')}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Passeios em Destaque</span>
              <span>→</span>
            </button>
            <button
              onClick={() => handleNavClick('pacote-casal-vip')}
              className="w-full text-left py-2 font-bold text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Pacote Casal VIP (4 Dias + Transfer)</span>
              <span>❤️</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking('transfer-vip-aeroporto');
              }}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Transfer VIP Aeroporto</span>
              <span>🚐</span>
            </button>
            <button
              onClick={() => handleNavClick('destinos-incriveis')}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Destinos Incríveis no RN</span>
              <span>→</span>
            </button>
            <button
              onClick={() => handleNavClick('promocoes')}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Promoções & Descontos</span>
              <span>🏷️</span>
            </button>
            <button
              onClick={() => handleNavClick('dicas-viagem')}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] border-b border-[#165662]/50 flex items-center justify-between"
            >
              <span>Dicas de Viagem & Tábua de Marés</span>
              <span>🌊</span>
            </button>
            <button
              onClick={() => handleNavClick('contato')}
              className="w-full text-left py-2 font-bold hover:text-[#FFC857] flex items-center justify-between"
            >
              <span>Fale com o Consultor VIP</span>
              <span>💬</span>
            </button>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyReservations();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-[#FFC857]" />
                <span>Acessar Minhas Reservas</span>
              </button>
              <a
                href="https://wa.me/5584988722044"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: (84) 98872-2044</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
