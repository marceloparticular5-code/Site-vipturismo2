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
      {/* Exact Golden Emblem SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
      >
        <defs>
          {/* Metallic Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF0B9" />
            <stop offset="25%" stopColor="#DFB243" />
            <stop offset="50%" stopColor="#FFEAA5" />
            <stop offset="75%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Deep Navy Radial Gradient */}
          <radialGradient id="navyRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="60%" stopColor="#0B192C" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>

          {/* Sun Glow Gradient */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="40%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>

          {/* Ocean Wave Gradient */}
          <linearGradient id="waveAqua" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Arc Paths for Text */}
          <path id="upperArc" d="M 38 120 A 82 82 0 0 1 202 120" />
          <path id="lowerArc" d="M 204 124 A 84 84 0 0 1 36 124" />
        </defs>

        {/* Outer Ring Border */}
        <circle cx="120" cy="120" r="115" stroke="url(#goldGradient)" strokeWidth="6" fill="#0B192C" />
        <circle cx="120" cy="120" r="108" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />

        {/* Navy Center Disk */}
        <circle cx="120" cy="120" r="102" fill="url(#navyRadial)" />

        {/* Decorative Ring Icons (Plane, Dolphin, Stars, Mask) */}
        <g opacity="0.85" fill="#FFEAA5">
          {/* Left Wing Plane */}
          <path d="M 68 84 L 76 80 L 73 85 L 75 87 Z" />
          {/* Right Wing Plane */}
          <path d="M 172 84 L 164 80 L 167 85 L 165 87 Z" />
          {/* Dolphin silhouette right */}
          <path d="M 194 104 C 196 100 200 102 198 106 C 196 109 193 107 194 104 Z" />
          {/* Star Top Left */}
          <polygon points="50,68 52,73 57,74 53,78 54,83 50,80 46,83 47,78 43,74 48,73" />
          {/* Star Top Right */}
          <polygon points="190,68 192,73 197,74 193,78 194,83 190,80 186,83 187,78 183,74 188,73" />
          {/* Diving Mask icon right */}
          <circle cx="196" cy="154" r="5" stroke="#FFEAA5" strokeWidth="1.5" fill="none" />
          <circle cx="206" cy="154" r="5" stroke="#FFEAA5" strokeWidth="1.5" fill="none" />
          <line x1="201" y1="154" x2="201" y2="154" stroke="#FFEAA5" strokeWidth="2" />
        </g>

        {/* Embossed Ring Inner Gold Border */}
        <circle cx="120" cy="120" r="78" stroke="url(#goldGradient)" strokeWidth="3" fill="none" opacity="0.9" />

        {/* Text Along Arcs */}
        <text fill="url(#goldGradient)" fontSize="18" fontWeight="800" letterSpacing="4" fontFamily="'Cinzel', 'Playfair Display', serif">
          <textPath href="#upperArc" startOffset="50%" textAnchor="middle">
            NATAL VIP
          </textPath>
        </text>

        <text fill="#FFFFFF" fontSize="13" fontWeight="700" letterSpacing="3" fontFamily="'Plus Jakarta Sans', sans-serif">
          <textPath href="#lowerArc" startOffset="50%" textAnchor="middle">
            TURISMO AGENCY
          </textPath>
        </text>

        {/* Center Scene: Sun, Palm Trees, Waves, Stars */}
        <g id="centerScene">
          {/* Radiating Sun */}
          <g>
            {/* Sun Rays */}
            <path d="M 120 48 L 123 60 L 117 60 Z" fill="url(#goldGradient)" />
            <path d="M 100 52 L 107 62 L 102 65 Z" fill="url(#goldGradient)" />
            <path d="M 140 52 L 138 65 L 133 62 Z" fill="url(#goldGradient)" />
            <path d="M 83 66 L 93 72 L 90 76 Z" fill="url(#goldGradient)" />
            <path d="M 157 66 L 150 76 L 147 72 Z" fill="url(#goldGradient)" />
            
            {/* Sun Dome */}
            <ellipse cx="120" cy="85" rx="27" ry="23" fill="url(#sunGlow)" />
            <ellipse cx="120" cy="83" rx="24" ry="19" fill="url(#goldGradient)" opacity="0.6" />
          </g>

          {/* Left Palm Tree */}
          <g transform="translate(68, 82)">
            <path d="M 14 34 Q 16 18 10 6" stroke="#DFB243" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 10 6 Q 0 4 -2 12" stroke="#10B981" strokeWidth="2.5" fill="none" />
            <path d="M 10 6 Q 2 -6 8 -10" stroke="#059669" strokeWidth="2.5" fill="none" />
            <path d="M 10 6 Q 18 -2 20 8" stroke="#10B981" strokeWidth="2.5" fill="none" />
            <path d="M 10 6 Q 8 14 0 16" stroke="#047857" strokeWidth="2" fill="none" />
          </g>

          {/* Right Palm Tree */}
          <g transform="translate(150, 82)">
            <path d="M 8 34 Q 6 18 12 6" stroke="#DFB243" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 12 6 Q 22 4 24 12" stroke="#10B981" strokeWidth="2.5" fill="none" />
            <path d="M 12 6 Q 20 -6 14 -10" stroke="#059669" strokeWidth="2.5" fill="none" />
            <path d="M 12 6 Q 4 -2 2 8" stroke="#10B981" strokeWidth="2.5" fill="none" />
            <path d="M 12 6 Q 14 14 22 16" stroke="#047857" strokeWidth="2" fill="none" />
          </g>

          {/* Wave Curves with Golden Edge */}
          <path
            d="M 62 118 Q 90 98 120 114 Q 150 130 178 118 Q 150 125 120 110 Q 90 96 62 118 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
          <path
            d="M 68 128 Q 95 112 120 124 Q 145 136 172 128 Q 145 133 120 120 Q 95 108 68 128 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M 72 138 Q 95 126 120 134 Q 145 142 168 138 Q 145 140 120 130 Q 95 122 72 138 Z"
            fill="url(#goldGradient)"
            opacity="0.8"
          />

          {/* Golden Beach Sand Arc */}
          <path
            d="M 52 150 Q 85 138 120 148 Q 155 158 188 150 C 172 176 148 186 120 186 C 92 186 68 176 52 150 Z"
            fill="url(#waveAqua)"
          />
          <path
            d="M 58 156 Q 88 144 120 152 Q 152 160 182 156 C 168 178 146 186 120 186 C 94 186 72 178 58 156 Z"
            fill="#0369A1"
          />

          {/* 5 Golden Stars at Bottom Beach */}
          <g fill="url(#goldGradient)" transform="translate(88, 168)">
            <polygon points="6,0 7.5,4 12,4 8.5,6.5 10,11 6,8 2,11 3.5,6.5 0,4 4.5,4" transform="scale(0.7) translate(0, 0)" />
            <polygon points="6,0 7.5,4 12,4 8.5,6.5 10,11 6,8 2,11 3.5,6.5 0,4 4.5,4" transform="scale(0.7) translate(22, 0)" />
            <polygon points="6,0 7.5,4 12,4 8.5,6.5 10,11 6,8 2,11 3.5,6.5 0,4 4.5,4" transform="scale(0.85) translate(40, -2)" />
            <polygon points="6,0 7.5,4 12,4 8.5,6.5 10,11 6,8 2,11 3.5,6.5 0,4 4.5,4" transform="scale(0.7) translate(64, 0)" />
            <polygon points="6,0 7.5,4 12,4 8.5,6.5 10,11 6,8 2,11 3.5,6.5 0,4 4.5,4" transform="scale(0.7) translate(86, 0)" />
          </g>
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-['Cinzel',serif] tracking-wider text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-sm">
              NATAL VIP
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              Nº 1 em Satisfação
            </span>
          </div>
          <span className="text-[11px] tracking-[0.25em] font-medium text-slate-300 uppercase">
            Turismo Agency
          </span>
        </div>
      )}
    </div>
  );
};
