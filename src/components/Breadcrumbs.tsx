import React, { useState } from 'react';
import { Home, ChevronRight, MapPin, Compass, Sparkles, Navigation } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  highlight?: boolean;
}

interface BreadcrumbsProps {
  currentSection?: string;
  onSelectArea?: (area: 'ponta-negra' | 'praia-do-forte' | 'via-costeira') => void;
  onOpenTour?: (tourId: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentSection = 'Passeios & Experiências VIP',
  onSelectArea,
  onOpenTour,
}) => {
  const [selectedHub, setSelectedHub] = useState<'ponta-negra' | 'praia-do-forte'>('ponta-negra');

  const handleHubClick = (hub: 'ponta-negra' | 'praia-do-forte') => {
    setSelectedHub(hub);
    if (onSelectArea) {
      onSelectArea(hub);
    }
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início (Natal - RN)',
        item: 'https://www.natalvipturismo.com.br',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ponta Negra & Orla Hoteleira',
        item: 'https://www.natalvipturismo.com.br/#ponta-negra',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Praia do Forte (Ponto Histórico & Náutico)',
        item: 'https://www.natalvipturismo.com.br/#praia-do-forte',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: currentSection,
        item: 'https://www.natalvipturismo.com.br/#passeios-vip',
      },
    ],
  };

  return (
    <nav
      aria-label="Breadcrumb e Navegação por Regiões"
      className="bg-[#050C16]/90 border-y border-amber-500/20 backdrop-blur-md sticky top-16 sm:top-20 z-30 py-2.5 transition-all"
    >
      {/* Schema.org Breadcrumb JSON-LD for Search Engine Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
          {/* Main Breadcrumb Path */}
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-slate-400">
            <li className="inline-flex items-center">
              <a
                href="#inicio"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors"
                title="Página inicial Natal Vip Turismo"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Natal/RN</span>
              </a>
            </li>

            <li aria-hidden="true" className="text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>

            {/* Hub Ponta Negra */}
            <li className="inline-flex items-center">
              <button
                type="button"
                onClick={() => handleHubClick('ponta-negra')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedHub === 'ponta-negra'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Polo Principal: Transfer em todos os hotéis de Ponta Negra"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Ponta Negra (Base VIP)</span>
              </button>
            </li>

            <li aria-hidden="true" className="text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>

            {/* Hub Praia do Forte */}
            <li className="inline-flex items-center">
              <button
                type="button"
                onClick={() => handleHubClick('praia-do-forte')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedHub === 'praia-do-forte'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Ponto Histórico: Fortaleza dos Reis Magos e Rota das Águas"
              >
                <Navigation className="w-3 h-3 text-emerald-400" />
                <span>Praia do Forte (Rota Histórica)</span>
              </button>
            </li>

            <li aria-hidden="true" className="text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>

            {/* Current Dynamic Focus */}
            <li aria-current="page" className="inline-flex items-center">
              <span className="text-amber-200 font-extrabold flex items-center gap-1 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[180px] sm:max-w-none">{currentSection}</span>
              </span>
            </li>
          </ol>

          {/* Quick Hub Filter Bar for Tourist Convenience */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Transfer Hotéis:
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-[10px]">
              ✓ Ponta Negra
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-[10px]">
              ✓ Praia do Forte
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[10px]">
              Via Costeira
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
