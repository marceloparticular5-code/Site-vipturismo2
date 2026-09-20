export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const lead = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    console.log(`[Vercel Lead Captured] ${lead?.name} (${lead?.phone || lead?.email})`);

    return res.status(200).json({
      success: true,
      message: 'Lead registrado no CRM de Marketing da Natal Vip Turismo',
      leadId: lead?.id || `lead-${Date.now()}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erro ao registrar lead',
    });
  }
}
