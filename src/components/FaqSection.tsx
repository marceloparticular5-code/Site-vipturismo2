import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Calendar } from 'lucide-react';
import { PHONE_DISPLAY } from '../config/contact';

interface FaqSectionProps {
  onOpenChat?: () => void;
  onOpenBooking?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenChat, onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Onde o passeio inicia e onde vocês buscam?',
      a: 'Todos os nossos passeios incluem transfer com busca e retorno gratuito na recepção do seu hotel ou pousada em Ponta Negra, Via Costeira e Praia do Meio. Nosso guia chama nominalmente no horário agendado com veículo executivo climatizado.',
    },
    {
      q: 'O Pacote Casal VIP (R$ 1.320) é cobrado por pessoa ou para o casal?',
      a: 'O valor de R$ 1.320,00 é TOTAL e fechado para o CASAL (as duas pessoas inclusas juntas). NÃO é cobrado por pessoa! Inclui transfer in/out exclusivo no aeroporto, 4 dias de roteiros completos, Maracajaú de lancha, Pipa VIP, Litoral Sul 4x4 e suporte concierge 24h.',
    },
    {
      q: 'O que está incluso no passeio aos Parrachos de Maracajaú por R$ 170?',
      a: 'Está incluso: transfer ida e volta em veículo climatizado saindo da recepção do seu hotel, embarque em lancha rápida veloz até a barreira de corais (7km da costa oceânica), kit completo de snorkel (máscara e tubo higienizados), colete flutuador homologado pela Capitania, instrutores experientes de apoio e taxa de preservação ambiental IDEMA.',
    },
    {
      q: 'Qual a política de cancelamento ou remarcação em caso de chuva ou maré?',
      a: 'Você pode cancelar ou remarcar sem qualquer custo com até 24 horas de antecedência. Em caso de chuva forte ou ventos que desaconselhem a navegação náutica em Maracajaú pela Capitania dos Portos, reagendamos imediatamente sem taxa ou estornamos 100% do seu pagamento.',
    },
    {
      q: 'Como funciona o pagamento das reservas no Pix ou Cartão?',
      a: 'Você paga o mesmo valor no Pix ou no Cartão de Crédito em até 3x sem juros (ou até 12x) em todos os principais cartões (Visa, Mastercard, Elo, Hipercard, Amex). O Pix conta com confirmação imediata e aprovação em segundos, liberando seu voucher nominal na hora.',
    },
    {
      q: 'Quantas pessoas cabem no Buggy e o passeio tem emoção?',
      a: 'O buggy privativo comporta até 4 passageiros com total conforto e segurança. O trajeto pelas dunas de Genipabu conta com opção "com emoção" ou "sem emoção" — você escolhe o nível de adrenalina diretamente com o bugueiro credenciado.',
    },
    {
      q: 'Como posso confirmar minha reserva agora de forma rápida?',
      a: `Você pode finalizar em poucos cliques pelo autoatendimento seguro aqui no site com Pix ou Cartão em até 12x, ou falar com o Assistente Natal VIP no chat flutuante 24h. Caso precise de suporte personalizado: ${PHONE_DISPLAY}.`,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F59E0B]">
            <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-['Playfair_Display',serif]">
            Perguntas Frequentes dos Viajantes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Respostas claras e transparentes para você planejar suas férias sem surpresas.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all shadow-sm ${
                  isOpen
                    ? 'border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`w-full p-4 sm:p-5 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 transition-colors cursor-pointer rounded-2xl ${
                    isOpen
                      ? 'bg-[#0A192F] text-amber-300 hover:text-amber-200 rounded-b-none'
                      : 'bg-slate-50 hover:bg-slate-100/90 text-[#0A192F] hover:text-[#B45309]'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-80 hidden sm:inline">
                      {isOpen ? 'Fechar' : 'Ver resposta'}
                    </span>
                    {isOpen ? (
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 text-sm sm:text-base text-[#0F172A] leading-[1.65] bg-white border-t border-amber-400/30 animate-fadeIn rounded-b-2xl">
                    <p className="font-normal">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A192F] text-white border border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-sm text-white">Ainda ficou com alguma dúvida sobre seu roteiro?</h4>
            <p className="text-xs text-slate-300">Tire dúvidas em tempo real com o Assistente Natal VIP ou inicie sua reserva online.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tirar Dúvidas no Chat</span>
              </button>
            )}
            {onOpenBooking && (
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Reservar Online</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
