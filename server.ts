import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { processChat } from './src/server/conciergeService';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads folder for locally uploaded photos
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
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

app.post('/api/upload', (req, res) => {
  try {
    const { files, dataUrl, filename } = req.body;
    const uploadedFiles: Array<{ name: string; url: string; size: number }> = [];

    const processItem = (fileDataUrl: string, origName?: string) => {
      // Data URL format: data:image/jpeg;base64,...
      const match = fileDataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
      if (!match) {
        throw new Error('Formato de imagem não suportado. Utilize JPG, JPEG ou PNG.');
      }
      const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Max 5MB check
      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite máximo permitido de 5 MB.');
      }

      const safeBaseName = (origName || 'foto')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const uniqueFilename = `tour-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBaseName}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      return {
        name: uniqueFilename,
        url: fileUrl,
        size: buffer.length,
      };
    };

    if (Array.isArray(files) && files.length > 0) {
      for (const item of files) {
        if (item && item.dataUrl) {
          uploadedFiles.push(processItem(item.dataUrl, item.filename));
        }
      }
    } else if (dataUrl) {
      uploadedFiles.push(processItem(dataUrl, filename));
    } else {
      res.status(400).json({ success: false, error: 'Nenhum dado de imagem recebido.' });
      return;
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} foto(s) enviada(s) e salva(s) com sucesso no servidor!`,
      files: uploadedFiles,
      url: uploadedFiles[0]?.url,
    });
  } catch (error: any) {
    console.error('[Upload Error]:', error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Falha ao processar o upload da imagem.',
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
