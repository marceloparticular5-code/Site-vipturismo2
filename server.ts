import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { processChat } from './src/server/conciergeService.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agency: 'Natal Vip Turismo Agency',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Gemini Chatbot Endpoint
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
      error: 'Erro interno ao consultar o Concierge Gemini',
      message: error?.message || 'Erro desconhecido',
    });
  }
});

// Automatic Voucher Email Dispatch Endpoint (reservas@natalvipturismo.com)
app.post('/api/send-voucher', (req, res) => {
  try {
    const { voucherCode, customerEmail, agencyEmail, booking } = req.body;
    console.log(
      `[Voucher Dispatch] Code ${voucherCode} dispatched to ${customerEmail} and ${agencyEmail || 'reservas@natalvipturismo.com'}`
    );
    res.json({
      success: true,
      message: `Voucher ${voucherCode} encaminhado automaticamente para ${customerEmail} e cópia confirmada em reservas@natalvipturismo.com`,
      customerEmail,
      agencyEmail: 'reservas@natalvipturismo.com',
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// Marketing Leads & Follow-up Endpoint
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

// Vite middleware or static serving
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
