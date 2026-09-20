import React, { useState, useEffect } from 'react';
import { CookiePreferences } from '../types';
import { ShieldCheck, Cookie, Settings, Check, X, ArrowRight, Lock, Eye } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPreferences?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: true,
    hasChosen: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('natal_vip_cookie_consent');
      if (!saved) {
        // Show after a brief delay for smoother UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const updated = {
      ...prefs,
      acceptedAt: new Date().toISOString(),
      hasChosen: true,
    };
    setPreferences(updated);
    try {
      localStorage.setItem('natal_vip_cookie_consent', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsVisible(false);
    setShowDetails(false);

    // Track simulated marketing tags
    if (prefs.marketing) {
      // Simulate Meta Pixel / Google Ads Consent granted
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        window.dataLayer.push({
          event: 'cookie_consent_marketing_granted',
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      hasChosen: true,
    });
  };

  const handleAcceptEssentialOnly = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      hasChosen: true,
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      ...preferences,
      hasChosen: true,
    });
  };

  return (
    <>
      {/* Floating Re-Open Button when banner is closed */}
      {!isVisible && preferences.hasChosen && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 z-40 p-2.5 rounded-full bg-[#081324]/90 border border-amber-400/30 text-amber-300 hover:text-amber-200 hover:bg-[#0c1c36] shadow-lg backdrop-blur-md text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 group"
          title="Configurações de Cookies e Privacidade"
        >
          <Cookie className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-[11px] font-medium text-slate-300">Privacidade & Cookies</span>
        </button>
      )}

      {/* Main Cookie Banner */}
      {isVisible && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="w-full max-w-4xl bg-[#091527]/95 backdrop-blur-xl border border-amber-400/30 rounded-2xl shadow-2xl p-4 sm:p-6 pointer-events-auto text-slate-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Privacidade, Cookies & Ofertas Personalizadas
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                      LGPD 100%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    Utilizamos cookies para assegurar o funcionamento das reservas da{' '}
                    <strong className="text-amber-300">Natal Vip Turismo</strong>, calcular a melhor tábua de maré e personalizar ofertas exclusivas de passeios. Você pode personalizar suas preferências a qualquer momento.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showDetails ? 'Ocultar' : 'Preferências'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAcceptEssentialOnly}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Apenas Essenciais
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 text-xs font-black hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Aceitar Todos</span>
                </button>
              </div>
            </div>

            {/* Expandable Preferences Modal / Drawer */}
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Category 1: Essential */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" /> Essenciais
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Sempre Ativo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Necessários para o carrinho de reservas, cálculo de datas da tábua de maré e segurança antifraude.
                      </p>
                    </div>
                  </div>

                  {/* Category 2: Analytics */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> Analíticos
                        </span>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) =>
                            setPreferences({ ...preferences, analytics: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-700 focus:ring-amber-400"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Ajudam a entender quais passeios e horários de maré são mais procurados para melhorar a navegação.
                      </p>
                    </div>
                  </div>

                  {/* Category 3: Marketing & Retargeting */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Marketing & VIP
                        </span>
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) =>
                            setPreferences({ ...preferences, marketing: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-700 focus:ring-amber-400"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Permite apresentar campanhas personalizadas, lembretes de maré baixa e cupons especiais de desconto no WhatsApp e Instagram.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    Salvar Minhas Preferências
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
