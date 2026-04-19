import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';

interface InsightsPanelProps {
  suggestions: string[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ suggestions }) => {
  return (
    <Card title="Smart Insights" icon={<Lightbulb size={16} />}>
      {suggestions.length === 0 ? (
        <div className="flex items-start gap-3" style={{ padding: '4px 0' }}>
          <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your portfolio looks well-balanced. No significant concentration risks detected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => {
            const isSector = suggestion.toLowerCase().includes('sector');
            return (
              <div
                key={idx}
                className="flex gap-3 rounded-xl p-3.5 text-sm"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  borderLeft: '3px solid #F59E0B',
                }}
              >
                <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                <div>
                  <div className="font-bold text-xs mb-1" style={{ color: 'var(--text-primary)' }}>
                    {isSector ? 'Sector Concentration' : 'High Concentration Risk'}
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {suggestion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
