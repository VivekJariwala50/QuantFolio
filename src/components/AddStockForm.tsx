import React, { useState } from 'react';
import { Plus, PlusCircle, Search } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from './ui/Card';
import toast from 'react-hot-toast';

export const AddStockForm: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const { addPosition, loading } = usePortfolioStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!symbol || !shares || !price) {
      toast.error('Please fill out all fields');
      return;
    }
    try {
      await addPosition({
        user_id: user.id,
        symbol: symbol.toUpperCase().trim(),
        shares_owned: parseFloat(shares),
        cost_per_share: parseFloat(price),
      });
      toast.success(`${symbol.toUpperCase()} added to portfolio`);
      setSymbol('');
      setShares('');
      setPrice('');
    } catch (error: any) {
      toast.error('Failed to add: ' + error.message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '9px 12px',
    fontSize: '13px',
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
    marginBottom: '6px',
  };

  return (
    <Card title="Add Position" icon={<PlusCircle size={16} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={labelStyle}>Ticker Symbol</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              style={{ ...inputStyle, paddingLeft: '32px', textTransform: 'uppercase' }}
              placeholder="AAPL, TSLA, GOOG..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Shares</label>
            <input
              type="number"
              min="0"
              step="any"
              style={inputStyle}
              placeholder="100"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Avg Cost ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              style={inputStyle}
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          <Plus size={16} />
          {loading ? 'Adding...' : 'Add to Portfolio'}
        </button>
      </form>
    </Card>
  );
};