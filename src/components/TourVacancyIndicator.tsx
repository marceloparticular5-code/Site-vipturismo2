import React from 'react';
import { Flame, Users, AlertTriangle } from 'lucide-react';

interface TourVacancyIndicatorProps {
  remainingSlots?: number;
  totalCapacity?: number;
  compact?: boolean;
  className?: string;
  variant?: 'banner' | 'badge' | 'bar' | 'full';
}

export const TourVacancyIndicator: React.FC<TourVacancyIndicatorProps> = ({
  remainingSlots = 3,
  totalCapacity = 10,
  compact = false,
  className = '',
  variant = 'full',
}) => {
  const slots = Math.max(1, remainingSlots);
  const isCritical = slots <= 2;
  const isHigh = slots <= 4;

  // Percentage filled for visual meter
  const filledPercent = Math.min(
    95,
    Math.max(65, Math.round(((totalCapacity - slots) / totalCapacity) * 100))
  );

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md transition-all ${
          isCritical
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-rose-500/20 animate-pulse'
            : isHigh
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/15'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        } ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCritical ? 'bg-rose-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isCritical ? 'bg-rose-500' : 'bg-amber-400'
            }`}
          />
        </span>
        <Flame className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
        <span>Apenas {slots} vagas restantes</span>
      </span>
    );
  }

  if (variant === 'bar') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="flex items-center gap-1 text-amber-300">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
            <span className={isCritical ? 'text-rose-300 font-bold' : 'text-amber-200'}>
              Apenas {slots} vagas restantes
            </span>
          </span>
          <span className="text-slate-400 text-[10px]">{filledPercent}% preenchido</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-rose-600'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500'
            }`}
            style={{ width: `${filledPercent}%` }}
          />
        </div>
      </div>
    );
  }

  // Full / Banner variant with micro-meter and high-contrast styling
  return (
    <div
      className={`rounded-xl border p-2.5 sm:p-3 transition-all ${
        isCritical
          ? 'bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-rose-950/60 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
          : 'bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/40 border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-tight">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCritical ? 'bg-rose-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isCritical ? 'bg-rose-500' : 'bg-amber-400'
              }`}
            />
          </span>
          <span
            className={`${
              isCritical ? 'text-rose-200 font-extrabold' : 'text-amber-200'
            } uppercase tracking-wider text-[11px]`}
          >
            Apenas {slots} vagas restantes
          </span>
        </div>

        <span className="text-[10px] font-bold text-slate-400 shrink-0 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
          {filledPercent}% esgotado
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="h-1.5 w-full bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isCritical
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
              : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
          }`}
          style={{ width: `${filledPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
        <span className="flex items-center gap-1 text-slate-300">
          <Users className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Grupos reduzidos e suporte Cadastur</span>
        </span>
        <span className={isCritical ? 'text-rose-400 font-semibold' : 'text-amber-300 font-medium'}>
          {isCritical ? 'Esgotando hoje' : 'Alta procura'}
        </span>
      </div>
    </div>
  );
};
