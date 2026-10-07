/**
 * Natal VIP Turismo - Marketing & Analytics Tracking Engine
 * GTM, GA4 (Google Analytics 4), Meta Pixel & CAPI Ready
 */

export interface TrackingLeadPayload {
  name: string;
  tour: string;
  phone?: string;
  guests?: string | number;
  date?: string;
  value?: number;
}

export function trackWhatsAppClick(tourName?: string, estimatedValue?: number) {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event: 'whatsapp_lead_click',
    event_category: 'Conversao',
    event_action: 'Click WhatsApp',
    event_label: tourName || 'Geral / Concierge',
    value: estimatedValue || 189,
    currency: 'BRL',
    timestamp: new Date().toISOString(),
  };

  // 1. Google Tag Manager / GA4 DataLayer
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push(eventPayload);

  // 2. Google Analytics 4 direct (gtag)
  // @ts-ignore
  if (typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', 'generate_lead', {
      event_category: 'Lead',
      event_label: tourName || 'WhatsApp Click',
      value: estimatedValue || 189,
      currency: 'BRL',
    });
  }

  // 3. Meta Pixel (Facebook Ads)
  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('track', 'Contact', {
      content_name: tourName || 'Atendimento WhatsApp VIP',
      content_category: 'Turismo e Passeios Natal',
      value: estimatedValue || 189,
      currency: 'BRL',
    });
  }
}

export function trackLeadGeneration(payload: TrackingLeadPayload) {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event: 'generate_lead',
    lead_name: payload.name,
    tour_interest: payload.tour,
    guests_count: payload.guests || '1',
    travel_date: payload.date || 'A definir',
    value: payload.value || 189,
    currency: 'BRL',
  };

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push(eventPayload);

  // @ts-ignore
  if (typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', 'generate_lead', {
      currency: 'BRL',
      value: payload.value || 189,
      lead_type: 'Chatbot VIP Autoatendimento',
    });
  }

  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('track', 'Lead', {
      content_name: payload.tour,
      value: payload.value || 189,
      currency: 'BRL',
    });
  }
}

export function trackTourView(tourTitle: string, price: number) {
  if (typeof window === 'undefined') return;

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [
        {
          item_name: tourTitle,
          price: price,
          currency: 'BRL',
        },
      ],
    },
  });

  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('track', 'ViewContent', {
      content_name: tourTitle,
      value: price,
      currency: 'BRL',
    });
  }
}

export function trackChatStart() {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event: 'chat_start',
    event_category: 'Engajamento',
    event_action: 'Início Chat VIP Autoatendimento',
    timestamp: new Date().toISOString(),
  };

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push(eventPayload);

  // @ts-ignore
  if (typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', 'chat_start', {
      event_category: 'Chat',
      event_label: 'Assistente Natal VIP',
    });
  }

  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('trackCustom', 'ChatStart', {
      content_name: 'Assistente Natal VIP',
    });
  }
}

export function trackCheckoutStart(tourTitle: string, totalAmount: number) {
  if (typeof window === 'undefined') return;

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      value: totalAmount,
      currency: 'BRL',
      items: [
        {
          item_name: tourTitle,
          price: totalAmount,
          currency: 'BRL',
        },
      ],
    },
  });

  // @ts-ignore
  if (typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', 'begin_checkout', {
      currency: 'BRL',
      value: totalAmount,
      items: [{ item_name: tourTitle }],
    });
  }

  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('track', 'InitiateCheckout', {
      content_name: tourTitle,
      value: totalAmount,
      currency: 'BRL',
    });
  }
}

export function trackBookingComplete(bookingId: string, tourTitle: string, totalAmount: number) {
  if (typeof window === 'undefined') return;

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: bookingId,
      value: totalAmount,
      currency: 'BRL',
      items: [
        {
          item_name: tourTitle,
          price: totalAmount,
          currency: 'BRL',
        },
      ],
    },
  });

  // @ts-ignore
  if (typeof window.fbq === 'function') {
    // @ts-ignore
    window.fbq('track', 'Purchase', {
      content_name: tourTitle,
      value: totalAmount,
      currency: 'BRL',
    });
  }
}
