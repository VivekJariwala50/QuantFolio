import { create } from 'zustand';
import { fetchStockPrice } from '../services/marketData';
import type { StockPrice } from '../types';

interface MarketDataState {
  prices: Record<string, StockPrice>;
  loading: boolean;
  error: string | null;
  fetchPrices: (symbols: string[]) => Promise<void>;
}

export const useMarketDataStore = create<MarketDataState>((set, get) => ({
  prices: {},
  loading: false,
  error: null,

  fetchPrices: async (symbols: string[]) => {
    if (!symbols.length) return;
    
    set({ loading: true, error: null });
    try {
      const currentPrices = { ...get().prices };
      const promises = symbols.map(async (symbol) => {
        try {
          const price = await fetchStockPrice(symbol);
          currentPrices[symbol] = price;
        } catch (err) {
          console.error(`Failed to fetch price for ${symbol}`);
        }
      });

      await Promise.allSettled(promises);
      
      set({ prices: currentPrices, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
