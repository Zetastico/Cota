import React from 'react';

const ChartCard = ({ title, subtitle, children, loading = false, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4 hover:shadow-premium-hover transition-all duration-200 ${className}`}>
      {(title || subtitle) && (
        <div className="flex flex-col">
          {title && <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-2xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex-1 min-h-[220px] w-full flex items-center justify-center relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-300 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <span className="text-2xs font-semibold text-slate-300">Cargando gráfico...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
