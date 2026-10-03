import React from 'react';
import { Waves, Sun, Clock, Backpack, Compass, ArrowRight } from 'lucide-react';

interface TravelTipsSectionProps {
  onOpenBooking: () => void;
  onOpenCalendar: () => void;
}

export const TravelTipsSection: React.FC<TravelTipsSectionProps> = ({
  onOpenBooking,
  onOpenCalendar,
}) => {
  const tips = [
    {
      id: 'mare',
      icon: Waves,
      tag: 'Segredo de Especialista',
      title: 'Como escolher o dia ideal para os Parrachos de Maracajaú?',
      desc: 'Os corais só podem ser visitados na maré baixa (entre 0.0m e 0.5m). Nós consultamos a tábua oficial da Marinha do Brasil e reservamos apenas os dias perfeitos de água cristalina para você.',
      actionText: 'Consultar Tábua de Maré 2026',
      action: onOpenCalendar,
    },
    {
      id: 'levar',
      icon: Backpack,
      tag: 'O que Levar na Mochila',
      title: 'Itens indispensáveis para os passeios de praia e dunas',
      desc: 'Protetor solar biodegradável, óculos de sol, boné ou chapéu, chinelo ou sapatilha aquática para os corais, toalha leve e documento oficial com foto. Dinheiro ou cartão para petiscos à beira-mar.',
      actionText: 'Tirar dúvidas no WhatsApp',
      action: onOpenBooking,
    },
    {
      id: 'transfer',
      icon: Clock,
      tag: 'Chegada Sem Estresse',
      title: 'Por que o transfer privativo do Aeroporto de Natal vale a pena?',
      desc: 'O Aeroporto de Natal fica a cerca de 40km de Ponta Negra. Com nosso transfer executivo por R$ 160 até 4 pessoas, um motorista aguarda você no portão de desembarque e monitora atrasos de voo sem cobrança extra.',
      actionText: 'Reservar Transfer VIP',
      action: onOpenBooking,
    },
  ];

  return (
    <section id="dicas-viagem" className="py-14 sm:py-20 bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A192F]/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F59E0B]">
              <Sun className="w-4 h-4 text-[#F59E0B]" />
              <span>Dicas Úteis de Viagem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-['Playfair_Display',serif]">
              Tudo o que Você Precisa Saber Antes de Embarcar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Orientações práticas de quem vive e opera o melhor turismo em Natal há anos.
            </p>
          </div>
        </div>

        {/* 3 Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A192F] text-[#FBBF24] flex items-center justify-center shadow">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F59E0B] block">
                    {tip.tag}
                  </span>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#0A192F] leading-snug">
                    {tip.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={tip.action}
                    className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1.5 cursor-pointer group"
                  >
                    <span>{tip.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
