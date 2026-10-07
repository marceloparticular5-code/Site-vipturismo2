// Centralized Contact Configuration - Natal VIP Turismo
// All components, footers, headers and chat must import from this file.

export const PHONE_DISPLAY = '(84) 98872-2044';
export const PHONE_WA = '5584988722044';
export const CADASTUR_NUMBER = '39.456.551/0001-08';
export const SUPPORT_EMAIL = 'reservas@natalvipturismo.com.br';
export const ADDRESS_DISPLAY = 'Av. Eng. Roberto Freire, Ponta Negra, Natal - RN, CEP 59090-000';

export const HELP_TEXT =
  'Precisa de ajuda? Reserve online em poucos minutos. Se preferir, fale com a gente: (84) 98872-2044';

/**
 * Returns a standardized WhatsApp URL with encoded message
 */
export function getWhatsAppLink(message?: string): string {
  const defaultMsg =
    'Olá! Gostaria de falar com o atendimento da Natal VIP Turismo sobre reservas de passeios.';
  const text = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${PHONE_WA}?text=${text}`;
}
