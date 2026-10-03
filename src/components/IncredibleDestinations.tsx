import React from 'react';
import { MapPin, ArrowRight, Compass, Sparkles } from 'lucide-react';

interface IncredibleDestinationsProps {
  onSelectDestination: (destName: string, tourId?: string) => void;
}

export const IncredibleDestinations: React.FC<IncredibleDestinationsProps> = ({
  onSelectDestination,
}) => {
  const destinations = [
    {
      id: 'pipa',
      tourId: 'pipa-praia-do-amor',
      name: 'Praia de Pipa',
      subtitle: 'Falésias vermelhas, Baía dos Golfinhos e charme boêmio',
      badge: 'Destino Obrigatório',
      imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'Passeios a partir de R$ 80',
    },
    {
      id: 'maracajau',
      tourId: 'maracajau-vip',
      name: 'Parrachos de Maracajaú',
      subtitle: 'O Caribe Brasileiro a 7km da costa com piscinas mornas',
      badge: 'Mergulho & Corais',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'R$ 170 com lancha rápida',
    },
    {
      id: 'rio-do-fogo',
      tourId: 'rio-do-fogo-vip',
      name: 'Rio do Fogo',
      subtitle: 'Piscinas preservadas e banco de areia no meio do oceano',
      badge: 'Refúgio Preservado',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'R$ 170 por pessoa',
    },
    {
      id: 'praia-do-amor',
      tourId: 'pipa-praia-do-amor',
      name: 'Praia do Amor',
      subtitle: 'O famoso mirante natural em formato de coração e mar aberto',
      badge: 'Cenário de Cinema',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'Incluso no roteiro Pipa VIP',
    },
    {
      id: 'litoral-sul',
      tourId: 'off-road-litoral-sul',
      name: 'Litoral Sul & Lagoas',
      subtitle: 'Expedição 4x4, Lagoa do Carcará e pôr do sol em Búzios',
      badge: 'Aventura 4x4',
      imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'Veículos 4x4 Pajero Dakar',
    },
    {
      id: 'litoral-norte',
      tourId: 'buggy-vip-privativo',
      name: 'Litoral Norte & Genipabu',
      subtitle: 'Dunas móveis clássicas, travessia de balsa e lagoas de banho',
      badge: 'Emoção Pura',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      priceNotice: 'Buggys credenciados Cadastur',
    },
  ];

  return (
    <section id="destinos-incriveis" className="py-14 sm:py-20 bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F59E0B]">
            <Compass className="w-4 h-4 text-[#F59E0B]" />
            <span>Inspiração para suas Férias</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] font-['Playfair_Display',serif]">
            Conheça Destinos Incríveis no RN
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Descubra as praias, corais e dunas mais encantadoras do Rio Grande do Norte com saídas garantidas a partir de Ponta Negra.
          </p>
        </div>

        {/* 6 Destination Cards Grid (2 cols mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name, dest.tourId)}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 aspect-[4/3] cursor-pointer"
            >
              <img
                src={dest.imageUrl}
                alt={`Destino turístico ${dest.name} em Natal e Litoral do RN`}
                width="400"
                height="300"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D17] via-[#060D17]/50 to-transparent" />

              {/* Destination Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0A192F]/90 text-[#FBBF24] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#1E3A5F]">
                {dest.badge}
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white space-y-1">
                <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider block">
                  {dest.priceNotice}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl font-['Playfair_Display',serif] group-hover:text-[#FBBF24] transition-colors leading-snug">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#FBBF24] group-hover:translate-x-1 transition-transform">
                  <span>Ver roteiros para este destino</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
