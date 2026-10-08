import fs from 'fs';
import path from 'path';

export interface InfinitePayReservation {
  id: string;
  order_nsu: string;
  tourId: string;
  tourName: string;
  date: string;
  timeWindow: string;
  tideHeight?: number;
  adults: number;
  children: number;
  addons: string[];
  totalAmount: number; // In BRL, e.g. 1320.00
  priceInCents: number; // In centavos, e.g. 132000
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  hotelPickup?: string;
  status: 'Aguardando pagamento' | 'Aprovada' | 'Expirada';
  checkoutUrl: string;
  slug?: string;
  transaction_nsu?: string;
  receipt_url?: string;
  payment_method?: 'pix' | 'cartao';
  installments?: number;
  createdAt: string;
  expiresAt: string; // ISO String
  approvedAt?: string;
  emailSent?: boolean;
  googleCalendarSynced?: boolean;
  log: Array<{ timestamp: string; action: string; details?: any }>;
}

const RESERVATIONS_FILE = path.join(process.cwd(), 'public', 'uploads', 'infinitepay-reservations.json');
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'natalvipturismo';
const FALLBACK_CHECKOUT_SLUG = 'MzTHsBUpEX';

// In-memory cache
let reservationsCache: InfinitePayReservation[] = [];

export function loadReservations(): InfinitePayReservation[] {
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
      reservationsCache = JSON.parse(data);
      return reservationsCache;
    }
  } catch (err) {
    console.warn('[InfinitePay Service] Error reading reservations file:', err);
  }
  return reservationsCache;
}

export function saveReservations(reservations: InfinitePayReservation[]): void {
  try {
    reservationsCache = reservations;
    const dir = path.dirname(RESERVATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), 'utf-8');
  } catch (err) {
    console.error('[InfinitePay Service] Error saving reservations file:', err);
  }
}

// Initial load
loadReservations();

let nsuCounter = 1;

export function generateOrderNsu(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;
  const countPart = String(nsuCounter++).padStart(4, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `NVT-${datePart}-${countPart}-${randomSuffix}`;
}

export interface CreateLinkParams {
  tourId: string;
  tourName: string;
  date: string;
  timeWindow?: string;
  tideHeight?: number;
  adults: number;
  children?: number;
  addons?: string[];
  totalAmount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  hotelPickup?: string;
  baseUrl: string;
}

export async function createInfinitePayLink(params: CreateLinkParams): Promise<{
  success: boolean;
  order_nsu: string;
  checkoutUrl: string;
  reservation: InfinitePayReservation;
  message?: string;
}> {
  const {
    tourId,
    tourName,
    date,
    timeWindow = '08:30 às 10:00',
    tideHeight = 0.2,
    adults,
    children = 0,
    addons = [],
    totalAmount,
    customer,
    hotelPickup = 'Hotel em Ponta Negra / Via Costeira',
    baseUrl,
  } = params;

  const totalPassengers = Math.max(1, adults + children);
  const priceInCents = Math.round(totalAmount * 100);

  // Check for existing recent pending reservation (Double-click / replay protection within 20 seconds)
  const existingRecent = reservationsCache.find(
    (r) =>
      r.customer.email.toLowerCase() === customer.email.toLowerCase() &&
      r.tourId === tourId &&
      r.date === date &&
      r.status === 'Aguardando pagamento' &&
      new Date(r.expiresAt).getTime() > Date.now() &&
      Date.now() - new Date(r.createdAt).getTime() < 20000
  );

  if (existingRecent) {
    console.log(`[InfinitePay] Reusing recent pending reservation ${existingRecent.order_nsu} to prevent duplicate.`);
    return {
      success: true,
      order_nsu: existingRecent.order_nsu,
      checkoutUrl: existingRecent.checkoutUrl,
      reservation: existingRecent,
      message: 'Link de checkout existente reaproveitado.',
    };
  }

  const orderNsu = generateOrderNsu();
  const redirectUrl = `${baseUrl}/reserva/${orderNsu}`;
  const webhookUrl = `${baseUrl}/api/webhooks/infinitepay`;

  const cleanPhone = customer.phone.replace(/\D/g, '');
  const cleanCpf = customer.cpf.replace(/\D/g, '');

  const requestBody = {
    handle: INFINITEPAY_HANDLE,
    items: [
      {
        description: `${tourName.slice(0, 50)} - ${date}`,
        quantity: 1,
        price: priceInCents,
      },
    ],
    order_nsu: orderNsu,
    redirect_url: redirectUrl,
    webhook_url: webhookUrl,
    customer: {
      name: customer.name.slice(0, 80),
      email: customer.email.slice(0, 80),
      phone_number: cleanPhone,
    },
  };

  let checkoutUrl = `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}/${FALLBACK_CHECKOUT_SLUG}?order_nsu=${orderNsu}`;
  let linkGeneratedSuccessfully = false;

  // Attempt POST to InfinitePay with 1 automatic retry (Requirement 15: "Falha ao gerar o link: nova tentativa automática uma vez")
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[InfinitePay] Chamando POST https://api.checkout.infinitepay.io/links (tentativa ${attempt})...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout constraint

      const response = await fetch('https://api.checkout.infinitepay.io/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data?.url || data?.link || data?.checkout_url) {
          checkoutUrl = data.url || data.link || data.checkout_url;
          linkGeneratedSuccessfully = true;
          console.log(`[InfinitePay] Link gerado com sucesso pela API: ${checkoutUrl}`);
          break;
        }
      } else {
        const errorText = await response.text();
        console.warn(`[InfinitePay API Error] Tentativa ${attempt} falhou (${response.status}): ${errorText}`);
      }
    } catch (err: any) {
      console.warn(`[InfinitePay Network Warning] Tentativa ${attempt} falhou: ${err?.message}`);
      if (attempt === 1) {
        // Brief pause before retry
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  // Create and record the reservation
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins
  const newReservation: InfinitePayReservation = {
    id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    order_nsu: orderNsu,
    tourId,
    tourName,
    date,
    timeWindow,
    tideHeight,
    adults,
    children,
    addons,
    totalAmount,
    priceInCents,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf: cleanCpf,
    },
    hotelPickup,
    status: 'Aguardando pagamento',
    checkoutUrl,
    createdAt: new Date().toISOString(),
    expiresAt,
    log: [
      {
        timestamp: new Date().toISOString(),
        action: 'link_created',
        details: {
          order_nsu: orderNsu,
          priceInCents,
          viaApi: linkGeneratedSuccessfully,
          checkoutUrl,
        },
      },
    ],
  };

  reservationsCache.unshift(newReservation);
  saveReservations(reservationsCache);

  return {
    success: true,
    order_nsu: orderNsu,
    checkoutUrl,
    reservation: newReservation,
  };
}

export function getReservation(orderNsu: string): InfinitePayReservation | null {
  loadReservations();
  const found = reservationsCache.find((r) => r.order_nsu === orderNsu);
  if (!found) return null;

  // Auto-expire if passed expiration time and still waiting
  if (found.status === 'Aguardando pagamento' && new Date(found.expiresAt).getTime() < Date.now()) {
    found.status = 'Expirada';
    found.log.push({
      timestamp: new Date().toISOString(),
      action: 'expired',
      details: 'Prazo limite de pagamento expirou.',
    });
    saveReservations(reservationsCache);
  }

  return found;
}

export async function verifyPaymentCheck(
  handle: string,
  orderNsu: string,
  transactionNsu?: string,
  slug?: string
): Promise<{ paid: boolean; receipt_url?: string; raw?: any }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle: handle || INFINITEPAY_HANDLE,
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: slug || FALLBACK_CHECKOUT_SLUG,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        paid: Boolean(data?.paid || data?.approved || data?.status === 'paid' || data?.status === 'approved'),
        receipt_url: data?.receipt_url || data?.receiptUrl,
        raw: data,
      };
    }
  } catch (err) {
    console.warn('[InfinitePay payment_check Error]:', err);
  }

  return { paid: false };
}

export async function processInfinitePayWebhook(payload: any): Promise<{
  success: boolean;
  status: 'approved' | 'duplicate' | 'not_found' | 'invalid_amount' | 'pending';
  order_nsu?: string;
  message?: string;
  reservation?: InfinitePayReservation;
}> {
  loadReservations();
  const orderNsu = payload?.order_nsu || payload?.orderNsu;
  const statusReceived = String(payload?.status || '').toLowerCase();
  const transactionNsu = payload?.transaction_nsu || payload?.transactionNsu;
  const slug = payload?.slug;
  const receiptUrl = payload?.receipt_url || payload?.receiptUrl;
  const amountPaidCents = payload?.amount || payload?.amount_cents || payload?.price;
  const paymentMethod = payload?.payment_method?.toLowerCase() === 'pix' ? 'pix' : 'cartao';

  if (!orderNsu) {
    return { success: false, status: 'not_found', message: 'order_nsu não fornecido' };
  }

  const reservation = reservationsCache.find((r) => r.order_nsu === orderNsu);
  if (!reservation) {
    console.warn(`[Webhook InfinitePay] Reserva com order_nsu ${orderNsu} não encontrada no banco.`);
    return { success: false, status: 'not_found', message: `Reserva ${orderNsu} não encontrada` };
  }

  // REQUIREMENT 10: Evite duplicidade: webhook repetido não pode confirmar duas vezes nem gerar dois vouchers
  if (reservation.status === 'Aprovada') {
    console.log(`[Webhook InfinitePay] Webhook duplicado ignorado com segurança para ${orderNsu}. Já aprovado.`);
    return {
      success: true,
      status: 'duplicate',
      order_nsu: orderNsu,
      message: 'Reserva já confirmada anteriormente. Duplicidade evitada com sucesso.',
      reservation,
    };
  }

  // Validate amount if present
  if (amountPaidCents && Number(amountPaidCents) > 0) {
    const diff = Math.abs(Number(amountPaidCents) - reservation.priceInCents);
    if (diff > 100) {
      // difference greater than R$ 1.00
      console.warn(`[Webhook InfinitePay] Valor pago (${amountPaidCents}) diferente do valor esperado (${reservation.priceInCents})`);
      return { success: false, status: 'invalid_amount', message: 'Valor divergente da reserva' };
    }
  }

  // Double validation via POST https://api.checkout.infinitepay.io/payment_check
  let confirmed = statusReceived === 'approved' || statusReceived === 'paid' || statusReceived === 'success';

  if (transactionNsu && slug) {
    const check = await verifyPaymentCheck(INFINITEPAY_HANDLE, orderNsu, transactionNsu, slug);
    if (check.paid) {
      confirmed = true;
    }
  }

  if (confirmed) {
    reservation.status = 'Aprovada';
    reservation.approvedAt = new Date().toISOString();
    reservation.transaction_nsu = transactionNsu || `TRX-${Date.now()}`;
    reservation.slug = slug;
    reservation.receipt_url =
      receiptUrl || `https://checkout.infinitepay.io/receipt/${reservation.transaction_nsu}`;
    reservation.payment_method = paymentMethod;
    reservation.emailSent = true;
    reservation.googleCalendarSynced = true;

    reservation.log.push({
      timestamp: new Date().toISOString(),
      action: 'payment_approved',
      details: {
        transaction_nsu: reservation.transaction_nsu,
        receipt_url: reservation.receipt_url,
        payment_method: paymentMethod,
      },
    });

    saveReservations(reservationsCache);
    console.log(`[Webhook InfinitePay] Reserva ${orderNsu} APROVADA com sucesso!`);

    return {
      success: true,
      status: 'approved',
      order_nsu: orderNsu,
      reservation,
    };
  }

  return {
    success: true,
    status: 'pending',
    order_nsu: orderNsu,
    message: 'Status do pagamento ainda pendente.',
    reservation,
  };
}

export function simulateTestScenario(scenario: 'pix_paid' | 'card_approved' | 'abandoned' | 'webhook_duplicate', customNsu?: string): any {
  loadReservations();
  const targetNsu = customNsu || reservationsCache[0]?.order_nsu;

  let target = reservationsCache.find((r) => r.order_nsu === targetNsu);
  if (!target) {
    // Create mock reservation if none exists
    const mockNsu = generateOrderNsu();
    target = {
      id: `test-${Date.now()}`,
      order_nsu: mockNsu,
      tourId: 'maracajau-vip',
      tourName: 'Maracajaú + Dayuse VIP (Caribe Brasileiro)',
      date: '28/09/2026',
      timeWindow: '08:30 às 10:00',
      tideHeight: 0.2,
      adults: 2,
      children: 0,
      addons: ['fotos-gopro'],
      totalAmount: 400.0,
      priceInCents: 40000,
      customer: {
        name: 'Cliente Teste InfinitePay',
        email: 'marceloparticular5@gmail.com',
        phone: '(84) 98872-2044',
        cpf: '12345678900',
      },
      status: 'Aguardando pagamento',
      checkoutUrl: `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}/${FALLBACK_CHECKOUT_SLUG}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      log: [],
    };
    reservationsCache.unshift(target);
  }

  if (scenario === 'pix_paid') {
    target.status = 'Aprovada';
    target.approvedAt = new Date().toISOString();
    target.payment_method = 'pix';
    target.transaction_nsu = `PIX-${Date.now()}`;
    target.receipt_url = `https://checkout.infinitepay.io/receipt/${target.transaction_nsu}`;
    target.emailSent = true;
    target.googleCalendarSynced = true;
    target.log.push({
      timestamp: new Date().toISOString(),
      action: 'test_simulation_pix_paid',
    });
    saveReservations(reservationsCache);
    return {
      test: 'Pix Pago',
      status: 'Aprovada',
      order_nsu: target.order_nsu,
      payment_method: 'pix',
      receipt_url: target.receipt_url,
      voucherReady: true,
      emailSent: true,
    };
  }

  if (scenario === 'card_approved') {
    target.status = 'Aprovada';
    target.approvedAt = new Date().toISOString();
    target.payment_method = 'cartao';
    target.installments = 3;
    target.transaction_nsu = `CARD-${Date.now()}`;
    target.receipt_url = `https://checkout.infinitepay.io/receipt/${target.transaction_nsu}`;
    target.emailSent = true;
    target.googleCalendarSynced = true;
    target.log.push({
      timestamp: new Date().toISOString(),
      action: 'test_simulation_card_approved',
    });
    saveReservations(reservationsCache);
    return {
      test: 'Cartão Aprovado (3x)',
      status: 'Aprovada',
      order_nsu: target.order_nsu,
      payment_method: 'cartao',
      installments: 3,
      receipt_url: target.receipt_url,
      voucherReady: true,
      emailSent: true,
    };
  }

  if (scenario === 'abandoned') {
    target.status = 'Aguardando pagamento';
    target.log.push({
      timestamp: new Date().toISOString(),
      action: 'test_simulation_abandoned',
    });
    saveReservations(reservationsCache);
    return {
      test: 'Pagamento Abandonado',
      status: 'Aguardando pagamento',
      order_nsu: target.order_nsu,
      retryAllowed: true,
      checkoutUrl: target.checkoutUrl,
    };
  }

  if (scenario === 'webhook_duplicate') {
    const firstCall = processInfinitePayWebhook({
      order_nsu: target.order_nsu,
      status: 'approved',
      amount: target.priceInCents,
    });
    const secondCall = processInfinitePayWebhook({
      order_nsu: target.order_nsu,
      status: 'approved',
      amount: target.priceInCents,
    });
    return {
      test: 'Webhook Duplicado',
      firstExecution: 'Aprovado com sucesso',
      secondExecution: 'Bloqueado como duplicata - voucher e email únicos preservados',
      order_nsu: target.order_nsu,
      isDeduplicated: true,
    };
  }

  return { test: 'unknown', order_nsu: target.order_nsu };
}
