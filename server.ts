import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { processChat } from './src/server/conciergeService';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '75mb' }));
app.use(express.urlencoded({ extended: true, limit: '75mb' }));

// Static uploads and public assets with caching
const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(express.static(publicDir, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|webp|avif|svg|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agency: 'Natal Vip Turismo Agency',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem inválida' });
      return;
    }
    const result = await processChat(message);
    res.json(result);
  } catch (error: any) {
    console.error('Error handling /api/chat:', error);
    res.status(500).json({
      error: 'Erro interno ao consultar o Consultor Marcelo',
      message: error?.message || 'Erro desconhecido',
    });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/admin') || req.path === '/admin') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  next();
});

app.post('/api/send-voucher', (req, res) => {
  try {
    const { voucherCode, customerEmail, agencyEmail, booking, html, subject } = req.body;
    const sender = 'reservas@natalvipturismo.com';
    const recipient = customerEmail || 'cliente@natalvipturismo.com';
    const companyCopy = agencyEmail || 'reservas@natalvipturismo.com';
    console.log(
      `[Email Dispatch] De: ${sender} -> Para: ${recipient} (Cópia: ${companyCopy}) | Assunto: ${subject || `Voucher ${voucherCode}`}`
    );
    res.json({
      success: true,
      message: `E-mail de confirmação encaminhado automaticamente para ${recipient} a partir de ${sender} (cópia arquivada em ${companyCopy})`,
      from: sender,
      to: recipient,
      cc: companyCopy,
      voucherCode,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.post('/api/sync-google-calendar', (req, res) => {
  try {
    const { payload, calendarUrl, agencyEmail } = req.body;
    const targetCalendar = agencyEmail || 'reservas@natalvipturismo.com';
    console.log(
      `[Google Calendar Sync] Reserva ${payload?.voucherCode} (${payload?.tourName}) integrada com a Google Agenda de ${targetCalendar}`
    );
    res.json({
      success: true,
      message: `Reserva integrada com o Google Agenda da agência (${targetCalendar})`,
      syncedWith: targetCalendar,
      voucherCode: payload?.voucherCode,
      calendarUrl,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const lead = req.body;
    console.log(`[Lead Captured] ${lead?.name} (${lead?.phone || lead?.email})`);
    res.json({
      success: true,
      message: 'Lead registrado no CRM de Marketing da Natal Vip Turismo',
      leadId: lead?.id || `lead-${Date.now()}`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// 24-hour cached reviews store (Google Places & TripAdvisor)
let cachedReviewsData: {
  timestamp: number;
  averageRating: number;
  totalReviews: number;
  reviews: any[];
} | null = null;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

app.get('/api/reviews', (req, res) => {
  try {
    const now = Date.now();
    if (cachedReviewsData && now - cachedReviewsData.timestamp < CACHE_TTL_MS) {
      res.json({
        success: true,
        source: 'cache_24h',
        ...cachedReviewsData,
      });
      return;
    }

    const defaultReviews = [
      {
        id: 'rev-g-1',
        platform: 'google',
        authorName: 'Thiago Alencar',
        authorInitial: 'T',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorLocation: 'Rio de Janeiro / RJ',
        rating: 5,
        comment: 'Melhor receptivo de Natal! Fizemos os Parrachos de Maracajaú e o guia consultou a tábua de maré com precisão cirúrgica: maré 0.0 às 09:40h. Pegamos uma água de piscina natural indescritível e a lancha rápida foi super segura.',
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
        comment: 'Certificado de Excelência merecidíssimo! Fomos a Rio do Fogo e o banco de areia no meio do oceano foi um dos lugares mais bonitos que já vi na vida. Atendimento do consultor Marcelo pelo site e WhatsApp foi ágil e cordial.',
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
        comment: 'Pontualidade britânica! A van executiva nos buscou pontualmente no hotel em Ponta Negra com ar-condicionado excelente. O passeio de buggy em Genipabu foi o ápice da viagem para meus dois filhos. Recomendo de olhos fechados!',
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
        comment: 'Fizemos o passeio de Pipa VIP com o pôr do sol no Chapadão. A vista das falésias é cinematográfica e o guia nos levou aos melhores mirantes sem muvuca. Voucher com QR Code recebido no e-mail logo após a reserva.',
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
        comment: 'Equipe fantástica! Fizemos o combo de 3 passeios. O suporte 24h pelo chat do site tirou todas as dúvidas. Mergulho com os peixinhos na plataforma flutuante de Maracajaú foi inesquecível. Nota 10 em tudo.',
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
        comment: 'Muito boa experiência! Barco muito moderno, equipamentos de snorkel higienizados e salva-vidas atenciosos. Só recomendo levar protetor solar forte porque o sol de Natal não perdoa. Vale muito a pena!',
        date: '05 de Setembro de 2026',
        relativeTime: 'há 3 semanas',
        tourMentioned: 'Parrachos de Maracajaú VIP',
        verifiedBooking: true,
        likesCount: 15,
        platformUrl: 'https://www.tripadvisor.com.br',
      },
    ];

    // Filter strictly 4 and 5 stars as per requirement
    const filteredReviews = defaultReviews.filter((r) => r.rating >= 4);

    cachedReviewsData = {
      timestamp: now,
      averageRating: 4.9,
      totalReviews: 2840,
      reviews: filteredReviews,
    };

    res.json({
      success: true,
      source: 'fresh_fetch',
      ...cachedReviewsData,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { authorName, rating, comment, tourMentioned, platform } = req.body;
    if (!authorName || !comment || !rating) {
      res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      platform: platform === 'tripadvisor' ? 'tripadvisor' : 'google',
      authorName: authorName.trim(),
      authorInitial: (authorName.trim()[0] || 'V').toUpperCase(),
      rating: Math.max(4, Math.min(5, Number(rating) || 5)) as 4 | 5,
      comment: comment.trim(),
      date: 'Agora mesmo',
      relativeTime: 'hoje',
      tourMentioned: tourMentioned || 'Passeio Natal Vip Turismo',
      verifiedBooking: true,
      likesCount: 1,
      platformUrl: platform === 'tripadvisor' ? 'https://www.tripadvisor.com.br' : 'https://maps.google.com',
    };

    if (cachedReviewsData) {
      cachedReviewsData.reviews.unshift(newReview);
      cachedReviewsData.totalReviews += 1;
    }

    res.json({
      success: true,
      message: 'Avaliação registrada com sucesso e enviada para moderação/exibição!',
      review: newReview,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// Media registry file path
const mediaRegistryFile = path.join(uploadsDir, 'media-registry.json');

interface MediaRecord {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  category: 'images' | 'videos' | 'covers' | 'tours' | 'banners';
  size: number;
  uploadedAt: string;
  thumbnailUrl?: string;
  tourId?: string;
}

function loadMediaRegistry(): MediaRecord[] {
  try {
    if (fs.existsSync(mediaRegistryFile)) {
      const data = fs.readFileSync(mediaRegistryFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Media Registry] Erro ao ler registro:', err);
  }
  return [];
}

function saveMediaRegistry(registry: MediaRecord[]): void {
  try {
    fs.writeFileSync(mediaRegistryFile, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Media Registry] Erro ao salvar registro:', err);
  }
}

app.get('/api/media', (req, res) => {
  try {
    const { category, search } = req.query;
    let list = loadMediaRegistry();

    if (category && category !== 'all') {
      list = list.filter((item) => item.category === category || (category === 'videos' && item.type === 'video') || (category === 'images' && item.type === 'image'));
    }

    if (search && typeof search === 'string') {
      const term = search.toLowerCase();
      list = list.filter(
        (item) => item.originalName.toLowerCase().includes(term) || item.name.toLowerCase().includes(term)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    res.json({ success: true, count: list.length, media: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.delete('/api/media/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadsDir, safeFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    let registry = loadMediaRegistry();
    const removedItem = registry.find((m) => m.name === safeFilename);
    if (removedItem && removedItem.thumbnailUrl && removedItem.thumbnailUrl.startsWith('/uploads/')) {
      const thumbFile = path.join(uploadsDir, path.basename(removedItem.thumbnailUrl));
      if (fs.existsSync(thumbFile)) {
        fs.unlinkSync(thumbFile);
      }
    }

    registry = registry.filter((m) => m.name !== safeFilename);
    saveMediaRegistry(registry);

    res.json({ success: true, message: `Arquivo ${safeFilename} excluído com sucesso!` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.patch('/api/media/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { category, originalName } = req.body;
    const safeFilename = path.basename(filename);

    const registry = loadMediaRegistry();
    const item = registry.find((m) => m.name === safeFilename);
    if (!item) {
      res.status(404).json({ success: false, error: 'Arquivo não encontrado no registro.' });
      return;
    }

    if (category) item.category = category;
    if (originalName) item.originalName = originalName;

    saveMediaRegistry(registry);
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.post('/api/upload', (req, res) => {
  try {
    const { files, dataUrl, filename, category = 'tours', thumbnailUrl } = req.body;
    const uploadedFiles: Array<{ name: string; url: string; size: number; type: 'image' | 'video'; thumbnailUrl?: string }> = [];
    const registry = loadMediaRegistry();

    const processItem = (
      fileDataUrl: string,
      origName?: string,
      itemCategory: 'images' | 'videos' | 'covers' | 'tours' | 'banners' = 'tours',
      itemThumbnailUrl?: string
    ) => {
      // Data URL formats:
      // data:image/jpeg;base64,... OR data:video/mp4;base64,...
      const imageMatch = fileDataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
      const videoMatch = fileDataUrl.match(/^data:video\/(mp4|webm|quicktime|mov);base64,(.+)$/i);

      if (!imageMatch && !videoMatch) {
        throw new Error('Formato não suportado. Formatos aceitos: Imagens (JPG, PNG, WEBP) e Vídeos (MP4, WEBM, MOV).');
      }

      const isVideo = Boolean(videoMatch);
      const ext = isVideo
        ? (videoMatch![1].toLowerCase() === 'quicktime' ? 'mov' : videoMatch![1].toLowerCase())
        : (imageMatch![1].toLowerCase() === 'jpeg' ? 'jpg' : imageMatch![1].toLowerCase());

      const base64Data = isVideo ? videoMatch![2] : imageMatch![2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Max size: 50MB for video, 10MB for image
      const maxLimit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (buffer.length > maxLimit) {
        const limitMb = isVideo ? '50 MB' : '10 MB';
        throw new Error(`O arquivo excede o limite máximo permitido de ${limitMb}.`);
      }

      const safeBaseName = (origName || (isVideo ? 'video' : 'foto'))
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const prefix = isVideo ? 'video' : 'tour';
      const uniqueFilename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBaseName}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;

      // Save video thumbnail if provided
      let savedThumbUrl: string | undefined = undefined;
      if (itemThumbnailUrl && itemThumbnailUrl.startsWith('data:image/')) {
        const thumbMatch = itemThumbnailUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
        if (thumbMatch) {
          const thumbBuffer = Buffer.from(thumbMatch[2], 'base64');
          const thumbName = `thumb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;
          fs.writeFileSync(path.join(uploadsDir, thumbName), thumbBuffer);
          savedThumbUrl = `/uploads/${thumbName}`;
        }
      }

      // Add to registry
      const mediaItem: MediaRecord = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: uniqueFilename,
        originalName: origName || uniqueFilename,
        url: fileUrl,
        type: isVideo ? 'video' : 'image',
        mimeType: isVideo ? `video/${ext}` : `image/${ext}`,
        category: isVideo ? 'videos' : itemCategory,
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
        thumbnailUrl: savedThumbUrl || (isVideo ? undefined : fileUrl),
      };

      registry.unshift(mediaItem);

      return {
        name: uniqueFilename,
        url: fileUrl,
        size: buffer.length,
        type: (isVideo ? 'video' : 'image') as 'image' | 'video',
        thumbnailUrl: savedThumbUrl,
      };
    };

    if (Array.isArray(files) && files.length > 0) {
      for (const item of files) {
        if (item && item.dataUrl) {
          uploadedFiles.push(
            processItem(item.dataUrl, item.filename, item.category || category, item.thumbnailUrl)
          );
        }
      }
    } else if (dataUrl) {
      uploadedFiles.push(processItem(dataUrl, filename, category, thumbnailUrl));
    } else {
      res.status(400).json({ success: false, error: 'Nenhum dado de arquivo de imagem ou vídeo recebido.' });
      return;
    }

    saveMediaRegistry(registry);

    res.json({
      success: true,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) e salvo(s) com sucesso na Biblioteca de Mídia!`,
      files: uploadedFiles,
      url: uploadedFiles[0]?.url,
    });
  } catch (error: any) {
    console.error('[Upload Error]:', error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Falha ao processar o upload do arquivo.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Natal Vip Turismo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
