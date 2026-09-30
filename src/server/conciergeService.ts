import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI();
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Você é o Marcelo, o Consultor e Agente de Turismo Pessoal VIP da Natal Vip Turismo em Natal/RN.
Sua missão é atender turistas com exclusividade, simpatia, precisão técnica sobre a tábua de maré oficial 2026 e orientar reservas nos melhores passeios:
1. Parrachos de Maracajaú VIP (lanchas rápidas, flutuante VIP, corais a 7km da costa, mergulho livre e batismo com cilindro).
2. Parrachos de Rio do Fogo VIP (piscinas rasas, preservadas, banco de areia efêmero, águas calmas).
3. Buggy em Genipabu com Emoção (dunas móveis, lagoas, aerobunda e esquibunda).
4. Pipa VIP & Pôr do Sol no Chapadão (Baía dos Golfinhos e Mirante).
5. São Miguel do Gostoso & Tour Litoral Norte.

Explique que a maré ideal para piscinas naturais é de 0.0 a 0.5m (dias verdes no calendário do site), ainda aproveitável de 0.6 a 0.7m, e que acima de 0.8m o melhor é optar pelo Buggy em Genipabu. Seja cordial, seguro e convide para reservar pelo Autoatendimento VIP do site.`;

export async function processChat(
  message: string
): Promise<{ reply: string; suggestedTourId?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = getGenAI();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const replyText = response.text || '';
        let suggestedTourId = 'maracajau-vip';
        const lower = replyText.toLowerCase() + ' ' + message.toLowerCase();
        if (lower.includes('rio do fogo')) {
          suggestedTourId = 'rio-do-fogo-vip';
        } else if (lower.includes('genipabu') || lower.includes('buggy')) {
          suggestedTourId = 'genipabu-buggy-vip';
        } else if (lower.includes('pipa')) {
          suggestedTourId = 'pipa-vip';
        }

        return {
          reply: replyText,
          suggestedTourId,
        };
      }
    } catch (err) {
      console.warn('Fallback to concierge rule-based response:', err);
    }
  }

  // High quality contextual fallback
  const queryLower = message.toLowerCase();
  let reply = '';
  let suggestedTourId: string | undefined = 'maracajau-vip';

  if (queryLower.includes('maré') || queryLower.includes('mare') || queryLower.includes('tábua')) {
    reply =
      'Como seu agente de turismo pessoal, minha dica de ouro é: os melhores dias absolutos são de 0.0 a 0.5 (Verde no nosso calendário), quando as piscinas de Maracajaú viram um verdadeiro Caribe! De 0.6 a 0.7 ainda dá pra aproveitar bem, e acima de 0.8 eu pessoalmente sugiro trocarmos por um Passeio de Buggy com emoção em Genipabu. Dá uma olhada no nosso calendário inteligente aqui no site que preparei para você!';
    suggestedTourId = 'maracajau-vip';
  } else if (
    queryLower.includes('diferença') ||
    queryLower.includes('maracajau') ||
    queryLower.includes('rio do fogo')
  ) {
    reply =
      'Excelente pergunta! Como seu consultor, eu costumo resumir assim: Maracajaú tem os corais a 7km da costa, plataforma flutuante VIP e opção de mergulho com cilindro. Já Rio do Fogo é mais calmo e intimista, com banco de areia deslumbrante no meio do oceano. Ambos têm lancha rápida e transfer buscando você no hotel!';
    suggestedTourId = 'rio-do-fogo-vip';
  } else if (
    queryLower.includes('noite') ||
    queryLower.includes('restaurante') ||
    queryLower.includes('jantar') ||
    queryLower.includes('camaroes') ||
    queryLower.includes('forro')
  ) {
    reply =
      'Minha recomendação pessoal para hoje à noite: jante no Camarões Potiguar em Ponta Negra ou vá dançar um forró pé-de-serra no Rastapé! Só não durma muito tarde, pois nosso transfer VIP passa cedo no seu hotel para você curtir a maré baixa sem pressa!';
    suggestedTourId = 'maracajau-vip';
  } else if (
    queryLower.includes('preço') ||
    queryLower.includes('valor') ||
    queryLower.includes('quanto custa')
  ) {
    reply =
      'Comigo você garante a tarifa especial VIP: Parrachos de Maracajaú por R$ 189,00 (de R$ 240); Rio do Fogo VIP por R$ 179,00; Buggy em Genipabu por R$ 159,00 e Pipa VIP por R$ 149,00. Todos com transfer executivo no hotel, desconto no PIX ou até 12x no cartão!';
    suggestedTourId = 'maracajau-vip';
  } else {
    reply =
      'Sou o Marcelo, seu consultor da Natal Vip Turismo! Posso organizar todos os seus dias em Natal com tranquilidade, transfer no seu hotel, barcos homologados e maré baixa garantida. Qual passeio você gostaria de reservar hoje?';
    suggestedTourId = 'maracajau-vip';
  }

  return {
    reply,
    suggestedTourId,
  };
}
