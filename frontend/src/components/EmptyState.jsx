import React from 'react';

const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl w-full h-full">
      {icon ? (
        <div className="text-slate-300 mb-3">{icon}</div>
      ) : (
        <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )}
      <h4 className="text-xs font-bold text-slate-700">{title}</h4>
      {description && <p className="text-2xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">{description}</p>}
    </div>
  );
};

export default EmptyState;
