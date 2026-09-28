import React from 'react';

export const TourShowcaseSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[#0B172A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Visual Silhouette (Left Column) */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] bg-slate-800/70 overflow-hidden flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-36 bg-slate-700/80 rounded-full" />
            <div className="h-7 w-24 bg-slate-700/80 rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="h-9 w-3/4 bg-slate-700/60 rounded-xl" />
            <div className="h-5 w-1/2 bg-slate-700/50 rounded-lg" />
          </div>

          <div className="h-10 w-full bg-slate-900/80 rounded-2xl border border-slate-700/40" />
        </div>

        {/* Info Silhouette (Right Column) */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#0B172A]/90">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-4 w-3 bg-slate-800 rounded-full" />
              <div className="h-4 w-32 bg-slate-800 rounded" />
            </div>

            <div className="h-8 w-4/5 bg-slate-700/70 rounded-lg" />
            <div className="h-4 w-3/5 bg-slate-800/80 rounded" />

            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full bg-slate-800/60 rounded" />
              <div className="h-3.5 w-5/6 bg-slate-800/60 rounded" />
              <div className="h-3.5 w-4/6 bg-slate-800/60 rounded" />
            </div>

            {/* Urgency / Vagas Placeholder */}
            <div className="h-8 w-full bg-amber-500/10 border border-amber-500/20 rounded-xl mt-4" />

            {/* Inclusions checklist placeholders */}
            <div className="space-y-2 pt-2">
              <div className="h-8 w-full bg-slate-900/80 rounded-xl border border-slate-800" />
              <div className="h-8 w-full bg-slate-900/80 rounded-xl border border-slate-800" />
              <div className="h-8 w-full bg-slate-900/80 rounded-xl border border-slate-800" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3.5 w-20 bg-slate-800 rounded" />
              <div className="h-8 w-32 bg-amber-500/20 rounded-lg" />
            </div>
            <div className="h-12 w-36 bg-amber-400/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TourGridCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#091527] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between animate-pulse">
      <div>
        {/* Image Placeholder */}
        <div className="relative h-56 bg-slate-800/80 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 bg-slate-700 rounded-full" />
            <div className="h-6 w-14 bg-slate-700 rounded-full" />
          </div>
          <div className="h-7 w-full bg-slate-900/80 rounded-xl" />
        </div>

        {/* Card Content Placeholder */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-3.5 w-24 bg-slate-800 rounded" />
            <div className="h-3.5 w-20 bg-slate-800 rounded" />
          </div>

          <div className="h-6 w-4/5 bg-slate-700/80 rounded" />

          {/* Vagas Limitadas bar placeholder */}
          <div className="h-6 w-3/4 bg-amber-500/10 border border-amber-500/20 rounded-lg" />

          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/60 rounded" />
            <div className="h-3 w-4/5 bg-slate-800/60 rounded" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-900 rounded" />
            <div className="h-4 w-5/6 bg-slate-900 rounded" />
            <div className="h-4 w-4/6 bg-slate-900 rounded" />
          </div>
        </div>
      </div>

      {/* Footer CTA Placeholder */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-800 rounded" />
          <div className="h-6 w-24 bg-amber-500/20 rounded" />
        </div>
        <div className="h-10 w-28 bg-amber-400/20 rounded-xl" />
      </div>
    </div>
  );
};

export const TourGridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <TourGridCardSkeleton key={i} />
      ))}
    </div>
  );
};
