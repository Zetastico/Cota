import React from 'react';

export default function PaymentMethodSelector({ value, onChange }) {
  const options = [
    {
      id: 'CASH',
      title: 'Pago en Efectivo',
      desc: 'Pago directo al ofertante al finalizar el servicio.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'QR',
      title: 'Pago por QR',
      desc: 'Coordina el pago mediante código QR con el ofertante.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      id: 'CARD',
      title: 'Pago con Tarjeta',
      desc: 'Registra preferencia de pago con tarjeta. Coordinación final con el ofertante.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-slate-700 text-sm font-semibold mb-1">
        Método de Pago <span className="text-rose-500">*</span>
      </label>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-sm text-indigo-900'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'
                }`}
              >
                {opt.icon}
              </div>
              <div>
                <p className="font-bold text-sm">{opt.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
