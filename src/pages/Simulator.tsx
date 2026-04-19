import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Calculator, BarChart2 } from 'lucide-react';
import { Card } from '../components/ui/Card';

/** Format large dollar values with K / M / B / T suffixes to prevent overflow. */
const formatCurrency = (value: number): { short: string; full: string } => {
  const full = '$' + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const abs = Math.abs(value);
  if (abs >= 1e15) return { short: `$${(value / 1e15).toFixed(2)}Q`,  full }; // Quadrillion
  if (abs >= 1e12) return { short: `$${(value / 1e12).toFixed(2)}T`,  full }; // Trillion
  if (abs >= 1e9)  return { short: `$${(value / 1e9).toFixed(2)}B`,   full }; // Billion
  if (abs >= 1e6)  return { short: `$${(value / 1e6).toFixed(2)}M`,   full }; // Million
  if (abs >= 1e3)  return { short: `$${(value / 1e3).toFixed(2)}K`,   full }; // Thousand
  return { short: full, full };
};

export const Simulator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(8);

  const calculateProjection = () => {
    let balance = initialInvestment;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    let totalContributions = initialInvestment;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributions += monthlyContribution;
    }
    return { finalBalance: balance, totalContributions, totalInterest: balance - totalContributions };
  };

  const { finalBalance, totalContributions, totalInterest } = calculateProjection();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '10px 12px 10px 38px',
    fontSize: '14px',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
    marginBottom: '7px',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#3B82F6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--border-color)';
    e.target.style.boxShadow = 'none';
  };

  const fields = [
    {
      label: 'Initial Investment ($)',
      icon: DollarSign,
      value: initialInvestment,
      onChange: setInitialInvestment,
      placeholder: '10000',
    },
    {
      label: 'Monthly Contribution ($)',
      icon: DollarSign,
      value: monthlyContribution,
      onChange: setMonthlyContribution,
      placeholder: '500',
    },
    {
      label: 'Time Horizon (Years)',
      icon: Calendar,
      value: years,
      onChange: setYears,
      placeholder: '10',
    },
    {
      label: 'Expected Annual Return (%)',
      icon: TrendingUp,
      value: expectedReturn,
      onChange: setExpectedReturn,
      placeholder: '8',
    },
  ];

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Calculator size={20} className="text-brand-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Investment Simulator</h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Project your portfolio growth with compound interest modeling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT: Parameters */}
        <div className="xl:col-span-5">
          <Card title="Simulation Parameters">
            <div className="space-y-5">
              {fields.map(({ label, icon: Icon, value, onChange, placeholder }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <div className="relative">
                    <Icon
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: Results */}
        <div className="xl:col-span-7 space-y-5">
          <Card title="Projection Results" icon={<BarChart2 size={16} />}>
            {/* Big number */}
            <div className="text-center py-6" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px', overflow: 'hidden', minWidth: 0 }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Projected Final Balance
              </div>
              <div
                className="font-bold font-mono tracking-tight"
                style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 6vw, 3rem)', lineHeight: 1.2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                title={formatCurrency(finalBalance).full}
              >
                {formatCurrency(finalBalance).short}
              </div>
              {/* Show full number only when it was abbreviated */}
              {formatCurrency(finalBalance).short !== formatCurrency(finalBalance).full && (
                <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {formatCurrency(finalBalance).full}
                </div>
              )}
              <div className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                After {years} years at {expectedReturn}% annual return
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Total Contributions
                </div>
                <div
                  className="font-bold font-mono"
                  style={{ color: 'var(--text-primary)', fontSize: 'clamp(1rem, 4vw, 1.5rem)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  title={formatCurrency(totalContributions).full}
                >
                  {formatCurrency(totalContributions).short}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {((totalContributions / finalBalance) * 100).toFixed(0)}% of final value
                </div>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#22C55E' }}>
                  Investment Growth
                </div>
                <div
                  className="font-bold font-mono"
                  style={{ color: '#22C55E', fontSize: 'clamp(1rem, 4vw, 1.5rem)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  title={'+' + formatCurrency(totalInterest).full}
                >
                  +{formatCurrency(totalInterest).short}
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(34,197,94,0.7)' }}>
                  {((totalInterest / totalContributions) * 100).toFixed(0)}% growth on contributions
                </div>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <div
            className="rounded-r-xl p-4 text-xs leading-relaxed"
            style={{
              borderLeft: '3px solid #3B82F6',
              background: 'rgba(59,130,246,0.06)',
              color: 'var(--text-muted)',
            }}
          >
            <strong style={{ color: '#3B82F6' }}>Disclaimer:</strong> This simulator assumes a constant annual rate of return compounded monthly. Real market returns vary. This does not account for inflation, taxes, or investment fees.
          </div>
        </div>
      </div>
    </div>
  );
};
