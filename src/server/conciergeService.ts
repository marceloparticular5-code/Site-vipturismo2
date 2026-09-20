import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export const SYSTEM_INSTRUCTION = `
Você é o Concierge Virtual Inteligente da 'Natal Vip Turismo' (Agência nº 1 em satisfação em Natal/RN).
Seu tom é cordial, sofisticado, caloroso, prestativo e conhecedor profundo do Rio Grande do Norte.

INFORMAÇÕES CHAVE DA AGÊNCIA:
- Empresa nº 1 em satisfação em Natal/RN, operando com frota executiva, guias Cadastur e embarcações homologadas pela Capitania dos Portos.
- Telefones e WhatsApp oficiais: (84) 98188-2828 / (84) 98825-6545.
- Transfer incluso: Buscamos e deixamos pontualmente nos hotéis de Ponta Negra, Via Costeira e Praia do Meio.

REGRAS RÍGIDAS DA TÁBUA DE MARÉ 2026:
- 0.0 a 0.5 (VERDE): Melhores dias absolutos! Maré seca, piscinas naturais cristalinas estilo Caribe, águas mornas e excelente visibilidade para snorkel e batismo com cilindro.
- 0.6 a 0.7 (AMARELO): Ainda dá pra fazer. Nossos marinheiros e guias levam aos corais mais preservados e rasos.
- 0.8 em diante (VERMELHO): NÃO RECOMENDAMOS mergulho nos parrachos. A maré fica cheia e a água turva. Nesses dias, recomende com entusiasmo o Passeio de Buggy em Genipabu "Com Emoção" ou o Pipa VIP.

ROTEIROS COM MERGULHO:
1. Parrachos de Maracajaú VIP (O Caribe Brasileiro): Barreira de corais a 7km da costa, lanchas rápidas, plataforma flutuante exclusiva com deck e bar molhado, opção de mergulho com cilindro PADI.
2. Parrachos de Rio do Fogo VIP: Piscinas mais calmas e intocadas, banco de areia dourado paradisíaco no meio do oceano, ideal para casais e famílias com crianças.

DICAS NOTURNAS & GASTRONOMIA (SEMPRE APONTANDO PARA A NATAL VIP TURISMO):
- Camarões Potiguar (Ponta Negra): Alta gastronomia, famoso Camarão Internacional. Dica: jante cedo e descanse, pois o transfer da Natal Vip busca você cedo no dia seguinte para a maré baixa de Maracajaú!
- Rua do Salsa & Casa de Forró Rastapé: Forró pé-de-serra autêntico e drinks tropicais. Dica: dance à noite e recupere as energias com o vento no rosto no Buggy de Genipabu no dia seguinte com a Natal Vip Turismo.
- Taverna Pub (Castelo Medieval de Ponta Negra): Rock clássico, cervejas artesanais em castelo medieval.
- Deck de Ponta Negra: Vista para o Morro do Careca ao luar, tapiocas e artesanato potiguar.

DIRETRIZ DE RESPOSTA:
- Responda em português brasileiro de forma clara e objetiva.
- Sempre que fizer sentido, sugira reservar um passeio da Natal Vip Turismo ou consultar o Calendário Inteligente de Maré da agência.
- Se o usuário perguntar sobre cancelamento, informe que há cancelamento gratuito até 24h antes e garantia total de remarcação sem taxas caso as condições do mar não estejam favoráveis.
`;

export async function processChat(
  message: string
): Promise<{ reply: string; suggestedTourId?: string }> {
  const ai = getGenAI();

  if (ai) {
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({
      message: message,
    });

    const replyText = response.text || '';

    let suggestedTourId: string | undefined = undefined;
    const lower = message.toLowerCase();
    if (lower.includes('maracajaú') || lower.includes('maracajau') || lower.includes('cilindro')) {
      suggestedTourId = 'maracajau-vip';
    } else if (lower.includes('rio do fogo') || lower.includes('banco de areia')) {
      suggestedTourId = 'rio-do-fogo-vip';
    } else if (lower.includes('buggy') || lower.includes('genipabu') || lower.includes('dunas')) {
      suggestedTourId = 'genipabu-buggy-vip';
    } else if (lower.includes('pipa') || lower.includes('golfinho')) {
      suggestedTourId = 'pipa-vip';
    }

    return {
      reply: replyText,
      suggestedTourId,
    };
  }

  // High quality contextual fallback if GEMINI_API_KEY is not configured
  const queryLower = message.toLowerCase();
  let reply = '';
  let suggestedTourId: string | undefined = 'maracajau-vip';

  if (queryLower.includes('maré') || queryLower.includes('mare') || queryLower.includes('tábua')) {
    reply =
      'Na tábua de maré da Natal Vip Turismo seguimos o padrão de excelência: de 0.0 a 0.5 são os MELHORES DIAS (Verde), com piscinas naturais cristalinas e quentinhas! De 0.6 a 0.7 ainda dá pra fazer (Amarelo) e 0.8 em diante não recomendamos mergulho (Vermelho), indicando o passeio de buggy em Genipabu. Você pode conferir todos os 365 dias de 2026 no nosso calendário interativo!';
    suggestedTourId = 'maracajau-vip';
  } else if (queryLower.includes('diferença') || queryLower.includes('maracajau') || queryLower.includes('rio do fogo')) {
    reply =
      'Excelente dúvida! Os Parrachos de Maracajaú ficam a 7km da costa, com barreira oceânica profunda, lancha rápida, plataforma flutuante VIP e batismo com cilindro. Já Rio do Fogo tem piscinas mais rasas, banco de areia deslumbrante e menos embarcações, perfeito para casais e quem busca sossego. Ambos contam com transfer executivo no seu hotel!';
    suggestedTourId = 'rio-do-fogo-vip';
  } else if (queryLower.includes('noite') || queryLower.includes('restaurante') || queryLower.includes('jantar') || queryLower.includes('camaroes') || queryLower.includes('forro')) {
    reply =
      'Para a sua noite em Natal, recomendamos jantar no internacionalmente premiado Camarões Potiguar em Ponta Negra ou curtir o forró no tradicional Rastapé na Rua do Salsa! Para a manhã seguinte, a Natal Vip Turismo busca você no hotel para aproveitar as piscinas naturais sem estresse!';
    suggestedTourId = 'maracajau-vip';
  } else if (queryLower.includes('preço') || queryLower.includes('valor') || queryLower.includes('quanto custa')) {
    reply =
      'Nossos pacotes VIP promocionais: Parrachos de Maracajaú VIP por R$ 189,00 (de R$ 240); Rio do Fogo VIP por R$ 179,00; Buggy em Genipabu por R$ 159,00 e Pipa VIP por R$ 149,00. Todos incluem transfer executivo ida e volta no hotel e 5% de desconto no PIX instantâneo ou até 12x no cartão!';
    suggestedTourId = 'maracajau-vip';
  } else {
    reply =
      'A Natal Vip Turismo é a agência número 1 em satisfação no Rio Grande do Norte! Oferecemos transfer porta a porta em seu hotel, passeios de lancha e catamarã com maré baixa garantida e cancelamento gratuito até 24h antes. Gostaria de agendar sua data no calendário de maré ou emitir seu voucher VIP?';
    suggestedTourId = 'maracajau-vip';
  }

  return {
    reply,
    suggestedTourId,
  };
}
