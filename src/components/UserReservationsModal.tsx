import React, { useEffect, useState } from 'react';
import { X, Ticket, Calendar, Clock, Users, ShieldCheck, LogIn, ExternalLink } from 'lucide-react';
import { auth, loginWithGoogle, subscribeUserBookings, FirebaseBooking } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UserReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const UserReservationsModal: React.FC<UserReservationsModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [bookings, setBookings] = useState<FirebaseBooking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    setLoading(true);
    const unsubscribeSnapshot = subscribeUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1528] border border-amber-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#070E1A] to-[#0B1528]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                Minhas Reservas VIP
              </h3>
              <p className="text-xs text-slate-400">
                Histórico de passaportes e vouchers sincronizados no Firebase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {!user ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <Ticket className="w-8 h-8 opacity-60" />
              </div>
              <div className="max-w-sm mx-auto">
                <h4 className="text-base font-bold text-white mb-1">
                  Acesse suas reservas com sua conta
                </h4>
                <p className="text-xs text-slate-400 mb-6">
                  Faça login para visualizar seus passaportes marítimos, horários de maré baixa e emitir vouchers a qualquer momento.
                </p>
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar com Google
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Carregando seus passaportes VIP...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  Nenhuma reserva ativa encontrada
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Você ainda não possui nenhum passeio agendado. Escolha uma data com maré baixa perfeita e garanta sua vaga!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="py-2.5 px-6 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-md"
                >
                  Fazer Nova Reserva
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 rounded-2xl p-5 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/imagens/logovip.jpg"
                        alt="Natal VIP"
                        className="w-7 h-7 rounded-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {booking.voucherCode}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {booking.status === 'confirmed' ? 'Confirmado' : booking.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-base font-bold text-white">{booking.tourName}</h5>
                    <p className="text-xs text-slate-400">Passageiro: {booking.passengerName}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{booking.timeWindow || 'Manhã'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{booking.participants} pessoa(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Total: <strong className="text-amber-300 text-sm font-bold">R$ {booking.totalAmount}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Vaga Garantida na Lancha
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Sincronização em tempo real via Cloud Firestore</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
