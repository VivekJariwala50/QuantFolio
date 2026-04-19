import type { Position, StockPrice } from '../types';

// Mock sector mapping for demonstration
export const SECTOR_MAP: Record<string, string> = {
  'AAPL': 'Technology',
  'MSFT': 'Technology',
  'GOOGL': 'Technology',
  'META': 'Technology',
  'TSLA': 'Consumer Discretionary',
  'AMZN': 'Consumer Discretionary',
  'BRK.B': 'Financials',
  'JPM': 'Financials',
  'JNJ': 'Healthcare',
  'UNH': 'Healthcare',
  'XOM': 'Energy',
  'CVX': 'Energy',
};

export const calculatePortfolioValue = (positions: Position[], prices: Record<string, StockPrice>) => {
  let totalValue = 0;
  let totalCost = 0;

  positions.forEach(pos => {
    const currentPrice = prices[pos.symbol]?.price || pos.cost_per_share;
    totalValue += currentPrice * pos.shares_owned;
    totalCost += pos.cost_per_share * pos.shares_owned;
  });

  const unrealizedGain = totalValue - totalCost;
  const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;

  return { totalValue, totalCost, unrealizedGain, unrealizedGainPercent };
};

export const calculateSharpeRatio = (returns: number[], riskFreeRate = 0.04) => {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate) / stdDev;
};

export const calculateVolatility = (returns: number[]) => {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility assumption
};

export const calculateMaxDrawdown = (values: number[]) => {
  if (values.length === 0) return 0;
  let maxDrawdown = 0;
  let peak = values[0];
  
  for (const value of values) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  return maxDrawdown * 100;
};

export const getRebalancingSuggestions = (positions: Position[], prices: Record<string, StockPrice>): string[] => {
  const suggestions: string[] = [];
  const { totalValue } = calculatePortfolioValue(positions, prices);
  
  if (totalValue === 0) return suggestions;

  const sectorExposure: Record<string, number> = {};

  positions.forEach(pos => {
    const currentPrice = prices[pos.symbol]?.price || pos.cost_per_share;
    const value = pos.shares_owned * currentPrice;
    const percentage = value / totalValue;
    
    // Single stock concentration risk
    if (percentage > 0.25) {
      suggestions.push(`${pos.symbol} makes up ${(percentage * 100).toFixed(1)}% of your portfolio. Consider rebalancing to reduce single-stock risk (target < 25%).`);
    }

    // Sector concentration risk
    const sector = SECTOR_MAP[pos.symbol] || 'Other';
    sectorExposure[sector] = (sectorExposure[sector] || 0) + percentage;
  });

  // Check sector limits
  Object.entries(sectorExposure).forEach(([sector, exposure]) => {
    if (exposure > 0.40 && sector !== 'Other') {
      suggestions.push(`High exposure to ${sector} sector (${(exposure * 100).toFixed(1)}%). Consider diversifying into other sectors to mitigate industry-specific risks.`);
    }
  });

  return suggestions;
};
