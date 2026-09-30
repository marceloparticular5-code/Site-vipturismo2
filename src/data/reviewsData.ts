export interface PlatformReview {
  id: string;
  platform: 'google' | 'tripadvisor';
  authorName: string;
  authorAvatar?: string;
  authorInitial: string;
  authorLocation?: string;
  rating: 4 | 5;
  comment: string;
  date: string;
  relativeTime: string;
  tourMentioned: string;
  verifiedBooking: boolean;
  likesCount?: number;
  platformUrl: string;
}

export const PLATFORM_REVIEWS: PlatformReview[] = [
  {
    id: 'rev-g-1',
    platform: 'google',
    authorName: 'Thiago Alencar',
    authorInitial: 'T',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'Rio de Janeiro / RJ',
    rating: 5,
    comment:
      'Melhor receptivo de Natal! Fizemos os Parrachos de Maracajaú e o guia consultou a tábua de maré com precisão cirúrgica: maré 0.0 às 09:40h. Pegamos uma água de piscina natural indescritível e a lancha rápida foi super segura.',
    date: '24 de Setembro de 2026',
    relativeTime: 'há 3 dias',
    tourMentioned: 'Parrachos de Maracajaú VIP',
    verifiedBooking: true,
    likesCount: 28,
    platformUrl: 'https://maps.google.com',
  },
  {
    id: 'rev-ta-1',
    platform: 'tripadvisor',
    authorName: 'Beatriz & Leonardo Mendes',
    authorInitial: 'B',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'Belo Horizonte / MG',
    rating: 5,
    comment:
      'Certificado de Excelência merecidíssimo! Fomos a Rio do Fogo e o banco de areia no meio do oceano foi um dos lugares mais bonitos que já vi na vida. Atendimento do consultor Marcelo pelo site e WhatsApp foi ágil e cordial.',
    date: '20 de Setembro de 2026',
    relativeTime: 'há 1 semana',
    tourMentioned: 'Parrachos de Rio do Fogo VIP',
    verifiedBooking: true,
    likesCount: 35,
    platformUrl: 'https://www.tripadvisor.com.br',
  },
  {
    id: 'rev-g-2',
    platform: 'google',
    authorName: 'Dra. Vanessa Guimarães',
    authorInitial: 'V',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'São Paulo / SP',
    rating: 5,
    comment:
      'Pontualidade britânica! A van executiva nos buscou pontualmente no hotel em Ponta Negra com ar-condicionado excelente. O passeio de buggy em Genipabu foi o ápice da viagem para meus dois filhos. Recomendo de olhos fechados!',
    date: '18 de Setembro de 2026',
    relativeTime: 'há 1 semana',
    tourMentioned: 'Buggy em Genipabu com Emoção',
    verifiedBooking: true,
    likesCount: 19,
    platformUrl: 'https://maps.google.com',
  },
  {
    id: 'rev-ta-2',
    platform: 'tripadvisor',
    authorName: 'Carlos Eduardo Nogueira',
    authorInitial: 'C',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'Porto Alegre / RS',
    rating: 5,
    comment:
      'Fizemos o passeio de Pipa VIP com o pôr do sol no Chapadão. A vista das falésias é cinematográfica e o guia nos levou aos melhores mirantes sem muvuca. Voucher com QR Code recebido no e-mail logo após a reserva.',
    date: '14 de Setembro de 2026',
    relativeTime: 'há 2 semanas',
    tourMentioned: 'Pipa VIP & Pôr do Sol no Chapadão',
    verifiedBooking: true,
    likesCount: 42,
    platformUrl: 'https://www.tripadvisor.com.br',
  },
  {
    id: 'rev-g-3',
    platform: 'google',
    authorName: 'Renata Frota & Família',
    authorInitial: 'R',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'Brasília / DF',
    rating: 5,
    comment:
      'Equipe fantástica! Fizemos o combo de 3 passeios. O suporte 24h pelo chat do site tirou todas as dúvidas. Mergulho com os peixinhos na plataforma flutuante de Maracajaú foi inesquecível. Nota 10 em tudo.',
    date: '10 de Setembro de 2026',
    relativeTime: 'há 2 semanas',
    tourMentioned: 'Combo VIP Maracajaú + Genipabu',
    verifiedBooking: true,
    likesCount: 22,
    platformUrl: 'https://maps.google.com',
  },
  {
    id: 'rev-ta-3',
    platform: 'tripadvisor',
    authorName: 'Gabriel S. Vasconcellos',
    authorInitial: 'G',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    authorLocation: 'Campinas / SP',
    rating: 4,
    comment:
      'Muito boa experiência! Barco muito moderno, equipamentos de snorkel higienizados e salva-vidas atenciosos. Só recomendo levar protetor solar forte porque o sol de Natal não perdoa. Vale muito a pena!',
    date: '05 de Setembro de 2026',
    relativeTime: 'há 3 semanas',
    tourMentioned: 'Parrachos de Maracajaú VIP',
    verifiedBooking: true,
    likesCount: 15,
    platformUrl: 'https://www.tripadvisor.com.br',
  },
];
