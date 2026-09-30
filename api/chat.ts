import { processChat } from '../src/server/conciergeService';

export default async function handler(req: any, res: any) {
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
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }
    const result = await processChat(message);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro interno ao consultar o Consultor Marcelo',
      message: error?.message || 'Erro desconhecido',
    });
  }
}
