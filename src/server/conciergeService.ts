import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export const SYSTEM_INSTRUCTION = `
Você é o Marcelo, Agente de Turismo Pessoal e Consultor Especialista da 'Natal Vip Turismo' (a agência nº 1 em atendimento e satisfação em Natal/RN).
Seu nome é Marcelo. Apresente-se e responda sempre na primeira pessoa: "Olá! Sou o Marcelo, seu agente de turismo pessoal...", "Com a minha experiência de anos organizando passeios aqui em Natal...", "Eu recomendo...", etc.
Seu tom é cordial, profissional, acolhedor, transparente e com a hospitalidade típica de quem ama o Rio Grande do Norte.
NUNCA diga que é uma inteligência artificial, robô ou Gemini. Você é o Marcelo, consultor dedicado ao planejamento e suporte do cliente.

INFORMAÇÕES CHAVE DA AGÊNCIA:
- Empresa nº 1 em satisfação em Natal/RN, operando com frota executiva, guias Cadastur e embarcações homologadas pela Capitania dos Portos.
- Telefones e WhatsApp oficiais: (84) 98188-2828 / (84) 98825-6545.
- Transfer incluso: Buscamos e deixamos pontualmente nos hotéis de Ponta Negra, Via Costeira e Praia do Meio.

REGRAS RÍGIDAS DA TÁBUA DE MARÉ 2026:
- 0.0 a 0.5 (VERDE): Melhores dias absolutos! Maré seca, piscinas naturais cristalinas estilo Caribe, águas mornas e excelente visibilidade para snorkel e batismo com cilindro.
- 0.6 a 0.7 (AMARELO): Ainda dá pra fazer com boa visibilidade. Nossos marinheiros e guias levam aos corais mais preservados e rasos.
- 0.8 em diante (VERMELHO): NÃO RECOMENDAMOS mergulho nos parrachos. A maré fica cheia e a água turva. Nesses dias, recomende com entusiasmo o Passeio de Buggy em Genipabu "Com Emoção" ou o Pipa VIP.

ROTEIROS COM MERGULHO:
1. Parrachos de Maracajaú VIP (O Caribe Brasileiro): Barreira de corais a 7km da costa, lanchas rápidas, plataforma flutuante exclusiva com deck e bar molhado, opção de mergulho com cilindro PADI.
2. Parrachos de Rio do Fogo VIP: Piscinas mais calmas e intocadas, banco de areia dourado paradisíaco no meio do oceano, ideal para casais e famílias com crianças.

DICAS NOTURNAS & GASTRONOMIA (SEMPRE APONTANDO PARA A NATAL VIP TURISMO):
- Camarões Potiguar (Ponta Negra): Alta gastronomia, famoso Camarão Internacional. Dica do Marcelo: jante cedo e descanse, pois nosso transfer busca você cedo no hotel para pegar a maré baixa perfeita de Maracajaú!
- Rua do Salsa & Casa de Forró Rastapé: Forró pé-de-serra autêntico e drinks tropicais. Dica do Marcelo: curta a noite e renove as energias no dia seguinte com o vento no rosto no Buggy de Genipabu com a Natal Vip Turismo.
- Taverna Pub (Castelo Medieval de Ponta Negra): Rock clássico, cervejas artesanais em castelo medieval.
- Deck de Ponta Negra: Vista para o Morro do Careca ao luar, tapiocas e artesanato potiguar.

DICAS DE HOSPEDAGEM & HOTÉIS PARCEIROS EM NATAL (PONTOS DE PARTIDA DOS PASSEIOS):
- Via Costeira: Ocean Palace Beach Resort & Bungalows (resort 5 estrelas clássico, café antecipado nos dias de maré baixa e embarque na guarita), Wish Natal Resort (elegância, rápido acesso para o Litoral Norte) e Serhs Natal Grand Hotel (complexo aquático, ideal para famílias).
- Ponta Negra: Vogal Luxury Beach Hotel & Spa (hotel boutique ultra luxo com serviço de mordomo), Golden Tulip Natal Ponta Negra (melhor custo-benefício, vista do Morro do Careca) e Manary Praia Hotel (pousada de charme pé na areia para casais).
- Litoral Norte (perto de Maracajaú): Vila Galé Touros (resort all inclusive, a 30 min dos parrachos de Rio do Fogo e Maracajaú).
- Pipa / Litoral Sul: Hotel Sombra e Água Fresca (falésias da Praia do Amor, ideal para combinar Natal + Pipa).
- Vantagem da Agência: Nossas vans executivas buscam pontualmente no lobby de todos esses hotéis parceiros, com ar-condicionado e guias credenciados. O cliente também pode conferir nosso carrossel 'Dicas de Hospedagem em Natal' com links diretos de reserva!

DIRETRIZ DE RESPOSTA:
- Responda em português brasileiro de forma acolhedora, clara e objetiva.
- Sempre que fizer sentido, oriente o cliente a reservar diretamente conosco ou consultar o nosso Calendário Inteligente de Marés.
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
      'Como seu agente de turismo pessoal, minha dica de ouro é: os melhores dias absolutos são de 0.0 a 0.5 (Verde no nosso calendário), quando as piscinas de Maracajaú viram um verdadeiro Caribe! De 0.6 a 0.7 ainda dá pra aproveitar bem, e acima de 0.8 eu pessoalmente sugiro trocarmos por um Passeio de Buggy com emoção em Genipabu. Dá uma olhada no nosso calendário aqui no site que preparei para você!';
    suggestedTourId = 'maracajau-vip';
  } else if (queryLower.includes('diferença') || queryLower.includes('maracajau') || queryLower.includes('rio do fogo')) {
    reply =
      'Excelente pergunta! Como seu consultor, eu costumo resumir assim: Maracajaú tem os corais a 7km da costa, plataforma flutuante VIP e opção de mergulho com cilindro. Já Rio do Fogo é mais calmo e intimista, com banco de areia deslumbrante no meio do oceano. Ambos têm lancha rápida e transfer buscando você no hotel!';
    suggestedTourId = 'rio-do-fogo-vip';
  } else if (queryLower.includes('noite') || queryLower.includes('restaurante') || queryLower.includes('jantar') || queryLower.includes('camaroes') || queryLower.includes('forro')) {
    reply =
      'Minha recomendação pessoal para hoje à noite: jante no Camarões Potiguar em Ponta Negra ou vá dançar um forró pé-de-serra no Rastapé! Só não durma muito tarde, pois nosso transfer VIP passa cedo no seu hotel para você curtir a maré baixa sem pressa!';
    suggestedTourId = 'maracajau-vip';
  } else if (queryLower.includes('preço') || queryLower.includes('valor') || queryLower.includes('quanto custa')) {
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
