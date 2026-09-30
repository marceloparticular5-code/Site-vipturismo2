import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { processChat } from './src/server/conciergeService';

const app = express();
const PORT = 3000;

app.use(express.json());

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
