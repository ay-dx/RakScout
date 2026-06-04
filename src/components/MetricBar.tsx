import { useId } from 'react';

interface MetricBarProps {
  label: string;
  value: string;
  pct: number;
  color: 'red' | 'blue' | 'green';
}

const colorMap = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
};

export function MetricBar({ label, value, pct, color }: MetricBarProps) {
  const id = useId();
  const barColor = colorMap[color];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-lg font-bold text-gray-900">{value}</span>
      </div>
      <div
        id={id}
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}`}
        className="h-3 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}