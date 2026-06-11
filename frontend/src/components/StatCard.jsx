import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

const StatCard = ({ label, value, icon, color = 'indigo', loading = false, sub }) => {
  const colors = {
    indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
    slate:   { bg: 'bg-slate-100',  icon: 'text-slate-600',   border: 'border-slate-200' },
    rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    border: 'border-rose-100' },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4
      hover:shadow-premium-hover hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 text-3xl font-extrabold font-display text-slate-900">
            {loading ? <Skeleton className="h-9 w-20 rounded-lg" /> : value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.icon} border ${c.border} transition-colors duration-250`}>
          {icon}
        </div>
      </div>
      {sub !== undefined && (
        <p className="text-2xs text-slate-400 font-medium">
          {loading ? <Skeleton className="h-3.5 w-28 rounded" /> : sub}
        </p>
      )}
    </div>
  );
};

export default StatCard;
