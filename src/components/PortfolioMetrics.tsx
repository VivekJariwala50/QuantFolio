import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PortfolioMetricsProps {
  totalValue: number;
  totalCost: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  isLoading: boolean;
}

export const PortfolioMetrics: React.FC<PortfolioMetricsProps> = ({
  totalValue,
  totalCost,
  unrealizedGain,
  unrealizedGainPercent,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
        ))}
      </div>
    );
  }

  const isPositive = unrealizedGain >= 0;

  return (
    <div className="space-y-3">
      {/* Total Value */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <DollarSign size={14} className="text-brand-blue" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Total Portfolio Value
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Activity size={12} className="text-status-profit" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Invested: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Unrealized Return */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: isPositive ? '#22C55E' : '#EF4444' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}
            >
              {isPositive
                ? <TrendingUp size={14} className="text-status-profit" />
                : <TrendingDown size={14} className="text-status-loss" />
              }
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Unrealized Return
            </span>
          </div>
          <div className="flex items-end gap-3">
            <div
              className="text-3xl font-bold font-mono tracking-tight"
              style={{ color: isPositive ? '#22C55E' : '#EF4444' }}
            >
              {isPositive ? '+' : ''}${unrealizedGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span
              className="mb-0.5 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                color: isPositive ? '#22C55E' : '#EF4444',
              }}
            >
              {isPositive ? '+' : ''}{unrealizedGainPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};