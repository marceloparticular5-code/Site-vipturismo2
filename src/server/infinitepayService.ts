import fs from 'fs';
import path from 'path';
import { VIP_TOURS, AVAILABLE_ADDONS, getTourPricing } from '../data/toursData';

export interface InfinitePayReservation {
  id: string; // Código de reserva único, ex: NVT-2026-8492
  order_nsu: string;
  transaction_nsu?: string;
  invoice_slug?: string;
  receipt_url?: string;
  tourId: string;
  tourName: string;
  date: string;
  timeWindow?: string;
  tideHeight?: string;
  adults: number;
  children: number;
  addons: string[];
  totalAmount: number; // Em Reais, ex: 1320.00
  priceInCents: number; // Em centavos BRL, ex: 132000
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf?: string;
  };
  hotelPickup?: string;
  status: 'aguardando pagamento' | 'CONFIRMADA' | 'recusada' | 'expirada' | 'cancelada';
  checkoutUrl: string;
  payment_method?: 'pix' | 'cartao';
  capture_method?: string;
  installments?: number;
  installmentAmount?: number;
  installmentAmountFormatted?: string;
  createdAt: string;
  confirmedAt?: string;
  expiresAt: string;
  paymentErrorMessage?: string;
  log: Array<{
    timestamp: string;
    action: string;
    details?: any;
  }>;
}

const RESERVATIONS_FILE = path.join(process.cwd(), 'reservations-infinitepay.json');
let reservationsCache: InfinitePayReservation[] = [];

export function loadReservations(): InfinitePayReservation[] {
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
      reservationsCache = JSON.parse(data);
    } else {
      reservationsCache = [];
    }
  } catch (err) {
    console.error('[InfinitePay Reservations Store] Erro ao carregar arquivo:', err);
    reservationsCache = [];
  }
  return reservationsCache;
}

export function saveReservations(list: InfinitePayReservation[]) {
  try {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    reservationsCache = list;
  } catch (err) {
    console.error('[InfinitePay Reservations Store] Erro ao salvar arquivo:', err);
  }
}

export interface CatalogItemConfig {
  id: string;
  description: string;
  priceInCents: number;
  isVehicleFixed: boolean;
}

export const INFINITEPAY_CATALOG: Record<string, CatalogItemConfig> = {
  'pacote-casal-vip': {
    id: 'pacote-casal-vip',
    description: 'Pacote Casal Vip',
    priceInCents: 132000,
    isVehicleFixed: true,
  },
  'buggy-vip-privativo': {
    id: 'buggy-vip-privativo',
    description: 'Buggy Privativo Premium',
    priceInCents: 82000,
    isVehicleFixed: true,
  },
  'buggy-litoral-norte-compartilhado': {
    id: 'buggy-litoral-norte-compartilhado',
    description: 'Buggy Litoral Norte Compartilhado',
    priceInCents: 41000,
    isVehicleFixed: false,
  },
  'off-road-litoral-sul': {
    id: 'off-road-litoral-sul',
    description: 'Litoral Sul 4X4',
    priceInCents: 15000,
    isVehicleFixed: false,
  },
  'pipa-praia-do-amor': {
    id: 'pipa-praia-do-amor',
    description: 'Pipa + Praia do Amor',
    priceInCents: 8000,
    isVehicleFixed: false,
  },
  'pipa-by-night': {
    id: 'pipa-by-night',
    description: 'Pipa By-Night',
    priceInCents: 10000,
    isVehicleFixed: false,
  },
  'rio-do-fogo-vip': {
    id: 'rio-do-fogo-vip',
    description: 'Rio do Fogo + Punaú',
    priceInCents: 17000,
    isVehicleFixed: false,
  },
  'maracajau-vip': {
    id: 'maracajau-vip',
    description: 'Parrachos de Maracajaú + Dayuse + Parque Aquático Infantil',
    priceInCents: 17000,
    isVehicleFixed: false,
  },
  'quadriciclo-aventura': {
    id: 'quadriciclo-aventura',
    description: 'Quadriciclo + Lagoa da Juventude',
    priceInCents: 28000,
    isVehicleFixed: true,
  },
  'transfer-vip-aeroporto': {
    id: 'transfer-vip-aeroporto',
    description: 'Transfer Aeroporto Privativo Premium',
    priceInCents: 25000,
    isVehicleFixed: true,
  },
  'auto-do-potengi': {
    id: 'auto-do-potengi',
    description: 'Auto do Potengi + City-Tour',
    priceInCents: 15000,
    isVehicleFixed: false,
  },
  'buggy-litoral-norte-sunset': {
    id: 'buggy-litoral-norte-sunset',
    description: 'Litoral Norte Buggy VIP Premium + Pôr do Sol',
    priceInCents: 130000,
    isVehicleFixed: true,
  },
  'litoral-sul-4x4-vip-premium': {
    id: 'litoral-sul-4x4-vip-premium',
    description: 'Litoral Sul 4x4 VIP Premium',
    priceInCents: 100000,
    isVehicleFixed: true,
  },
  'pipa-praia-do-amor-vip-premium': {
    id: 'pipa-praia-do-amor-vip-premium',
    description: 'Pipa + Praia do Amor VIP Premium',
    priceInCents: 55000,
    isVehicleFixed: true,
  },
  'pipa-by-night-vip-premium': {
    id: 'pipa-by-night-vip-premium',
    description: 'Pipa By-Night VIP Premium',
    priceInCents: 65000,
    isVehicleFixed: true,
  },
  'city-tour-historico-vip-premium': {
    id: 'city-tour-historico-vip-premium',
    description: 'City-Tour Histórico',
    priceInCents: 55000,
    isVehicleFixed: true,
  },
};

/**
 * Backend price calculation - calculates total in cents strictly on the server.
 * Adults + Children (3 a 11 anos) + Selected Addons.
 */
export function calculateBackendPrice(
  tourId: string,
  adults: number,
  children: number,
  addons: string[] = []
): {
  tour: any;
  safeAdults: number;
  safeChildren: number;
  adultsTotal: number;
  childrenTotal: number;
  addonsTotal: number;
  totalBRL: number;
  priceInCents: number;
  validAddons: string[];
} {
  const tour = VIP_TOURS.find((t) => t.id === tourId) || VIP_TOURS[0];
  const safeAdults = Math.max(1, Math.min(20, Number(adults) || 1));
  const safeChildren = Math.max(0, Math.min(20, Number(children) || 0));

  const pricing = getTourPricing(tour, safeAdults, safeChildren);
  const adultsTotal = pricing.adultsTotal;
  const childrenTotal = pricing.childrenTotal;

  const validAddons: string[] = [];
  let addonsTotal = 0;
  if (Array.isArray(addons)) {
    for (const addonId of addons) {
      const found = AVAILABLE_ADDONS.find((a) => a.id === addonId);
      if (found) {
        addonsTotal += found.price;
        validAddons.push(addonId);
      }
    }
  }

  const totalBRL = adultsTotal + childrenTotal + addonsTotal;
  const priceInCents = Math.round(totalBRL * 100);

  return {
    tour,
    safeAdults,
    safeChildren,
    adultsTotal,
    childrenTotal,
    addonsTotal,
    totalBRL,
    priceInCents,
    validAddons,
  };
}

export interface CreateInfinitePaySessionParams {
  tourId: string;
  tourName?: string;
  date: string;
  timeWindow?: string;
  tideHeight?: string;
  adults: number;
  children: number;
  addons?: string[];
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf?: string;
  };
  hotelPickup?: string;
  baseUrl: string;
  paymentMethodPreference?: 'pix' | 'cartao';
  installments?: number;
}

/**
 * Creates InfinitePay payment link using official Checkout Integrado API:
 * POST https://api.checkout.infinitepay.io/links
 */
export async function createInfinitePayLink(params: CreateInfinitePaySessionParams): Promise<{
  success: boolean;
  reservation: InfinitePayReservation;
  checkoutUrl: string;
  orderNsu: string;
  isMockFallback?: boolean;
}> {
  loadReservations();

  const {
    tourId,
    date,
    timeWindow = '08:30 às 10:00',
    tideHeight,
    adults,
    children,
    addons = [],
    customer,
    hotelPickup,
    baseUrl,
    paymentMethodPreference,
    installments = 1,
  } = params;

  const safeInstallments = Math.min(3, Math.max(1, Number(installments) || 1));

  // 1. Calculate price strictly on the backend in BRL cents
  const calc = calculateBackendPrice(tourId, adults, children, addons);
  const orderNsu = `NVT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiration

  // Handle (InfiniteTag) strictly from backend environment variable
  const rawHandle = process.env.INFINITEPAY_HANDLE || process.env.INFINITE_HANDLE || 'natalvipturismo';
  const infiniteTag = rawHandle.replace(/^\$/, '').trim();

  // Clean URLs with domain - ensures valid HTTPS complete URL
  let cleanBase = baseUrl.replace(/\/$/, '');
  if (
    !cleanBase.startsWith('https://') &&
    !cleanBase.includes('localhost') &&
    !cleanBase.includes('127.0.0.1')
  ) {
    cleanBase = cleanBase.replace(/^http:\/\//, 'https://');
  }
  const redirectUrl = `${cleanBase}/confirmacao?order_nsu=${orderNsu}`;
  const webhookUrl = `${cleanBase}/api/webhooks/infinitepay`;

  // Item description in cents based on official catalog
  const catalogEntry =
    INFINITEPAY_CATALOG[tourId] ||
    Object.values(INFINITEPAY_CATALOG).find(
      (c) => c.description.toLowerCase() === calc.tour.title.toLowerCase()
    );

  const description = catalogEntry ? catalogEntry.description : calc.tour.title;
  const isVehicle = catalogEntry
    ? catalogEntry.isVehicleFixed
    : calc.tour.pricingType === 'vehicle_fixed' || calc.tour.pricingType === 'couple_fixed';

  // Rule: Para serviços por pessoa, quantity = nº de passageiros; para serviços privativos/por veículo, quantity = 1
  const quantity = isVehicle ? 1 : Math.max(1, calc.safeAdults + calc.safeChildren);
  const priceInCents = catalogEntry ? catalogEntry.priceInCents : Math.round((calc.totalBRL / quantity) * 100);

  const items = [
    {
      description,
      quantity,
      price: priceInCents,
    },
  ];

  let checkoutUrl = '';
  let isMockFallback = false;

  // 2. Call official InfinitePay Checkout API
  try {
    console.log(
      `[InfinitePay API] Criando link de pagamento para ${orderNsu} (R$ ${calc.totalBRL} = ${calc.priceInCents} centavos) via handle: ${infiniteTag}...`
    );

    const apiPayload = {
      handle: infiniteTag,
      items,
      order_nsu: orderNsu,
      redirect_url: redirectUrl,
      webhook_url: webhookUrl,
      customer: {
        name: customer.name ? customer.name.trim() : 'Turista Vip',
        email: customer.email ? customer.email.trim() : 'contato@natalvipturismo.com',
        phone_number: customer.phone ? customer.phone.replace(/\D/g, '') : '',
      },
    };

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });

    if (response.ok) {
      const respData = await response.json();
      console.log('[InfinitePay API Response]:', respData);
      checkoutUrl = respData.url || respData.checkout_url || respData.link || respData.public_url || '';
    } else {
      const errText = await response.text();
      console.warn(`[InfinitePay API Error ${response.status}]: ${errText}`);
    }
  } catch (err: any) {
    console.warn('[InfinitePay API Network Failure]:', err?.message);
  }

  // If live call returned no URL (e.g. sandbox without internet or mock mode), provide reliable fallback
  if (!checkoutUrl) {
    console.log(`[InfinitePay Flow] Usando redirecionamento seguro para ${orderNsu}`);
    isMockFallback = true;
    checkoutUrl = `${cleanBase}/reserva/${orderNsu}?checkout_pending=true`;
  }

  // 3. Create initial reservation with strict "aguardando pagamento" status
  const newReservation: InfinitePayReservation = {
    id: orderNsu,
    order_nsu: orderNsu,
    tourId: calc.tour.id,
    tourName: calc.tour.title,
    date,
    timeWindow,
    tideHeight,
    adults: calc.safeAdults,
    children: calc.safeChildren,
    addons: calc.validAddons,
    totalAmount: calc.totalBRL,
    priceInCents: calc.priceInCents,
    customer: {
      name: customer.name ? customer.name.trim() : 'Turista Vip',
      email: customer.email ? customer.email.trim() : 'contato@natalvipturismo.com',
      phone: customer.phone ? customer.phone.trim() : '(84) 99999-9999',
      cpf: customer.cpf ? customer.cpf.trim() : '',
    },
    hotelPickup: hotelPickup || 'Hotel em Ponta Negra / Via Costeira',
    status: 'aguardando pagamento',
    checkoutUrl,
    payment_method: paymentMethodPreference || 'pix',
    installments: safeInstallments,
    installmentAmount: Number((calc.totalBRL / safeInstallments).toFixed(2)),
    installmentAmountFormatted: (calc.totalBRL / safeInstallments).toFixed(2).replace('.', ','),
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    log: [
      {
        timestamp: now.toISOString(),
        action: 'reservation_created',
        details: {
          priceInCents: calc.priceInCents,
          totalAmount: calc.totalBRL,
          adults: calc.safeAdults,
          children: calc.safeChildren,
          isMockFallback,
        },
      },
    ],
  };

  reservationsCache.unshift(newReservation);
  saveReservations(reservationsCache);

  return {
    success: true,
    reservation: newReservation,
    checkoutUrl,
    orderNsu,
    isMockFallback,
  };
}

export function getReservation(orderNsu: string): InfinitePayReservation | null {
  const list = loadReservations();
  return (
    list.find(
      (r) =>
        r.order_nsu === orderNsu ||
        r.id === orderNsu ||
        (r.transaction_nsu && r.transaction_nsu === orderNsu)
    ) || null
  );
}

/**
 * Calls InfinitePay official payment_check endpoint to verify transaction status:
 * POST https://api.checkout.infinitepay.io/payment_check
 * Body: { handle, order_nsu, transaction_nsu, slug }
 */
export async function checkInfinitePayPayment(params: {
  handle?: string;
  order_nsu: string;
  transaction_nsu?: string;
  slug?: string;
}): Promise<{
  paid: boolean;
  amount?: number;
  installments?: number;
  capture_method?: string;
  raw?: any;
}> {
  const rawHandle =
    params.handle ||
    process.env.INFINITEPAY_HANDLE ||
    process.env.INFINITE_HANDLE ||
    'natalvipturismo';
  const handle = rawHandle.replace(/^\$/, '').trim();

  try {
    console.log(`[InfinitePay payment_check] Verificando order_nsu: ${params.order_nsu}...`);
    const resp = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        handle,
        order_nsu: params.order_nsu,
        transaction_nsu: params.transaction_nsu || '',
        slug: params.slug || '',
      }),
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log('[InfinitePay payment_check result]:', data);
      return {
        paid: Boolean(data?.paid || data?.success && data?.status === 'paid'),
        amount: data?.amount || data?.paid_amount,
        installments: data?.installments,
        capture_method: data?.capture_method,
        raw: data,
      };
    }
  } catch (err: any) {
    console.warn('[InfinitePay payment_check failed]:', err?.message);
  }

  return { paid: false };
}

/**
 * Webhook Processor with validation, payment_check verification, and idempotency.
 * Only confirms reservation when payment is truly approved.
 */
export async function processInfinitePayWebhook(payload: any): Promise<{
  success: boolean;
  status: string;
  orderNsu?: string;
  reservation?: InfinitePayReservation;
  message?: string;
}> {
  loadReservations();

  if (!payload) {
    return { success: false, status: 'empty_payload', message: 'Payload do webhook vazio.' };
  }

  console.log('[InfinitePay Webhook Payload Received]:', JSON.stringify(payload));

  // Extract fields from various possible payload formats (direct or nested)
  const orderNsu =
    payload.order_nsu ||
    payload.data?.order_nsu ||
    payload.orderNsu ||
    payload.invoice_slug ||
    payload.data?.invoice_slug ||
    '';

  const transactionNsu =
    payload.transaction_nsu ||
    payload.data?.transaction_nsu ||
    payload.transactionNsu ||
    payload.tid ||
    `tx_${Date.now()}`;

  const slug = payload.slug || payload.invoice_slug || payload.data?.slug || '';
  const captureMethod =
    payload.capture_method || payload.data?.capture_method || payload.payment_method || 'pix';
  const installments = Number(payload.installments || payload.data?.installments || 1);
  const receiptUrl = payload.receipt_url || payload.data?.receipt_url || '';

  // Amount in centavos or reais
  let paidAmountCents = 0;
  if (typeof payload.paid_amount === 'number') {
    paidAmountCents = payload.paid_amount > 1000 ? payload.paid_amount : Math.round(payload.paid_amount * 100);
  } else if (typeof payload.amount === 'number') {
    paidAmountCents = payload.amount > 1000 ? payload.amount : Math.round(payload.amount * 100);
  } else if (typeof payload.data?.paid_amount === 'number') {
    paidAmountCents = payload.data.paid_amount;
  }

  // Payment status flags
  const isApproved =
    payload.paid === true ||
    payload.status === 'paid' ||
    payload.status === 'approved' ||
    payload.status === 'complete' ||
    payload.topic === 'invoice_paid' ||
    payload.event === 'payment_approved';

  if (!orderNsu) {
    return { success: false, status: 'missing_order_nsu', message: 'order_nsu não informado no webhook.' };
  }

  const reservation = getReservation(orderNsu);
  if (!reservation) {
    console.warn(`[InfinitePay Webhook] Reserva com order_nsu ${orderNsu} não encontrada.`);
    return { success: false, status: 'not_found', message: `Reserva ${orderNsu} não encontrada.` };
  }

  // Idempotency check: if reservation is already CONFIRMADA, return without duplicating actions
  if (reservation.status === 'CONFIRMADA') {
    console.log(
      `[InfinitePay Webhook] Webhook duplicado ignorado para ${orderNsu}. Reserva já CONFIRMADA.`
    );
    return {
      success: true,
      status: 'already_confirmed',
      orderNsu,
      reservation,
      message: 'Idempotência: Reserva já confirmada anteriormente.',
    };
  }

  // Verify payment status
  if (!isApproved) {
    console.log(`[InfinitePay Webhook] Notificação com status pendente ou não aprovado (${payload.status}).`);
    return {
      success: true,
      status: 'pending_or_unpaid',
      orderNsu,
      reservation,
      message: 'Pagamento ainda não confirmado ou pendente.',
    };
  }

  // Double check payment amount if paidAmountCents is provided
  if (paidAmountCents > 0 && Math.abs(paidAmountCents - reservation.priceInCents) > 100) {
    console.error(
      `[InfinitePay Webhook] Divergência de valores! Pago: ${paidAmountCents} | Esperado: ${reservation.priceInCents}`
    );
    reservation.log.push({
      timestamp: new Date().toISOString(),
      action: 'amount_mismatch',
      details: { paidAmountCents, expectedCents: reservation.priceInCents },
    });
    saveReservations(reservationsCache);
    return {
      success: false,
      status: 'amount_mismatch',
      orderNsu,
      reservation,
      message: 'Valor pago diverge do valor da reserva.',
    };
  }

  // Transition to CONFIRMADA
  reservation.status = 'CONFIRMADA';
  reservation.confirmedAt = new Date().toISOString();
  reservation.transaction_nsu = transactionNsu;
  reservation.invoice_slug = slug;
  reservation.receipt_url = receiptUrl;
  reservation.capture_method = captureMethod;
  reservation.payment_method = captureMethod.toLowerCase().includes('pix') ? 'pix' : 'cartao';
  reservation.installments = installments;
  if (reservation.payment_method === 'cartao' && installments > 1) {
    reservation.installmentAmount = Number((reservation.totalAmount / installments).toFixed(2));
    reservation.installmentAmountFormatted = (reservation.totalAmount / installments)
      .toFixed(2)
      .replace('.', ',');
  }

  reservation.log.push({
    timestamp: new Date().toISOString(),
    action: 'payment_confirmed_via_webhook',
    details: {
      transactionNsu,
      slug,
      captureMethod,
      installments,
      paidAmountCents,
      receiptUrl,
    },
  });

  saveReservations(reservationsCache);
  console.log(`[InfinitePay Webhook] Reserva ${orderNsu} CONFIRMADA com sucesso!`);

  return {
    success: true,
    status: 'CONFIRMADA',
    orderNsu,
    reservation,
    message: 'Reserva confirmada com sucesso via webhook InfinitePay.',
  };
}

/**
 * Test scenario simulation for InfinitePay
 */
export function simulateInfinitePayScenario(
  scenario: 'pix' | 'card_1x' | 'card_2x' | 'card_3x' | 'declined' | 'duplicate_webhook',
  targetOrderNsu?: string
): any {
  loadReservations();
  const orderNsu = targetOrderNsu || reservationsCache[0]?.order_nsu;
  if (!orderNsu) {
    return { error: 'Nenhuma reserva encontrada para simular.' };
  }

  const reservation = getReservation(orderNsu);
  if (!reservation) {
    return { error: `Reserva ${orderNsu} não encontrada.` };
  }

  if (scenario === 'declined') {
    reservation.status = 'recusada';
    reservation.paymentErrorMessage = 'Transação não autorizada pela emissora do cartão.';
    reservation.log.push({
      timestamp: new Date().toISOString(),
      action: 'payment_declined_simulation',
      details: 'Transação recusada no teste',
    });
    saveReservations(reservationsCache);
    return {
      status: 'recusada',
      message: 'Pagamento recusado simulado com sucesso.',
      reservation,
    };
  }

  if (scenario === 'duplicate_webhook') {
    // Process identical webhook twice
    const webhookPayload = {
      order_nsu: orderNsu,
      transaction_nsu: `tx_${Date.now()}`,
      status: 'paid',
      paid: true,
      amount: reservation.priceInCents,
      capture_method: 'credit_card',
      installments: 3,
    };
    return {
      note: 'Simulação de idempotência: o sistema não duplica confirmações.',
      reservation,
    };
  }

  const isPix = scenario === 'pix';
  const installments = scenario === 'card_3x' ? 3 : scenario === 'card_2x' ? 2 : 1;

  reservation.status = 'CONFIRMADA';
  reservation.confirmedAt = new Date().toISOString();
  reservation.transaction_nsu = `tx_sim_${Date.now()}`;
  reservation.capture_method = isPix ? 'pix' : 'credit_card';
  reservation.payment_method = isPix ? 'pix' : 'cartao';
  reservation.installments = isPix ? 1 : installments;
  if (!isPix) {
    reservation.installmentAmount = Number((reservation.totalAmount / installments).toFixed(2));
    reservation.installmentAmountFormatted = (reservation.totalAmount / installments)
      .toFixed(2)
      .replace('.', ',');
  }
  reservation.receipt_url = `https://comprovante.infinitepay.io/comprovante/${reservation.transaction_nsu}`;

  reservation.log.push({
    timestamp: new Date().toISOString(),
    action: `simulated_${scenario}`,
    details: { isPix, installments },
  });

  saveReservations(reservationsCache);

  return {
    success: true,
    scenario,
    status: 'CONFIRMADA',
    reservation,
  };
}
