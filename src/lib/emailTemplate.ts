import { BookingEmailConfirmationPayload } from './emailService';
import { generateGoogleCalendarUrl } from './googleCalendarSync';

/**
 * Builds the official confirmation email HTML template for Natal Vip Turismo.
 * Sender: reservas@natalvipturismo.com
 */
export function buildBookingConfirmationEmailHtml(
  booking: BookingEmailConfirmationPayload
): string {
  const calendarUrl = generateGoogleCalendarUrl({
    voucherCode: booking.voucherCode,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    tourName: booking.tourName,
    date: booking.date,
    timeWindow: booking.timeWindow,
    tideHeight: booking.tideHeight,
    hotelPickup: booking.hotelPickup,
    adultsCount: booking.adultsCount,
    childrenCount: booking.childrenCount,
    totalPrice: booking.totalPrice,
    paymentMethod: booking.paymentMethod,
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Reserva - Natal Vip Turismo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050C16; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050C16; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #091527; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Header Brand -->
          <tr>
            <td style="padding: 28px 24px; text-align: center; background: linear-gradient(180deg, #0f223d 0%, #091527 100%); border-bottom: 1px solid rgba(245, 158, 11, 0.2);">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #f59e0b; font-weight: 800; margin-bottom: 6px;">
                ✦ NATAL VIP TURISMO · AGÊNCIA OFICIAL ✦
              </div>
              <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 900; letter-spacing: -0.5px;">
                Reserva & Pagamento Confirmados
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">
                Enviado oficialmente por <strong style="color: #38bdf8;">reservas@natalvipturismo.com</strong>
              </p>
            </td>
          </tr>

          <!-- Success Alert Banner -->
          <tr>
            <td style="padding: 16px 24px; background-color: rgba(16, 185, 129, 0.15); border-bottom: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
              <span style="display: inline-block; background-color: #10b981; color: #050c16; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 12px;">
                ✓ PAGAMENTO APROVADO & VAGA GARANTIDA
              </span>
            </td>
          </tr>

          <!-- Passenger Greeting -->
          <tr>
            <td style="padding: 24px 24px 12px;">
              <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                Olá, <strong style="color: #f8fafc;">${booking.customerName}</strong>! É uma honra ter você conosco em Natal/RN. 
                Sua reserva foi concluída com sucesso e os registros da Marinha e do clube de apoio já foram sincronizados.
              </p>
            </td>
          </tr>

          <!-- Voucher Badge Box -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table role="presentation" width="100%" style="background-color: #060e1a; border: 2px dashed #f59e0b; border-radius: 16px; padding: 18px;">
                <tr>
                  <td align="center">
                    <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 1px;">
                      CÓDIGO LOCALIZADOR (VOUCHER VIP)
                    </span>
                    <div style="font-size: 28px; font-weight: 900; color: #fbbf24; letter-spacing: 2px; margin: 4px 0;">
                      ${booking.voucherCode}
                    </div>
                    <span style="font-size: 11px; color: #10b981; font-weight: 700;">
                      ● Válido com apresentação de documento com foto no embarque
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tour & Schedule Details Grid -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table role="presentation" width="100%" style="background-color: #0c1a30; border-radius: 14px; border: 1px solid #1e293b; padding: 16px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #1e293b;">
                    <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Roteiro Escolhido</span>
                    <div style="font-size: 17px; font-weight: 800; color: #ffffff; margin-top: 2px;">
                      ${booking.tourName}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; width: 50%;">
                    <span style="font-size: 11px; color: #94a3b8;">Data do Passeio:</span>
                    <div style="font-size: 14px; font-weight: 800; color: #fbbf24;">${booking.date}</div>
                  </td>
                  <td style="padding-top: 12px; width: 50%;">
                    <span style="font-size: 11px; color: #94a3b8;">Janela Recomendada:</span>
                    <div style="font-size: 14px; font-weight: 800; color: #ffffff;">${booking.timeWindow}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; width: 50%;">
                    <span style="font-size: 11px; color: #94a3b8;">Condição de Maré:</span>
                    <div style="font-size: 14px; font-weight: 800; color: #38bdf8;">${booking.tideHeight}m (Maré Baixa Ideal)</div>
                  </td>
                  <td style="padding-top: 12px; width: 50%;">
                    <span style="font-size: 11px; color: #94a3b8;">Passageiros:</span>
                    <div style="font-size: 14px; font-weight: 800; color: #ffffff;">
                      ${booking.adultsCount} Adulto(s)${booking.childrenCount ? `, ${booking.childrenCount} Criança(s)` : ''}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 12px; border-top: 1px solid #1e293b; margin-top: 12px;">
                    <span style="font-size: 11px; color: #94a3b8;">Local de Embarque (Hotel):</span>
                    <div style="font-size: 14px; font-weight: 700; color: #e2e8f0; margin-top: 2px;">
                      ${booking.hotelPickup || 'Ponta Negra / Via Costeira (A confirmar com o guia)'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 12px; border-top: 1px solid #1e293b; margin-top: 12px;">
                    <span style="font-size: 11px; color: #94a3b8;">Pagamento Realizado:</span>
                    <div style="font-size: 16px; font-weight: 900; color: #10b981; margin-top: 2px;">
                      R$ ${booking.totalPrice.toFixed(2)} (${booking.paymentMethod.toUpperCase()})
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Google Calendar Integration Callout -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table role="presentation" width="100%" style="background: linear-gradient(135deg, rgba(66, 133, 244, 0.15) 0%, rgba(52, 168, 83, 0.15) 100%); border: 1px solid rgba(66, 133, 244, 0.4); border-radius: 14px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 800; color: #60a5fa; text-transform: uppercase; margin-bottom: 4px;">
                      📅 SINCRONIZAÇÃO COM GOOGLE AGENDA
                    </div>
                    <p style="margin: 0 0 12px; font-size: 12px; color: #cbd5e1; line-height: 1.4;">
                      Este evento foi registrado na agenda oficial da agência (<strong>reservas@natalvipturismo.com</strong>). 
                      Adicione-o diretamente ao seu Google Calendário com 1 clique:
                    </p>
                    <a href="${calendarUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 800; padding: 10px 18px; border-radius: 10px;">
                      + Adicionar ao Meu Google Agenda
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recommendations Checklist -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="font-size: 12px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px;">
                Informações Importantes para o Dia:
              </div>
              <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #94a3b8; line-height: 1.8;">
                <li>Esteja na recepção do hotel com 15 minutos de antecedência ao horário indicado.</li>
                <li>Leve protetor solar biodegradável, toalha, óculos escuros e trajes de banho.</li>
                <li>Fotos aquáticas e suporte de bordo inclusos para clientes VIP.</li>
                <li>Caso precise ajustar a data ou passageiros, entre em contato imediatamente com nossa central.</li>
              </ul>
            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #060e1a; border-top: 1px solid rgba(245, 158, 11, 0.2); text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #cbd5e1;">
                Dúvidas sobre a maré ou roteiro? Fale com nosso consultor:
              </p>
              <div style="font-size: 14px; font-weight: 900; color: #fbbf24; margin-bottom: 12px;">
                Marcelo · Plantão VIP WhatsApp: <a href="https://wa.me/5584988256545" style="color: #10b981; text-decoration: none;">(84) 98825-6545</a>
              </div>
              <p style="margin: 0; font-size: 10px; color: #64748b; line-height: 1.5;">
                Natal Vip Turismo Ltda · Cadastur 24.089.123/0001-90<br>
                E-mail Oficial: reservas@natalvipturismo.com · Ponta Negra, Natal/RN<br>
                Este e-mail é gerado automaticamente pelo sistema de confirmação e sincronização VIP.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
