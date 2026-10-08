import { BookingAddon, TourPackage } from '../types';

export const VIP_TOURS: TourPackage[] = [
  // 1. Pacote Casal VIP (Destaque Principal)
  {
    id: 'pacote-casal-vip',
    title: 'Pacote Casal VIP · 4 Dias + Transfer',
    subtitle: 'Transfer aeroporto in/out + 4 dias de passeios privativos (R$ 1.320 total para 2 pessoas / casal)',
    badge: 'Oferta Especial Casal',
    location: 'Natal, Maracajaú, Pipa e Litoral Sul',
    rating: 5.0,
    reviewsCount: 1420,
    priceOriginal: 1650,
    priceDiscounted: 1320,
    childPrice: 0,
    pricingType: 'couple_fixed',
    maxCapacity: 8,
    duration: '4 Dias Completos',
    includesDiving: true,
    isVip: true,
    category: 'pacotes',
    remainingSlots: 3,
    urgencyText: 'R$ 1.320,00 fechado para 2 pessoas (casal) em até 3x sem juros no cartão ou Pix',
    description:
      'A viagem dos sonhos a dois: transfer executivo in/out no Aeroporto de Natal, passeio aos Parrachos de Maracajaú com lancha rápida, dia romântico em Pipa com falésias do Chapadão e pôr do sol, expedição 4x4 no Litoral Sul e buggy com emoção.',
    highlights: [
      'Transfer executivo exclusivo Aeroporto ⇄ Hotel ida e volta',
      'Parrachos de Maracajaú com lancha rápida e kit snorkel incluso',
      'Pipa VIP: Baía dos Golfinhos, Chapadão e pôr do sol na Lagoa Guaraíras',
      'Expedição 4x4 pelas lagoas do Carcará e Arituba',
      'Assistência de concierge VIP dedicada 24h via WhatsApp',
    ],
    included: [
      'Transfer in/out climatizado privativo para 2 pessoas',
      'Todos os ingressos e taxas de embarque náutico inclusos',
      'Veículos credenciados Cadastur com ar-condicionado',
      'Pague com Pix ou cartão em até 3x sem juros',
    ],
    imageUrl: '/images/pacote-casal/casal-vip-buggy-praia.webp',
  },

  // 2. Passeio Maracajaú + Dayuse
  {
    id: 'maracajau-vip',
    title: 'Maracajaú + Dayuse (Caribe Brasileiro)',
    subtitle: 'Mergulho nas piscinas naturais a 7km da costa com lancha rápida e plataforma flutuante',
    badge: 'Mais Vendido',
    location: 'Maxaranguape / Parrachos de Maracajaú',
    rating: 4.98,
    reviewsCount: 2840,
    priceOriginal: 210,
    priceDiscounted: 170,
    childPrice: 110, // Crianças de 3 a 11 anos: R$ 110,00
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: true,
    isVip: true,
    category: 'passeios',
    remainingSlots: 4,
    urgencyText: 'R$ 170,00 por adulto · R$ 110,00 criança (3 a 11 anos) · Dayuse incluso',
    description:
      'Navegue em lancha rápida até as piscinas de corais cristalinas mais famosas do Nordeste. Águas mornas repletas de peixes tropicais com apoio de plataforma VIP. Opção de quadriciclo pelas dunas e lagoas da região.',
    highlights: [
      'Embarque veloz em lanchas homologadas pela Capitania dos Portos',
      'Kit completo de mergulho (máscara, snorkel e colete flutuador)',
      'Plataforma flutuante com apoio, segurança e sombra',
      'Dayuse em clube à beira-mar com piscinas e restaurante',
      'Busca e retorno no hotel',
    ],
    included: [
      'Busca e retorno na porta do hotel em Ponta Negra, Via Costeira ou Praia dos Artistas',
      'Passeio de lancha rápida até os arrecifes de corais',
      'Kit de mergulho higienizado e instrutor de bordo',
      'Seguro passageiro náutico integral',
    ],
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
  },

  // 3. Passeio Rio do Fogo + Punaú
  {
    id: 'rio-do-fogo-vip',
    title: 'Rio do Fogo + Punaú (Piscinas & Banco de Areia)',
    subtitle: 'Piscinas naturais paradisíacas e o famoso banco de areia dourado em alto-mar',
    badge: 'Águas Cristalinas',
    location: 'Rio do Fogo (Litoral Norte de Natal)',
    rating: 4.99,
    reviewsCount: 1690,
    priceOriginal: 220,
    priceDiscounted: 170,
    childPrice: 110, // Crianças de 3 a 11 anos: R$ 110,00
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Dia inteiro (Aprox. 8h)',
    includesDiving: true,
    isVip: true,
    category: 'passeios',
    remainingSlots: 2,
    urgencyText: 'R$ 170,00 por adulto · R$ 110,00 criança (3 a 11 anos)',
    description:
      'Um refúgio preservado de águas transparentes e calmas. Além das piscinas de corais, na maré baixa surge um incrível banco de areia no meio do oceano para fotos espetaculares.',
    highlights: [
      'Piscinas naturais preservadas com rica vida marinha',
      'Visita ao banco de areia paradisíaco no meio do mar',
      'Navegação segura em catamarã ou lancha rápida homologada',
      'Parada para almoço em restaurante com culinária potiguar típica',
    ],
    included: [
      'Transfer executivo hotel ⇄ ponto de embarque ⇄ hotel',
      'Passeio náutico até as piscinas e banco de areia',
      'Kit snorkel e colete flutuador',
      'Guia credenciado Cadastur acompanhante',
    ],
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
  },

  // 4. Passeio Pipa + Praia do Amor (VAN)
  {
    id: 'pipa-praia-do-amor',
    title: 'Pipa + Praia do Amor (VAN)',
    subtitle: 'Falésias vermelhas do Chapadão, Baía dos Golfinhos e a icônica Praia do Amor',
    badge: 'Preço Imbatível',
    location: 'Tibau do Sul / Praia da Pipa',
    rating: 4.97,
    reviewsCount: 3200,
    priceOriginal: 120,
    priceDiscounted: 80,
    childPrice: 60, // Crianças de 3 a 11 anos: R$ 60,00
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Dia inteiro (Aprox. 9h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 5,
    urgencyText: 'R$ 80,00 por adulto · R$ 60,00 criança (3 a 11 anos) - (VAN Executiva Climatizada)',
    description:
      'Visite a praia mais famosa e charmosa do Rio Grande do Norte. Mirante do Chapadão com vista panorâmica da Praia do Amor, banho de mar, tempo livre na vila de Pipa e opção de lancha para observar golfinhos de perto.',
    highlights: [
      'Mirante do Chapadão com vista espetacular das falésias',
      'Praia do Amor e Praia do Centro de Pipa',
      'Vila charmosa com lojas de artesanato, bistrôs e cafés',
      'Opcional: Passeio de lancha na Baía dos Golfinhos (+R$ 75)',
      'Espetáculo do pôr do sol na Lagoa Guaraíras',
    ],
    included: [
      'Transporte executivo climatizado ida e volta do seu hotel',
      'Guia de turismo credenciado pelo Ministério do Turismo (Cadastur)',
      'Paradas programadas nos melhores mirantes para fotos',
      'Seguro viagem para todos os passageiros',
    ],
    imageUrl: '/images/pipa/pipa-falesias-amor.webp',
  },

  // 5. Pipa By-Night
  {
    id: 'pipa-by-night',
    title: 'Pipa by-Night (Noite Charmosa)',
    subtitle: 'Gastronomia sofisticada, música ao vivo e o charme das ruelas iluminadas de Pipa',
    badge: 'Sextas & Sábados',
    location: 'Vila de Pipa / Rua do Céu e Av. Baía dos Golfinhos',
    rating: 4.96,
    reviewsCount: 1150,
    priceOriginal: 140,
    priceDiscounted: 100,
    childPrice: 100, // Crianças: mesmo valor do adulto (editável por passeio)
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Noite (17:30 às 23:30)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 6,
    urgencyText: 'R$ 100,00 por pessoa · Retorno seguro direto no hotel',
    description:
      'Viva a efervescência noturna de Pipa sem se preocupar com trânsito ou direção. Transporte executivo de ida e volta, tempo livre para jantar nos melhores restaurantes, curtir bares com música ao vivo e passear pela badalada Rua do Céu.',
    highlights: [
      'Transporte noturno confortável com segurança total',
      'Tempo livre na vila de Pipa para compras e gastronomia',
      'Rua do Céu iluminada e bares temáticos com música ao vivo',
      'Retorno programado com desembarque direto na porta do seu hotel',
    ],
    included: [
      'Transfer executivo hotel ⇄ Vila de Pipa ⇄ hotel',
      'Ar-condicionado e motorista profissional',
      'Dicas gastronômicas e descontos em parceiros de Pipa',
    ],
    imageUrl: '/images/pipa-by-night/pipa-night-village.webp',
  },

  // 6. Off-Road Litoral Sul 4x4
  {
    id: 'off-road-litoral-sul',
    title: 'Litoral Sul 4X4 (Lagoas & Falésias)',
    subtitle: 'Expedição em veículos 4x4 Pajero Dakar pelas lagoas cristalinas, falésias e dunas',
    badge: 'Experiência 4x4 VIP',
    location: 'Litoral Sul (Nísia Floresta, Camurupim e Búzios)',
    rating: 4.99,
    reviewsCount: 1890,
    priceOriginal: 190,
    priceDiscounted: 150,
    childPrice: 150, // Crianças: mesmo valor do adulto (editável por passeio)
    pricingType: 'per_person',
    maxCapacity: 6,
    duration: 'Dia inteiro (Aprox. 8h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 2,
    urgencyText: 'R$ 150,00 por pessoa · Veículo 4x4 exclusivo e climatizado',
    description:
      'Uma expedição fascinante por caminhos rurais e praias desertas. Inclui Barreira do Inferno, Maior Cajueiro do Mundo, banho na Lagoa do Carcará de águas transparentes, arrecifes de Camurupim e o pôr do sol nas Dunas Douradas de Búzios.',
    highlights: [
      'Veículos 4x4 Mitsubishi Pajero Dakar com ar-condicionado',
      'Banho nas águas cristalinas da Lagoa do Carcará',
      'Piscinas naturais e paredões de arrecifes em Camurupim',
      'Pôr do sol cinematográfico nas Dunas Douradas de Búzios',
      'Roteiro personalizado ao ritmo do seu grupo',
    ],
    included: [
      'Veículo 4x4 exclusivo com motorista-guia Cadastur',
      'Busca e retorno no hotel',
      'Água mineral gelada a bordo',
      'Seguro passageiro integral',
    ],
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
  },

  // 7. Litoral Norte de Buggy (Genipabu)
  {
    id: 'buggy-vip-privativo',
    title: 'Litoral Norte de Buggy (Genipabu)',
    subtitle: 'O lendário passeio de buggy pelas dunas móveis com balsa e lagoas',
    badge: 'Privativo Exclusivo',
    location: 'Dunas de Genipabu / Extremoz (Litoral Norte)',
    rating: 5.0,
    reviewsCount: 2750,
    priceOriginal: 950,
    priceDiscounted: 820,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 4,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 3,
    urgencyText: 'R$ 820,00 Privativo para até 4 passageiros (÷ 2 Casais: R$ 205/pessoa)',
    description:
      'O passeio mais clássico do Nordeste feito sob medida: buggy privativo apenas para você e seus acompanhantes (até 4 pessoas). Travessia de balsa rústica, dunas móveis com emoção dosada por você, lagoas de Pitangui e Jacumã com esquibunda e kamikaze.',
    highlights: [
      'Buggy credenciado exclusivo para até 4 passageiros',
      'Bugueiro profissional credenciado pelo Cadastur',
      'Dunas de Genipabu com emoção segura',
      'Travessia ecológica de balsa no Rio Ceará-Mirim',
      'Lagoas de Pitangui e Jacumã com opções de lazer',
    ],
    included: [
      'Embarque e desembarque na porta do hotel em Ponta Negra, Via Costeira ou Praia dos Artistas',
      'Taxa de balsa artesanal ecológica inclusa',
      'Roteiro sem pressa com tempo livre nas lagoas',
      'Seguro atividade e assistência total',
    ],
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
  },

  // 8. Transfer Aeroporto Promocional
  {
    id: 'transfer-vip-aeroporto',
    title: 'Transfer Aeroporto Promocional (2 Trajetos)',
    subtitle: 'Na contratação de 1 ou mais passeios, de R$ 250 fica por apenas R$ 160 (Ida e Volta)',
    badge: 'Promoção VIP',
    location: 'Aeroporto Internacional de Natal (NAT) ⇄ Hotéis de Natal',
    rating: 5.0,
    reviewsCount: 3900,
    priceOriginal: 250,
    priceDiscounted: 160,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 4,
    duration: 'Aprox. 45 min direto',
    includesDiving: false,
    isVip: true,
    category: 'transfer',
    remainingSlots: 5,
    urgencyText: 'R$ 160,00 por veículo executivo (até 4 passageiros · 2 Trajetos)',
    description:
      'Comece e termine suas férias em Natal sem estresse. Motorista receptivo aguardando no desembarque com placa nominal, auxílio com malas e viagem direta em veículo moderno e higienizado até seu hotel em Ponta Negra, Via Costeira ou Praia dos Artistas.',
    highlights: [
      'Recepção no portão de desembarque com identificação nominal',
      'Valor promocional de R$ 160 para 2 trajetos (chegada e retorno)',
      'Monitoramento de voo em tempo real (sem taxa em caso de atrasos)',
      'Veículos modernos com ar-condicionado de alta potência',
    ],
    included: [
      'Transfer executivo Aeroporto ➔ Hotel e Hotel ➔ Aeroporto (2 trajetos)',
      'Seguro passageiro',
      'Disponibilidade de cadeirinha infantil gratuita sob solicitação',
      'Suporte direto via WhatsApp para confirmação de voo',
    ],
    imageUrl: '/images/transfer/transfer-executivo-vip.webp',
  },

  // 9. Quadriciclo Aventura
  {
    id: 'quadriciclo-aventura',
    title: 'Passeio de Quadriciclo (Até 2 Pessoas)',
    subtitle: 'Pilotagem de quadriciclo 4x4 automático por dunas, lagoas e trilhas ecológicas',
    badge: 'Aventura 4x4',
    location: 'Litoral Norte e Sul (Lagoa de Alcaçuz / Barra de Tabatinga)',
    rating: 4.95,
    reviewsCount: 890,
    priceOriginal: 350,
    priceDiscounted: 280,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 2,
    duration: 'Aprox. 2h30 de trilha',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 4,
    urgencyText: 'R$ 280,00 "Quadriciclo até 2 pessoas"',
    description:
      'Sinta a emoção de pilotar seu próprio quadriciclo 4x4 por trilhas rurais, dunas e lagoas deslumbrantes. O veículo suporta até 2 pessoas com total estabilidade e instrutor guia acompanhante.',
    highlights: [
      'Quadriciclos 4x4 automáticos e fáceis de pilotar',
      'Trilha em lagoas de água doce para banho',
      'Equipamentos de segurança (capacetes e óculos) inclusos',
      'Paradas fotográficas em mirantes naturais',
    ],
    included: [
      'Locação do quadriciclo para até 2 passageiros',
      'Instrutor guia em quadriciclo líder',
      'Combustível e equipamentos de proteção',
      'Instrução prática antes da partida',
    ],
    imageUrl: '/images/quadriciclo/quadriciclo-lagoa-casal.webp',
  },

  // 10. Auto do Potengi + City-Tour
  {
    id: 'auto-do-potengi',
    title: 'Auto do Potengi + City-Tour Histórico',
    subtitle: 'Fortaleza dos Reis Magos, Centro Histórico, Cajueiro e pôr do sol no Rio Potengi',
    badge: 'Cultura & Pôr do Sol',
    location: 'Natal / Rio Potengi e Fortaleza dos Reis Magos',
    rating: 4.94,
    reviewsCount: 760,
    priceOriginal: 190,
    priceDiscounted: 150,
    childPrice: 150, // Crianças: mesmo valor do adulto (editável por passeio)
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Tarde e pôr do sol (Aprox. 6h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 3,
    urgencyText: 'R$ 150,00 por pessoa · Inclui contemplação do pôr do sol no Potengi',
    description:
      'Conheça a história e os marcos culturais da Cidade do Sol: Fortaleza dos Reis Magos, Centro Histórico com casario colonial e navegação com o espetáculo do pôr do sol nas águas do Rio Potengi ao som do saxofone.',
    highlights: [
      'Visita guiada à histórica Fortaleza dos Reis Magos',
      'Tour panorâmico pelo Centro Histórico e Ponte Newton Navarro',
      'Pôr do sol cinematográfico no Rio Potengi',
      'Guia historiador credenciado pelo Cadastur',
    ],
    included: [
      'Transporte executivo climatizado com busca no hotel',
      'Guia credenciado Cadastur',
      'Ingressos e seguro viagem inclusos',
    ],
    imageUrl: '/images/city-tour/fortaleza-magos-sunset.webp',
  },
];

export const AVAILABLE_ADDONS: BookingAddon[] = [
  {
    id: 'fotos-gopro',
    name: 'Ensaio Subaquático GoPro 4K',
    price: 60,
    description: '15 fotos em alta definição com peixes coloridos e ângulos profissionais.',
    iconName: 'Camera',
  },
  {
    id: 'lancha-golfinhos',
    name: 'Passeio de Lancha com Golfinhos em Pipa',
    price: 75,
    description: 'Navegação até a Baía dos Golfinhos para avistar golfinhos livres.',
    iconName: 'Anchor',
  },
  {
    id: 'quadriciclo-opcional',
    name: 'Trilha de Quadriciclo 4x4 (Opcional Maracajaú)',
    price: 180,
    description: 'Pilotagem de quadriciclo 4x4 automático por dunas e lagoas.',
    iconName: 'Car',
  },
  {
    id: 'transfer-privativo-upgrade',
    name: 'Upgrade Veículo 100% Exclusivo VIP',
    price: 120,
    description: 'Carro privativo para seu casal ou família sem paradas adicionais.',
    iconName: 'Car',
  },
];

export interface TourPricingCalculation {
  adultPrice: number;
  childPrice: number;
  adultsTotal: number;
  childrenTotal: number;
  tourTotal: number;
  isCouple: boolean;
  isVehicle: boolean;
  couplesCount: number;
  maxCapacity: number;
}

/**
 * Calculates tour pricing based on passenger counts (Adults 12+ and Children 3 to 11).
 * Supports exception rules for Pacote Casal VIP, Transfer VIP Aeroporto, and Buggy Privativo.
 */
export function getTourPricing(
  tour: TourPackage,
  adults: number,
  children: number
): TourPricingCalculation {
  const safeAdults = Math.max(0, adults);
  const safeChildren = Math.max(0, children);
  const basePrice = tour.priceDiscounted;

  // 1. Pacote Casal VIP (Preço fechado para 2 pessoas / casal)
  if (tour.id === 'pacote-casal-vip' || tour.pricingType === 'couple_fixed') {
    const couples = Math.max(1, Math.ceil(safeAdults / 2));
    const adultsTotal = couples * basePrice;
    const childPrice = typeof tour.childPrice === 'number' ? tour.childPrice : 0;
    const childrenTotal = safeChildren * childPrice;
    return {
      adultPrice: basePrice,
      childPrice,
      adultsTotal,
      childrenTotal,
      tourTotal: adultsTotal + childrenTotal,
      isCouple: true,
      isVehicle: false,
      couplesCount: couples,
      maxCapacity: tour.maxCapacity || 8,
    };
  }

  // 2. Transfer VIP Aeroporto & Veículo Privativo (Buggy, Quadriciclo)
  // Preço por veículo (até a capacidade máxima); passageiros validam a capacidade sem multiplicar o valor
  if (
    tour.id === 'transfer-vip-aeroporto' ||
    tour.id === 'buggy-vip-privativo' ||
    tour.id === 'genipabu-buggy-vip' ||
    tour.id === 'quadriciclo-aventura' ||
    tour.pricingType === 'vehicle_fixed'
  ) {
    const maxCap = tour.id === 'quadriciclo-aventura' ? 2 : (tour.maxCapacity || 4);
    return {
      adultPrice: basePrice,
      childPrice: 0,
      adultsTotal: basePrice,
      childrenTotal: 0,
      tourTotal: basePrice,
      isCouple: false,
      isVehicle: true,
      couplesCount: 0,
      maxCapacity: maxCap,
    };
  }

  // 3. Passeios padrão por pessoa (Pipa R$ 60 criança, Rio do Fogo R$ 110 criança, Maracajaú R$ 110 criança)
  // Se o passeio não tiver valor infantil definido, usa o mesmo valor do adulto
  const adultPrice = basePrice;
  const childPrice = typeof tour.childPrice === 'number' ? tour.childPrice : adultPrice;
  const adultsTotal = safeAdults * adultPrice;
  const childrenTotal = safeChildren * childPrice;

  return {
    adultPrice,
    childPrice,
    adultsTotal,
    childrenTotal,
    tourTotal: adultsTotal + childrenTotal,
    isCouple: false,
    isVehicle: false,
    couplesCount: 0,
    maxCapacity: tour.maxCapacity || 15,
  };
}
