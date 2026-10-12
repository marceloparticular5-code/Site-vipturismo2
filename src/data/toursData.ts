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
    title: 'Parrachos de Maracajaú + Dayuse + Parque Aquático Infantil',
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
    title: 'Litoral Sul 4x4 (Lagoas & Falésias)',
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

  // 7. Litoral Norte de Buggy Privativo Premium
  {
    id: 'buggy-vip-privativo',
    title: 'Litoral Norte de Buggy Privativo Premium',
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

  // 8. Transfer Aeroporto Privativo Premium
  {
    id: 'transfer-vip-aeroporto',
    title: 'Transfer Aeroporto Privativo Premium',
    subtitle: 'Recepção executiva privativa no Aeroporto de Natal com veículo climatizado',
    badge: 'Privativo Executivo',
    location: 'Aeroporto Internacional de Natal (NAT) ⇄ Hotéis de Natal',
    rating: 5.0,
    reviewsCount: 3900,
    priceOriginal: 300,
    priceDiscounted: 250,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 4,
    duration: 'Aprox. 45 min direto',
    includesDiving: false,
    isVip: true,
    category: 'transfer',
    remainingSlots: 5,
    urgencyText: 'R$ 250,00 por veículo executivo privativo (até 4 passageiros)',
    description:
      'Comece e termine suas férias em Natal com conforto e exclusividade. Motorista receptivo aguardando no desembarque com placa nominal, auxílio com malas e viagem direta em veículo moderno até seu hotel em Ponta Negra, Via Costeira ou Praia dos Artistas.',
    highlights: [
      'Recepção no portão de desembarque com identificação nominal',
      'Veículo executivo exclusivo para seu grupo (até 4 passageiros)',
      'Monitoramento de voo em tempo real (sem taxa em caso de atrasos)',
      'Veículos modernos com ar-condicionado de alta potência',
    ],
    included: [
      'Transfer executivo Aeroporto ➔ Hotel e Hotel ➔ Aeroporto',
      'Seguro passageiro',
      'Disponibilidade de cadeirinha infantil sob solicitação',
      'Suporte direto via WhatsApp para confirmação de voo',
    ],
    imageUrl: '/images/transfer/transfer-executivo-vip.webp',
  },

  // 9. Quadriciclo + Lagoa da Juventude
  {
    id: 'quadriciclo-aventura',
    title: 'Quadriciclo + Lagoa da Juventude',
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
    urgencyText: 'R$ 280,00 por quadriciclo (até 2 pessoas)',
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
    title: 'Auto do Potengi + City-Tour',
    subtitle: 'Fortaleza dos Reis Magos, Centro Histórico, Cajueiro e pôr do sol no Rio Potengi',
    badge: 'Cultura & Pôr do Sol',
    location: 'Natal / Rio Potengi e Fortaleza dos Reis Magos',
    rating: 4.94,
    reviewsCount: 760,
    priceOriginal: 190,
    priceDiscounted: 150,
    childPrice: 150,
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

  // 11. Buggy Litoral Norte Compartilhado
  {
    id: 'buggy-litoral-norte-compartilhado',
    title: 'Buggy Litoral Norte Compartilhado',
    subtitle: 'Vagas em buggy compartilhado com emoção pelas dunas e lagoas de Genipabu',
    badge: 'Compartilhado',
    location: 'Dunas de Genipabu / Extremoz (Litoral Norte)',
    rating: 4.95,
    reviewsCount: 1420,
    priceOriginal: 480,
    priceDiscounted: 410,
    childPrice: 410,
    pricingType: 'per_person',
    maxCapacity: 15,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: false,
    isVip: true,
    category: 'passeios',
    remainingSlots: 4,
    urgencyText: 'R$ 410,00 por pessoa · Buggy compartilhado homologado',
    description:
      'A emoção clássica das dunas de Genipabu com valor por pessoa em buggy compartilhado. Travessia de balsa artesanal, dunas móveis e paradas nas lagoas de Pitangui e Jacumã.',
    highlights: [
      'Bugueiro credenciado pelo Cadastur',
      'Dunas de Genipabu com emoção segura',
      'Travessia ecológica de balsa no Rio Ceará-Mirim',
      'Tempo livre nas lagoas de Pitangui e Jacumã',
    ],
    included: [
      'Transporte de ida e volta no hotel',
      'Taxa de balsa artesanal inclusa',
      'Seguro passageiro',
    ],
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
  },

  // 12. Litoral Norte Buggy VIP Premium + Pôr do Sol (Privativo)
  {
    id: 'buggy-litoral-norte-sunset',
    title: 'Litoral Norte Buggy VIP Premium + Pôr do Sol',
    subtitle: 'Buggy 100% exclusivo com balsa, dunas móveis, lagoas e o pôr do sol inesquecível',
    badge: 'Privativo Premium',
    location: 'Genipabu, Lagoas de Pitangui, Jacumã e Dunas Douradas',
    rating: 5.0,
    reviewsCount: 980,
    priceOriginal: 1500,
    priceDiscounted: 1300,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 4,
    duration: 'Dia inteiro + Pôr do Sol (aprox. 8h)',
    includesDiving: false,
    isVip: true,
    category: 'privativos',
    remainingSlots: 2,
    urgencyText: 'R$ 1.300,00 por buggy exclusivo (até 4 passageiros)',
    description:
      'A experiência definitiva de buggy em Natal: veículo privativo exclusivo para o seu grupo, travessia de balsa rústica, dunas móveis com emoção personalizada, banho nas lagoas e encerramento com o espetáculo do pôr do sol nas dunas.',
    highlights: [
      'Buggy privativo exclusivo com bugueiro credenciado Cadastur',
      'Dunas móveis de Genipabu e travessia ecológica de balsa',
      'Lagoas de Pitangui e Jacumã com tempo livre para lazer',
      'Parada especial para contemplar o pôr do sol nas dunas',
      'Busca e retorno direto na porta do seu hotel',
    ],
    included: [
      'Buggy 100% privativo para até 4 passageiros',
      'Bugueiro profissional credenciado',
      'Taxa de balsa artesanal ecológica inclusa',
      'Seguro atividade e passageiro integral',
    ],
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
  },

  // 13. Litoral Sul 4x4 VIP Premium (Privativo)
  {
    id: 'litoral-sul-4x4-vip-premium',
    title: 'Litoral Sul 4x4 VIP Premium',
    subtitle: 'Expedição privativa em veículo 4x4 climatizado com Lagoa do Carcará e falésias',
    badge: 'Privativo Premium',
    location: 'Litoral Sul (Nísia Floresta, Camurupim e Lagoa do Carcará)',
    rating: 5.0,
    reviewsCount: 750,
    priceOriginal: 1200,
    priceDiscounted: 1000,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 6,
    duration: 'Dia inteiro privativo (aprox. 8h)',
    includesDiving: false,
    isVip: true,
    category: 'privativos',
    remainingSlots: 2,
    urgencyText: 'R$ 1.000,00 por veículo 4x4 exclusivo (até 6 passageiros)',
    description:
      'Expedição 4x4 exclusiva em Mitsubishi Pajero Dakar com ar-condicionado. Roteiro personalizado pelo Litoral Sul com banho nas águas cristalinas da Lagoa do Carcará, falésias de Tabatinga, mirante dos golfinhos e paredões de Camurupim.',
    highlights: [
      'Veículo 4x4 Mitsubishi Pajero Dakar privativo com ar-condicionado',
      'Capacidade exclusiva para até 6 passageiros',
      'Lagoa do Carcará de águas transparentes e Lagoa de Arituba',
      'Paradas fotográficas exclusivas sem pressa no ritmo do seu grupo',
      'Motorista-guia especializado credenciado pelo Cadastur',
    ],
    included: [
      'Veículo 4x4 privativo climatizado exclusivo',
      'Motorista-guia Cadastur dedicado',
      'Água mineral a bordo e busca no hotel',
      'Seguro passageiro integral',
    ],
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
  },

  // 14. Pipa + Praia do Amor VIP Premium (Privativo)
  {
    id: 'pipa-praia-do-amor-vip-premium',
    title: 'Pipa + Praia do Amor VIP Premium',
    subtitle: 'Transporte executivo privativo em Spin 6 lugares com falésias e Chapadão',
    badge: 'Privativo Premium',
    location: 'Praia da Pipa / Falésias do Chapadão e Baía dos Golfinhos',
    rating: 4.98,
    reviewsCount: 820,
    priceOriginal: 700,
    priceDiscounted: 550,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 6,
    duration: 'Dia inteiro privativo (aprox. 9h)',
    includesDiving: false,
    isVip: true,
    category: 'privativos',
    remainingSlots: 3,
    urgencyText: 'R$ 550,00 por Spin executiva 6 lugares (até 6 passageiros)',
    description:
      'Passeio privativo até a praia mais famosa do Rio Grande do Norte em veículo Chevrolet Spin executivo e climatizado. Conforto total para até 6 pessoas, com paradas no Chapadão, Praia do Amor e tempo livre na vila de Pipa.',
    highlights: [
      'Veículo Chevrolet Spin executivo exclusivo (até 6 lugares)',
      'Horário flexível de saída e retorno acordado com o grupo',
      'Mirante do Chapadão com vista panorâmica da Praia do Amor',
      'Tempo livre para almoço e compras na charmosa vila de Pipa',
      'Parada para contemplar o pôr do sol na Lagoa Guaraíras',
    ],
    included: [
      'Veículo executivo Spin privativo climatizado',
      'Motorista profissional receptivo com busca no hotel',
      'Combustível e pedágios inclusos',
      'Seguro passageiro integral',
    ],
    imageUrl: '/images/pipa/pipa-falesias-amor.webp',
  },

  // 15. Pipa By-Night VIP Premium (Privativo)
  {
    id: 'pipa-by-night-vip-premium',
    title: 'Pipa By-Night VIP Premium',
    subtitle: 'Noite privativa em Spin 6 lugares para jantar e curtir a vila charmosa de Pipa',
    badge: 'Privativo Premium',
    location: 'Vila de Pipa / Rua do Céu e Av. Baía dos Golfinhos',
    rating: 4.97,
    reviewsCount: 640,
    priceOriginal: 800,
    priceDiscounted: 650,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 6,
    duration: 'Noite privativa (17:30 às 23:30)',
    includesDiving: false,
    isVip: true,
    category: 'privativos',
    remainingSlots: 3,
    urgencyText: 'R$ 650,00 por Spin executiva 6 lugares (até 6 passageiros)',
    description:
      'Aproveite a noite charmosa e cosmopolita de Pipa com a comodidade e segurança de um transporte privativo executivo só para você e seus acompanhantes. Jantar nos melhores bistrôs e curtir música ao vivo sem preocupação com estrada.',
    highlights: [
      'Transporte privativo em Chevrolet Spin executiva climatizada (até 6 pessoas)',
      'Segurança total para degustar gastronomia na noite de Pipa',
      'Horário de retorno flexível combinado diretamente com o motorista',
      'Desembarque seguro direto na porta do seu hotel em Natal',
    ],
    included: [
      'Veículo executivo Spin privativo exclusivo ida e volta',
      'Motorista profissional dedicado à disposição',
      'Ar-condicionado e seguro viagem',
    ],
    imageUrl: '/images/pipa-by-night/pipa-night-village.webp',
  },

  // 16. City-Tour Histórico (Privativo)
  {
    id: 'city-tour-historico-vip-premium',
    title: 'City-Tour Histórico',
    subtitle: 'Roteiro privativo em Spin 6 lugares com Fortaleza dos Reis Magos e Rio Potengi',
    badge: 'Privativo Premium',
    location: 'Natal Histórica / Fortaleza dos Reis Magos e Ponte Newton Navarro',
    rating: 4.96,
    reviewsCount: 510,
    priceOriginal: 700,
    priceDiscounted: 550,
    childPrice: 0,
    pricingType: 'vehicle_fixed',
    maxCapacity: 6,
    duration: 'Tarde e pôr do sol privativo (aprox. 6h)',
    includesDiving: false,
    isVip: true,
    category: 'privativos',
    remainingSlots: 4,
    urgencyText: 'R$ 550,00 por Spin executiva 6 lugares (até 6 passageiros)',
    description:
      'Mergulhe na rica história e cultura potiguar em um city-tour privativo e confortável em Chevrolet Spin 6 lugares. Fortaleza dos Reis Magos, Centro Histórico com seus casarios, Centro de Turismo e o pôr do sol cinematográfico no Rio Potengi.',
    highlights: [
      'Veículo Chevrolet Spin executivo privativo climatizado (até 6 pessoas)',
      'Visita guiada histórica na Fortaleza dos Reis Magos',
      'Parada para compras de artesanato potiguar no Centro de Turismo',
      'Pôr do sol cinematográfico nas margens do Rio Potengi',
    ],
    included: [
      'Transporte privativo com motorista dedicado',
      'Busca e retorno no hotel',
      'Roteiro personalizado ao ritmo do grupo',
      'Seguro passageiro',
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
