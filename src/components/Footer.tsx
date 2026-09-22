import React, { useState } from 'react';
import { NatalVipLogo } from './NatalVipLogo';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUp, Sparkles, Send, CheckCircle2, Shield } from 'lucide-react';
import { subscribeToTravelDeals } from '../lib/emailService';

interface FooterProps {
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
  onOpenAutoAtendimento: () => void;
  onOpenCrm?: () => void;
  onOpenCookies?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenCalendar,
  onOpenAutoAtendimento,
  onOpenCrm,
  onOpenCookies,
  onOpenAdmin,
}) => {
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes('@')) {
      setSubStatus('error');
      setSubMessage('Por favor, informe um e-mail válido.');
      return;
    }

    try {
      setSubStatus('loading');
      const res = await subscribeToTravelDeals(subEmail);
      setSubStatus('success');
      setSubMessage(res.message || 'Inscrição realizada com sucesso!');
      setSubEmail('');
    } catch (err: any) {
      setSubStatus('error');
      setSubMessage(err?.message || 'Erro ao cadastrar e-mail. Tente novamente.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030811] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIP Deals Subscription Section */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C1A30] via-[#0A1628] to-[#071220] border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Clube de Ofertas Exclusivas VIP
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Receba Ofertas Exclusivas de Viagens & Melhores Marés
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Cadastre seu e-mail para receber cupons secretos, alertas antecipados de piscinas naturais perfeitas em Natal e condições exclusivas de passeios.
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={subEmail}
                    onChange={(e) => {
                      setSubEmail(e.target.value);
                      if (subStatus !== 'idle') setSubStatus('idle');
                    }}
                    placeholder="Seu melhor e-mail..."
                    disabled={subStatus === 'loading'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {subStatus === 'loading' ? (
                    <span>Cadastrando...</span>
                  ) : (
                    <>
                      <span>Quero Ofertas</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {subStatus === 'success' && (
                <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-400 font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{subMessage}</span>
                </div>
              )}

              {subStatus === 'error' && (
                <div className="mt-2.5 text-xs text-rose-400 font-medium">
                  {subMessage}
                </div>
              )}

              <span className="text-[10px] text-slate-500 mt-2 block">
                Sem spam. Cancele sua inscrição quando desejar com 1 clique.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand & Preserved Logo */}
          <div className="lg:col-span-2 space-y-4">
            <NatalVipLogo size={52} />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Agência de turismo receptivo de alto padrão em Natal/RN. Especialistas em mergulho nos
              Parrachos de Maracajaú e Rio do Fogo com análise inteligente da tábua de maré e
              atendimento VIP humanizado.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Empresa Nº 1 em Satisfação · Cadastur Homologado
            </div>
          </div>

          {/* Col 3: Passeios & Roteiros */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Roteiros de Elite
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onOpenBooking('maracajau-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Parrachos de Maracajaú VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('rio-do-fogo-vip')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  Parrachos de Rio do Fogo VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('genipabu-buggy-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Dunas de Genipabu Com Emoção
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pipa-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Pipa VIP & Pôr do Sol
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('sao-miguel-gostoso-vip')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  São Miguel do Gostoso VIP
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ferramentas & Suporte */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Autoatendimento
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onOpenCalendar} className="hover:text-amber-300 transition-colors">
                  Tábua de Maré Inteligente 2026
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAutoAtendimento}
                  className="hover:text-amber-300 transition-colors"
                >
                  Consultar Reserva & 2ª Via
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAutoAtendimento}
                  className="hover:text-amber-300 transition-colors"
                >
                  Políticas de Cancelamento & Maré
                </button>
              </li>
              <li>
                <a
                  href="#depoimentos-vip"
                  className="hover:text-amber-300 transition-colors block text-amber-400 font-semibold"
                >
                  ★ Depoimentos de Clientes VIP
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCrm}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  <span>Central de Leads & Follow-up</span>
                  <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">CRM</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCookies}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Cookies & LGPD (Marketing)
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5 text-amber-400 font-semibold"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Painel Admin VIP</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Contato Oficial */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Cinzel',serif]">
              Atendimento VIP
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a href="tel:84981882828" className="hover:text-white block font-medium">
                    (84) 98188-2828
                  </a>
                  <a href="https://wa.me/5584988256545" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 block font-semibold text-emerald-400">
                    WhatsApp: (84) 98825-6545
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:reservas@natalvipturismo.com" className="hover:text-white block text-amber-300 font-semibold">
                    reservas@natalvipturismo.com
                  </a>
                  <span className="text-[10px] text-slate-500 block">Envio automático de vouchers</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Ponta Negra / Via Costeira, Natal - RN, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Natal Vip Turismo Agency · Todos os direitos reservados.</span>
            <span>•</span>
            <span>CNPJ & Cadastur Regular</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-300 text-slate-400 flex items-center gap-1 transition-colors"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
