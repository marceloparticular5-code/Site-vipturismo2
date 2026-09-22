import React, { useState, useEffect } from 'react';
import {
  auth,
  loginWithGoogleDetailed,
  logoutUser,
  isUserAdmin,
  ADMIN_EMAIL,
  ADMIN_MASTER_PIN,
  verifyAdminPin,
  isRunningInIframe,
  getSavedAdminSession,
  subscribeToTours,
  saveTourToFirestore,
  deleteTourFromFirestore,
  seedDefaultToursToFirestore,
  subscribeAllBookingsForAdmin,
  FirebaseBooking,
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { TourPackage } from '../types';
import { VIP_TOURS } from '../data/toursData';
import {
  Shield,
  ShieldCheck,
  Lock,
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Image as ImageIcon,
  Anchor,
  AlertTriangle,
  Search,
  ListPlus,
  Layers,
  Users,
  Calendar,
  Key,
  ExternalLink,
  Copy,
  Info,
} from 'lucide-react';

interface AdminToursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTourUpdated?: () => void;
}

export const AdminToursModal: React.FC<AdminToursModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isUserAdmin(auth.currentUser));
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'google' | 'pin'>('google');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleErrorCode, setGoogleErrorCode] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  const [tours, setTours] = useState<TourPackage[]>(VIP_TOURS);
  const [bookings, setBookings] = useState<FirebaseBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'tours' | 'editor' | 'bookings'>('tours');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'diving' | 'active'>('all');

  // Tour Form State
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPriceOriginal, setFormPriceOriginal] = useState<number>(250);
  const [formPriceDiscounted, setFormPriceDiscounted] = useState<number>(199);
  const [formDuration, setFormDuration] = useState('Dia inteiro (Aprox. 7h)');
  const [formRating, setFormRating] = useState<number>(4.98);
  const [formReviewsCount, setFormReviewsCount] = useState<number>(1500);
  const [formIncludesDiving, setFormIncludesDiving] = useState(false);
  const [formIsVip, setFormIsVip] = useState(true);
  const [formActive, setFormActive] = useState(true);
  const [formUrgencyText, setFormUrgencyText] = useState('Vagas concorridas para este fim de semana');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [formIncluded, setFormIncluded] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Monitor Auth State & Iframe detection
  useEffect(() => {
    setIsInIframe(isRunningInIframe());
    if (getSavedAdminSession()) {
      setIsAdmin(true);
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(isUserAdmin(user));
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Tours
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToTours((allTours) => {
      setTours(allTours);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Listen to Firestore Bookings for Admin overview
  useEffect(() => {
    if (!isOpen || !isAdmin) return;
    try {
      const unsubscribe = subscribeAllBookingsForAdmin((allBookings) => {
        setBookings(allBookings);
      });
      return () => unsubscribe();
    } catch {
      // ignore
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setGoogleError(null);
    setGoogleErrorCode(null);
    try {
      const result = await loginWithGoogleDetailed();
      if (result.user) {
        setCurrentUser(result.user);
        setIsAdmin(isUserAdmin(result.user));
      } else if (result.error) {
        setGoogleError(result.error);
        setGoogleErrorCode(result.errorCode || null);
      }
    } catch (err: any) {
      setGoogleError(err?.message || 'Falha ao autenticar com o Google.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!adminPin.trim()) {
      setPinError('Digite o código de acesso de administrador.');
      return;
    }
    const valid = verifyAdminPin(adminPin);
    if (valid) {
      setIsAdmin(true);
      setPinError('');
    } else {
      setPinError('Código de segurança incorreto. Dica: use VIP2026.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIsAdmin(false);
    setAdminPin('');
    setPinError('');
    setGoogleError(null);
    setGoogleErrorCode(null);
  };

  const handleOpenNewTour = () => {
    setEditingTourId(null);
    const newSlug = `passeio-vip-${Date.now().toString().slice(-4)}`;
    setFormId(newSlug);
    setFormTitle('');
    setFormSubtitle('Experiência exclusiva pelo litoral potiguar com todo o conforto VIP');
    setFormBadge('Lançamento VIP');
    setFormLocation('Natal e Litoral / RN');
    setFormPriceOriginal(250);
    setFormPriceDiscounted(199);
    setFormDuration('Dia inteiro (Aprox. 7h)');
    setFormRating(5.0);
    setFormReviewsCount(120);
    setFormIncludesDiving(false);
    setFormIsVip(true);
    setFormActive(true);
    setFormUrgencyText('Poucas vagas disponíveis para este período');
    setFormDescription('Viva momentos inesquecíveis com transporte com ar-condicionado, guias credenciados Cadastur e atendimento de excelência.');
    setFormImageUrl('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80');
    setFormHighlights([
      'Transporte executivo com ar-condicionado direto no hotel',
      'Paradas fotográficas nos melhores mirantes',
      'Acompanhamento de guia especializado credenciado Cadastur',
    ]);
    setFormIncluded([
      'Transfer ida e volta hotel/ponto de partida',
      'Seguro passageiro integral',
      'Apoio náutico e de bordo especializado',
    ]);
    setActiveTab('editor');
  };

  const handleEditTour = (tour: TourPackage) => {
    setEditingTourId(tour.id);
    setFormId(tour.id);
    setFormTitle(tour.title);
    setFormSubtitle(tour.subtitle || '');
    setFormBadge(tour.badge || '');
    setFormLocation(tour.location || '');
    setFormPriceOriginal(tour.priceOriginal || tour.priceDiscounted + 50);
    setFormPriceDiscounted(tour.priceDiscounted);
    setFormDuration(tour.duration || 'Dia inteiro');
    setFormRating(tour.rating || 4.9);
    setFormReviewsCount(tour.reviewsCount || 100);
    setFormIncludesDiving(Boolean(tour.includesDiving));
    setFormIsVip(Boolean(tour.isVip));
    setFormActive(tour.active !== false);
    setFormUrgencyText(tour.urgencyText || '');
    setFormDescription(tour.description || '');
    setFormImageUrl(tour.imageUrl || '');
    setFormHighlights(tour.highlights || []);
    setFormIncluded(tour.included || []);
    setActiveTab('editor');
  };

  const handleToggleActive = async (tour: TourPackage) => {
    try {
      const updatedTour: TourPackage = {
        ...tour,
        active: tour.active === false ? true : false,
      };
      await saveTourToFirestore(updatedTour);
    } catch (err) {
      console.error('Erro ao alternar status do passeio:', err);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    try {
      await deleteTourFromFirestore(tourId);
      setDeleteConfirmId(null);
      setTours((prev) => prev.filter((t) => t.id !== tourId));
    } catch (err) {
      console.error('Erro ao excluir passeio:', err);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Deseja sincronizar e restaurar os 6 passeios oficiais da agência para o banco de dados Firestore?')) return;
    setIsSeeding(true);
    try {
      await seedDefaultToursToFirestore(VIP_TOURS);
      setSaveSuccessMsg('Passeios padrão sincronizados no Firestore com sucesso!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Erro ao sincronizar passeios padrão:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormHighlights((prev) => [...prev, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddIncluded = () => {
    if (includedInput.trim()) {
      setFormIncluded((prev) => [...prev, includedInput.trim()]);
      setIncludedInput('');
    }
  };

  const handleRemoveIncluded = (idx: number) => {
    setFormIncluded((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImageUrl.trim() || !formDescription.trim()) {
      alert('Por favor, preencha o Título, Imagem e Descrição do passeio.');
      return;
    }

    setIsSaving(true);
    try {
      const tourToSave: TourPackage = {
        id: formId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        badge: formBadge.trim(),
        location: formLocation.trim(),
        priceOriginal: Number(formPriceOriginal) || 0,
        priceDiscounted: Number(formPriceDiscounted) || 0,
        duration: formDuration.trim(),
        rating: Number(formRating) || 5.0,
        reviewsCount: Number(formReviewsCount) || 1,
        includesDiving: formIncludesDiving,
        isVip: formIsVip,
        active: formActive,
        urgencyText: formUrgencyText.trim(),
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        highlights: formHighlights,
        included: formIncluded,
        updatedAt: new Date().toISOString(),
      };

      await saveTourToFirestore(tourToSave);
      setSaveSuccessMsg(`Passeio "${tourToSave.title}" salvo com sucesso no Firestore!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      setActiveTab('tours');
    } catch (err) {
      console.error('Erro ao salvar passeio:', err);
      alert('Houve um erro ao gravar no Firestore. Verifique suas credenciais de administrador.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered tours for list view
  const displayTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory === 'diving') return tour.includesDiving;
    if (filterCategory === 'active') return tour.active !== false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#091527] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#0C1C35] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-slate-900 p-1 flex items-center justify-center shrink-0">
              <img
                src="/imagens/logovip.jpg"
                alt="Natal VIP Turismo"
                className="w-full h-full rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Painel de Controle
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Admin VIP
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Cinzel',serif]">
                Gestão de Passeios & Roteiros
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold truncate max-w-[200px]">
                  {currentUser?.email || ADMIN_EMAIL}
                </span>
              </div>
            )}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 text-xs font-medium transition-all"
                title="Sair da conta de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. AUTHENTICATION SCREENS (Google or Admin PIN) */}
          {!isAdmin ? (
            currentUser && !isUserAdmin(currentUser) ? (
              /* Logged in with Google, but not the authorized Admin email */
              <div className="max-w-md mx-auto py-10 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Acesso Não Autorizado
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Você está conectado como <strong className="text-white">{currentUser.email}</strong>. Esta conta não possui privilégios de administrador da agência.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  O acesso a este painel é restrito ao e-mail:
                  <div className="font-bold text-amber-300 mt-1 text-sm">{ADMIN_EMAIL}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                  >
                    Trocar de Conta Google
                  </button>
                  <button
                    onClick={() => {
                      setAuthMethod('pin');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                  >
                    Entrar com Chave Admin
                  </button>
                </div>
              </div>
            ) : (
              /* Main Admin Login Screen with Tabs */
              <div className="max-w-lg mx-auto py-4 sm:py-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center p-3 shadow-inner">
                    <Shield className="w-8 h-8 text-amber-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 font-['Cinzel',serif]">
                      Painel Administrativo VIP
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Gestão de pacotes, valores promocionais, fotos e reservas em tempo real.
                    </p>
                  </div>
                </div>

                {/* Iframe Notice & New Tab Button */}
                {isInIframe && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2 text-left">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="block text-amber-300 font-semibold">
                          Por que a janela do Google abriu e fechou?
                        </strong>
                        <p className="text-amber-200/90 leading-relaxed text-[11px]">
                          O navegador bloqueia a troca de cookies de login dentro de janelas incorporadas (iFrames do preview). Você pode entrar rapidamente usando a <strong>Chave de Acesso Admin</strong> logo abaixo ou abrindo o site em uma nova aba.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1 pl-6">
                      <a
                        href={window.location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shadow-sm"
                      >
                        <span>Abrir Site em Nova Aba</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMethod('pin');
                          setAdminPin(ADMIN_MASTER_PIN);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 font-semibold text-[11px] hover:bg-slate-800 transition-colors"
                      >
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>Entrar Imediato com Chave VIP</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tabs Selector: Google vs Master PIN */}
                <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('google');
                      setGoogleError(null);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMethod === 'google'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Conta Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('pin');
                      setPinError('');
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMethod === 'pin'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>Chave Admin (Direto)</span>
                  </button>
                </div>

                {/* METHOD 1: GOOGLE LOGIN */}
                {authMethod === 'google' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>E-mail credenciado: <strong className="text-amber-300">{ADMIN_EMAIL}</strong></span>
                    </div>

                    {/* Google Error Box */}
                    {googleError && (
                      <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 space-y-2 text-left animate-fadeIn">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong className="block text-rose-300 font-semibold mb-1">
                              Informação sobre o Login Google:
                            </strong>
                            {googleError}
                          </div>
                        </div>

                        {googleErrorCode === 'auth/unauthorized-domain' && (
                          <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-rose-900/60 space-y-2">
                            <div className="text-[11px] text-slate-300">
                              Domínio detectado desta janela:
                            </div>
                            <div className="flex items-center justify-between gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
                              <span className="truncate">{window.location.hostname}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(window.location.hostname);
                                  setCopiedDomain(true);
                                  setTimeout(() => setCopiedDomain(false), 2000);
                                }}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0"
                              >
                                {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedDomain ? 'Copiado' : 'Copiar'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex flex-wrap gap-2">
                          <a
                            href={window.location.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-400/40 text-rose-200 hover:text-white font-semibold text-[11px] flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir em Nova Aba</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMethod('pin');
                              setAdminPin(ADMIN_MASTER_PIN);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300"
                          >
                            Usar Chave Direta VIP2026
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(245,158,11,0.35)] disabled:opacity-50 cursor-pointer"
                    >
                      {authLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Aguardando Conta Google...
                        </span>
                      ) : (
                        <>
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Entrar com Conta Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* METHOD 2: MASTER PIN / ACCESS KEY (Direct & 100% Reliable) */}
                {authMethod === 'pin' && (
                  <form onSubmit={handlePinLogin} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Acesso Instantâneo Sem Depender de Pop-up</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ideal para gerenciar a agência mesmo em janelas embutidas ou navegadores com bloqueadores ativados.
                      </p>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Código de Segurança / Chave Master
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="password"
                          value={adminPin}
                          onChange={(e) => {
                            setAdminPin(e.target.value);
                            if (pinError) setPinError('');
                          }}
                          placeholder="Digite a chave..."
                          autoFocus
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors uppercase font-mono tracking-widest"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                        <span>Chave mestre da agência:</span>
                        <button
                          type="button"
                          onClick={() => setAdminPin(ADMIN_MASTER_PIN)}
                          className="text-amber-400 hover:text-amber-300 font-mono font-bold underline cursor-pointer"
                        >
                          Preencher VIP2026
                        </button>
                      </div>
                    </div>

                    {pinError && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{pinError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Liberar Acesso Administrativo</span>
                    </button>
                  </form>
                )}
              </div>
            )
          ) : (
            /* 2. AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">

              {/* Success Notification Alert */}
              {saveSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between shadow-lg animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                  <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-400 hover:text-emerald-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Admin Navigation Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setActiveTab('tours')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === 'tours'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Passeios Cadastrados ({tours.length})</span>
                  </button>

                  <button
                    onClick={handleOpenNewTour}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === 'editor' && !editingTourId
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Passeio</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === 'bookings'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reservas ({bookings.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSeedDefaults}
                    disabled={isSeeding}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                    title="Carregar passeios oficiais para o Firestore"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>Sincronizar Padrão</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: LIST OF TOURS */}
              {activeTab === 'tours' && (
                <div className="space-y-6">
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou local..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                      <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          filterCategory === 'all'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Todos ({tours.length})
                      </button>
                      <button
                        onClick={() => setFilterCategory('diving')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          filterCategory === 'diving'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Com Mergulho ({tours.filter((t) => t.includesDiving).length})
                      </button>
                      <button
                        onClick={() => setFilterCategory('active')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          filterCategory === 'active'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Ativos no Site ({tours.filter((t) => t.active !== false).length})
                      </button>
                    </div>
                  </div>

                  {/* Tours Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayTours.map((tour) => {
                      const isCurrentlyActive = tour.active !== false;
                      return (
                        <div
                          key={tour.id}
                          className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-[#0A1628] ${
                            isCurrentlyActive
                              ? 'border-slate-800 hover:border-amber-500/40 shadow-lg'
                              : 'border-slate-800/60 opacity-60'
                          }`}
                        >
                          {/* Image Preview & Badges */}
                          <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                            <img
                              src={tour.imageUrl}
                              alt={tour.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-black/40" />

                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              {tour.badge && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wide">
                                  {tour.badge}
                                </span>
                              )}
                              {tour.includesDiving && (
                                <span className="px-2 py-0.5 rounded-md bg-sky-500/90 text-white font-bold text-[10px] flex items-center gap-1">
                                  <Anchor className="w-3 h-3" />
                                  Mergulho
                                </span>
                              )}
                            </div>

                            <div className="absolute top-3 right-3">
                              <button
                                onClick={() => handleToggleActive(tour)}
                                className={`p-1.5 rounded-lg backdrop-blur-md border text-xs font-semibold flex items-center gap-1 ${
                                  isCurrentlyActive
                                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                                    : 'bg-slate-900/80 border-slate-700 text-slate-400'
                                }`}
                                title={isCurrentlyActive ? 'Passeio visível no site' : 'Passeio oculto no site'}
                              >
                                {isCurrentlyActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span className="truncate max-w-[170px]">{tour.location}</span>
                              </span>
                              <span className="flex items-center gap-1 text-amber-300 font-bold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {tour.rating} ({tour.reviewsCount})
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="text-[10px] text-slate-400 font-mono mb-1">
                                ID: {tour.id}
                              </div>
                              <h4 className="text-base font-bold text-white line-clamp-1">
                                {tour.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                                {tour.subtitle || tour.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 line-through block">
                                  R$ {tour.priceOriginal.toFixed(2)}
                                </span>
                                <span className="text-lg font-black text-amber-400">
                                  R$ {tour.priceDiscounted.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleEditTour(tour)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Editar</span>
                                </button>

                                {deleteConfirmId === tour.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDeleteTour(tour.id)}
                                      className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-xs font-bold"
                                      title="Confirmar exclusão"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(tour.id)}
                                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                                    title="Excluir passeio"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {displayTours.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      Nenhum passeio encontrado para a busca especificada.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TOUR EDITOR / NEW TOUR FORM */}
              {activeTab === 'editor' && (
                <form onSubmit={handleSaveTour} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {editingTourId ? 'Atualização de Roteiro' : 'Cadastro de Novo Roteiro'}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {editingTourId ? `Editar: ${formTitle || editingTourId}` : 'Criar Novo Passeio VIP'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tours')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                    >
                      Voltar à Lista
                    </button>
                  </div>

                  {/* Grid of basic fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Slug / ID */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Slug Identificador (ID único) *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={Boolean(editingTourId)}
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        placeholder="ex: parrachos-vip"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 disabled:opacity-50"
                      />
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Título do Passeio *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="ex: Parrachos de Maracajaú VIP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Subtítulo / Chamada Rápida
                      </label>
                      <input
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="ex: O autêntico Caribe Brasileiro com embarque exclusivo em lancha rápida"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Selo Promocional
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="ex: Mais Desejado de Natal"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Localização / Região
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="ex: Maxaranguape / Maracajaú (Litoral Norte)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Preço Original */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Preço Original (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formPriceOriginal}
                        onChange={(e) => setFormPriceOriginal(parseFloat(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Preço Promocional */}
                    <div>
                      <label className="text-xs font-bold text-amber-300 block mb-1">
                        Preço Promocional (R$) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formPriceDiscounted}
                        onChange={(e) => setFormPriceDiscounted(parseFloat(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Duração Estimada
                      </label>
                      <input
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="ex: Dia inteiro (Aprox. 7h)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nota de Avaliação (1 a 5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.01"
                        value={formRating}
                        onChange={(e) => setFormRating(parseFloat(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Reviews count */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Quantidade de Avaliações
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formReviewsCount}
                        onChange={(e) => setFormReviewsCount(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={formActive}
                        onChange={(e) => setFormActive(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-400 accent-amber-400"
                      />
                      <span>Passeio Ativo (visível para clientes no site)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={formIncludesDiving}
                        onChange={(e) => setFormIncludesDiving(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-400 accent-sky-400"
                      />
                      <span>Inclui Mergulho nos Parrachos</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={formIsVip}
                        onChange={(e) => setFormIsVip(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-400 accent-amber-400"
                      />
                      <span>Passeio com Selo VIP Exclusivo</span>
                    </label>
                  </div>

                  {/* Urgency text */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Aviso de Vagas / Maré Baixa
                    </label>
                    <input
                      type="text"
                      value={formUrgencyText}
                      onChange={(e) => setFormUrgencyText(e.target.value)}
                      placeholder="ex: Últimas 5 vagas para a maré baixa desta semana"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Image URL with visual preview */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      URL da Imagem de Capa *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="url"
                        required
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                      {formImageUrl && (
                        <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                          <img
                            src={formImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Descrição Detalhada do Passeio *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Descreva a experiência, atrações, roteiro de navegação e paradas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Destaques do Roteiro (Highlights)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                        placeholder="Adicione um destaque e clique em Adicionar..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30"
                      >
                        + Adicionar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formHighlights.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                        >
                          <Check className="w-3 h-3 text-amber-400" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-slate-500 hover:text-rose-400 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Included list */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      O que está Incluso
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncluded())}
                        placeholder="Ex: Transfer com ar-condicionado hotel ida e volta..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddIncluded}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30"
                      >
                        + Adicionar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formIncluded.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIncluded(idx)}
                            className="text-slate-500 hover:text-rose-400 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('tours')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Gravando no Firestore...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Salvar Alterações no Firestore
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: BOOKINGS OVERVIEW */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Reservas e Vouchers Registrados no Firestore ({bookings.length})</span>
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0A1628]">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Voucher</th>
                          <th className="p-3.5">Passageiro</th>
                          <th className="p-3.5">Passeio</th>
                          <th className="p-3.5">Data / Horário</th>
                          <th className="p-3.5">Valor</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {bookings.map((booking) => (
                          <tr key={booking.id || booking.voucherCode} className="hover:bg-slate-900/40">
                            <td className="p-3.5 font-mono font-bold text-amber-300">
                              {booking.voucherCode}
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white">{booking.passengerName || 'Turista'}</div>
                              <div className="text-[10px] text-slate-400">{booking.passengerPhone}</div>
                            </td>
                            <td className="p-3.5 font-medium text-slate-200">
                              {booking.tourName}
                            </td>
                            <td className="p-3.5">
                              <div>{booking.date}</div>
                              <div className="text-[10px] text-slate-400">{booking.timeWindow}</div>
                            </td>
                            <td className="p-3.5 font-bold text-emerald-400">
                              R$ {booking.totalAmount.toFixed(2)}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {bookings.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Nenhuma reserva cadastrada no momento. Quando os clientes finalizarem pagamentos no site, elas aparecerão aqui em tempo real.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
