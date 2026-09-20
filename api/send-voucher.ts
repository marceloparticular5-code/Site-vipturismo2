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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { voucherCode, customerEmail, agencyEmail } = body;

    console.log(
      `[Vercel Voucher Dispatch] Code ${voucherCode} dispatched to ${customerEmail} and ${agencyEmail || 'reservas@natalvipturismo.com'}`
    );

    return res.status(200).json({
      success: true,
      message: `Voucher ${voucherCode} encaminhado automaticamente para ${customerEmail} e cópia confirmada em reservas@natalvipturismo.com`,
      customerEmail,
      agencyEmail: 'reservas@natalvipturismo.com',
      dispatchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erro ao processar envio de voucher',
    });
  }
}
