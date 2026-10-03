import { BookingAddon, TourPackage } from '../types';

export const VIP_TOURS: TourPackage[] = [
  // 1. Pacote Casal VIP (Destaque Principal)
  {
    id: 'pacote-casal-vip',
    title: 'Pacote Casal VIP · 4 Dias + Transfer',
    subtitle: 'Transfer aeroporto-hotel-aeroporto + 4 dias de passeios privativos para 2 pessoas',
    badge: 'Oferta Especial Casal',
    location: 'Natal, Maracajaú, Pipa e Litoral Sul',
    rating: 5.0,
    reviewsCount: 1420,
    priceOriginal: 1650,
    priceDiscounted: 1320,
    duration: '4 Dias Completos',
    includesDiving: true,
    isVip: true,
    category: 'pacotes',
    remainingSlots: 3,
    urgencyText: 'R$ 1.320 para 2 pessoas em até 3x sem juros ou 5% de desconto no Pix',
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
      'Parcelamento em até 3x sem juros no cartão ou desconto no Pix',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
  },

  // 2. Passeio Maracajaú
  {
    id: 'maracajau-vip',
    title: 'Passeio Maracajaú (Caribe Brasileiro)',
    subtitle: 'Mergulho nas piscinas naturais a 7km da costa com lancha rápida e plataforma flutuante',
    badge: 'Mais Vendido',
    location: 'Maxaranguape / Parrachos de Maracajaú',
    rating: 4.98,
    reviewsCount: 2840,
    priceOriginal: 210,
    priceDiscounted: 170,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: true,
    isVip: true,
    category: 'passeios',
    remainingSlots: 4,
    urgencyText: 'R$ 170 por pessoa · Opcional: Trilha de Quadriciclo 4x4',
    description:
      'Navegue em lancha rápida até as piscinas de corais cristalinas mais famosas do Nordeste. Águas mornas repletas de peixes tropicais com apoio de plataforma VIP. Opção de quadriciclo pelas dunas e lagoas da região.',
    highlights: [
      'Embarque veloz em lanchas homologadas pela Capitania dos Portos',
      'Kit completo de mergulho (máscara, snorkel e colete flutuador)',
      'Plataforma flutuante com apoio, segurança e sombra',
      'Opcional: Trilha ecológica de Quadriciclo pelas dunas',
      'Acesso ao clube de praia parceiro à beira-mar',
    ],
    included: [
      'Busca e retorno na porta do hotel em Ponta Negra ou Via Costeira',
      'Passeio de lancha rápida até os arrecifes de corais',
      'Kit de mergulho higienizado e instrutor de bordo',
      'Seguro passageiro náutico integral',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },

  // 3. Passeio Rio do Fogo
  {
    id: 'rio-do-fogo-vip',
    title: 'Passeio Rio do Fogo (Piscinas Preservadas)',
    subtitle: 'Piscinas naturais paradisíacas e o famoso banco de areia dourado em alto-mar',
    badge: 'Águas Cristalinas',
    location: 'Rio do Fogo (Litoral Norte de Natal)',
    rating: 4.99,
    reviewsCount: 1690,
    priceOriginal: 220,
    priceDiscounted: 170,
    duration: 'Dia inteiro (Aprox. 8h)',
    includesDiving: true,
    isVip: true,
    category: 'passeios',
    remainingSlots: 2,
    urgencyText: 'R$ 170 por pessoa · Vagas limitadas para preservação ambiental',
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
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },

  // 4. Passeio Pipa + Praia do Amor
  {
    id: 'pipa-praia-do-amor',
    title: 'Passeio Pipa + Praia do Amor',
    subtitle: 'Falésias vermelhas do Chapadão, Baía dos Golfinhos e a icônica Praia do Amor',
    badge: 'Preço Imbatível',
    location: 'Tibau do Sul / Praia da Pipa',
    rating: 4.97,
    reviewsCount: 3200,
    priceOriginal: 120,
    priceDiscounted: 80,
    duration: 'Dia inteiro (Aprox. 9h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 5,
    urgencyText: 'R$ 80 por pessoa · Opcional: Passeio de lancha com golfinhos (+R$ 75)',
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
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },

  // 5. Pipa By Night
  {
    id: 'pipa-by-night',
    title: 'Pipa By Night (Noite Charmosa)',
    subtitle: 'Gastronomia sofisticada, música ao vivo e o charme das ruelas iluminadas de Pipa',
    badge: 'Sextas & Sábados',
    location: 'Vila de Pipa / Rua do Céu e Av. Baía dos Golfinhos',
    rating: 4.96,
    reviewsCount: 1150,
    priceOriginal: 140,
    priceDiscounted: 100,
    duration: 'Noite (17:30 às 23:30)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 6,
    urgencyText: 'R$ 100 por pessoa · Saídas exclusivas nas noites de sextas e sábados',
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
    imageUrl:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  },

  // 6. Off-Road Litoral Sul 4x4 Premium
  {
    id: 'off-road-litoral-sul',
    title: 'Off-Road Litoral Sul 4x4 Premium',
    subtitle: 'Expedição em veículos 4x4 Pajero Dakar pelas lagoas cristalinas, falésias e dunas',
    badge: 'Experiência 4x4 VIP',
    location: 'Litoral Sul (Nísia Floresta, Camurupim e Búzios)',
    rating: 4.99,
    reviewsCount: 1890,
    priceOriginal: 0,
    priceDiscounted: 0, // Sob consulta
    duration: 'Dia inteiro (Aprox. 8h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 2,
    urgencyText: 'Sob Consulta · Veículo 4x4 exclusivo e climatizado para sua família',
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
    imageUrl:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
  },

  // 7. Buggy VIP Premium Privativo
  {
    id: 'buggy-vip-privativo',
    title: 'Buggy VIP Premium Privativo (Genipabu)',
    subtitle: 'O lendário passeio de buggy pelas dunas móveis do Litoral Norte com balsa e lagoas',
    badge: 'Privativo Exclusivo',
    location: 'Dunas de Genipabu / Extremoz (Litoral Norte)',
    rating: 5.0,
    reviewsCount: 2750,
    priceOriginal: 0,
    priceDiscounted: 0, // Sob consulta
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 3,
    urgencyText: 'Sob Consulta · Buggy 100% exclusivo com saída direta da recepção do hotel',
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
      'Embarque e desembarque na porta do hotel em Ponta Negra',
      'Taxa de balsa artesanal ecológica inclusa',
      'Roteiro sem pressa com tempo livre nas lagoas',
      'Seguro atividade e assistência total',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },

  // 8. Transfer VIP Aeroporto
  {
    id: 'transfer-vip-aeroporto',
    title: 'Transfer VIP Aeroporto de Natal (NAT)',
    subtitle: 'Recepção executiva no saguão, veículo 100% climatizado e pontualidade garantida',
    badge: 'Conforto & Pontualidade',
    location: 'Aeroporto Internacional de Natal (NAT) ⇄ Hotéis de Natal',
    rating: 5.0,
    reviewsCount: 3900,
    priceOriginal: 200,
    priceDiscounted: 160,
    duration: 'Aprox. 45 min direto',
    includesDiving: false,
    isVip: true,
    category: 'transfer',
    remainingSlots: 5,
    urgencyText: 'R$ 160 até 4 passageiros com bagagens · Monitoramento de voo em tempo real',
    description:
      'Comece e termine suas férias em Natal sem estresse. Motorista receptivo aguardando no desembarque com placa nominal, auxílio com malas e viagem direta em veículo moderno e higienizado até seu hotel em Ponta Negra ou Via Costeira.',
    highlights: [
      'Recepção no portão de desembarque com identificação nominal',
      'Valor fixo de R$ 160 para até 4 passageiros com malas',
      'Monitoramento de voo em tempo real (sem taxa em caso de atrasos)',
      'Veículos modernos com ar-condicionado de alta potência',
    ],
    included: [
      'Transfer executivo Aeroporto ➔ Hotel ou Hotel ➔ Aeroporto',
      'Seguro passageiro',
      'Disponibilidade de cadeirinha infantil gratuita sob solicitação',
      'Suporte direto via WhatsApp para confirmação de voo',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
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
