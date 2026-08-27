export type MarketCategory = 'us_stocks' | 'world_stocks' | 'crypto' | 'futures' | 'forex' | 'bonds';

export type MarketRegion = 'Everywhere' | 'United States' | 'Europe' | 'Asia-Pacific' | 'Americas' | 'Global Emerging';

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

export type ChartType = 'line' | 'candlestick';

export interface PricePoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  badge?: string;
  category: MarketCategory;
  region?: string;
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  high52w?: number;
  low52w?: number;
  dayHigh?: number;
  dayLow?: number;
  sparkline: number[];
  historicalData: Record<Timeframe, PricePoint[]>;
  rsi?: number;
  macd?: string;
  technicalRating?: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  currency?: string;
  description?: string;
}

export interface MarketIndex {
  id: string;
  badge: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  historicalData: Record<Timeframe, PricePoint[]>;
  high52w: number;
  low52w: number;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  leadingStock: string;
  leadChange: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered?: boolean;
}
