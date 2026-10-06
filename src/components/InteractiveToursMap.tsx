import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  X,
  Compass,
  Navigation,
  Anchor,
  Sparkles,
  Waves,
  Car,
  Clock,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export type MapLocationFilter = 'todos' | 'maracajau' | 'rio-do-fogo' | 'partida';

export interface MapPointOfInterest {
  id: string;
  name: string;
  category: 'maracajau' | 'rio-do-fogo' | 'partida';
  typeLabel: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  imageUrl: string;
  recommendedTourId: string;
  recommendedTourName: string;
  highlights: string[];
  depthOrTide?: string;
  distanceFromNatal?: string;
  badgeColor?: string;
}

export const MAP_POINTS: MapPointOfInterest[] = [
  // 1. Pontos de Partida & Apoio
  {
    id: 'partida-ponta-negra',
    name: 'Base VIP Ponta Negra (Orla Hoteleira)',
    category: 'partida',
    typeLabel: 'Ponto de Partida & Transfer',
    coordinates: [-5.8783, -35.1764],
    description:
      'Ponto de partida principal com busca privativa e executiva em todos os hotéis e pousadas da orla de Ponta Negra em van executiva com ar-condicionado.',
    imageUrl: '/images/transfer/transfer-executivo-vip.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: ['Transfer ida e volta climatizado', 'Embarque a partir das 06:30', 'Acompanhamento de guia Cadastur'],
    distanceFromNatal: '0 km (Ponto de Partida)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'partida-via-costeira',
    name: 'Resorts da Via Costeira (Embarque VIP)',
    category: 'partida',
    typeLabel: 'Ponto de Partida & Transfer',
    coordinates: [-5.8365, -35.1912],
    description:
      'Parada de embarque prioritário para os hóspedes dos resorts 5 estrelas e all-inclusive da Via Costeira de Natal.',
    imageUrl: '/images/transfer/transfer-executivo-vip.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: ['Busca na recepção do resort', 'Sem necessidade de deslocamento', 'Veículos confortáveis'],
    distanceFromNatal: '5 km de Ponta Negra',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'base-maracajau',
    name: 'Marina & Ponto de Apoio Maracajaú',
    category: 'partida',
    typeLabel: 'Base Náutica de Embarque',
    coordinates: [-5.4121, -35.3115],
    description:
      'Ponto de apoio beira-mar com restaurante privativo, vestiários com ducha, guarda-volumes e ponto de partida das lanchas rápidas VIP.',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: ['Ponto de apoio com piscina e sombra', 'Embarque seguro em lancha rápida', 'Restaurante potiguar'],
    distanceFromNatal: '54 km de Natal',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 'base-rio-do-fogo',
    name: 'Ponto de Apoio & Praia de Rio do Fogo',
    category: 'partida',
    typeLabel: 'Base Náutica & Ponto de Apoio',
    coordinates: [-5.2718, -35.3854],
    description:
      'Vila de pescadores autêntica e tranquila com estrutura de apoio à beira-mar, culinária típica e embarque nas lanchas para os corais intocados.',
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
    recommendedTourId: 'rio-do-fogo-vip',
    recommendedTourName: 'Parrachos de Rio do Fogo VIP',
    highlights: ['Ambiente rústico e exclusivo', 'Peixe frito e petiscos locais', 'Embarque rápido sem muvuca'],
    distanceFromNatal: '75 km de Natal',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },

  // 2. Roteiro Maracajaú (Atrações e Visitação)
  {
    id: 'maracajau-parrachos',
    name: 'Parrachos de Maracajaú (O Caribe Brasileiro)',
    category: 'maracajau',
    typeLabel: 'Recife de Corais & Piscinas Naturais',
    coordinates: [-5.378, -35.253],
    description:
      'Formações de recifes de corais a 7 km da costa com águas mornas, cristalinas e vida marinha exuberante. Excelente visibilidade de até 15 metros na maré seca.',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: [
      'Snorkel com máscara e colete inclusos',
      'Tartarugas marinhas e peixes multicoloridos',
      'Piscina natural em mar aberto',
    ],
    depthOrTide: 'Maré ideal: 0.0 a 0.5m · Profundidade: 1m a 3m',
    distanceFromNatal: '7 km náuticos da costa de Maracajaú',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 'maracajau-plataforma',
    name: 'Plataforma Flutuante VIP Maracajaú',
    category: 'maracajau',
    typeLabel: 'Estrutura Náutica Flutuante',
    coordinates: [-5.375, -35.25],
    description:
      'Grande plataforma flutuante ancorada nos recifes com deck de descanso, bar flutuante, escadas de acesso fácil à água e base para mergulho com cilindro.',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: [
      'Segurança total com salva-vidas',
      'Batismo de mergulho autônomo com instrutor PADI',
      'Fotografia subaquática profissional',
    ],
    depthOrTide: 'Operação exclusiva em dias de maré favorável',
    distanceFromNatal: '7 km da costa',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'lagoa-pitangui',
    name: 'Lagoa de Pitangui & Dunas Douradas',
    category: 'maracajau',
    typeLabel: 'Parada Panorâmica no Trajeto',
    coordinates: [-5.642, -35.267],
    description:
      'Parada opcional de descanso e fotos durante o trajeto Litoral Norte, famosa pelas mesas na água doce e sombras de coqueiros.',
    imageUrl: '/images/quadriciclo/quadriciclo-lagoa-casal.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: ['Banho de água doce relaxante', 'Fotos nas dunas', 'Gastronomia caseira'],
    distanceFromNatal: '28 km de Natal',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'arvore-do-amor',
    name: 'Árvore do Amor (Barra de Maxaranguape)',
    category: 'maracajau',
    typeLabel: 'Ponto Turístico & Histórico',
    coordinates: [-5.521, -35.262],
    description:
      'Fenômeno natural onde duas gameleiras centenárias se abraçaram pela força dos ventos alísios formando um portal de frente para o mar turquesa.',
    imageUrl: '/images/pacote-casal/casal-vip-buggy-praia.webp',
    recommendedTourId: 'maracajau-vip',
    recommendedTourName: 'Parrachos de Maracajaú VIP',
    highlights: ['Mirante para o mar aberto', 'Tradição local para casais e fotos', 'Vento constante e brisa suave'],
    distanceFromNatal: '45 km de Natal',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },

  // 3. Roteiro Rio do Fogo (Atrações e Visitação)
  {
    id: 'rio-do-fogo-parrachos',
    name: 'Parrachos de Rio do Fogo (Piscinas Virgens)',
    category: 'rio-do-fogo',
    typeLabel: 'Recife Preservado & Piscinas Intocadas',
    coordinates: [-5.245, -35.325],
    description:
      'Piscinas naturais ultra cristalinas e rasas (0,8m a 1,5m), conhecidas por serem muito mais tranquilas e reservadas que outros recifes do estado.',
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
    recommendedTourId: 'rio-do-fogo-vip',
    recommendedTourName: 'Parrachos de Rio do Fogo VIP',
    highlights: [
      'Águas calmas como uma lagoa marinha',
      'Corais de fogo protegidos e peixes multicoloridos',
      'Lancha rápida privativa com poucas pessoas',
    ],
    depthOrTide: 'Maré ideal: 0.0 a 0.6m · Piscinas rasas e seguras',
    distanceFromNatal: '5 km da costa de Rio do Fogo',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'rio-do-fogo-banco-areia',
    name: 'Banco de Areia dos Parrachos (Ilha Efêmera)',
    category: 'rio-do-fogo',
    typeLabel: 'Fenômeno Natural da Maré Baixa',
    coordinates: [-5.251, -35.335],
    description:
      'Uma faixa de areia branca reluzente que surge no meio do mar quando a maré atinge o nível mais baixo (0.0 a 0.3m), proporcionando fotos paradisíacas surreais.',
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
    recommendedTourId: 'rio-do-fogo-vip',
    recommendedTourName: 'Parrachos de Rio do Fogo VIP',
    highlights: ['Caminhada em banco de areia oceânico', 'Cenário exclusivo para fotos VIP', 'Degustação de frutas a bordo'],
    depthOrTide: 'Disponível apenas em marés ultra secas (≤ 0.4m)',
    distanceFromNatal: 'Mar aberto em frente a Rio do Fogo',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  },
  {
    id: 'lagoa-do-teiu',
    name: 'Lagoa do Teiú & Coqueirais de Rio do Fogo',
    category: 'rio-do-fogo',
    typeLabel: 'Atração Natural Ecológica',
    coordinates: [-5.298, -35.412],
    description:
      'Lagoa de águas tranquilas e límpidas protegida por dunas e vasta vegetação nativa, perfeita para fechar o dia após o mergulho nos recifes.',
    imageUrl: '/images/quadriciclo/quadriciclo-lagoa-casal.webp',
    recommendedTourId: 'rio-do-fogo-vip',
    recommendedTourName: 'Parrachos de Rio do Fogo VIP',
    highlights: ['Pôr do sol cinematográfico', 'Sossego total longe das multidões', 'Água morna e doce'],
    distanceFromNatal: '78 km de Natal',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'mirante-dunas-douradas',
    name: 'Mirante das Dunas Costeiras',
    category: 'rio-do-fogo',
    typeLabel: 'Mirante Panorâmico 360°',
    coordinates: [-5.285, -35.395],
    description:
      'Ponto mais alto da orla norte com vista deslumbrante de onde o oceano encontra a barreira de corais e a costa dos coqueiros.',
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
    recommendedTourId: 'rio-do-fogo-vip',
    recommendedTourName: 'Parrachos de Rio do Fogo VIP',
    highlights: ['Vista de toda a enseada', 'Brisa marítima refrescante', 'Excelente parada fotográfica'],
    distanceFromNatal: '74 km de Natal',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
];

// Suggested Routes Waypoints
const ROUTE_TERRESTRE_NATAL_MARACAJAU: [number, number][] = [
  [-5.8783, -35.1764], // Ponta Negra
  [-5.8365, -35.1912], // Via Costeira
  [-5.78, -35.2], // Natal Centro
  [-5.74, -35.23], // Ponte Newton Navarro
  [-5.642, -35.267], // Pitangui
  [-5.521, -35.262], // Maxaranguape
  [-5.4121, -35.3115], // Marina Maracajaú
];

const ROUTE_TERRESTRE_MARACAJAU_RIO_DO_FOGO: [number, number][] = [
  [-5.4121, -35.3115], // Marina Maracajaú
  [-5.36, -35.34], // Caraúbas
  [-5.298, -35.412], // Lagoa do Teiú
  [-5.2718, -35.3854], // Praia Rio do Fogo
];

const ROUTE_NAUTICA_MARACAJAU: [number, number][] = [
  [-5.4121, -35.3115], // Praia Maracajaú
  [-5.395, -35.28], // Rota em mar
  [-5.378, -35.253], // Parrachos de Maracajaú
  [-5.375, -35.25], // Plataforma VIP
];

const ROUTE_NAUTICA_RIO_DO_FOGO: [number, number][] = [
  [-5.2718, -35.3854], // Praia Rio do Fogo
  [-5.26, -35.35], // Saída da costa
  [-5.251, -35.335], // Banco de Areia
  [-5.245, -35.325], // Parrachos de Rio do Fogo
];

interface InteractiveToursMapProps {
  onOpenBooking: (tourId: string) => void;
  onOpenCalendar?: () => void;
}

export const InteractiveToursMap: React.FC<InteractiveToursMapProps> = ({
  onOpenBooking,
  onOpenCalendar,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MapLocationFilter>('todos');
  const [activePoi, setActivePoi] = useState<MapPointOfInterest | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filtered POIs based on search and category
  const filteredPoints = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return MAP_POINTS.filter((poi) => {
      // Category filter
      if (selectedFilter !== 'todos' && poi.category !== selectedFilter) {
        return false;
      }
      // Instant text search filter
      if (!term) return true;

      const inName = poi.name.toLowerCase().includes(term);
      const inDesc = poi.description.toLowerCase().includes(term);
      const inType = poi.typeLabel.toLowerCase().includes(term);
      const inHighlights = poi.highlights.some((h) => h.toLowerCase().includes(term));
      const inTour = poi.recommendedTourName.toLowerCase().includes(term);

      return inName || inDesc || inType || inHighlights || inTour;
    });
  }, [searchTerm, selectedFilter]);

  // Create Modern Custom Marker Icon
  const createCustomMarker = useCallback((poi: MapPointOfInterest, isSelected: boolean) => {
    let pinColor = '#F59E0B'; // Amber default
    let iconSvg = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>`;

    if (poi.category === 'maracajau') {
      pinColor = '#06B6D4'; // Cyan for Maracajaú Caribbean
    } else if (poi.category === 'rio-do-fogo') {
      pinColor = '#10B981'; // Emerald for Rio do Fogo natural reef
    } else if (poi.category === 'partida') {
      pinColor = '#F59E0B'; // Golden for Departure / VIP Transfer
    }

    const size = isSelected ? 44 : 36;
    const shadowClass = isSelected
      ? `filter drop-shadow(0 0 12px ${pinColor})`
      : `filter drop-shadow(0 4px 8px rgba(0,0,0,0.6))`;

    const html = `
      <div style="transform: translate(-50%, -100%); cursor: pointer; transition: transform 0.2s;" class="custom-map-pin">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${pinColor}" style="${shadowClass};">
          ${iconSvg}
        </svg>
        <div style="
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(5, 12, 22, 0.92);
          border: 1px solid ${pinColor};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 9999px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        ">
          ${poi.name.split(' ')[0]} ${poi.name.includes('Parrachos') ? '🌊' : ''}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-pin',
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center between Natal and Rio do Fogo
    const map = L.map(mapContainerRef.current, {
      center: [-5.55, -35.25],
      zoom: 10,
      minZoom: 8,
      maxZoom: 17,
      zoomControl: false,
    });

    // Add luxury dark tiles (CartoDB Dark Matter) fitting Natal Vip Turismo luxury aesthetics
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom control at bottom right
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    // Initialize Layers
    const routesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    routesLayerRef.current = routesLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Routes (Polylines)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesLayer = routesLayerRef.current;
    if (!map || !routesLayer) return;

    routesLayer.clearLayers();

    if (!showRoutes) return;

    // 1. Rota Terrestre VIP Natal -> Maracajaú (Golden Line)
    const lineNatalMaracajau = L.polyline(ROUTE_TERRESTRE_NATAL_MARACAJAU, {
      color: '#F59E0B',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
    });
    lineNatalMaracajau.bindTooltip('Rota Terrestre VIP: Natal ➔ Maracajaú (54 km)', {
      sticky: true,
      className: 'route-tooltip',
    });
    routesLayer.addLayer(lineNatalMaracajau);

    // 2. Rota Terrestre Maracajaú -> Rio do Fogo (Amber Line)
    const lineMaracajauRioDoFogo = L.polyline(ROUTE_TERRESTRE_MARACAJAU_RIO_DO_FOGO, {
      color: '#EAB308',
      weight: 3.5,
      opacity: 0.8,
      dashArray: '6, 6',
    });
    lineMaracajauRioDoFogo.bindTooltip('Rota Terrestre: Maracajaú ➔ Rio do Fogo (21 km)', {
      sticky: true,
      className: 'route-tooltip',
    });
    routesLayer.addLayer(lineMaracajauRioDoFogo);

    // 3. Rota Náutica Maracajaú (Cyan Oceanic Line)
    const lineNauticaMaracajau = L.polyline(ROUTE_NAUTICA_MARACAJAU, {
      color: '#06B6D4',
      weight: 4.5,
      opacity: 0.9,
    });
    lineNauticaMaracajau.bindTooltip('Rota Náutica: Lancha Rápida VIP até os Parrachos (7 km)', {
      sticky: true,
      className: 'route-tooltip',
    });
    routesLayer.addLayer(lineNauticaMaracajau);

    // 4. Rota Náutica Rio do Fogo (Emerald Line)
    const lineNauticaRioDoFogo = L.polyline(ROUTE_NAUTICA_RIO_DO_FOGO, {
      color: '#10B981',
      weight: 4.5,
      opacity: 0.9,
    });
    lineNauticaRioDoFogo.bindTooltip('Rota Náutica: Lancha até os Parrachos Virgens (5 km)', {
      sticky: true,
      className: 'route-tooltip',
    });
    routesLayer.addLayer(lineNauticaRioDoFogo);
  }, [showRoutes]);

  // Update Markers based on filtered points
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredPoints.forEach((poi) => {
      const isSelected = activePoi?.id === poi.id;
      const icon = createCustomMarker(poi, isSelected);
      const marker = L.marker(poi.coordinates, { icon });

      // Build Rich Interactive Popup HTML
      const popupHtml = `
        <div style="min-width: 260px; max-width: 320px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="position: relative; height: 130px; border-radius: 12px; overflow: hidden; margin-bottom: 8px;">
            <img src="${poi.imageUrl}" alt="${poi.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(5,12,22,0.85); color: #FDE047; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; text-transform: uppercase;">
              ${poi.typeLabel}
            </div>
            ${
              poi.distanceFromNatal
                ? `<div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.75); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px;">📍 ${poi.distanceFromNatal}</div>`
                : ''
            }
          </div>

          <h4 style="color: #0f172a; font-weight: 800; font-size: 14px; margin: 0 0 4px 0; line-height: 1.2;">
            ${poi.name}
          </h4>

          <p style="color: #475569; font-size: 11px; margin: 0 0 8px 0; line-height: 1.4;">
            ${poi.description}
          </p>

          ${
            poi.depthOrTide
              ? `<div style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 10px; color: #0369a1; font-weight: 600; margin-bottom: 8px;">🌊 ${poi.depthOrTide}</div>`
              : ''
          }

          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <button id="btn-book-${poi.id}" style="
              flex: 1;
              background: linear-gradient(135deg, #F59E0B, #D97706);
              color: #050C16;
              border: none;
              padding: 7px 10px;
              border-radius: 8px;
              font-weight: 800;
              font-size: 11px;
              cursor: pointer;
              text-align: center;
              box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
            ">
              Reservar Este Roteiro ➔
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: 'custom-vip-popup',
      });

      marker.on('click', () => {
        setActivePoi(poi);
      });

      marker.on('popupopen', () => {
        setActivePoi(poi);
        // Bind dynamic button inside popup
        setTimeout(() => {
          const btn = document.getElementById(`btn-book-${poi.id}`);
          if (btn) {
            btn.onclick = () => {
              onOpenBooking(poi.recommendedTourId);
            };
          }
        }, 50);
      });

      markersLayer.addLayer(marker);
    });

    // Auto fit bounds if search is applied
    if (searchTerm.trim() && filteredPoints.length > 0) {
      const bounds = L.latLngBounds(filteredPoints.map((p) => p.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [filteredPoints, activePoi, createCustomMarker, onOpenBooking, searchTerm]);

  // Handle click on list item to fly to point
  const handleSelectPoi = (poi: MapPointOfInterest) => {
    setActivePoi(poi);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(poi.coordinates, 13, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([-5.55, -35.25], 10, { duration: 1 });
    }
  };

  return (
    <section
      id="mapa-interativo"
      aria-label="Mapa Interativo dos Roteiros de Maracajaú e Rio do Fogo"
      className={`relative py-14 sm:py-20 bg-[#040A14] text-slate-100 overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4 bg-slate-950 flex flex-col' : ''
      }`}
    >
      {/* Decorative Golden Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Navegação & Geolocalização VIP</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Cinzel',serif]">
            Mapa Interativo: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-teal-300">Maracajaú & Rio do Fogo</span>
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore as rotas sugeridas da costa de Natal aos recifes de corais mais cobiçados do Rio Grande do Norte.
            Localize os <strong>pontos de partida</strong>, as <strong>bases de embarque</strong> e as <strong>piscinas naturais</strong> em mar aberto com busca instantânea.
          </p>
        </div>

        {/* Search Bar & Instant Filtering Control Hub */}
        <div className="bg-[#091527]/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* 1. Instant Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ponto (ex: Maracajaú, Rio do Fogo, Banco de Areia, Plataforma, Pitangui...)"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Location & Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-1 hidden sm:flex">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                Filtrar:
              </span>

              <button
                type="button"
                onClick={() => setSelectedFilter('todos')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'todos'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                Todos ({MAP_POINTS.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('maracajau')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'maracajau'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-900 border border-slate-700 text-cyan-300 hover:border-cyan-500/50'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                Maracajaú VIP
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('rio-do-fogo')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'rio-do-fogo'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-slate-900 border border-slate-700 text-emerald-300 hover:border-emerald-500/50'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" />
                Rio do Fogo VIP
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('partida')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'partida'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-slate-900 border border-slate-700 text-amber-300 hover:border-amber-500/50'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                Pontos de Partida
              </button>
            </div>
          </div>

          {/* Instant Search Feedback Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {filteredPoints.length} ponto(s) encontrado(s)
              </span>
              {searchTerm && (
                <span className="text-slate-400">
                  para o termo &quot;<strong className="text-white">{searchTerm}</strong>&quot;
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-400 w-3.5 h-3.5"
                />
                <span>Exibir traçado das rotas</span>
              </label>

              <button
                type="button"
                onClick={handleResetView}
                className="hover:text-amber-300 underline transition-colors cursor-pointer"
              >
                Resetar visualização
              </button>
            </div>
          </div>
        </div>

        {/* Map & POI Sidebar Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
          {/* Left Column: Leaflet Map Container */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-[#091527] h-[450px] sm:h-[540px] lg:h-[600px] w-full">
              {/* Map Canvas */}
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Top Controls Overlay on Map */}
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-300 shadow-lg transition-all cursor-pointer"
                  title={isFullscreen ? 'Sair da tela cheia' : 'Expandir mapa'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Legend Overlay at Map Bottom-Left */}
              <div className="absolute bottom-3 left-3 z-20 hidden sm:block p-3 rounded-xl bg-[#050C16]/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-[11px] space-y-1.5 max-w-xs pointer-events-none">
                <div className="font-bold text-white flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Legenda de Cores das Rotas</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                  <span>Rota Náutica Maracajaú (7 km ao mar)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                  <span>Rota Náutica Rio do Fogo (5 km ao mar)</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <span className="w-3 h-1 bg-amber-400 rounded-full" />
                  <span>Transfer Terrestre Ponta Negra ➔ Litoral Norte</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Search Results & Point Details Sidebar */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
              <span>Pontos de Interesse Selecionados ({filteredPoints.length})</span>
              <span className="text-[11px] text-amber-300 font-normal">Clique para navegar no mapa</span>
            </div>

            {/* Scrollable POIs list */}
            <div className="overflow-y-auto space-y-2.5 max-h-[450px] sm:max-h-[540px] lg:max-h-[600px] pr-1 custom-scrollbar">
              {filteredPoints.length === 0 ? (
                <div className="p-8 text-center bg-[#091527]/70 border border-slate-800 rounded-2xl">
                  <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-300">Nenhum ponto encontrado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tente buscar por termos como &quot;Maracajaú&quot;, &quot;Rio do Fogo&quot; ou &quot;Banco de Areia&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFilter('todos');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition-colors"
                  >
                    Ver todos os pontos
                  </button>
                </div>
              ) : (
                filteredPoints.map((poi) => {
                  const isSelected = activePoi?.id === poi.id;
                  return (
                    <div
                      key={poi.id}
                      onClick={() => handleSelectPoi(poi)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D1E36] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/60'
                          : 'bg-[#091527]/80 hover:bg-[#0D1F38] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700 relative">
                          <img
                            src={poi.imageUrl}
                            alt={poi.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/maracajau/maracajau-mergulho-peixes.webp';
                            }}
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                            {poi.category === 'partida' ? 'Partida' : 'Recife'}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                poi.badgeColor || 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {poi.typeLabel}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
                            {poi.name}
                          </h4>

                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">
                            ${poi.description}
                          </p>

                          {poi.distanceFromNatal && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-300/90 font-medium mt-1.5">
                              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{poi.distanceFromNatal}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action footer */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Roteiro: <strong className="text-slate-200">{poi.recommendedTourName}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBooking(poi.recommendedTourId);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow cursor-pointer transition-all hover:scale-105"
                        >
                          <span>Ver Passeio</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
