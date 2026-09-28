import { buildBookingConfirmationEmailHtml } from './emailTemplate';
import { syncReservationWithGoogleCalendar, generateGoogleCalendarUrl } from './googleCalendarSync';

/**
 * Service function for triggering mock email confirmations upon booking
 * and managing travel deal newsletter subscriptions.
 */

export interface BookingEmailConfirmationPayload {
  voucherCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tourName: string;
  date: string;
  timeWindow: string;
  tideHeight: number;
  adultsCount: number;
  childrenCount: number;
  hotelPickup?: string;
  paymentMethod: string;
  totalPrice: number;
}

export interface EmailConfirmationResult {
  success: boolean;
  messageId: string;
  recipient: string;
  agencyCopy: string;
  sentAt: string;
  subject: string;
  previewSummary: string;
  calendarUrl?: string;
  htmlTemplate?: string;
}

/**
 * Triggers a mock email confirmation upon booking.
 * Dispatches notification to customer's email and agency reservation center.
 */
export async function triggerBookingEmailConfirmation(
  booking: BookingEmailConfirmationPayload
): Promise<EmailConfirmationResult> {
  const timestamp = new Date().toISOString();
  const messageId = `MSG-VIP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const subject = `✨ Confirmação de Reserva VIP - ${booking.tourName} [Voucher: ${booking.voucherCode}]`;
  const agencyCopy = 'reservas@natalvipturismo.com';

  const previewSummary = `Olá, ${booking.customerName}! Sua reserva para ${booking.tourName} no dia ${booking.date} (janela ${booking.timeWindow}, maré ${booking.tideHeight}m) foi confirmada com sucesso. Valor: R$ ${booking.totalPrice.toFixed(2)}.`;

  const htmlTemplate = buildBookingConfirmationEmailHtml(booking);
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

  console.log(
    `%c[EMAIL SERVICE]%c Enviando confirmação de reserva para ${booking.customerEmail} de reservas@natalvipturismo.com...`,
    'background: #d97706; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #38bdf8;'
  );

  // 1. Attempt server-side dispatch to /api/send-voucher with full HTML and sender reservas@natalvipturismo.com
  try {
    await fetch('/api/send-voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voucherCode: booking.voucherCode,
        customerEmail: booking.customerEmail,
        agencyEmail: agencyCopy,
        booking,
        html: htmlTemplate,
        subject,
      }),
    });
  } catch (err) {
    console.debug('[EMAIL SERVICE] Backend endpoint simulation complete:', err);
  }

  // 2. Automatically synchronize with Google Agenda for reservas@natalvipturismo.com
  try {
    await syncReservationWithGoogleCalendar({
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
  } catch (err) {
    console.debug('[GOOGLE CALENDAR] Auto-sync notice:', err);
  }

  // 3. Persist in local storage for demonstration & customer review
  try {
    const existing = JSON.parse(localStorage.getItem('natalvip_email_logs') || '[]');
    existing.unshift({
      messageId,
      recipient: booking.customerEmail,
      agencyCopy,
      subject,
      sentAt: timestamp,
      voucherCode: booking.voucherCode,
      calendarUrl,
    });
    localStorage.setItem('natalvip_email_logs', JSON.stringify(existing.slice(0, 20)));
  } catch {
    // ignore local storage errors
  }

  return {
    success: true,
    messageId,
    recipient: booking.customerEmail,
    agencyCopy,
    sentAt: timestamp,
    subject,
    previewSummary,
    calendarUrl,
    htmlTemplate,
  };
}

/**
 * Subscribes a user's email to receive exclusive travel deals and promotions.
 */
export async function subscribeToTravelDeals(
  email: string,
  name?: string
): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Por favor, informe um endereço de e-mail válido.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();

  // Save to localStorage for demo persistence
  try {
    const list = JSON.parse(localStorage.getItem('natalvip_deals_subscribers') || '[]');
    if (!list.some((item: any) => item.email === cleanEmail)) {
      list.push({ email: cleanEmail, name: name || '', subscribedAt: timestamp });
      localStorage.setItem('natalvip_deals_subscribers', JSON.stringify(list));
    }
  } catch {
    // ignore storage error
  }

  // Also post to backend if active
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        name: name || 'Inscrito Newsletter VIP',
        source: 'footer_deals_subscription',
        subscribedAt: timestamp,
      }),
    });
  } catch {
    // silent fallback
  }

  return {
    success: true,
    message: 'Inscrição confirmada! Você receberá ofertas exclusivas de viagens em primeira mão.',
  };
}
