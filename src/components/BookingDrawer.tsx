import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { AVAILABLE_ADDONS, VIP_TOURS, getTourPricing } from '../data/toursData';
import { BookingState, VoucherData, TourPackage } from '../types';
import { auth, saveBookingToFirestore } from '../lib/firebase';
import { isDateStringInPast } from '../lib/dateUtils';
import { triggerBookingEmailConfirmation, BookingEmailConfirmationPayload } from '../lib/emailService';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../lib/googleCalendarSync';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { NATIONALITIES, formatCurrencyValue, SupportedCurrency } from '../lib/i18n';
import { trackBookingComplete, trackCheckoutStart, trackCheckoutLinkGenerated, trackPurchaseApproved } from '../lib/tracking';
import { PHONE_WA, PHONE_DISPLAY } from '../config/contact';
import {
  X,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Send,
  ArrowRight,
  Flame,
  Check,
  Mail,
  AlertTriangle,
  Eye,
  ExternalLink,
  Globe,
  RefreshCw,
  Lock,
  Heart,
  Calculator,
} from 'lucide-react';

export interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Componente que exibe valores monetários com animação suave de contagem (Framer Motion odometer effect)
 * sempre que a quantidade de adultos, crianças ou opcionais é alterada.
 */
export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  value,
  prefix = 'R$ ',
  suffix = '',
  className = '',
}) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => {
    const safeVal = Math.max(0, isNaN(latest) ? 0 : latest);
    const formatted = safeVal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1], // suave e fluido
    });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTourId?: string;
  preselectedDate?: string;
  preselectedTimeWindow?: string;
  preselectedTideHeight?: number;
  preselectedAdults?: number;
  preselectedChildren?: number;
  preselectedCustomerName?: string;
  preselectedCustomerPhone?: string;
  preselectedCustomerEmail?: string;
  preselectedAddons?: string[];
  initialStep?: 'details' | 'gateway' | 'voucher';
  tours?: TourPackage[];
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  preselectedTourId = 'maracajau-vip',
  preselectedDate = '03/01/2026',
  preselectedTimeWindow = '08:30 às 10:00',
  preselectedTideHeight = 0.2,
  preselectedAdults,
  preselectedChildren,
  preselectedCustomerName,
  preselectedCustomerPhone,
  preselectedCustomerEmail,
  preselectedAddons,
  initialStep,
  tours,
}) => {
  const [selectedTourId, setSelectedTourId] = useState(preselectedTourId);
  const [bookingDate, setBookingDate] = useState(preselectedDate);
  const [bookingTimeWindow, setBookingTimeWindow] = useState(preselectedTimeWindow);
  const [adults, setAdults] = useState(preselectedAdults || 2);
  const [children, setChildren] = useState(preselectedChildren || 0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(preselectedAddons || ['fotos-gopro']);

  const [customerName, setCustomerName] = useState(preselectedCustomerName || '');
  const [customerPhone, setCustomerPhone] = useState(preselectedCustomerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(preselectedCustomerEmail || '');
  const [hotelPickup, setHotelPickup] = useState('');
  const [selectedNatCode, setSelectedNatCode] = useState<string>('BR');
  const [customerDocument, setCustomerDocument] = useState<string>('');
  const [displayCurrency, setDisplayCurrency] = useState<SupportedCurrency>('BRL');

  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  const [pixTimer, setPixTimer] = useState(900); // 15 mins
  const [copiedPix, setCopiedPix] = useState(false);

  const [step, setStep] = useState<'details' | 'gateway' | 'voucher'>('details');
  const [generatedVoucher, setGeneratedVoucher] = useState<VoucherData | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailBookingPayload, setEmailBookingPayload] = useState<BookingEmailConfirmationPayload | null>(null);

  // InfinitePay Checkout states
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [formValidationErrors, setFormValidationErrors] = useState<{ [key: string]: string }>({});

  // Feedback visual imediato e animação ao alterar quantidade de pessoas/passeio
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [priceFeedbackMessage, setPriceFeedbackMessage] = useState<string | null>(null);

  const handleDocumentChange = (val: string) => {
    if (selectedNatCode === 'BR') {
      const digits = val.replace(/\D/g, '').slice(0, 11);
      const masked = digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setCustomerDocument(masked);
    } else {
      setCustomerDocument(val);
    }
  };

  const handlePhoneChange = (val: string) => {
    if (selectedNatCode === 'BR') {
      const digits = val.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 10) {
        setCustomerPhone(digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim());
      } else {
        setCustomerPhone(digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim());
      }
    } else {
      setCustomerPhone(val);
    }
  };

  const tourList = (tours && tours.length > 0 ? tours : VIP_TOURS).filter((t) => t.active !== false);
  const currentTour = tourList.find((t) => t.id === selectedTourId) || tourList[0] || VIP_TOURS[0];

  // Price calculations with getTourPricing
  const isCouplePackage = currentTour.id === 'pacote-casal-vip' || currentTour.pricingType === 'couple_fixed';
  const isVehicleFixed =
    currentTour.id === 'transfer-vip-aeroporto' ||
    currentTour.id === 'buggy-vip-privativo' ||
    currentTour.id === 'genipabu-buggy-vip' ||
    currentTour.id === 'quadriciclo-aventura' ||
    currentTour.pricingType === 'vehicle_fixed';

  const isTransfer = currentTour.id === 'transfer-vip-aeroporto';
  const isBuggy = currentTour.id === 'buggy-vip-privativo' || currentTour.id === 'genipabu-buggy-vip';
  const isQuadri = currentTour.id === 'quadriciclo-aventura';

  const baseTourPrice = currentTour.priceDiscounted;
  const pricing = getTourPricing(currentTour, adults, children);
  const adultsTotal = pricing.adultsTotal;
  const childrenTotal = pricing.childrenTotal;
  const maxCapacity = pricing.maxCapacity;

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const grossTotal = adultsTotal + childrenTotal + addonsTotal;
  // Regra: Pix e cartão possuem o mesmo preço oficial sem desconto exclusivo.
  const finalTotal = grossTotal;

  // Capture abandoned reservation if customer filled info but closed drawer without completing
  const handleCloseDrawer = () => {
    if ((customerName || customerPhone) && step !== 'voucher') {
      try {
        const stored = JSON.parse(localStorage.getItem('natal_vip_leads') || '[]');
        const existing = stored.find(
          (l: any) => l.phone === customerPhone || (customerEmail && l.email === customerEmail)
        );
        if (!existing) {
          const abandonedLead = {
            id: `lead-abandoned-${Date.now()}`,
            name: customerName || 'Visitante Interessado',
            phone: customerPhone || PHONE_DISPLAY,
            email: customerEmail || 'contato@cliente.com',
            travelMonth: bookingDate,
            tourInterest: currentTour.title,
            origin: 'abandoned_cart',
            createdAt: new Date().toLocaleString('pt-BR'),
            status: 'novo',
            notes: `Iniciou reserva para ${adults} adulto(s) em ${bookingDate}. Valor: R$ ${finalTotal.toFixed(2)}.`,
            couponCode: 'VIPNATAL30',
          };
          stored.unshift(abandonedLead);
          localStorage.setItem('natal_vip_leads', JSON.stringify(stored));
        }
      } catch {
        // ignore
      }
    }
    onClose();
  };

  useEffect(() => {
    if (preselectedTourId) setSelectedTourId(preselectedTourId);
    if (preselectedDate) setBookingDate(preselectedDate);
    if (preselectedTimeWindow) setBookingTimeWindow(preselectedTimeWindow);
    if (preselectedAdults) setAdults(preselectedAdults);
    if (typeof preselectedChildren === 'number') setChildren(preselectedChildren);
    if (preselectedCustomerName) setCustomerName(preselectedCustomerName);
    if (preselectedCustomerPhone) setCustomerPhone(preselectedCustomerPhone);
    if (preselectedCustomerEmail) setCustomerEmail(preselectedCustomerEmail);
    if (preselectedAddons && preselectedAddons.length > 0) setSelectedAddons(preselectedAddons);
    if (initialStep) setStep(initialStep);
  }, [
    preselectedTourId,
    preselectedDate,
    preselectedTimeWindow,
    preselectedAdults,
    preselectedChildren,
    preselectedCustomerName,
    preselectedCustomerPhone,
    preselectedCustomerEmail,
    preselectedAddons,
    initialStep,
    isOpen,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'gateway' && paymentTab === 'pix' && pixTimer > 0) {
      interval = setInterval(() => setPixTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentTab, pixTimer]);

  useEffect(() => {
    if (priceAnimating) {
      const timer = setTimeout(() => {
        setPriceAnimating(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [priceAnimating]);

  if (!isOpen) return null;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
    setPriceFeedbackMessage('Opcional atualizado');
    setPriceAnimating(true);
  };

  const handleInfinitePayCheckout = async () => {
    setGenerationError(null);
    const errors: { [key: string]: string } = {};

    if (!adults || adults < 1) {
      errors.adults = 'É obrigatório selecionar pelo menos 1 adulto (12 anos ou mais).';
    }

    if (adults + children > maxCapacity) {
      errors.passengers = `A capacidade máxima para este passeio é de ${maxCapacity} passageiros. Para grupos maiores, entre em contato via WhatsApp.`;
    }

    if (!customerName || customerName.trim().length < 3) {
      errors.name = 'Informe seu nome completo (mínimo 3 letras).';
    }

    const cleanDigits = customerPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      errors.phone = 'Informe um WhatsApp válido com DDD.';
    }

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = 'Informe um e-mail válido para envio do voucher.';
    }

    if (selectedNatCode === 'BR' && customerDocument.replace(/\D/g, '').length !== 11) {
      errors.document = 'Informe um CPF válido com 11 dígitos.';
    }

    if (isDateStringInPast(bookingDate)) {
      errors.date = 'Selecione uma data a partir de hoje.';
    }

    if (Object.keys(errors).length > 0) {
      setFormValidationErrors(errors);
      return;
    }

    setFormValidationErrors({});
    setIsGeneratingLink(true);

    try {
      // 1. Pixel & GA4 Event: initiate checkout com valor total e quantidade de pessoas
      trackCheckoutStart(currentTour.title, finalTotal, adults + children);

      const payload = {
        tourId: currentTour.id,
        tourName: currentTour.title,
        date: bookingDate,
        timeWindow: bookingTimeWindow,
        tideHeight: preselectedTideHeight,
        adults,
        children,
        addons: selectedAddons,
        totalAmount: finalTotal,
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          cpf: customerDocument.trim(),
        },
        hotelPickup: hotelPickup || 'Hotel em Ponta Negra / Via Costeira',
      };

      const res = await fetch('/api/infinitepay/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Falha na comunicação com o gateway InfinitePay.');
      }

      const data = await res.json();
      if (data?.success && data?.checkoutUrl) {
        trackCheckoutLinkGenerated(data.order_nsu, currentTour.title, finalTotal, adults + children);
        // Direct redirect without extra steps (Requirement 4)
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data?.error || 'Não foi possível gerar o link de pagamento.');
      }
    } catch (err: any) {
      console.warn('[InfinitePay Checkout]: Falha inicial, tentando reconexão automática...', err);
      // Automatic retry once (Requirement 15: "nova tentativa automática uma vez")
      try {
        const retryRes = await fetch('/api/infinitepay/create-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: currentTour.id,
            tourName: currentTour.title,
            date: bookingDate,
            timeWindow: bookingTimeWindow,
            tideHeight: preselectedTideHeight,
            adults,
            children,
            addons: selectedAddons,
            totalAmount: finalTotal,
            customer: {
              name: customerName.trim(),
              email: customerEmail.trim(),
              phone: customerPhone.trim(),
              cpf: customerDocument.trim(),
            },
            hotelPickup: hotelPickup || 'Hotel em Ponta Negra / Via Costeira',
          }),
        });
        const retryData = await retryRes.json();
        if (retryData?.checkoutUrl) {
          trackCheckoutLinkGenerated(retryData.order_nsu || 'NVT-RETRY', currentTour.title, finalTotal, adults + children);
          window.location.href = retryData.checkoutUrl;
          return;
        }
      } catch (retryErr) {
        console.error('[InfinitePay Retry Error]:', retryErr);
      }

      setGenerationError(
        'Houve uma oscilação na conexão com a InfinitePay. Clique novamente para gerar o link ou tente pelo link direto.'
      );
      setIsGeneratingLink(false);
    }
  };

  const handleConfirmBooking = () => {
    const bookingCode = `NVT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingState = {
      tourId: currentTour.id,
      tourName: currentTour.title,
      date: bookingDate,
      timeWindow: bookingTimeWindow,
      tideHeight: preselectedTideHeight,
      adultsCount: adults,
      childrenCount: children,
      addons: selectedAddons,
      customerName: customerName || 'Passageiro VIP',
      customerPhone: customerPhone || '+55 (84) 98872-2044',
      customerEmail: customerEmail || 'contato@cliente.com',
      hotelPickup: hotelPickup || 'Hotel em Ponta Negra',
      paymentMethod: paymentTab,
      totalPrice: finalTotal,
      emailSentToCustomer: true,
      emailSentToAgency: true,
    };

    const voucher: VoucherData = {
      voucherCode: bookingCode,
      booking: newBooking,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'confirmado',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NATALVIP-${bookingCode}`,
      emailDispatchedAt: new Date().toLocaleString('pt-BR'),
      confirmationEmailAddress: 'reservas@natalvipturismo.com',
    };

    // Save to local storage for Autoatendimento integration
    try {
      const stored = JSON.parse(localStorage.getItem('natal_vip_reservations') || '[]');
      stored.unshift(voucher);
      localStorage.setItem('natal_vip_reservations', JSON.stringify(stored));

      // Mark lead as converted if exists in leadsList
      const storedLeads = JSON.parse(localStorage.getItem('natal_vip_leads') || '[]');
      const updatedLeads = storedLeads.map((lead: any) =>
        lead.phone === customerPhone || lead.email === customerEmail
          ? { ...lead, status: 'convertido', lastFollowUpDate: new Date().toLocaleString('pt-BR') }
          : lead
      );
      localStorage.setItem('natal_vip_leads', JSON.stringify(updatedLeads));
    } catch {
      // ignore
    }

    // Persist to Cloud Firestore
    try {
      trackBookingComplete(bookingCode, currentTour.title, finalTotal);
      trackPurchaseApproved(bookingCode, currentTour.title, finalTotal, adults + children);
      const activeUid = auth.currentUser?.uid || `guest_${Date.now()}`;
      saveBookingToFirestore({
        userId: activeUid,
        tourId: currentTour.id,
        tourName: currentTour.title,
        date: bookingDate,
        timeWindow: bookingTimeWindow,
        adultsCount: adults,
        childrenCount: children,
        participants: adults + children,
        totalAmount: finalTotal,
        paymentMethod: paymentTab,
        status: 'confirmed',
        voucherCode: bookingCode,
        passengerName: customerName,
        passengerEmail: customerEmail,
        passengerPhone: customerPhone,
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Firestore reservation save warning:', err);
      });
    } catch (err) {
      console.warn('Firestore sync error:', err);
    }

    // Setup email and calendar payload
    const emailPayload: BookingEmailConfirmationPayload = {
      voucherCode: bookingCode,
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail || 'cliente@natalvipturismo.com',
      customerPhone: newBooking.customerPhone,
      tourName: currentTour.title,
      date: newBooking.date,
      timeWindow: newBooking.timeWindow,
      tideHeight: newBooking.tideHeight,
      adultsCount: newBooking.adultsCount,
      childrenCount: newBooking.childrenCount,
      hotelPickup: newBooking.hotelPickup,
      paymentMethod: paymentTab,
      totalPrice: finalTotal,
    };
    setEmailBookingPayload(emailPayload);

    // Trigger automatic email confirmation and Google Calendar sync
    triggerBookingEmailConfirmation(emailPayload).catch((err) => {
      console.warn('Booking confirmation email trigger error:', err);
    });

    setGeneratedVoucher(voucher);
    setStep('voucher');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(
      '00020126580014br.gov.bcb.pix0136natalvipturismo@bancocentral.gov.br520400005303986540' +
        finalTotal.toFixed(2) +
        '5802BR5920NATAL VIP TURISMO6005NATAL62070503***6304E8F2'
    );
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const minutes = Math.floor(pixTimer / 60);
  const seconds = pixTimer % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md transition-opacity">
      <div
        id="booking-drawer-modal"
        className="relative w-full max-w-2xl h-full bg-[#081220] border-l border-amber-500/30 flex flex-col shadow-2xl overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#0A1628] sticky top-0 z-20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block">
              Sistema Moderno de Reserva VIP
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{currentTour.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Garantia Maré Perfeita
              </span>
            </h3>
          </div>

          <button
            onClick={handleCloseDrawer}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/90 border border-slate-600 hover:border-rose-500 text-white hover:text-rose-200 transition-all cursor-pointer shadow-md flex items-center justify-center active:scale-95"
            title="Fechar reserva (X)"
            aria-label="Fechar gaveta de reserva"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Multi-step progress header */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span
            className={
              step === 'details'
                ? 'text-amber-400 flex items-center gap-1 font-bold'
                : 'text-emerald-400 flex items-center gap-1'
            }
          >
            1. Dados do Passeio
          </span>
          <span>→</span>
          <span
            className={
              step === 'gateway'
                ? 'text-amber-400 flex items-center gap-1 font-bold'
                : step === 'voucher'
                ? 'text-emerald-400'
                : 'text-slate-600'
            }
          >
            2. Gateway Intuitivo
          </span>
          <span>→</span>
          <span
            className={
              step === 'voucher'
                ? 'text-amber-400 flex items-center gap-1 font-bold'
                : 'text-slate-600'
            }
          >
            3. Voucher & Passaporte
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          {/* STEP 1: TOUR DETAILS & PASSENGERS */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Tour Switcher Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 mb-2">
                  Escolha o Passeio
                </label>
                <select
                  value={selectedTourId}
                  onChange={(e) => {
                    setSelectedTourId(e.target.value);
                    setPriceFeedbackMessage('Passeio alterado');
                    setPriceAnimating(true);
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                >
                  {tourList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id === 'pacote-casal-vip'
                        ? `${t.title} — R$ ${t.priceDiscounted.toFixed(2)} (VALOR TOTAL PARA 2 PESSOAS / CASAL)`
                        : t.id === 'genipabu-buggy-vip' || t.id === 'buggy-vip-privativo'
                        ? `${t.title} — R$ ${t.priceDiscounted.toFixed(2)} (Buggy privativo até 4 pessoas)`
                        : `${t.title} — R$ ${t.priceDiscounted.toFixed(2)} por pessoa`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Embarkation Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Data Desejada
                  </label>
                  <input
                    type="text"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    placeholder="Ex: 27/09/2026"
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none ${
                      isDateStringInPast(bookingDate)
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-slate-600 focus:border-amber-400'
                    }`}
                  />
                  {isDateStringInPast(bookingDate) ? (
                    <span className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Esta data já passou no calendário. Escolha uma data a partir de hoje.
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 mt-1 block font-medium">
                      Sincronizada com o calendário oficial de marés
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Janela de Embarque
                  </label>
                  <input
                    type="text"
                    value={bookingTimeWindow}
                    onChange={(e) => setBookingTimeWindow(e.target.value)}
                    placeholder="Ex: 08:30 às 10:00"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-xs text-emerald-300 mt-1 block font-semibold">
                    Horário ajustado para maré 0.2m
                  </span>
                </div>
              </div>

              {/* Passengers Counters */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Selecione a Quantidade de Pessoas</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Crianças até 2 anos: Free
                  </span>
                </div>

                {/* Exceção 1: Pacote Casal VIP */}
                {isCouplePackage && (
                  <div className="p-3.5 rounded-xl bg-amber-400/15 border border-amber-400/50 text-amber-200 text-xs sm:text-sm space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                      <Heart className="w-4 h-4 fill-amber-300 shrink-0" />
                      <span>Pacote Casal VIP · R$ 1.320,00 por casal (2 pessoas)</span>
                    </div>
                    <p className="text-slate-100 font-normal leading-relaxed text-xs">
                      Valor fechado de <strong>R$ 1.320,00 para 2 pessoas (casal)</strong> em até 3x de R$ 440,00 sem juros. O cálculo é por casal: cada 2 adultos equivalem a 1 casal (R$ 1.320).
                    </p>
                  </div>
                )}

                {/* Exceção 2: Transfer VIP Aeroporto */}
                {isTransfer && (
                  <div className="p-3.5 rounded-xl bg-sky-500/15 border border-sky-400/50 text-sky-200 text-xs sm:text-sm space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-300 font-extrabold text-sm">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Transfer VIP Aeroporto · R$ 160,00 por veículo (até 4 passageiros)</span>
                    </div>
                    <p className="text-slate-100 font-normal leading-relaxed text-xs">
                      Valor fechado de <strong>R$ 160,00 por veículo executivo</strong> (ida e volta). O campo de passageiros valida a capacidade máxima do carro (até 4 pessoas) sem multiplicar o valor.
                    </p>
                  </div>
                )}

                {/* Exceção 3: Buggy Privativo ou Quadriciclo */}
                {(isBuggy || isQuadri) && !isTransfer && !isCouplePackage && (
                  <div className="p-3.5 rounded-xl bg-amber-400/15 border border-amber-400/50 text-amber-200 text-xs sm:text-sm space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Veículo Privativo · Valor fechado pelo veículo</span>
                    </div>
                    <p className="text-slate-100 font-normal leading-relaxed text-xs">
                      Valor fechado de <strong>R$ {baseTourPrice.toFixed(2)}</strong> pelo veículo exclusivo (capacidade de até {maxCapacity} passageiros).
                    </p>
                  </div>
                )}

                {/* Campo 1: Adultos (12 anos ou mais) */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-white block">
                        Adultos (12 anos ou mais)
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">
                        Mínimo 1
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-0.5 font-medium">
                      {isCouplePackage
                        ? `R$ 1.320,00 por casal (2 pessoas) · ${pricing.couplesCount} casal(is) = R$ ${adultsTotal.toFixed(2)}`
                        : isVehicleFixed
                        ? `Incluso no veículo (capacidade até ${maxCapacity} pessoas)`
                        : `R$ ${pricing.adultPrice.toFixed(2)} por adulto`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => {
                        setAdults((prev) => Math.max(1, prev - 1));
                        setPriceFeedbackMessage('1 adulto removido');
                        setPriceAnimating(true);
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 text-white font-black hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-xl flex items-center justify-center active:scale-90 shadow-md border border-slate-600"
                      aria-label="Diminuir adultos"
                    >
                      −
                    </button>
                    <span
                      className={`font-black text-lg sm:text-xl w-7 text-center transition-all duration-300 ${
                        priceAnimating ? 'text-amber-200 scale-125' : 'text-amber-300'
                      }`}
                    >
                      {adults}
                    </span>
                    <button
                      type="button"
                      disabled={adults + children >= maxCapacity}
                      onClick={() => {
                        if (adults + children < maxCapacity) {
                          setAdults((prev) => prev + 1);
                          setPriceFeedbackMessage('+1 adulto adicionado');
                          setPriceAnimating(true);
                          setFormValidationErrors((prev) => {
                            const cp = { ...prev };
                            delete cp.adults;
                            delete cp.passengers;
                            return cp;
                          });
                        }
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-slate-950 font-black hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-xl flex items-center justify-center active:scale-90 shadow-md"
                      aria-label="Aumentar adultos"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Campo 2: Crianças (3 a 11 anos) */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-white block">
                        Crianças (3 a 11 anos)
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-0.5 font-medium">
                      {isCouplePackage
                        ? 'Crianças no pacote do casal'
                        : isVehicleFixed
                        ? `Incluso no veículo (máx. ${maxCapacity} pessoas no total)`
                        : `R$ ${pricing.childPrice.toFixed(2)} por criança`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => {
                        setChildren((prev) => Math.max(0, prev - 1));
                        setPriceFeedbackMessage('1 criança removida');
                        setPriceAnimating(true);
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 text-white font-black hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-xl flex items-center justify-center active:scale-90 shadow-md border border-slate-600"
                      aria-label="Diminuir crianças"
                    >
                      −
                    </button>
                    <span
                      className={`font-black text-lg sm:text-xl w-7 text-center transition-all duration-300 ${
                        priceAnimating ? 'text-amber-200 scale-125' : 'text-amber-300'
                      }`}
                    >
                      {children}
                    </span>
                    <button
                      type="button"
                      disabled={adults + children >= maxCapacity}
                      onClick={() => {
                        if (adults + children < maxCapacity) {
                          setChildren((prev) => prev + 1);
                          setPriceFeedbackMessage('+1 criança adicionada');
                          setPriceAnimating(true);
                          setFormValidationErrors((prev) => {
                            const cp = { ...prev };
                            delete cp.passengers;
                            return cp;
                          });
                        }
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-slate-950 font-black hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-xl flex items-center justify-center active:scale-90 shadow-md"
                      aria-label="Aumentar crianças"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Linha de apoio e capacidade */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1 border-t border-slate-800">
                  <div className="text-slate-300 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span>
                      Total: <strong>{adults + children} passageiro(s)</strong> (Capacidade máx: {maxCapacity})
                    </span>
                  </div>
                  <div className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                    Crianças até 2 anos: Free
                  </div>
                </div>

                {/* Painel Imediato de Transparência e Feedback Visual do Cálculo */}
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 ${
                    priceAnimating
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.35)] scale-[1.01]'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Cálculo Automático & Transparência
                      </span>
                    </div>
                    {priceAnimating ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 animate-pulse shadow">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>{priceFeedbackMessage || 'Valor recalculado!'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Atualizado em tempo real</span>
                      </span>
                    )}
                  </div>

                  {/* Detalhe da fórmula de cálculo */}
                  {isCouplePackage ? (
                    <div className="space-y-1.5 text-xs text-slate-200">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-300">
                          {pricing.couplesCount} Casal(is) [{adults} pessoa{adults > 1 ? 's' : ''}] × R$ 1.320,00:
                        </span>
                        <strong className="text-white font-bold">
                          <AnimatedPrice value={adultsTotal} />
                        </strong>
                      </div>
                      {children > 0 && (
                        <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-300">
                            {children} Criança{children > 1 ? 's' : ''} (3 a 11 anos):
                          </span>
                          <strong className="text-white font-bold">
                            <AnimatedPrice value={childrenTotal} />
                          </strong>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1 font-bold text-amber-300">
                        <span>Total dos Passageiros:</span>
                        <AnimatedPrice
                          value={adultsTotal + childrenTotal}
                          className={`text-sm sm:text-base transition-all duration-300 ${
                            priceAnimating ? 'scale-110 text-amber-200' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ) : isVehicleFixed ? (
                    <div className="space-y-1.5 text-xs text-slate-200">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-300">
                          Veículo Executivo ({adults} adulto{adults > 1 ? 's' : ''}
                          {children > 0 ? ` + ${children} criança${children > 1 ? 's' : ''}` : ''}):
                        </span>
                        <strong className="text-white font-bold">
                          <AnimatedPrice value={baseTourPrice} />
                        </strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 font-bold text-amber-300">
                        <span>Preço fechado pelo veículo:</span>
                        <AnimatedPrice
                          value={baseTourPrice}
                          className={`text-sm sm:text-base transition-all duration-300 ${
                            priceAnimating ? 'scale-110 text-amber-200' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                            priceAnimating
                              ? 'bg-amber-400/10 border-amber-400/50'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
                          <span className="text-slate-300">
                            {adults} {adults === 1 ? 'adulto' : 'adultos'} × R$ {pricing.adultPrice.toFixed(2)}
                          </span>
                          <strong className="text-amber-300 font-bold ml-2">
                            <AnimatedPrice value={adultsTotal} />
                          </strong>
                        </div>
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                            priceAnimating
                              ? 'bg-amber-400/10 border-amber-400/50'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
                          <span className="text-slate-300">
                            {children} {children === 1 ? 'criança' : 'crianças'} × R$ {pricing.childPrice.toFixed(2)}
                          </span>
                          <strong className="text-amber-300 font-bold ml-2">
                            <AnimatedPrice value={childrenTotal} />
                          </strong>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-slate-300 gap-1 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400">
                          ({adults} × R$ {pricing.adultPrice.toFixed(2)}) + ({children} × R$ {pricing.childPrice.toFixed(2)})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">Subtotal dos Passageiros:</span>
                          <AnimatedPrice
                            value={adultsTotal + childrenTotal}
                            className={`font-black text-sm sm:text-base text-amber-300 transition-all duration-300 ${
                              priceAnimating ? 'scale-110 text-amber-200' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mensagens de validação em português */}
                {formValidationErrors.adults && (
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formValidationErrors.adults}</span>
                  </div>
                )}

                {formValidationErrors.passengers && (
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formValidationErrors.passengers}</span>
                  </div>
                )}

                {adults + children >= maxCapacity && (
                  <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs">
                    Capacidade máxima deste passeio atingida ({maxCapacity} passageiros). Para reservas de grupos maiores, entre em contato via WhatsApp com nosso consultor VIP.
                  </div>
                )}
              </div>

              {/* Addons Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Opcionais VIP para sua Experiência
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => handleToggleAddon(addon.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-amber-400 border-amber-400 text-slate-950 font-bold'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">
                              {addon.name}
                            </span>
                            <span className="text-xs font-extrabold text-amber-300 shrink-0">
                              +R$ {addon.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                            {addon.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Responsible Customer Data & Nationality */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Dados do Responsável & Nacionalidade</span>
                  </label>
                  <span className="text-[11px] text-cyan-200 font-bold bg-cyan-950/80 border border-cyan-400/40 px-2.5 py-0.5 rounded-full">
                    Todas as Nacionalidades
                  </span>
                </div>

                {/* Country/Nationality Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">
                      Nacionalidade / País de Origem:
                    </label>
                    <select
                      value={selectedNatCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedNatCode(code);
                        const nat = NATIONALITIES.find((n) => n.code === code) || NATIONALITIES[0];
                        setDisplayCurrency(nat.currency);
                        if (!customerPhone || customerPhone.startsWith('+')) {
                          setCustomerPhone(`${nat.dialCode} `);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {NATIONALITIES.map((nat) => (
                        <option key={nat.code} value={nat.code}>
                          {nat.flag} {nat.namePt} ({nat.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">
                      {NATIONALITIES.find((n) => n.code === selectedNatCode)?.documentType || 'Documento / CPF'}: *
                    </label>
                    <input
                      type="text"
                      value={customerDocument}
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      placeholder={
                        selectedNatCode === 'BR'
                          ? '000.000.000-00 (CPF)'
                          : NATIONALITIES.find((n) => n.code === selectedNatCode)?.documentPlaceholder ||
                            'Número do Documento / Passport'
                      }
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none ${
                        formValidationErrors.document ? 'border-rose-500' : 'border-slate-600 focus:border-amber-400'
                      }`}
                    />
                    {formValidationErrors.document && (
                      <span className="text-[11px] text-rose-400 font-bold mt-1 block">
                        {formValidationErrors.document}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      required
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none ${
                        formValidationErrors.name ? 'border-rose-500' : 'border-slate-600 focus:border-amber-400'
                      }`}
                    />
                    {formValidationErrors.name && (
                      <span className="text-[11px] text-rose-400 font-bold mt-1 block">
                        {formValidationErrors.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(84) 99999-9999"
                      required
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none ${
                        formValidationErrors.phone ? 'border-rose-500' : 'border-slate-600 focus:border-amber-400'
                      }`}
                    />
                    {formValidationErrors.phone && (
                      <span className="text-[11px] text-rose-400 font-bold mt-1 block">
                        {formValidationErrors.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">E-mail para envio do voucher *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none ${
                        formValidationErrors.email ? 'border-rose-500' : 'border-slate-600 focus:border-amber-400'
                      }`}
                    />
                    {formValidationErrors.email && (
                      <span className="text-[11px] text-rose-400 font-bold mt-1 block">
                        {formValidationErrors.email}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-200 font-bold block mb-1">Hotel / Pousada para embarque</label>
                    <input
                      type="text"
                      value={hotelPickup}
                      onChange={(e) => setHotelPickup(e.target.value)}
                      placeholder="Ex: Hotel em Ponta Negra / Via Costeira"
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & InfinitePay Highlights */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#091C35] to-[#061220] border-2 border-amber-400/40 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    Resumo do Pedido Online
                  </span>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Vaga Pré-Aprovada
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-white text-sm">
                    {currentTour.title}
                  </div>

                  {/* Detalhamento de passageiros e subtotais */}
                  {isCouplePackage ? (
                    <div
                      className={`space-y-1.5 p-3 rounded-xl border transition-all duration-300 ${
                        priceAnimating
                          ? 'bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between text-slate-200">
                        <span>{pricing.couplesCount} Casal(is) ({adults} pessoas)</span>
                        <strong className="text-white">
                          <AnimatedPrice value={adultsTotal} />
                        </strong>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between text-slate-200">
                          <span>{children} Criança(s) (3 a 11 anos)</span>
                          <strong className="text-white">
                            <AnimatedPrice value={childrenTotal} />
                          </strong>
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
                        Crianças até 2 anos: Free
                      </div>
                    </div>
                  ) : isVehicleFixed ? (
                    <div
                      className={`space-y-1.5 p-3 rounded-xl border transition-all duration-300 ${
                        priceAnimating
                          ? 'bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between text-slate-200">
                        <span>
                          Veículo Executivo ({adults} adulto{adults > 1 ? 's' : ''}
                          {children > 0 ? ` + ${children} criança${children > 1 ? 's' : ''}` : ''})
                        </span>
                        <strong className="text-white">
                          <AnimatedPrice value={baseTourPrice} />
                        </strong>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
                        Preço fixo por veículo (até {maxCapacity} passageiros) · Crianças até 2 anos: Free
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`space-y-1.5 p-3 rounded-xl border transition-all duration-300 ${
                        priceAnimating
                          ? 'bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between text-slate-200">
                        <span>
                          {adults} {adults === 1 ? 'adulto' : 'adultos'} (12+ anos) × R$ {pricing.adultPrice.toFixed(2)}
                        </span>
                        <strong className="text-white">
                          <AnimatedPrice value={adultsTotal} />
                        </strong>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between text-slate-200">
                          <span>
                            {children} {children === 1 ? 'criança' : 'crianças'} (3 a 11 anos) × R$ {pricing.childPrice.toFixed(2)}
                          </span>
                          <strong className="text-white">
                            <AnimatedPrice value={childrenTotal} />
                          </strong>
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/60 flex items-center justify-between">
                        <span>
                          {adults} {adults === 1 ? 'adulto' : 'adultos'}
                          {children > 0 ? ` + ${children} ${children === 1 ? 'criança (3 a 11 anos)' : 'crianças (3 a 11 anos)'}` : ''}
                        </span>
                        <span className="text-emerald-300">Crianças até 2 anos: Free</span>
                      </div>
                    </div>
                  )}

                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Opcionais VIP ({selectedAddons.length} selecionado{selectedAddons.length > 1 ? 's' : ''})</span>
                      <strong className="text-white">
                        <AnimatedPrice value={addonsTotal} />
                      </strong>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                    <span>Formas Aceitas:</span>
                    <span className="text-emerald-300 font-bold">Pix ou cartão em até 3x sem juros</span>
                  </div>
                </div>

                <div
                  className={`pt-2 border-t border-slate-800 flex items-baseline justify-between transition-all duration-300 rounded-xl px-2.5 py-2 ${
                    priceAnimating
                      ? 'bg-amber-400/15 ring-2 ring-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">Total da Reserva:</span>
                    {priceAnimating && (
                      <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full animate-bounce shadow">
                        ⚡ Recalculado
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <AnimatedPrice
                      value={finalTotal}
                      className={`text-2xl font-black block transition-all duration-300 ${
                        priceAnimating
                          ? 'text-amber-200 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                          : 'text-amber-300'
                      }`}
                    />
                    <span className="text-[11px] text-emerald-400 font-semibold block">
                      ou até 3x de <AnimatedPrice value={finalTotal / 3} prefix="R$ " suffix=" sem juros" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Alert if link generation failed */}
              {generationError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{generationError}</p>
                    <a
                      href="https://checkout.infinitepay.io/natalvipturismo/MzTHsBUpEX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 underline font-bold mt-1"
                    >
                      <span>Abrir checkout oficial InfinitePay direto</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action: Primary InfinitePay Checkout Button */}
              {isDateStringInPast(bookingDate) && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>A data selecionada ({bookingDate}) já passou no calendário. Escolha uma data a partir de hoje.</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isDateStringInPast(bookingDate) || isGeneratingLink}
                  onClick={handleInfinitePayCheckout}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xl ${
                    isDateStringInPast(bookingDate)
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                      : isGeneratingLink
                      ? 'bg-amber-500 text-slate-950 cursor-wait opacity-80'
                      : 'btn-pulse-hover text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95'
                  }`}
                >
                  {isGeneratingLink ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Gerando Link Seguro InfinitePay...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Reservar e Pagar Agora · InfinitePay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pagamento seguro InfinitePay
                  </span>
                  <span>•</span>
                  <span>Cadastur 39.456.551/0001-08</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">Pix ou Cartão</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INTUITIVE GATEWAY */}
          {step === 'gateway' && (
            <div className="space-y-6">
              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentTab('pix')}
                  className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    paymentTab === 'pix'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" /> PIX Instantâneo
                  </span>
                  <span className="text-[10px] bg-emerald-700/30 text-emerald-400 font-black px-1.5 py-0.2 rounded">
                    Confirmação Imediata
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    paymentTab === 'card'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Cartão de Crédito
                  </span>
                  <span className="text-[10px] opacity-80">Até 12x Sem Juros</span>
                </button>
              </div>

              {/* Order summary banner */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 text-sm space-y-2.5">
                <div className="flex justify-between text-slate-100 font-semibold">
                  <span>
                    {isCouplePackage
                      ? `${pricing.couplesCount} Casal(is) (${adults} pessoas)`
                      : isVehicleFixed
                      ? `Veículo Executivo (${adults} adulto${adults > 1 ? 's' : ''}${children > 0 ? ` + ${children} criança${children > 1 ? 's' : ''}` : ''})`
                      : `${adults} Adulto(s) (12+ anos)${children > 0 ? ` + ${children} Criança(s) (3 a 11 anos)` : ''}`}
                  </span>
                  <span className="text-white font-bold">
                    <AnimatedPrice value={adultsTotal + childrenTotal} />
                  </span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-slate-200">
                    <span>Opcionais selecionados ({selectedAddons.length})</span>
                    <span className="text-white font-bold">
                      <AnimatedPrice value={addonsTotal} />
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                  <div>
                    <span className="font-extrabold text-white text-base block">Total Final:</span>
                    {displayCurrency !== 'BRL' && (
                      <span className="text-xs sm:text-sm text-cyan-200 font-bold block">
                        Equivalente: {formatCurrencyValue(finalTotal, displayCurrency)}
                      </span>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <AnimatedPrice
                      value={finalTotal}
                      className="font-black text-amber-300 text-2xl sm:text-3xl block"
                    />
                    <div className="flex items-center sm:justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                      <span>Ver moeda:</span>
                      {(['BRL', 'USD', 'EUR', 'ARS'] as SupportedCurrency[]).map((cur) => (
                        <button
                          key={cur}
                          type="button"
                          onClick={() => setDisplayCurrency(cur)}
                          className={`px-1.5 py-0.5 rounded cursor-pointer ${
                            displayCurrency === cur
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB 1: PIX Gateway */}
              {paymentTab === 'pix' && (
                <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-b from-[#0B1E38] to-[#071324] border border-amber-400/30 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> QR Code Gerado
                    </span>
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Expira em: {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* QR Code SVG / Visual representation */}
                  <div className="flex justify-center my-3">
                    <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400/40">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NATALVIP-PIX-${finalTotal}`}
                        alt="QR Code PIX"
                        className="w-36 h-36"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    Abra o app do seu banco, escolha <strong>PIX</strong> e aponte a câmera ou use o
                    código Copia e Cola abaixo.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136natalvipturismo@bancocentral.gov.br52040000"
                      className="bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded-xl px-3 py-2.5 flex-1 font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedPix ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Credit Card Simulator Gateway */}
              {paymentTab === 'card' && (
                <div className="space-y-4">
                  {/* Visual Luxury Credit Card */}
                  <div className="h-44 rounded-2xl bg-gradient-to-tr from-slate-950 via-[#132A4B] to-slate-900 border border-amber-400/40 p-5 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />
                    <div className="flex justify-between items-center text-xs font-bold tracking-widest text-amber-300">
                      <span>NATAL VIP PASS</span>
                      <span className="text-base font-black">VISA VIP</span>
                    </div>

                    <div className="text-lg tracking-widest font-mono text-amber-100">
                      {cardNumber}
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-300">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                          Titular
                        </span>
                        <span className="font-bold uppercase">
                          {cardHolder || 'NOME DO PASSAGEIRO'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                          Validade
                        </span>
                        <span className="font-bold">{cardExpiry || '12/29'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card form inputs */}
                  <div className="space-y-3 text-xs">
                    <input
                      type="text"
                      placeholder="Número do Cartão"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Nome impresso no Cartão"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Parcelamento sem juros:
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      >
                        {[1, 2, 3, 4, 5, 6, 10, 12].map((n) => (
                          <option key={n} value={n}>
                            {n}x de R$ {(grossTotal / n).toFixed(2).replace('.', ',')} sem juros
                          </option>
                        ))}
                      </select>
                    </div>

                    <a
                      href="https://loja.infinitepay.io/natalvipturismo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ou pagar direto no Link Oficial InfinitePay</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentTab === 'pix'
                      ? 'Confirmar Pagamento no PIX'
                      : 'Pagar com Cartão de Crédito'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: VOUCHER EMISSIONS */}
          {step === 'voucher' && generatedVoucher && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Reserva Confirmada com Sucesso!
                </span>
                <h3 className="text-2xl font-black text-white">
                  Passaporte VIP · Natal Vip Turismo
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Seu código localizador foi registrado nos registros marítimos e no clube de praia.
                </p>
              </div>

              {/* Digital Voucher Ticket */}
              <div className="bg-gradient-to-b from-[#0C1A30] to-[#071220] border-2 border-amber-400/50 rounded-3xl p-6 text-left shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] shrink-0 bg-slate-950">
                      <img
                        src="/images/brand/logo-natal-vip.webp"
                        alt="Natal Vip Turismo"
                        className="w-full h-full rounded-full object-cover scale-[1.04]"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/brand/favicon.png';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        Localizador
                      </span>
                      <span className="text-lg font-black text-white tracking-wider">
                        {generatedVoucher.voucherCode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Status
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      EMITIDO & CONFIRMADO
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block">Passeio:</span>
                    <strong className="text-white">{generatedVoucher.booking.tourName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Data do Mergulho:</span>
                    <strong className="text-amber-300">{generatedVoucher.booking.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Janela de Saída:</span>
                    <strong className="text-white">{generatedVoucher.booking.timeWindow}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hotel / Pickup:</span>
                    <strong className="text-white">
                      {generatedVoucher.booking.hotelPickup || 'Ponta Negra / A combinar'}
                    </strong>
                  </div>
                </div>

                {/* QR Code Validation */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="text-white font-bold block">
                      {generatedVoucher.booking.customerName}
                    </span>
                    <span>
                      {generatedVoucher.booking.adultsCount} Adulto(s)
                      {generatedVoucher.booking.childrenCount ? ` + ${generatedVoucher.booking.childrenCount} Criança(s)` : ''} · Total: R${' '}
                      {generatedVoucher.booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <img
                    src={generatedVoucher.qrCodeUrl}
                    alt="QR Code do Voucher"
                    className="w-16 h-16 rounded-xl bg-white p-1"
                  />
                </div>
              </div>

              {/* Automatic Email Notification Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0A1D1A] to-[#0A1628] border border-emerald-500/40 text-left text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Confirmação Enviada por E-mail</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                    Sincronizado
                  </span>
                </div>

                <div className="text-slate-300 text-[11px] space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <div>
                    📤 <strong>Remetente Oficial:</strong>{' '}
                    <span className="text-amber-300 font-mono font-bold">
                      reservas@natalvipturismo.com
                    </span>
                  </div>
                  <div>
                    📧 <strong>E-mail Cadastrado:</strong>{' '}
                    <span className="text-emerald-300 font-mono font-bold">
                      {generatedVoucher.booking.customerEmail}
                    </span>{' '}
                    (Voucher completo & instruções)
                  </div>
                  <div>
                    🏢 <strong>Cópia Central:</strong>{' '}
                    <span className="text-slate-400 font-mono">
                      reservas@natalvipturismo.com
                    </span>{' '}
                    (Registro operacional aprovado)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Visualizar Modelo do E-mail Enviado</span>
                </button>
              </div>

              {/* Google Agenda Integration Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0B1A30] to-[#0A1628] border border-blue-500/40 text-left text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Sincronizado com Google Agenda</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold border border-blue-500/40">
                    Google Calendar
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Os dados desta reserva foram integrados com a agenda oficial da agência em{' '}
                  <strong className="text-amber-300">reservas@natalvipturismo.com</strong>.
                  Adicione também ao seu calendário pessoal:
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={generateGoogleCalendarUrl({
                      voucherCode: generatedVoucher.voucherCode,
                      customerName: generatedVoucher.booking.customerName,
                      customerEmail: generatedVoucher.booking.customerEmail,
                      customerPhone: generatedVoucher.booking.customerPhone,
                      tourName: generatedVoucher.booking.tourName,
                      date: generatedVoucher.booking.date,
                      timeWindow: generatedVoucher.booking.timeWindow,
                      tideHeight: generatedVoucher.booking.tideHeight,
                      hotelPickup: generatedVoucher.booking.hotelPickup,
                      adultsCount: generatedVoucher.booking.adultsCount,
                      childrenCount: generatedVoucher.booking.childrenCount,
                      totalPrice: generatedVoucher.booking.totalPrice,
                      paymentMethod: generatedVoucher.booking.paymentMethod,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>+ Adicionar ao Meu Google Agenda</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      downloadIcsFile({
                        voucherCode: generatedVoucher.voucherCode,
                        customerName: generatedVoucher.booking.customerName,
                        customerEmail: generatedVoucher.booking.customerEmail,
                        customerPhone: generatedVoucher.booking.customerPhone,
                        tourName: generatedVoucher.booking.tourName,
                        date: generatedVoucher.booking.date,
                        timeWindow: generatedVoucher.booking.timeWindow,
                        tideHeight: generatedVoucher.booking.tideHeight,
                        hotelPickup: generatedVoucher.booking.hotelPickup,
                        adultsCount: generatedVoucher.booking.adultsCount,
                        childrenCount: generatedVoucher.booking.childrenCount,
                        totalPrice: generatedVoucher.booking.totalPrice,
                        paymentMethod: generatedVoucher.booking.paymentMethod,
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    title="Baixar arquivo de evento (.ics) para Outlook, iPhone ou Android"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Baixar .ICS</span>
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(`Olá Natal Vip Turismo! Acabei de emitir meu Voucher ${generatedVoucher.voucherCode} para o passeio ${generatedVoucher.booking.tourName} no dia ${generatedVoucher.booking.date}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar para o WhatsApp da Agência</span>
                </a>

                <button
                  onClick={() => alert(`Voucher ${generatedVoucher.voucherCode} salvo com sucesso!`)}
                  className="py-3 px-4 rounded-xl border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Baixar Passaporte VIP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Email Model Preview Modal */}
      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        booking={
          emailBookingPayload ||
          (generatedVoucher
            ? {
                voucherCode: generatedVoucher.voucherCode,
                customerName: generatedVoucher.booking.customerName,
                customerEmail: generatedVoucher.booking.customerEmail,
                customerPhone: generatedVoucher.booking.customerPhone,
                tourName: generatedVoucher.booking.tourName,
                date: generatedVoucher.booking.date,
                timeWindow: generatedVoucher.booking.timeWindow,
                tideHeight: generatedVoucher.booking.tideHeight,
                hotelPickup: generatedVoucher.booking.hotelPickup,
                adultsCount: generatedVoucher.booking.adultsCount,
                childrenCount: generatedVoucher.booking.childrenCount,
                totalPrice: generatedVoucher.booking.totalPrice,
                paymentMethod: generatedVoucher.booking.paymentMethod,
              }
            : null)
        }
      />
    </div>
  );
};
