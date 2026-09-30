import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'teal', onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const colorStyles = {
    teal: {
      accent: 'border-t-teal-500',
      gradient: 'from-teal-500/5 via-bg-surface to-bg-surface dark:from-teal-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200/70 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/50',
      glow: 'hover:border-teal-500/40 hover:shadow-sm'
    },
    rose: {
      accent: 'border-t-rose-500',
      gradient: 'from-rose-500/5 via-bg-surface to-bg-surface dark:from-rose-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50',
      glow: 'hover:border-rose-500/40 hover:shadow-sm'
    },
    amber: {
      accent: 'border-t-amber-500',
      gradient: 'from-amber-500/5 via-bg-surface to-bg-surface dark:from-amber-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/70 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50',
      glow: 'hover:border-amber-500/40 hover:shadow-sm'
    },
    emerald: {
      accent: 'border-t-emerald-500',
      gradient: 'from-emerald-500/5 via-bg-surface to-bg-surface dark:from-emerald-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50',
      glow: 'hover:border-emerald-500/40 hover:shadow-sm'
    },
    indigo: {
      accent: 'border-t-indigo-500',
      gradient: 'from-indigo-500/5 via-bg-surface to-bg-surface dark:from-indigo-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/70 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/50',
      glow: 'hover:border-indigo-500/40 hover:shadow-sm'
    },
    cyan: {
      accent: 'border-t-cyan-500',
      gradient: 'from-cyan-500/5 via-bg-surface to-bg-surface dark:from-cyan-950/20 dark:via-bg-surface dark:to-bg-surface',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50',
      glow: 'hover:border-cyan-500/40 hover:shadow-sm'
    }
  };

  const activeStyle = colorStyles[color] || colorStyles.teal;
  const isPositive = trend && (trend.startsWith('+') || trend.includes('vs target') || trend.includes('Occupancy'));

  return (
    <div
      onClick={handleClick}
      className={`glass-card flex flex-col justify-between h-full min-h-[136px] gap-3 relative bg-bg-surface border border-border-subtle shadow-xs hover:shadow-md ${activeStyle.glow} cursor-pointer transition-all duration-200 hover:-translate-y-px select-none group overflow-hidden min-w-0`}
    >
      <div className="flex items-center justify-between gap-3 min-w-0">
        <span className="text-[13px] font-medium text-text-muted truncate min-w-0 flex-1">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${activeStyle.iconBg}`}>
            <Icon size={20} strokeWidth={1.9} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 mt-auto pt-2 flex-wrap min-w-0">
        <span className="text-2xl sm:text-[1.75rem] font-bold text-text-main tracking-tight leading-none truncate tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 leading-normal shrink-0 whitespace-nowrap ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="text-[13px] text-text-muted truncate min-w-0 flex items-center gap-1 block">
          {subtitle}
        </span>
      )}
    </div>
  );
};

