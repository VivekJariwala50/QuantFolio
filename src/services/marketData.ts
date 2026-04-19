import type { StockPrice, StockQuoteResponse } from '../types';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const CACHE_KEY = 'stock_prices_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  [symbol: string]: StockPrice;
}

const getCache = (): CachedData => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setCache = (data: CachedData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const fetchStockPrice = async (symbol: string): Promise<StockPrice> => {
  const cache = getCache();
  const cachedStock = cache[symbol];

  // Check if we have valid cache
  if (cachedStock && Date.now() - cachedStock.timestamp < CACHE_TTL) {
    return cachedStock;
  }

  // Fetch new data
  try {
    if (!FINNHUB_API_KEY) {
      console.warn('Missing Finnhub API Key, returning dummy data');
      return {
        symbol,
        price: 150 + Math.random() * 10,
        change: 0,
        percentChange: 0,
        timestamp: Date.now()
      };
    }

    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    if (!res.ok) {
      // If rate limited, fallback to cache even if expired
      if (res.status === 429 && cachedStock) return cachedStock;
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }

    const data: StockQuoteResponse = await res.json();
    
    const stockPrice: StockPrice = {
      symbol,
      price: data.c,
      change: data.d,
      percentChange: data.dp,
      timestamp: Date.now()
    };

    // Update cache
    const newCache = { ...getCache(), [symbol]: stockPrice };
    setCache(newCache);

    return stockPrice;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}`, error);
    // Return cached data if available on network error
    if (cachedStock) return cachedStock;
    throw error;
  }
};
