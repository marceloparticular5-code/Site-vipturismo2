import React from 'react';

interface NatalVipLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NatalVipLogo: React.FC<NatalVipLogoProps> = ({
  className = '',
  size = 48,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Luxury Emblem Logo */}
      <div
        className="relative shrink-0 rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="Natal VIP Turismo Agency Logo"
          className="w-full h-full object-contain rounded-full drop-shadow-[0_4px_14px_rgba(212,175,55,0.45)]"
          width={size}
          height={size}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-['Cinzel',serif] tracking-wider text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-sm leading-tight">
              NATAL VIP
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              Nº 1 em Satisfação
            </span>
          </div>
          <span className="text-[11px] tracking-[0.25em] font-semibold text-slate-300 uppercase">
            Turismo Agency
          </span>
        </div>
      )}
    </div>
  );
};
