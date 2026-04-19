export interface Position {
  id: string;
  user_id?: string;
  symbol: string;
  shares_owned: number;
  cost_per_share: number;
  created_at?: string;
  updated_at?: string;
}

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  timestamp: number;
}

export interface PortfolioSnapshot {
  id: string;
  user_id: string;
  total_value: number;
  snapshot_date: string;
}

export interface StockQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // timestamp
}