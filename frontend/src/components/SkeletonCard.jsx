import React from 'react';

export const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SkeletonKPI = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-8 w-24" />
      </div>
      <Shimmer className="w-10 h-10 rounded-xl" />
    </div>
    <Shimmer className="h-3 w-32" />
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4">
    <div className="space-y-1.5">
      <Shimmer className="h-4 w-32" />
      <Shimmer className="h-3 w-48" />
    </div>
    <div className="flex-1 min-h-[220px] flex items-end gap-3 justify-around pt-6">
      <Shimmer className="w-8 h-20" />
      <Shimmer className="w-8 h-32" />
      <Shimmer className="w-8 h-12" />
      <Shimmer className="w-8 h-28" />
      <Shimmer className="w-8 h-16" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-3 py-2.5">
    <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <Shimmer className="h-3.5 w-32" />
      <Shimmer className="h-2.5 w-24" />
    </div>
    <Shimmer className="h-5 w-14 rounded-full" />
  </div>
);

export default {
  Shimmer,
  SkeletonKPI,
  SkeletonChart,
  SkeletonRow,
};
