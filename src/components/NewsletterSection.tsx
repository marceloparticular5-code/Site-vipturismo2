import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { saveLeadToFirestore } from '../lib/firebase';
import { trackLeadGeneration } from '../lib/tracking';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    trackLeadGeneration({
      name: name.trim() || 'Assinante Newsletter',
      tour: 'Cupom Newsletter VIP',
      phone: '',
    });

    saveLeadToFirestore({
      name: name.trim() || 'Assinante VIP',
      email: email.trim(),
      phone: '',
      tourInterest: 'Cupom de Desconto 10%',
      travelMonth: '2026-10',
      status: 'new',
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    setSubmitted(true);
  };

  return (
    <section id="promocoes" className="py-14 sm:py-16 bg-[#0A192F] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#060D17] via-[#0A192F] to-[#172A45] p-6 sm:p-10 border border-[#1E3A5F] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FBBF24]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clube VIP de Vantagens</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Playfair_Display',serif]">
              Receba Promoções Secretas & Dicas de Maré em Natal
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              Cadastre-se para receber em primeira mão as melhores datas da tábua de maré e um{' '}
              <strong className="text-[#FBBF24]">cupom com desconto especial</strong> para sua reserva.
            </p>

            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Obrigado! Seu cupom VIP foi gerado. Use <strong>VIPNATAL10</strong> no checkout ou informe no WhatsApp!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Seu primeiro nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] flex-1"
                />
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] flex-1"
                />
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Quero Desconto VIP
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seus dados estão seguros e protegidos pela LGPD. Sem spam.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
