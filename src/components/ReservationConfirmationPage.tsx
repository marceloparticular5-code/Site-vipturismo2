import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Download,
  Calendar,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Mail,
  Receipt,
  Phone,
  Home,
} from 'lucide-react';
import { trackPurchaseApproved, trackPaymentAbandoned } from '../lib/tracking';
import { downloadIcsFile } from '../lib/googleCalendarSync';
import { PHONE_DISPLAY, PHONE_WA } from '../config/contact';

interface ReservationConfirmationPageProps {
  orderNsu: string;
  onGoHome?: () => void;
}

export const ReservationConfirmationPage: React.FC<ReservationConfirmationPageProps> = ({
  orderNsu,
  onGoHome,
}) => {
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const purchaseTrackedRef = useRef(false);

  // Poll reservation status from server
  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/infinitepay/reservation/${encodeURIComponent(orderNsu)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Reserva não encontrada. Verifique o código identificador.');
        } else {
          setError('Erro ao carregar o status da reserva.');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data?.reservation) {
        setReservation(data.reservation);
        setError(null);

        // Track purchase event ONLY when status is Aprovada and only once
        if (data.reservation.status === 'Aprovada' && !purchaseTrackedRef.current) {
          purchaseTrackedRef.current = true;
          trackPurchaseApproved(
            data.reservation.order_nsu,
            data.reservation.tourName,
            data.reservation.totalAmount
          );

          // Save to local storage for user's vouchers list
          try {
            const stored = JSON.parse(localStorage.getItem('natal_vip_reservations') || '[]');
            const exists = stored.some((v: any) => v.voucherCode === data.reservation.order_nsu);
            if (!exists) {
              stored.unshift({
                voucherCode: data.reservation.order_nsu,
                createdAt: new Date(data.reservation.createdAt).toLocaleDateString('pt-BR'),
                status: 'confirmado',
                booking: {
                  tourId: data.reservation.tourId,
                  tourName: data.reservation.tourName,
                  date: data.reservation.date,
                  timeWindow: data.reservation.timeWindow,
                  adultsCount: data.reservation.adults,
                  childrenCount: data.reservation.children,
                  customerName: data.reservation.customer?.name,
                  customerPhone: data.reservation.customer?.phone,
                  customerEmail: data.reservation.customer?.email,
                  hotelPickup: data.reservation.hotelPickup,
                  paymentMethod: data.reservation.payment_method || 'cartao',
                  totalPrice: data.reservation.totalAmount,
                },
                qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NATALVIP-${data.reservation.order_nsu}`,
              });
              localStorage.setItem('natal_vip_reservations', JSON.stringify(stored));
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err: any) {
      console.warn('[Polling Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 3 seconds if status is "Aguardando pagamento"
    const interval = setInterval(() => {
      setPollCount((prev) => prev + 1);
      fetchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [orderNsu]);

  // Track abandoned payment when user leaves or after timeout
  useEffect(() => {
    return () => {
      if (reservation && reservation.status === 'Aguardando pagamento' && !purchaseTrackedRef.current) {
        trackPaymentAbandoned(
          reservation.order_nsu,
          reservation.tourName,
          reservation.totalAmount,
          'user_left_awaiting_page'
        );
      }
    };
  }, [reservation]);

  const handleDownloadCalendar = () => {
    if (!reservation) return;
    downloadIcsFile({
      voucherCode: reservation.order_nsu,
      customerName: reservation.customer.name,
      customerEmail: reservation.customer.email,
      customerPhone: reservation.customer.phone,
      tourName: reservation.tourName,
      date: reservation.date,
      timeWindow: reservation.timeWindow,
      tideHeight: reservation.tideHeight || 0.2,
      hotelPickup: reservation.hotelPickup || 'Ponta Negra / A combinar',
      adultsCount: reservation.adults,
      childrenCount: reservation.children,
      totalPrice: reservation.totalAmount,
      paymentMethod: reservation.payment_method || 'cartao',
    });
  };

  const handleRetryPayment = () => {
    if (reservation?.checkoutUrl) {
      window.location.href = reservation.checkoutUrl;
    }
  };

  const isApproved = reservation?.status === 'Aprovada';
  const isExpired = reservation?.status === 'Expirada';
  const isPending = reservation?.status === 'Aguardando pagamento' || !reservation;

  return (
    <div className="min-h-screen bg-[#060D17] text-[#0F172A] py-10 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Brand Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/50 bg-[#0A192F]">
              <img
                src="/images/brand/logo-natal-vip.webp"
                alt="Natal Vip Turismo"
                className="w-full h-full object-cover scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/brand/favicon.png';
                }}
              />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider block">NATAL VIP TURISMO</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                Checkout Oficial InfinitePay · Cadastur 39.456.551/0001-08
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onGoHome) onGoHome();
              else window.location.href = '/';
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Início</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && !reservation && (
          <div className="bg-[#0B1E38] border border-amber-400/30 rounded-3xl p-10 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-white">Carregando dados da sua reserva...</h3>
            <p className="text-xs text-slate-300">Identificador: {orderNsu}</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-3xl p-8 text-center space-y-4 text-white">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-xl font-black">{error}</h3>
            <p className="text-xs text-slate-300">
              Caso já tenha efetuado o pagamento via Pix ou Cartão, contate nossa central de plantão com o número{' '}
              <strong className="text-amber-300">{orderNsu}</strong>.
            </p>
            <a
              href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(
                `Olá Marcelo! Preciso de ajuda com a confirmação da minha reserva: ${orderNsu}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
            >
              <Phone className="w-4 h-4" />
              <span>Chamar Plantão VIP no WhatsApp</span>
            </a>
          </div>
        )}

        {/* 1. AGUARDANDO PAGAMENTO (Live Checking Status) */}
        {!loading && isPending && (
          <div className="bg-gradient-to-br from-[#0B2544] via-[#091C35] to-[#071322] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-white text-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 text-amber-300 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 block">
                Sincronização em Tempo Real
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Confirmando seu pagamento...
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Estamos consultando a InfinitePay automaticamente. Assim que seu Pix ou Cartão for aprovado,
                esta tela será atualizada instantaneamente e o voucher com QR Code será liberado.
              </p>
            </div>

            {/* Reservation Summary Box */}
            <div className="bg-[#050C16] border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Identificador (Order NSU):</span>
                <span className="font-mono font-bold text-amber-300">{reservation.order_nsu}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Passeio:</span>
                <span className="font-bold text-white text-right">{reservation.tourName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Data Agendada:</span>
                <span className="font-bold text-white">{reservation.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Passageiros:</span>
                <span className="font-bold text-white">
                  {reservation.adults} adulto(s){reservation.children > 0 && ` + ${reservation.children} criança(s)`}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Valor Total:</span>
                <span className="font-black text-emerald-400 text-sm">
                  R$ {reservation.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetryPayment}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>Concluir ou Tentar Pagar Novamente</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={fetchStatus}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Checar Agora</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pagamento Seguro InfinitePay
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Atualizando automaticamente a cada 3s
              </span>
            </div>
          </div>
        )}

        {/* 2. SUCESSO & VOUCHER APROVADO */}
        {!loading && isApproved && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-[#062016] via-[#091D28] to-[#0A1628] border-2 border-emerald-500/70 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
                  Pagamento Confirmado pela InfinitePay
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white font-['Playfair_Display',serif]">
                  Sua Reserva VIP Está Confirmada!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Parabéns! Sua vaga está 100% garantida. O voucher nominal e as orientações de embarque foram
                  encaminhados automaticamente para <strong className="text-emerald-300">{reservation.customer.email}</strong>.
                </p>
              </div>

              {/* Digital Voucher Board */}
              <div className="bg-gradient-to-b from-[#0C1A30] to-[#071220] border-2 border-amber-400/50 rounded-3xl p-6 text-left shadow-2xl relative overflow-hidden mt-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Localizador Oficial (Order NSU)
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white tracking-wider">
                      {reservation.order_nsu}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Status Marítimo
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      APROVADA & EMITIDA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4 text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Passeio:</span>
                    <strong className="text-white text-sm">{reservation.tourName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Data do Roteiro:</span>
                    <strong className="text-amber-300 text-sm">{reservation.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Janela de Saída:</span>
                    <strong className="text-white">{reservation.timeWindow}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Passageiros:</span>
                    <strong className="text-white">
                      {reservation.adults} Adulto(s)
                      {reservation.children > 0 && ` + ${reservation.children} Criança(s)`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Titular:</span>
                    <strong className="text-white">{reservation.customer.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Valor Quitado:</span>
                    <strong className="text-emerald-400 text-sm">
                      R$ {reservation.totalAmount.toFixed(2)} (Sem Juros)
                    </strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Mail className="w-3.5 h-3.5" />
                      E-mail e comprovante encaminhados para {reservation.customer.email}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Apresente este voucher no celular ou documento original no momento do embarque.
                    </p>
                  </div>

                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NATALVIP-${reservation.order_nsu}`}
                    alt="QR Code Voucher"
                    className="w-20 h-20 rounded-xl bg-white p-1 border-2 border-amber-400/50"
                  />
                </div>
              </div>

              {/* CTAs after approval */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Adicionar ao Google Agenda (.ics)</span>
                </button>

                {reservation.receipt_url && (
                  <a
                    href={reservation.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 hover:bg-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Ver Comprovante Oficial InfinitePay</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(
                    `Olá! Minha reserva foi confirmada (NSU: ${reservation.order_nsu}) para ${reservation.tourName} no dia ${reservation.date}. Gostaria de confirmar o ponto de encontro no meu hotel.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Falar com Concierge no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 3. RESERVA EXPIRADA */}
        {!loading && isExpired && (
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center space-y-4 text-white">
            <Clock className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-black">Tempo Limite Expirado</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              O link de pagamento para a reserva <strong className="text-white">{reservation.order_nsu}</strong> expirou
              por motivos de segurança. Você pode gerar um novo link ou tentar pagar novamente.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRetryPayment}
                className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer"
              >
                Gerar Novo Link com Mesmo NSU
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="max-w-3xl mx-auto w-full pt-8 text-center text-[11px] text-slate-400">
        <p>Natal Vip Turismo Ltda · Cadastur 39.456.551/0001-08 · reservas@natalvipturismo.com · Plantão: {PHONE_DISPLAY}</p>
      </div>
    </div>
  );
};
