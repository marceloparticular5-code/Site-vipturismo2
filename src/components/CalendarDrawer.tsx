import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface CalendarDrawerProps {
  onSelectDate: (dateFormatted: string) => void;
  onOpenBookingWithDate?: (dateFormatted: string) => void;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA_NOMES = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export const CalendarDrawer: React.FC<CalendarDrawerProps> = ({
  onSelectDate,
  onOpenBookingWithDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hoje = new Date();

  // Cancel mouse timer
  const clearMouseTimer = () => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
  };

  // Close with cleanup
  const handleClose = () => {
    clearMouseTimer();
    setIsOpen(false);
  };

  // Open with cleanup
  const handleOpen = () => {
    clearMouseTimer();
    setIsOpen(true);
  };

  // Auto-close on mouse leave for 1 second on desktop
  const handleMouseEnter = () => {
    clearMouseTimer();
  };

  const handleMouseLeave = () => {
    // Only on devices that support hover/mouse
    if (window.matchMedia('(hover: hover)').matches && isOpen) {
      clearMouseTimer();
      mouseLeaveTimerRef.current = setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean timer on unmount
  useEffect(() => {
    return () => clearMouseTimer();
  }, []);

  // Calendar calculations
  const year = currentDisplayDate.getFullYear();
  const month = currentDisplayDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDisplayDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Days array construction
  const prevDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevDays.push(daysInPrevMonth - i);
  }

  const currentDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentDays.push(i);
  }

  const totalCells = firstDayIndex + daysInMonth;
  const nextDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextDays = [];
  for (let i = 1; i <= nextDaysCount; i++) {
    nextDays.push(i);
  }

  const handleSelectDay = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);

    const diaFmt = String(day).padStart(2, '0');
    const mesFmt = String(month + 1).padStart(2, '0');
    const dataFormatada = `${diaFmt}/${mesFmt}/${year}`;

    onSelectDate(dataFormatada);

    // Call window.aoSelecionarDia if defined
    if (typeof (window as any).aoSelecionarDia === 'function') {
      (window as any).aoSelecionarDia({
        data: newDate,
        dataFormatada,
        dia: day,
        mes: month + 1,
        ano: year,
        diaDaSemana: DIAS_SEMANA_NOMES[newDate.getDay()],
      });
    }
  };

  const formattedSelected = `${String(selectedDate.getDate()).padStart(2, '0')}/${String(
    selectedDate.getMonth() + 1
  ).padStart(2, '0')}/${selectedDate.getFullYear()}`;

  const dayOfWeekSelected = DIAS_SEMANA_NOMES[selectedDate.getDay()];

  const handleConfirm = () => {
    if (onOpenBookingWithDate) {
      onOpenBookingWithDate(formattedSelected);
    }
    handleClose();
  };

  return (
    <>
      {/* Botão Fixo Lateral */}
      <button
        onClick={handleOpen}
        aria-label="Abrir Calendário de Reservas"
        title="Abrir Calendário"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3 px-3 rounded-l-2xl shadow-[-4px_4px_20px_rgba(0,0,0,0.5),0_0_12px_rgba(245,158,11,0.4)] flex flex-col items-center gap-1.5 transition-all duration-300 hover:pr-4 cursor-pointer group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">📅</span>
        <span
          className="uppercase tracking-widest text-[10px] font-extrabold"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Calendário
        </span>
      </button>

      {/* Overlay Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Gaveta Deslizante */}
      <aside
        ref={drawerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 right-0 bottom-0 w-[340px] max-w-[90%] bg-[#071224] border-l border-amber-500/30 text-white z-50 shadow-[-12px_0_40px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Gaveta de Calendário"
      >
        {/* Cabeçalho da Gaveta */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0B1A2F]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                Calendário Oficial
              </h3>
              <p className="text-[11px] font-semibold text-amber-400">
                Natal VIP Turismo
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Fechar Gaveta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com o Calendário */}
        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Card do Calendário */}
          <div className="bg-[#0D1B2E] border border-amber-500/25 rounded-2xl p-4 shadow-xl">
            {/* Navegação de Mês */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                aria-label="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-extrabold text-white capitalize">
                {MESES[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                aria-label="Próximo Mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Cabeçalho dos Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div key={dia} className="text-[11px] font-bold text-amber-400 py-1 uppercase">
                  {dia}
                </div>
              ))}
            </div>

            {/* Grade dos Dias */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Dias anteriores */}
              {prevDays.map((dia) => (
                <div
                  key={`prev-${dia}`}
                  className="aspect-square flex items-center justify-center text-xs text-slate-600 opacity-40 select-none"
                >
                  {dia}
                </div>
              ))}

              {/* Dias do mês atual */}
              {currentDays.map((dia) => {
                const isToday =
                  hoje.getFullYear() === year &&
                  hoje.getMonth() === month &&
                  hoje.getDate() === dia;

                const isSelected =
                  selectedDate.getFullYear() === year &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getDate() === dia;

                return (
                  <button
                    key={`cur-${dia}`}
                    onClick={() => handleSelectDay(dia)}
                    className={`aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30 scale-105'
                        : isToday
                        ? 'border border-amber-400 text-amber-300 font-bold bg-amber-500/10'
                        : 'text-slate-200 hover:bg-amber-400/20 hover:text-white'
                    }`}
                  >
                    {dia}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}

              {/* Dias seguintes */}
              {nextDays.map((dia) => (
                <div
                  key={`next-${dia}`}
                  className="aspect-square flex items-center justify-center text-xs text-slate-600 opacity-40 select-none"
                >
                  {dia}
                </div>
              ))}
            </div>
          </div>

          {/* Card Informativo da Data Selecionada */}
          <div className="bg-amber-400/10 border border-dashed border-amber-400/40 rounded-xl p-3.5 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              Data Selecionada:
            </span>
            <div className="text-sm font-extrabold text-white">
              {dayOfWeekSelected}, {formattedSelected}
            </div>
          </div>

          {/* Botão de Ação */}
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Consultar Passeios Nesta Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rodapé da Gaveta */}
        <div className="p-3 border-t border-slate-800 bg-[#050C16]/80 text-center text-[10px] text-slate-400">
          💡 Fecha automaticamente por inatividade (1s sem cursor) ou tecla ESC.
        </div>
      </aside>
    </>
  );
};
