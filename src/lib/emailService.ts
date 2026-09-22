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

  console.log(
    `%c[EMAIL SERVICE]%c Enviando confirmação de reserva para ${booking.customerEmail} e cópia para ${agencyCopy}...`,
    'background: #d97706; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #38bdf8;'
  );
  console.log({
    messageId,
    subject,
    recipient: booking.customerEmail,
    agencyCopy,
    sentAt: timestamp,
    bookingDetails: {
      voucherCode: booking.voucherCode,
      tour: booking.tourName,
      date: booking.date,
      timeWindow: booking.timeWindow,
      tide: `${booking.tideHeight}m`,
      passengers: `${booking.adultsCount} adulto(s), ${booking.childrenCount} criança(s)`,
      hotelPickup: booking.hotelPickup || 'A combinar',
      paymentMethod: booking.paymentMethod.toUpperCase(),
      totalPrice: `R$ ${booking.totalPrice.toFixed(2)}`,
    },
  });

  // Attempt server-side dispatch to /api/send-voucher if backend route is available
  try {
    await fetch('/api/send-voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voucherCode: booking.voucherCode,
        customerEmail: booking.customerEmail,
        agencyEmail: agencyCopy,
        booking,
      }),
    });
  } catch (err) {
    // Graceful fallback for mock service
    console.debug('[EMAIL SERVICE] Backend endpoint simulation complete:', err);
  }

  // Also persist in local storage for demonstration & customer review
  try {
    const existing = JSON.parse(localStorage.getItem('natalvip_email_logs') || '[]');
    existing.unshift({
      messageId,
      recipient: booking.customerEmail,
      subject,
      sentAt: timestamp,
      voucherCode: booking.voucherCode,
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
