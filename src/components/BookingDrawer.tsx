import React, { useState, useEffect } from 'react';
import { AVAILABLE_ADDONS, VIP_TOURS } from '../data/toursData';
import { BookingState, VoucherData, TourPackage } from '../types';
import { auth, saveBookingToFirestore } from '../lib/firebase';
import { isDateStringInPast } from '../lib/dateUtils';
import { triggerBookingEmailConfirmation } from '../lib/emailService';
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
} from 'lucide-react';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTourId?: string;
  preselectedDate?: string;
  preselectedTimeWindow?: string;
  preselectedTideHeight?: number;
  tours?: TourPackage[];
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  preselectedTourId = 'maracajau-vip',
  preselectedDate = '03/01/2026',
  preselectedTimeWindow = '08:30 às 10:00',
  preselectedTideHeight = 0.2,
  tours,
}) => {
  const [selectedTourId, setSelectedTourId] = useState(preselectedTourId);
  const [bookingDate, setBookingDate] = useState(preselectedDate);
  const [bookingTimeWindow, setBookingTimeWindow] = useState(preselectedTimeWindow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['fotos-gopro']);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [hotelPickup, setHotelPickup] = useState('');

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
            phone: customerPhone || '(84) 98825-6545',
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
  }, [preselectedTourId, preselectedDate, preselectedTimeWindow]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'gateway' && paymentTab === 'pix' && pixTimer > 0) {
      interval = setInterval(() => setPixTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentTab, pixTimer]);

  if (!isOpen) return null;

  const tourList = (tours && tours.length > 0 ? tours : VIP_TOURS).filter((t) => t.active !== false);
  const currentTour = tourList.find((t) => t.id === selectedTourId) || tourList[0] || VIP_TOURS[0];

  // Price calculations
  const baseTourPrice = currentTour.priceDiscounted;
  const adultsTotal = adults * baseTourPrice;
  const childrenTotal = children * (baseTourPrice * 0.5); // 50% discount for children
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const grossTotal = adultsTotal + childrenTotal + addonsTotal;
  const pixDiscount = paymentTab === 'pix' ? grossTotal * 0.05 : 0;
  const finalTotal = grossTotal - pixDiscount;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
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
      customerPhone: customerPhone || '(84) 98825-6545',
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
      const activeUid = auth.currentUser?.uid || `guest_${Date.now()}`;
      saveBookingToFirestore({
        userId: activeUid,
        tourId: currentTour.id,
        tourName: currentTour.title,
        date: bookingDate,
        timeWindow: bookingTimeWindow,
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

    // Trigger mock email confirmation service function upon booking
    triggerBookingEmailConfirmation({
      voucherCode: bookingCode,
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail,
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
    }).catch((err) => {
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
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Fechar reserva"
          >
            <X className="w-5 h-5" />
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Escolha o Passeio
                </label>
                <select
                  value={selectedTourId}
                  onChange={(e) => setSelectedTourId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {tourList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} — R$ {t.priceDiscounted.toFixed(2)} por pessoa
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Embarkation Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
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
                        : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                  {isDateStringInPast(bookingDate) ? (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      Esta data já passou no calendário. Escolha uma data a partir de hoje.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Sincronizada com o calendário oficial de marés
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Janela de Embarque
                  </label>
                  <input
                    type="text"
                    value={bookingTimeWindow}
                    onChange={(e) => setBookingTimeWindow(e.target.value)}
                    placeholder="Ex: 08:30 às 10:00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    Horário ajustado para maré 0.2m
                  </span>
                </div>
              </div>

              {/* Passengers Counters */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Passageiros
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Adultos</span>
                    <span className="text-xs text-slate-400">
                      R$ {baseTourPrice},00 por pessoa
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-white w-6 text-center">{adults}</span>
                    <button
                      onClick={() => setAdults((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-sm font-bold text-white block">Crianças (6 a 11 anos)</span>
                    <span className="text-xs text-emerald-400 font-medium">
                      50% OFF (R$ {(baseTourPrice * 0.5).toFixed(2)}) · 0 a 5 anos cortesia
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-white w-6 text-center">{children}</span>
                    <button
                      onClick={() => setChildren((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
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

              {/* Responsible Customer Data */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dados do Responsável & Local de Embarque
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome Completo *"
                    required
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp / Telefone *"
                    required
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="E-mail para envio do voucher"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={hotelPickup}
                    onChange={(e) => setHotelPickup(e.target.value)}
                    placeholder="Nome do Hotel/Pousada em Natal (para transfer)"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Action: Proceed to Gateway */}
              {isDateStringInPast(bookingDate) && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>A data selecionada ({bookingDate}) já passou no calendário. Escolha uma data a partir de hoje para continuar.</span>
                </div>
              )}
              <button
                type="button"
                disabled={isDateStringInPast(bookingDate)}
                onClick={() => {
                  if (isDateStringInPast(bookingDate)) {
                    alert('Por favor, selecione uma data válida (a partir de hoje).');
                    return;
                  }
                  setStep('gateway');
                }}
                className={`w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isDateStringInPast(bookingDate)
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                    : 'text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer'
                }`}
              >
                <span>{isDateStringInPast(bookingDate) ? 'Data Inválida (Já Passou)' : 'Avançar para Pagamento Seguro'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
                  <span className="text-[10px] bg-emerald-700/30 text-emerald-950 font-black px-1.5 py-0.2 rounded">
                    5% de Desconto
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
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>
                    {adults} Adulto(s) + {children} Criança(s)
                  </span>
                  <span>R$ {(adultsTotal + childrenTotal).toFixed(2)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Opcionais selecionados ({selectedAddons.length})</span>
                    <span>R$ {addonsTotal.toFixed(2)}</span>
                  </div>
                )}
                {paymentTab === 'pix' && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto Exclusivo PIX (5%)</span>
                    <span>- R$ {pixDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Total Final:</span>
                  <span className="font-black text-amber-300 text-2xl">
                    R$ {finalTotal.toFixed(2)}
                  </span>
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
                      ? 'Confirmar Pagamento PIX (5% OFF)'
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
                    <img
                      src="/imagens/logovip.jpg"
                      alt="Natal Vip Turismo"
                      className="w-10 h-10 rounded-full object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] shrink-0"
                      referrerPolicy="no-referrer"
                    />
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
                      {generatedVoucher.booking.adultsCount} Adulto(s) · Total: R${' '}
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-[#0A1D1A] border border-emerald-500/40 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vouchers Encaminhados Automaticamente por E-mail</span>
                </div>
                <div className="text-slate-300 text-[11px] space-y-1">
                  <div>
                    📧 <strong>E-mail do Cliente:</strong>{' '}
                    <span className="text-emerald-300 font-mono">
                      {generatedVoucher.booking.customerEmail}
                    </span>{' '}
                    (Cópia com QR Code e detalhes)
                  </div>
                  <div>
                    🏢 <strong>Central da Agência:</strong>{' '}
                    <span className="text-amber-300 font-mono">
                      reservas@natalvipturismo.com
                    </span>{' '}
                    (Confirmado no sistema operacional)
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/5584988256545?text=Ol%C3%A1%20Natal%20Vip%20Turismo!%20Acabei%20de%20emitir%20meu%20Voucher%20${generatedVoucher.voucherCode}%20para%20o%20passeio%20${encodeURIComponent(
                    generatedVoucher.booking.tourName
                  )}%20no%20dia%20${generatedVoucher.booking.date}.`}
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
    </div>
  );
};
