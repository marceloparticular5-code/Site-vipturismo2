import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Onde o passeio inicia e onde vocês buscam?',
      a: 'Todos os nossos passeios incluem transfer com busca e retorno gratuito na recepção do seu hotel ou pousada em Ponta Negra, Via Costeira e Praia do Meio. Nosso guia chama nominalmente no horário agendado.',
    },
    {
      q: 'Qual a política de cancelamento ou remarcação?',
      a: 'Você pode cancelar ou remarcar sem qualquer custo com até 24 horas de antecedência. Em caso de chuva forte ou ventos que desaconselhem a navegação náutica em Maracajaú pela Capitania, reagendamos ou reembolsamos integralmente.',
    },
    {
      q: 'Como funciona o parcelamento das reservas?',
      a: 'Parcelamos em até 3x sem juros em todos os principais cartões de crédito (Visa, Mastercard, Elo, Hipercard, Amex). Para pagamentos à vista via Pix, oferecemos condições especiais com confirmação imediata do voucher.',
    },
    {
      q: 'O que está incluso no passeio aos Parrachos de Maracajaú por R$ 170?',
      a: 'Está incluso: transfer ida e volta em veículo climatizado saindo do hotel, lancha rápida veloz até a barreira de corais (7km da costa), kit completo de snorkel (máscara e tubo higienizados), colete flutuador, instrutor de apoio e taxa de preservação ambiental.',
    },
    {
      q: 'Quantas pessoas cabem no Buggy e o passeio tem emoção?',
      a: 'O buggy comporta até 4 passageiros com total conforto e segurança. O trajeto pelas dunas de Genipabu conta com opção "com emoção" ou "sem emoção" — você escolhe o nível de adrenalina diretamente com o bugueiro credenciado.',
    },
    {
      q: 'Como posso confirmar minha reserva agora?',
      a: 'Você pode finalizar pelo checkout seguro aqui no site com Pix ou Cartão, ou falar diretamente com o consultor Marcelo pelo WhatsApp no número (84) 98872-2044.',
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
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#0A192F] hover:text-[#D97706] flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#F59E0B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-sm text-[#0A192F]">Ainda ficou com alguma dúvida sobre seu roteiro?</h4>
            <p className="text-xs text-slate-600">Nossa equipe em Ponta Negra responde em poucos minutos.</p>
          </div>
          <a
            href="https://wa.me/5584988722044"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
