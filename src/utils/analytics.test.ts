import { describe, it, expect } from 'vitest';
import { 
  calculatePortfolioValue, 
  calculateSharpeRatio, 
  calculateVolatility, 
  calculateMaxDrawdown,
  getRebalancingSuggestions
} from './analytics';
import type { Position } from '../types';

describe('Analytics Utils', () => {
  it('calculates portfolio value correctly', () => {
    const positions: Position[] = [
      { id: '1', symbol: 'AAPL', shares_owned: 10, cost_per_share: 150 },
      { id: '2', symbol: 'MSFT', shares_owned: 5, cost_per_share: 300 }
    ];
    const prices = {
      'AAPL': { symbol: 'AAPL', price: 160, change: 10, percentChange: 6.6, timestamp: 0 },
      'MSFT': { symbol: 'MSFT', price: 310, change: 10, percentChange: 3.3, timestamp: 0 }
    };

    const { totalValue, totalCost, unrealizedGain } = calculatePortfolioValue(positions, prices);
    expect(totalValue).toBe(1600 + 1550); // 3150
    expect(totalCost).toBe(1500 + 1500); // 3000
    expect(unrealizedGain).toBe(150);
  });

  it('calculates Sharpe Ratio correctly', () => {
    const returns = [0.01, 0.02, -0.01, 0.03];
    const sharpe = calculateSharpeRatio(returns, 0.01);
    expect(sharpe).toBeGreaterThan(0);
  });

  it('calculates Volatility correctly', () => {
    const returns = [0.01, 0.02, -0.01, 0.03];
    const vol = calculateVolatility(returns);
    expect(vol).toBeGreaterThan(0);
  });

  it('calculates Max Drawdown correctly', () => {
    const values = [100, 110, 90, 120, 80, 150];
    const md = calculateMaxDrawdown(values);
    // Peak 120 -> trough 80 => (120-80)/120 = 40 / 120 = 33.3%
    expect(md).toBeCloseTo(33.33, 1);
  });

  it('suggests rebalancing for over-concentrated positions', () => {
    const positions: Position[] = [
      { id: '1', symbol: 'AAPL', shares_owned: 100, cost_per_share: 150 }, // 15000 value
      { id: '2', symbol: 'MSFT', shares_owned: 10, cost_per_share: 300 }  // 3000 value
    ];
    const prices = {
      'AAPL': { symbol: 'AAPL', price: 150, change: 0, percentChange: 0, timestamp: 0 },
      'MSFT': { symbol: 'MSFT', price: 300, change: 0, percentChange: 0, timestamp: 0 }
    };
    
    // Total value = 18000. AAPL = 15000/18000 = 83% > 25%
    const suggestions = getRebalancingSuggestions(positions, prices);
    expect(suggestions.length).toBe(1);
    expect(suggestions[0]).toContain('AAPL');
  });
});
