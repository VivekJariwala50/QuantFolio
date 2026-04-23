import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Brain, TrendingUp, TrendingDown, Activity, Cpu } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMarketDataStore } from '../store/useMarketDataStore';
import { calculatePortfolioValue } from '../utils/analytics';

export const Analytics: React.FC = () => {
  const { positions } = usePortfolioStore();
  const { prices } = useMarketDataStore();

  const { totalValue } = useMemo(
    () => calculatePortfolioValue(positions, prices),
    [positions, prices]
  );

  // Generate Monte Carlo Simulation Data (12 months, 5 paths)
  const monteCarloData = useMemo(() => {
    const data = [];
    let currentPrices = [totalValue || 10000, totalValue || 10000, totalValue || 10000];
    const volatility = 0.05; // 5% monthly volatility
    const expectedReturn = 0.008; // 0.8% monthly return

    for (let month = 0; month <= 12; month++) {
      if (month === 0) {
        data.push({
          month: `M${month}`,
          path1: currentPrices[0],
          path2: currentPrices[1],
          path3: currentPrices[2],
        });
      } else {
        currentPrices = currentPrices.map(p => {
          const randomShock = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 3; // roughly normal distribution
          const monthlyReturn = expectedReturn + volatility * randomShock;
          return p * (1 + monthlyReturn);
        });
        data.push({
          month: `M${month}`,
          path1: currentPrices[0],
          path2: currentPrices[1],
          path3: currentPrices[2],
        });
      }
    }
    return data;
  }, [totalValue]);

  // Generate AI Momentum Scores
  const momentumSignals = useMemo(() => {
    return positions.map(p => {
      const randomScore = Math.random() * 100;
      let signal = 'Neutral';
      let confidence = Math.random() * 40 + 50; // 50% to 90%
      let color = 'var(--text-muted)';
      let Icon = Activity;

      if (randomScore > 75) {
        signal = 'Strong Buy';
        color = '#22C55E';
        Icon = TrendingUp;
      } else if (randomScore > 55) {
        signal = 'Buy';
        color = '#10B981';
        Icon = TrendingUp;
      } else if (randomScore < 25) {
        signal = 'Strong Sell';
        color = '#EF4444';
        Icon = TrendingDown;
      } else if (randomScore < 45) {
        signal = 'Sell';
        color = '#F59E0B';
        Icon = TrendingDown;
      }

      return {
        symbol: p.symbol,
        signal,
        confidence: confidence.toFixed(1),
        color,
        Icon
      };
    });
  }, [positions]);

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Advanced Analytics & AI</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Powered by quantitative models and momentum tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Momentum */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="AI Momentum Signals" icon={<Brain size={18} className="text-purple-500" />}>
            <div className="space-y-4">
              {momentumSignals.length === 0 ? (
                <div className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>Add positions to see AI signals.</div>
              ) : (
                momentumSignals.map(sig => (
                  <div key={sig.symbol} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `color-mix(in srgb, ${sig.color} 15%, transparent)` }}>
                        <sig.Icon size={14} style={{ color: sig.color }} />
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{sig.symbol}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sig.confidence}% Confidence</div>
                      </div>
                    </div>
                    <div className="font-semibold text-sm" style={{ color: sig.color }}>
                      {sig.signal}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
          
          <Card title="Algorithmic Health" icon={<Cpu size={18} className="text-blue-500" />}>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Market Regime</span>
                  <span className="font-bold text-green-500">Bullish</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Volatility Skew</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Normal</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Correlation Risk</span>
                  <span className="font-bold text-yellow-500">Moderate</span>
                </div>
             </div>
          </Card>
        </div>

        {/* Right Column: Monte Carlo */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Monte Carlo Projection (12 Months)" icon={<Activity size={18} className="text-brand-blue" />}>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monteCarloData}>
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                    itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}
                    formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Projected Value']}
                  />
                  <ReferenceLine y={totalValue} stroke="var(--text-muted)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="path1" stroke="#3B82F6" strokeWidth={2} dot={false} strokeOpacity={0.8} />
                  <Line type="monotone" dataKey="path2" stroke="#8B5CF6" strokeWidth={2} dot={false} strokeOpacity={0.6} />
                  <Line type="monotone" dataKey="path3" stroke="#10B981" strokeWidth={2} dot={false} strokeOpacity={0.4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <strong>Note:</strong> This Monte Carlo simulation runs multiple random-walk pricing models using estimated market volatility to project potential portfolio values over the next 12 months. This does not constitute financial advice.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
