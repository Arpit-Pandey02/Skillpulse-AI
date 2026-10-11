import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string; // hex or tailwind class
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
  color = 'bg-indigo-600',
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const isCustomHex = color.startsWith('#');

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercent && (
            <span className="font-semibold text-slate-600 tabular-nums ml-auto">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            !isCustomHex && color
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: isCustomHex ? color : undefined,
          }}
        />
      </div>
    </div>
  );
};
