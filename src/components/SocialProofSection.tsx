import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageCircle, Quote } from 'lucide-react';

interface SocialProofSectionProps {
  onOpenBooking: () => void;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({ onOpenBooking }) => {
  const testimonials = [
    {
      id: '1',
      name: 'Carla & Rodrigo Medeiros',
      city: 'São Paulo / SP',
      tour: 'Pacote Casal VIP + Maracajaú',
      rating: 5,
      date: 'Setembro / 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment:
        'Melhor investimento das nossas férias! O transfer pontual no aeroporto nos deu tranquilidade logo na chegada. Em Maracajaú, a lancha rápida nos levou antes das multidões e pegamos água cristalina de maré 0.1!',
    },
    {
      id: '2',
      name: 'Leonardo Vasconcelos',
      city: 'Belo Horizonte / MG',
      tour: 'Passeio Pipa + Praia do Amor',
      rating: 5,
      date: 'Agosto / 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment:
        'Passeio sensacional por apenas R$ 80 por pessoa. O guia conhecia cada cantinho de Pipa e nos levou nos melhores mirantes do Chapadão. Fizemos a lancha opcional e vimos golfinhos bem de perto!',
    },
    {
      id: '3',
      name: 'Fernanda & Família',
      city: 'Curitiba / PR',
      tour: 'Buggy VIP Privativo em Genipabu',
      rating: 5,
      date: 'Setembro / 2026',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      comment:
        'Segurança impecável com nossos filhos pequenos! O bugueiro credenciado teve todo o cuidado nas manobras, parou na lagoa tranquila para as crianças brincarem e o atendimento do Marcelo no WhatsApp foi 10 estrelas.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white text-[#1F2A2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Rating Summary Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#0E3B43] text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC857] text-[#0E3B43] flex flex-col items-center justify-center font-black shadow shrink-0">
              <span className="text-2xl leading-none">4.98</span>
              <span className="text-[10px] tracking-wider uppercase">de 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#FFC857]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFC857]" />
                ))}
                <span className="text-xs font-bold text-white ml-1">Excepcional</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Playfair_Display',serif]">
                Mais de 1.850 viajantes atendidos com nota máxima
              </h3>
              <p className="text-xs text-[#F6EBDD]/80">
                Avaliações verificadas de clientes reais no Google Maps e TripAdvisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#FFC857] block">Cadastur Regular</span>
              <span className="text-[11px] text-slate-300">Agência 100% Homologada</span>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#D97514] text-white font-black text-xs uppercase tracking-wider shadow cursor-pointer transition-transform active:scale-95"
            >
              Garantir Meu Passeio
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-[#F6EBDD]/60 border border-[#F6EBDD] hover:border-[#F28C28]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#F28C28]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F28C28]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#0E3B43]/20" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#0E3B43]/20"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-[#0E3B43] truncate">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.city}</p>
                  <p className="text-[10px] text-[#F28C28] font-bold truncate">{t.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
