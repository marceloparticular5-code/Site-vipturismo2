import React, { useState } from 'react';
import {
  X,
  Mail,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Send,
  Sparkles,
} from 'lucide-react';
import { BookingEmailConfirmationPayload } from '../lib/emailService';
import { buildBookingConfirmationEmailHtml } from '../lib/emailTemplate';
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
  syncReservationWithGoogleCalendar,
} from '../lib/googleCalendarSync';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingEmailConfirmationPayload | null;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const htmlContent = buildBookingConfirmationEmailHtml(booking);
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

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await fetch('/api/send-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: booking.voucherCode,
          customerEmail: booking.customerEmail,
          agencyEmail: 'reservas@natalvipturismo.com',
          booking,
          html: htmlContent,
        }),
      });
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
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      // fallback
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#081220] border-2 border-amber-500/40 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0B182B] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-400">
                  Modelo de E-mail de Confirmação Oficial
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  Disparado Automaticamente
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                De: reservas@natalvipturismo.com · Para: {booking.customerEmail}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header Banner */}
        <div className="px-4 py-3 bg-[#0A1628] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Prévia Visual do E-mail
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'html'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Código HTML do Modelo
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all"
              title="Sincronizar com Google Agenda"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Google Agenda</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() =>
                downloadIcsFile({
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
                })
              }
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
              title="Baixar arquivo de calendário (.ics)"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Baixar .ICS</span>
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{resendSuccess ? 'E-mail Reenviado!' : isResending ? 'Enviando...' : 'Reenviar'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040811]">
          {activeTab === 'preview' ? (
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#050C16]">
              <iframe
                title="Pré-visualização do E-mail de Confirmação"
                srcDoc={htmlContent}
                className="w-full min-h-[580px] border-0"
              />
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={handleCopyHtml}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 z-10"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'HTML Copiado!' : 'Copiar HTML'}</span>
              </button>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[560px]">
                {htmlContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-[#0A1628] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Sincronização realizada com <strong>reservas@natalvipturismo.com</strong> e Google Calendar.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
