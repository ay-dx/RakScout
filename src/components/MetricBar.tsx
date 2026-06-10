import React from 'react';

interface MetricBarProps {
  label: string;
  value: string;
  pct: number;
  colorClass: string;
}

export default function MetricBar({ label, value, pct, colorClass }: MetricBarProps) {
  return (
    <div 
      className="h-14 bg-white flex items-center border border-stone-200 overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.06)]" 
      style={{ transform: 'skewX(-15deg)' }}
    >
      <div 
        className={`h-full flex items-center justify-between px-5 transition-all duration-1000 ${colorClass}`}
        style={{ width: `${pct}%` }}
      >
        <span 
          className="text-lg font-black italic tracking-widest text-white drop-shadow-md" 
          style={{ transform: 'skewX(15deg)' }}
        >
          {label}
        </span>
        <span 
          className="text-3xl font-black italic text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]" 
          style={{ transform: 'skewX(15deg)' }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}