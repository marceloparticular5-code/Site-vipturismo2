export interface InstagramPost {
  id: string;
  authorUsername: string;
  authorName: string;
  authorAvatar: string;
  location: string;
  imageUrl: string;
  isVideo?: boolean;
  likesCount: number;
  commentsCount: number;
  caption: string;
  timeAgo: string;
  hashtagCategory: 'maracajau' | 'rio-do-fogo' | 'genipabu' | 'pipa' | 'geral';
  tourId: string;
  tourName: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    authorUsername: 'fernanda.destinos',
    authorName: 'Fernanda & Gabriel',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    location: 'Parrachos de Maracajaú, RN',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    isVideo: false,
    likesCount: 1420,
    commentsCount: 88,
    caption: 'Sem palavras para essa água! Pegamos maré 0.1 com a @natalvipturismo na lancha rápida VIP. Dica: reservem cedo porque as vagas esgotam rápido! 🤿🐠💙 #MaracajauVIP #NatalVipTurismo',
    timeAgo: 'há 1 dia',
    hashtagCategory: 'maracajau',
    tourId: 'maracajau-vip',
    tourName: 'Parrachos de Maracajaú VIP',
  },
  {
    id: 'ig-2',
    authorUsername: 'lucas.viajante',
    authorName: 'Lucas Morais',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    location: 'Dunas de Genipabu, Natal/RN',
    imageUrl: '/images/buggy/buggy-praia-dunas.webp',
    isVideo: true,
    likesCount: 2310,
    commentsCount: 142,
    caption: 'Passeio com MUITA emoção pelas dunas móveis! O bugueiro credenciado da @natalvipturismo foi nota 10, com manobras seguras e as melhores fotos no topo das dunas! 🏎️💨 #GenipabuComEmocao',
    timeAgo: 'há 2 dias',
    hashtagCategory: 'genipabu',
    tourId: 'genipabu-buggy-vip',
    tourName: 'Dunas de Genipabu Com Emoção',
  },
  {
    id: 'ig-3',
    authorUsername: 'casal.pelomundo',
    authorName: 'Camila & Rodrigo',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    location: 'Parrachos de Rio do Fogo, RN',
    imageUrl: '/images/rio-do-fogo/rio-do-fogo-mergulho-punau.webp',
    isVideo: false,
    likesCount: 1890,
    commentsCount: 95,
    caption: 'O banco de areia efêmero que surge no meio do oceano em Rio do Fogo é surreal de lindo! Paz total, pouquíssimas pessoas e águas quentes. Passeio indispensável! 🌊☀️ #RioDoFogoVIP',
    timeAgo: 'há 3 dias',
    hashtagCategory: 'rio-do-fogo',
    tourId: 'rio-do-fogo-vip',
    tourName: 'Parrachos de Rio do Fogo VIP',
  },
  {
    id: 'ig-4',
    authorUsername: 'mariana.wanderlust',
    authorName: 'Mariana Duarte',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    location: 'Chapadão da Praia de Pipa, RN',
    imageUrl: '/images/pipa/pipa-falesias-amor.webp',
    isVideo: false,
    likesCount: 3105,
    commentsCount: 184,
    caption: 'O pôr do sol mais dourado do Nordeste visto do alto das falésias de Pipa! Transfer impecável buscando a gente direto no hotel em Ponta Negra. Experiência 5 estrelas! 🌅🍹 #PipaVIP',
    timeAgo: 'há 4 dias',
    hashtagCategory: 'pipa',
    tourId: 'pipa-vip',
    tourName: 'Pipa VIP & Pôr do Sol no Chapadão',
  },
  {
    id: 'ig-5',
    authorUsername: 'rafael_adventure',
    authorName: 'Rafael & Amigos',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    location: 'Plataforma Flutuante Maracajaú',
    imageUrl: '/images/maracajau/maracajau-mergulho-peixes.webp',
    isVideo: true,
    likesCount: 1670,
    commentsCount: 76,
    caption: 'Primeiro mergulho com cilindro da vida na plataforma VIP em alto mar! Instrutores pacientes e fotógrafo subaquático tirando fotos incríveis com os peixinhos. 🐠🫧 #MergulhoPotiguar',
    timeAgo: 'há 5 dias',
    hashtagCategory: 'maracajau',
    tourId: 'maracajau-vip',
    tourName: 'Parrachos de Maracajaú VIP',
  },
  {
    id: 'ig-6',
    authorUsername: 'beatriz.travels',
    authorName: 'Beatriz Vasconcelos',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    location: 'São Miguel do Gostoso, RN',
    imageUrl: '/images/litoral-sul/litoral-sul-pajero-sunset.webp',
    isVideo: false,
    likesCount: 1240,
    commentsCount: 62,
    caption: 'Onde o vento faz a curva e a paz reina! São Miguel do Gostoso com a @natalvipturismo foi pura poesia. Parada em Maxaranguape na Árvore do Amor foi inesquecível! 🍃✨ #GostosoVIP',
    timeAgo: 'há 6 dias',
    hashtagCategory: 'geral',
    tourId: 'sao-miguel-gostoso-vip',
    tourName: 'São Miguel do Gostoso VIP',
  },
];
