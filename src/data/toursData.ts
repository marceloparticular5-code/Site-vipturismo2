import { BookingAddon, TourPackage } from '../types';

export const VIP_TOURS: TourPackage[] = [
  // 1. Pacote Vip Premium
  {
    id: 'pacote-vip-premium',
    title: 'Pacote VIP Premium · Combo Completo',
    subtitle: 'A experiência definitiva em Natal: Roteiro VIP com os melhores atrativos e marés selecionadas',
    badge: 'Mais Vendido · Combo VIP',
    location: 'Litoral Sul & Litoral Norte Completo de Natal',
    rating: 5.0,
    reviewsCount: 3120,
    priceOriginal: 820,
    priceDiscounted: 589,
    duration: 'Combo Multidias Programados',
    includesDiving: true,
    isVip: true,
    category: 'combo',
    remainingSlots: 3,
    urgencyText: 'Economize mais de R$ 230 reservando o combo exclusivo 2026',
    description:
      'O pacote definitivo para quem deseja vivenciar o melhor do Rio Grande do Norte com conforto absoluto e sem preocupações. Inclui os atrativos imperdíveis: Pipa com falésias e golfinhos, Litoral Sul 4x4 Rota dos Nativos, Dunas de Genipabu com emoção e Parrachos de Maracajaú com piscinas naturais cristalinas.',
    highlights: [
      'Roteiro completo sincronizado com as melhores tábuas de maré baixa',
      'Pipa VIP: Chapadão panorâmico, Baía dos Golfinhos e Lagoa Guaraíras',
      'Litoral Sul 4x4: Veículo Pajero Dakar pelas lagoas, arrecifes e pôr do sol em Búzios',
      'Litoral Norte de Buggy: Dunas de Genipabu, balsa ecológica e lagoas',
      'Parrachos de Maracajaú: Mergulho livre com snorkel em águas azul-turquesa',
    ],
    included: [
      'Busca e retorno em todos os passeios na recepção do seu hotel',
      'Frota premium climatizada, segura e higienizada',
      'Embarcações homologadas pela capitania e kit snorkel incluso',
      'Atendimento prioritário de concierge via WhatsApp 24h',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },

  // 2. Litoral Norte de Buggy
  {
    id: 'litoral-norte-buggy',
    title: 'Litoral Norte de Buggy (Dunas de Genipabu)',
    subtitle: 'O lendário clássico potiguar com emoção pelas dunas móveis, balsa e lagoas',
    badge: 'Clássico Obrigatório',
    location: 'Extremoz / Genipabu (Litoral Norte)',
    rating: 4.98,
    reviewsCount: 2450,
    priceOriginal: 220,
    priceDiscounted: 169,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: false,
    isVip: true,
    category: 'aventura',
    remainingSlots: 4,
    urgencyText: 'Buggy credenciado exclusivo com saída nobre direto do hotel',
    description:
      'A emoção clássica potiguar que tornou Natal famosa no mundo inteiro! Atravesse o Rio Ceará-Mirim na pitoresca balsa rústica, sinta a adrenalina das dunas móveis com manobras seguras e desfrute de banhos revigorantes nas Lagoas de Pitangui e Jacumã.',
    highlights: [
      'Bugueiros profissionais com credencial oficial Cadastur',
      'Travessia ecológica de balsa em balsa artesanal no Rio Ceará-Mirim',
      'Parada para fotos com os dromedários de Genipabu',
      'Brincadeiras de aerobunda, esquibunda e kamikaze nas lagoas',
      'Mirantes cinematográficos de toda a orla norte de Natal',
    ],
    included: [
      'Busca e retorno no hotel em Ponta Negra ou Via Costeira',
      'Buggy credenciado higienizado e seguro',
      'Taxa de balsa ecológica inclusa',
      'Seguro passageiro integral e assistência total',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },

  // 3. Litoral Sul 4x4 Rota Nativos
  {
    id: 'litoral-sul-4x4-vip',
    title: 'Litoral Sul 4x4 · Rota dos Nativos',
    subtitle: 'Expedição 4x4 exclusiva pelas lagoas cristalinas, arrecifes e pôr do sol em Búzios',
    badge: 'Frota Premium 4x4',
    location: 'Litoral Sul de Natal (Nísia Floresta / Camurupim / Búzios)',
    rating: 4.99,
    reviewsCount: 1680,
    priceOriginal: 260,
    priceDiscounted: 199,
    duration: 'Dia inteiro (Aprox. 8h)',
    includesDiving: false,
    isVip: true,
    category: 'aventura',
    remainingSlots: 3,
    urgencyText: 'Veículos 4x4 Mitsubishi Pajero Dakar climatizados para grupos exclusivos',
    description:
      'A Rota dos Nativos pelo Litoral Sul: Museu Aeroespacial Barreira do Inferno, o Maior Cajueiro do Mundo, banho refrescante na paradisíaca Lagoa do Carcará de águas límpidas, Lagoa de Alcaçuz, piscinas naturais da Praia de Camurupim e o pôr do sol cinematográfico nas Dunas Douradas de Búzios.',
    highlights: [
      'Museu Aeroespacial Barreira do Inferno com guias históricos',
      'Visita ao Maior Cajueiro do Mundo em Pirangi',
      'Banho nas águas cristalinas e calmas da Lagoa do Carcará',
      'Paredões de arrecifes e piscinas mornas na Praia de Camurupim',
      'Pôr do Sol cinematográfico sobre as Dunas Douradas de Búzios',
    ],
    included: [
      'Veículo 4x4 Mitsubishi Pajero Dakar com ar-condicionado e seguro',
      'Motorista-guia especialista com credencial Cadastur oficial',
      'Busca e retorno na porta do seu hotel',
      'Paradas programadas com iluminação perfeita para fotografias',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  },

  // 4. Pipa
  {
    id: 'pipa-vip',
    title: 'Pipa VIP & Pôr do Sol',
    subtitle: 'Chapadão, Baía dos Golfinhos, Praia do Amor e o entardecer mais lindo do RN',
    badge: 'Charme & Golfinhos',
    location: 'Tibau do Sul / Praia da Pipa (Litoral Sul)',
    rating: 4.97,
    reviewsCount: 1950,
    priceOriginal: 190,
    priceDiscounted: 149,
    duration: 'Dia inteiro (Aprox. 9h)',
    includesDiving: false,
    isVip: true,
    category: 'cultural',
    remainingSlots: 4,
    urgencyText: 'Transporte confortável climatizado e guia especializado',
    description:
      'Conheça uma das praias mais famosas e encantadoras do Brasil com requinte. Falésias avermelhadas monumentais no Chapadão, banho de mar na Praia do Amor, observação de golfinhos na Baía dos Golfinhos, passeio pela charmosa vila de Pipa e pôr do sol inesquecível na Lagoa Guaraíras.',
    highlights: [
      'Mirante do Chapadão com vista panorâmica da Praia do Amor e das falésias',
      'Baía dos Golfinhos para observar golfinhos livres em seu habitat',
      'Vila charmosa de Pipa com artesanato, bistrôs e cafés',
      'Espetáculo do pôr do sol sobre a Lagoa Guaraíras em Tibau do Sul',
    ],
    included: [
      'Transfer ida e volta em van ou microônibus executivo climatizado',
      'Guia credenciado Cadastur acompanhante',
      'Roteiro otimizado para evitar horários de pico',
      'Tempo livre para banho de mar e gastronomia local',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
  },

  // 5. Maracajaú
  {
    id: 'maracajau-vip',
    title: 'Parrachos de Maracajaú VIP',
    subtitle: 'O autêntico Caribe Brasileiro com embarque exclusivo em lancha rápida',
    badge: 'Caribe Brasileiro',
    location: 'Maxaranguape / Maracajaú (Litoral Norte)',
    rating: 4.98,
    reviewsCount: 2150,
    priceOriginal: 240,
    priceDiscounted: 189,
    duration: 'Dia inteiro (Aprox. 7h)',
    includesDiving: true,
    isVip: true,
    category: 'mergulho',
    remainingSlots: 2,
    urgencyText: 'Vagas limitadas pelas cotas ambientais da Marinha do Brasil',
    description:
      'Navegue a 7km da costa potiguar até a barreira de corais mais famosa do RN. Águas calmas, mornas e cristalinas repletas de peixes tropicais coloridos e arrecifes preservados com suporte de plataforma flutuante de alto padrão.',
    highlights: [
      'Embarque veloz em lanchas e catamarãs homologados pela Marinha',
      'Plataforma flutuante VIP com apoio e segurança em alto-mar',
      'Mergulho de superfície com máscara anti-embaçante e snorkel higienizado',
      'Opção de batismo de mergulho com cilindro e instrutor PADI credenciado',
      'Acesso ao clube de praia parceiro com piscina e restaurante à beira-mar',
    ],
    included: [
      'Transfer ida e volta com ar-condicionado direto no seu hotel',
      'Passeio de lancha rápida até os parrachos',
      'Kit mergulho completo (máscara, snorkel e colete flutuador)',
      'Seguro passageiro e guias credenciados Cadastur',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },

  // 6. Auto do Potengi
  {
    id: 'auto-do-potengi-vip',
    title: 'Auto do Potengi & Pôr do Sol Histórico',
    subtitle: 'Navegação panorâmica pelo Rio Potengi, Fortaleza dos Reis Magos e pôr do sol espetacular',
    badge: 'Cultura & Pôr do Sol',
    location: 'Rio Potengi / Centro Histórico de Natal',
    rating: 4.95,
    reviewsCount: 890,
    priceOriginal: 160,
    priceDiscounted: 119,
    duration: 'Tarde / Pôr do Sol (Aprox. 4h)',
    includesDiving: false,
    isVip: true,
    category: 'cultural',
    remainingSlots: 3,
    urgencyText: 'Saídas exclusivas no entardecer com vagas limitadas',
    description:
      'Uma experiência emocionante e poética que conecta as origens históricas de Natal à natureza exuberante do Rio Potengi. A bordo de catamarã moderno e estável, você contempla a Fortaleza dos Reis Magos, a majestosa Ponte Newton Navarro e manguezais preservados ao som de boa música e poesia.',
    highlights: [
      'Navegação confortável em catamarã moderno pelo leito do Rio Potengi',
      'Vista panorâmica da Fortaleza dos Reis Magos e da Ponte Newton Navarro',
      'Narrativa histórica envolvente sobre a fundação da Cidade do Sol',
      'Pôr do sol cinematográfico refletindo nas águas calmas do rio',
      'Ambiente acolhedor e seguro para casais e toda a família',
    ],
    included: [
      'Transfer executivo hotel - ponto de embarque - hotel',
      'Ingresso de navegação do catamarã',
      'Guia credenciado especializado em história potiguar',
      'Seguro náutico e apoio de bordo',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },

  // 7. Quadriciclo
  {
    id: 'quadriciclo-vip',
    title: 'Passeio de Quadriciclo VIP',
    subtitle: 'Pilote seu próprio quadriciclo 4x4 por trilhas ecológicas, dunas e lagoas deslumbrantes',
    badge: 'Aventura & Adrenalina',
    location: 'Trilhas e Lagoas do Litoral Sul (Nísia Floresta)',
    rating: 4.98,
    reviewsCount: 1320,
    priceOriginal: 280,
    priceDiscounted: 220,
    duration: 'Aprox. 2h30 a 3h de pilotagem',
    includesDiving: false,
    isVip: true,
    category: 'aventura',
    remainingSlots: 2,
    urgencyText: 'Quadriciclos automáticos 4x4 revisados e fáceis de pilotar',
    description:
      'Sinta a adrenalina de pilotar uma máquina 4x4 potente por caminhos de areia, trilhas rurais nativas e lagoas escondidas de água doce. Ideal para quem busca contato com a natureza, curvas emocionantes e banho revigorante nas lagoas do litoral sul.',
    highlights: [
      'Quadriciclos 4x4 automáticos de última geração, confortáveis e estáveis',
      'Trilha guiada com acompanhamento de instrutores experientes',
      'Parada para banho refrescante nas águas limpas da Lagoa Amarela ou Carcará',
      'Treinamento prévio para iniciantes com pista de teste de adaptação',
    ],
    included: [
      'Quadriciclo para até 2 pessoas (piloto e garupa)',
      'Capacetes e óculos de proteção higienizados',
      'Guia condutor liderando o comboio com segurança',
      'Instrução prática e seguro atividade',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
  },

  // 8. Transfer Aeroporto - Hotel - Aeroporto
  {
    id: 'transfer-aeroporto-hotel',
    title: 'Transfer Aeroporto - Hotel - Aeroporto',
    subtitle: 'Recepção executiva no Aeroporto de Natal (NAT), conforto climatizado e pontualidade garantida',
    badge: 'Chegada & Partida Tranquila',
    location: 'Aeroporto Internacional de Natal (NAT) ⇄ Hotéis de Natal',
    rating: 5.0,
    reviewsCount: 3400,
    priceOriginal: 160,
    priceDiscounted: 120,
    duration: 'Trajeto Direto Climatizado (Aprox. 45min)',
    includesDiving: false,
    isVip: true,
    category: 'transfer',
    remainingSlots: 5,
    urgencyText: 'Pontualidade britânica com monitoramento de voo em tempo real',
    description:
      'Comece e termine sua viagem a Natal com total conforto, segurança e tranquilidade. Nossa equipe recepciona você no saguão de desembarque do Aeroporto de Natal com placa nominal, carrega suas bagagens e leva você diretamente ao seu hotel em veículo moderno e 100% climatizado.',
    highlights: [
      'Recepção nominal personalizada no saguão de desembarque',
      'Monitoramento de voo em tempo real (sem custo extra se houver atraso)',
      'Veículos executivos modernos, limpos e climatizados',
      'Espaço amplo e seguro para bagagens e compras',
      'Opção de cadeirinha infantil gratuita sob solicitação antecipada',
    ],
    included: [
      'Transfer In (Aeroporto de Natal ➔ Hotel em Ponta Negra / Via Costeira)',
      'Transfer Out (Hotel ➔ Aeroporto de Natal)',
      'Seguro integral para todos os passageiros',
      'Suporte concierge via WhatsApp 24h para ajuste de horários de voo',
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
    description: '15 fotos em alta definição com peixes coloridos e ângulos profissionais enviados via nuvem.',
    iconName: 'Camera',
  },
  {
    id: 'cilindro-mergulho',
    name: 'Batismo de Mergulho com Cilindro',
    price: 140,
    description: 'Instrução personalizada individual e mergulho guiado até 5m com instrutor PADI.',
    iconName: 'Anchor',
  },
  {
    id: 'transfer-vip-privativo',
    name: 'Upgrade Transfer Privativo VIP',
    price: 110,
    description: 'Veículo exclusivo para sua família/casal, sem paradas em outros hotéis.',
    iconName: 'Car',
  },
  {
    id: 'kit-praia-conforto',
    name: 'Kit Conforto & Toalhas Macias',
    price: 35,
    description: 'Toalhas térmicas de algodão, protetor solar biodegradável e água de coco gelada.',
    iconName: 'Sparkles',
  },
];
