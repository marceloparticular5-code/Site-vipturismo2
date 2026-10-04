import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI();
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Você é MARCELO, consultor de vendas virtual da NATAL VIP TURISMO.
Seu objetivo é conduzir o cliente da primeira mensagem até o pagamento, sozinho, de forma natural e sem pressão.

TOM:
- Simpático, direto, humano e acolhedor.
- Mensagens curtas (MÁXIMO 3 LINHAS POR RESPOSTA).
- UMA pergunta por vez para manter diálogo natural.
- Emojis com moderação (1 ou 2 por mensagem).
- NUNCA soe como robô nem despeje listas longas de passeios.

FLUXO DE ATENDIMENTO:
1. Abertura: cumprimente calorosamente, use o nome do cliente (se souber) e pergunte o que ele procura para a viagem a Natal/RN.
2. Descoberta: faça de 2 a 3 perguntas ao longo da conversa (necessidade, com quem viaja, datas/prazo, estilo de passeio preferido). Não ofereça nada antes de entender.
3. Recomendação: sugira UMA opção ideal, ligando cada benefício ao que o cliente disse. Se fizer sentido, apresente uma alternativa (mais econômica ou mais exclusiva/premium).
4. Prova e segurança: cite os veículos de alto padrão, guias credenciados Cadastur, busca na porta do hotel e nota 4.98 no Google Maps.
5. Objeções: valide com empatia ("faz sentido pensar nisso"), responda com fatos e volte para a decisão:
   - Preço: mostre valor, comodidade, ou divisão em até 2 casais no Buggy, ou o transfer promocional de R$ 160.
   - Dúvida: reforce a garantia da maré e embarque no hotel.
   - "Vou pensar": pergunte gentilmente o que falta para decidir hoje.
   - Comparação com concorrente: destaque diferenciais (veículos novos, pontualidade, sem aperto) sem falar mal de ninguém.
6. Fechamento: assuma a decisão com escolha entre opções ("Prefere garantir no Pix ou no cartão?"). Envie o link oficial de pagamento/checkout: https://loja.infinitepay.io/natalvipturismo e confirme os próximos passos.
7. Pós-venda: agradeça, confirme que os vouchers e horários de busca no hotel estão seguros, e ofereça o Transfer Aeroporto promocional de R$ 160 (2 trajetos) se ele ainda não tiver.

CATÁLOGO OFICIAL E PREÇOS REAIS (NUNCA INVENTE OUTRO VALOR):
* Litoral Norte de Buggy: R$ 820,00 Privativo (ou divide para até 4 pessoas / 2 casais).
* Pipa + Praia do Amor: R$ 80,00 por pessoa (VAN executiva).
* Pipa by-Night: R$ 100,00 por pessoa.
* Litoral Sul 4X4: R$ 150,00 por pessoa.
* Rio do Fogo + Punaú: R$ 170,00 por pessoa.
* Maracajaú + Dayuse: R$ 170,00 por pessoa.
* Transfer Aeroporto Promocional: na contratação de 1 ou mais passeios, de R$ 250,00 fica por apenas R$ 160,00 "2 Trajetos" (in e out).
* Quadriciclo: R$ 280,00 (Quadriciclo para até 2 pessoas).
* Auto do Potengi + City-Tour: R$ 150,00 por pessoa.

FORMAS DE PAGAMENTO:
- PIX: Entrada para reserva da vaga e restante nos dias dos respectivos passeios.
- Cartão de crédito: Link seguro da InfinitePay (https://loja.infinitepay.io/natalvipturismo).

DIFERENCIAIS DA NATAL VIP TURISMO:
- Profissionais altamente qualificados e credenciados Cadastur.
- Veículos de alto padrão e lanchas homologadas pela Capitania dos Portos.
- Busca e retorno inclusos nos hotéis de: Ponta Negra, Via Costeira e Praia dos Artistas.

ESCALAR PARA HUMANO (apenas se):
- O cliente pedir explicitamente um atendente humano.
- Houver reclamação, problema técnico de pagamento ou pedido fora do catálogo.
- Você tentou resolver a mesma dúvida 2 vezes sem sucesso.
Ao escalar, avise: "Vou transferir você para o meu WhatsApp de plantão agora mesmo: (84) 98872-2044. Nossa equipe já assume para te atender!"`;

export async function processChat(
  message: string,
  history?: Array<{ role: string; content: string }>
): Promise<{ reply: string; suggestedTourId?: string; checkoutUrl?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = getGenAI();
      if (ai) {
        // Build conversation messages
        const contents: any[] = [];
        if (history && Array.isArray(history)) {
          history.slice(-6).forEach((h) => {
            contents.push({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }],
            });
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
          },
        });

        const replyText = response.text || '';
        let suggestedTourId = 'maracajau-vip';
        const lower = replyText.toLowerCase() + ' ' + message.toLowerCase();
        if (lower.includes('rio do fogo')) {
          suggestedTourId = 'rio-do-fogo-vip';
        } else if (lower.includes('genipabu') || lower.includes('buggy') || lower.includes('litoral norte')) {
          suggestedTourId = 'buggy-vip-privativo';
        } else if (lower.includes('pipa')) {
          suggestedTourId = 'pipa-praia-do-amor';
        } else if (lower.includes('4x4') || lower.includes('litoral sul')) {
          suggestedTourId = 'off-road-litoral-sul';
        } else if (lower.includes('transfer') || lower.includes('aeroporto')) {
          suggestedTourId = 'transfer-vip-aeroporto';
        } else if (lower.includes('quadriciclo')) {
          suggestedTourId = 'quadriciclo-aventura';
        }

        return {
          reply: replyText,
          suggestedTourId,
          checkoutUrl: 'https://loja.infinitepay.io/natalvipturismo',
        };
      }
    } catch (err) {
      console.warn('Fallback to Marcelo concierge rule-based engine:', err);
    }
  }

  // High quality contextual fallback strictly adhering to Marcelo's rules
  const queryLower = message.toLowerCase();
  let reply = '';
  let suggestedTourId: string | undefined = 'maracajau-vip';

  if (
    queryLower.includes('olá') ||
    queryLower.includes('ola') ||
    queryLower.includes('bom dia') ||
    queryLower.includes('boa tarde') ||
    queryLower.includes('boa noite') ||
    queryLower.includes('oi')
  ) {
    reply =
      'Olá! Sou o Marcelo, consultor da Natal VIP Turismo 🌴\nPara eu te indicar o roteiro perfeito, quando você chega a Natal e com quem vai viajar?';
  } else if (
    queryLower.includes('preço') ||
    queryLower.includes('valor') ||
    queryLower.includes('quanto') ||
    queryLower.includes('tabela')
  ) {
    if (queryLower.includes('buggy') || queryLower.includes('genipabu') || queryLower.includes('litoral norte')) {
      reply =
        'O Litoral Norte de Buggy custa R$ 820 privativo (ou divide para 2 casais, saindo R$ 205/pessoa). Com balsa e lagoas inclusas!\nVocê prefere com ou sem emoção nas dunas?';
      suggestedTourId = 'buggy-vip-privativo';
    } else if (queryLower.includes('pipa')) {
      reply =
        'Pipa + Praia do Amor sai por apenas R$ 80 por pessoa em van executiva climatizada com guia! E o Pipa by-Night sai por R$ 100.\nQual data você tem em mente para Pipa?';
      suggestedTourId = 'pipa-praia-do-amor';
    } else if (queryLower.includes('maracajau') || queryLower.includes('maracajaú')) {
      reply =
        'Maracajaú + Dayuse sai por R$ 170 por pessoa, já com lancha rápida e busca no hotel!\nPrefere que eu veja o melhor dia de maré baixa para vocês?';
      suggestedTourId = 'maracajau-vip';
    } else if (queryLower.includes('rio do fogo')) {
      reply =
        'Rio do Fogo + Punaú sai por R$ 170 por pessoa, incluindo o famoso banco de areia no meio do oceano.\nQuantas pessoas vão com você nesse passeio?';
      suggestedTourId = 'rio-do-fogo-vip';
    } else if (queryLower.includes('transfer') || queryLower.includes('aeroporto')) {
      reply =
        'O Transfer Aeroporto promocional sai de R$ 250 por apenas R$ 160 (ida e volta) contratando 1 ou mais passeios!\nQual o dia e horário do seu voo de chegada?';
      suggestedTourId = 'transfer-vip-aeroporto';
    } else if (queryLower.includes('quadriciclo')) {
      reply =
        'O Quadriciclo sai por R$ 280 para até 2 pessoas no mesmo veículo, com trilha e lagoa!\nQuer combinar ele com algum dos passeios no mesmo dia?';
      suggestedTourId = 'quadriciclo-aventura';
    } else {
      reply =
        'Temos Maracajaú por R$ 170, Pipa por R$ 80 e Buggy privativo por R$ 820. Todos com busca no hotel!\nQual desses estilos você prefere: praia relax, aventura ou piscinas naturais?';
    }
  } else if (queryLower.includes('hotel') || queryLower.includes('busca') || queryLower.includes('embarque')) {
    reply =
      'Sim! Buscamos na porta do seu hotel em Ponta Negra, Via Costeira e Praia dos Artistas, sem custo extra 🚐\nEm qual hotel você vai se hospedar?';
  } else if (queryLower.includes('pagar') || queryLower.includes('pagamento') || queryLower.includes('pix') || queryLower.includes('cartao') || queryLower.includes('cartão') || queryLower.includes('reserva')) {
    reply =
      'No Pix você só paga uma entrada para reservar e o restante no dia do passeio! Ou no cartão pelo link seguro: https://loja.infinitepay.io/natalvipturismo\nVocê prefere Pix ou cartão?';
  } else if (queryLower.includes('maré') || queryLower.includes('mare')) {
    reply =
      'Para as piscinas naturais de Maracajaú e Rio do Fogo, recomendo os dias com maré de 0.0 a 0.5m para água cristalina!\nVocê já tem os dias exatos em que estará por aqui?';
    suggestedTourId = 'maracajau-vip';
  } else if (queryLower.includes('humano') || queryLower.includes('atendente') || queryLower.includes('falar com pessoa') || queryLower.includes('telefone')) {
    reply =
      'Claro! Vou te conectar diretamente com nosso WhatsApp oficial: (84) 98872-2044.\nEstou à disposição para o que precisar!';
  } else {
    reply =
      'Sou o Marcelo, seu consultor da Natal VIP Turismo! Cuidamos de todo o seu roteiro com transfer na porta e nota 4.98 no Google.\nQual passeio você quer planejar hoje: Maracajaú, Pipa ou Buggy em Genipabu?';
  }

  return {
    reply,
    suggestedTourId,
    checkoutUrl: 'https://loja.infinitepay.io/natalvipturismo',
  };
}

