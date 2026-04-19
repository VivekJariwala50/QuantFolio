import React from 'react';
import { ShieldAlert, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';

interface RiskMetricsCardProps {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

const Metric: React.FC<{
  label: string;
  value: string;
  note: string;
  color: string;
  icon: React.ReactNode;
}> = ({ label, value, note, color, icon }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 mb-0.5">
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
    <div className="text-xl font-bold font-mono" style={{ color }}>
      {value}
    </div>
    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{note}</div>
  </div>
);

export const RiskMetricsCard: React.FC<RiskMetricsCardProps> = ({ volatility, sharpeRatio, maxDrawdown }) => {
  const sharpeColor = sharpeRatio > 1 ? '#22C55E' : sharpeRatio > 0 ? '#F59E0B' : '#EF4444';

  return (
    <Card title="Risk Analysis" icon={<ShieldAlert size={16} />}>
      <div
        className="grid grid-cols-3 gap-4"
        style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '0px' }}
      >
        <Metric
          label="Volatility"
          value={`${(volatility * 100).toFixed(2)}%`}
          note="Lower = less risk"
          color="var(--text-primary)"
          icon={<Activity size={12} />}
        />
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
          <Metric
            label="Sharpe"
            value={sharpeRatio.toFixed(2)}
            note="> 1.0 is good"
            color={sharpeColor}
            icon={<TrendingUp size={12} />}
          />
        </div>
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
          <Metric
            label="Drawdown"
            value={`${maxDrawdown.toFixed(2)}%`}
            note="Max historical"
            color="#EF4444"
            icon={<TrendingDown size={12} />}
          />
        </div>
      </div>
    </Card>
  );
};
