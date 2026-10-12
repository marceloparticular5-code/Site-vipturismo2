import React, { useState } from 'react';
import { MapPin, ArrowRight, Compass, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useInViewLazy } from '../hooks/useInViewLazy';

interface DestinationItem {
  id: string;
  tourId: string;
  name: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  altText: string;
  priceNotice: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'pipa',
    tourId: 'pipa-praia-do-amor',
    name: 'Praia de Pipa',
    subtitle: 'Falésias vermelhas, Baía dos Golfinhos e charme boêmio',
    badge: 'Destino Obrigatório',
    imageUrl: '/images/pipa/pipa-falesias-amor.webp',
    altText: 'Falésias vermelhas da Praia de Pipa e Baía dos Golfinhos em Tibau do Sul RN',
    priceNotice: 'Passeios a partir de R$ 80',
  },
  {
    id: 'maracajau',
    tourId: 'maracajau-vip',
    name: 'Parrachos de Maracajaú',
    subtitle: 'O Caribe Brasileiro a 7km da costa com piscinas mornas',
    badge: 'Mergulho & Corais',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    altText: 'Mergulho com peixes coloridos nos recifes de corais dos Parrachos de Maracajaú RN',
    priceNotice: 'R$ 170 com lancha rápida',
  },
  {
    id: 'rio-do-fogo',
    tourId: 'rio-do-fogo-vip',
    name: 'Rio do Fogo',
    subtitle: 'Piscinas preservadas e banco de areia no meio do oceano',
    badge: 'Refúgio Preservado',
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
    altText: 'Piscinas naturais paradisíacas e banco de areia em alto mar de Rio do Fogo RN',
    priceNotice: 'R$ 170 por pessoa',
  },
  {
    id: 'praia-do-amor',
    tourId: 'pipa-by-night',
    name: 'Pipa By Night',
    subtitle: 'O famoso mirante natural, bistrôs acolhedores e noites charmosas',
    badge: 'Cenário de Cinema',
    imageUrl: '/images/pipa-by-night/pipa-night-village.webp',
    altText: 'Rua charmosa iluminada e vida noturna boêmia na vila da Praia de Pipa RN',
    priceNotice: 'R$ 100 por pessoa (Transfer incluso)',
  },
  {
    id: 'litoral-sul',
    tourId: 'off-road-litoral-sul',
    name: 'Litoral Sul & Lagoas',
    subtitle: 'Expedição 4x4, Lagoa do Carcará e pôr do sol em Búzios',
    badge: 'Aventura 4x4',
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
    altText: 'Expedição off-road 4x4 Pajero Dakar nas falésias e lagoas do Litoral Sul de Natal',
    priceNotice: 'Veículos 4x4 Pajero Dakar',
  },
  {
    id: 'litoral-norte',
    tourId: 'buggy-vip-privativo',
    name: 'Litoral Norte & Genipabu',
    subtitle: 'Dunas móveis clássicas, travessia de balsa e lagoas de banho',
    badge: 'Emoção Pura',
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
    altText: 'Passeio de buggy com emoção pelas dunas móveis de Genipabu em Natal RN',
    priceNotice: 'Buggys credenciados Cadastur',
  },
];

interface DestinationCardProps {
  dest: DestinationItem;
  onSelect: () => void;
  isParentVisible: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ dest, onSelect, isParentVisible }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onSelect}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 aspect-[4/3] cursor-pointer bg-slate-900"
    >
      {/* Skeleton / Shimmer placeholder enquanto a foto carrega via Lazy Loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 animate-pulse flex items-center justify-center">
          <div className="text-slate-600 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-[11px] font-medium text-slate-500">Carregando destino...</span>
          </div>
        </div>
      )}

      {/* Imagem real com carregamento sob demanda (IntersectionObserver + native loading="lazy") */}
      {isParentVisible && (
        <img
          src={hasError ? '/images/maracajau/maracajau-mergulho-peixes.webp' : dest.imageUrl}
          alt={dest.altText}
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setHasError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#060D17] via-[#060D17]/50 to-transparent pointer-events-none" />

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
  );
};

interface IncredibleDestinationsProps {
  onSelectDestination: (destName: string, tourId?: string) => void;
}

export const IncredibleDestinations: React.FC<IncredibleDestinationsProps> = ({
  onSelectDestination,
}) => {
  // Intersection Observer para disparar o carregamento otimizado de imagens 250px antes da rolagem
  const [containerRef, isSectionInView] = useInViewLazy<HTMLElement>({
    rootMargin: '250px',
    triggerOnce: true,
  });

  return (
    <section
      ref={containerRef}
      id="destinos-incriveis"
      className="py-14 sm:py-20 bg-[#F8FAFC] text-[#0F172A] min-h-[450px]"
    >
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

        {/* 6 Destination Cards Grid (2 cols mobile, 3 cols desktop) com Lazy Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DESTINATIONS.map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              isParentVisible={isSectionInView}
              onSelect={() => onSelectDestination(dest.name, dest.tourId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default IncredibleDestinations;
