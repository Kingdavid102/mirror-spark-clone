import { useState, useEffect, useCallback } from 'react';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
}

// Simulated real-time stock data with realistic price movements
const baseStocks: Omit<StockData, 'price' | 'change' | 'changePercent' | 'previousClose'>[] = [
  { symbol: "TSLA", name: "Tesla, Inc.", sector: "Automotive", volume: 125000000 },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", volume: 87000000 },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", volume: 45000000 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", volume: 32000000 },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", volume: 98000000 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", sector: "E-Commerce", volume: 56000000 },
  { symbol: "META", name: "Meta Platforms, Inc.", sector: "Technology", volume: 42000000 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial", volume: 28000000 },
  { symbol: "V", name: "Visa Inc.", sector: "Financial", volume: 18000000 },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Retail", volume: 22000000 },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Healthcare", volume: 15000000 },
  { symbol: "PYPL", name: "PayPal Holdings, Inc.", sector: "Financial", volume: 35000000 },
  { symbol: "CVS", name: "CVS Health Corporation", sector: "Healthcare", volume: 19000000 },
  { symbol: "VZ", name: "Verizon Communications", sector: "Telecom", volume: 24000000 },
  { symbol: "HON", name: "Honeywell International", sector: "Industrial", volume: 12000000 },
  { symbol: "NEE", name: "NextEra Energy, Inc.", sector: "Utilities", volume: 11000000 },
  { symbol: "GS", name: "The Goldman Sachs Group", sector: "Financial", volume: 9000000 },
  { symbol: "HD", name: "The Home Depot, Inc.", sector: "Retail", volume: 14000000 },
  { symbol: "DIS", name: "The Walt Disney Company", sector: "Entertainment", volume: 21000000 },
  { symbol: "FTNT", name: "Fortinet, Inc.", sector: "Technology", volume: 8000000 },
  { symbol: "WFC", name: "Wells Fargo & Company", sector: "Financial", volume: 26000000 },
  { symbol: "ABNB", name: "Airbnb, Inc.", sector: "Travel", volume: 17000000 },
];

const basePrices: Record<string, number> = {
  TSLA: 428.50,
  AAPL: 229.35,
  MSFT: 522.04,
  GOOGL: 201.42,
  NVDA: 875.25,
  AMZN: 225.80,
  META: 612.45,
  JPM: 245.30,
  V: 318.75,
  WMT: 175.20,
  TMO: 585.40,
  PYPL: 72.85,
  CVS: 58.25,
  VZ: 42.30,
  HON: 215.60,
  NEE: 78.45,
  GS: 605.20,
  HD: 425.80,
  DIS: 118.95,
  FTNT: 98.75,
  WFC: 78.40,
  ABNB: 156.80,
};

const generateRandomChange = (basePrice: number) => {
  const maxChange = basePrice * 0.05; // Max 5% change
  const change = (Math.random() - 0.5) * 2 * maxChange;
  return change;
};

export const useStockPrices = (refreshInterval: number = 3000) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updatePrices = useCallback(() => {
    const updatedStocks = baseStocks.map(stock => {
      const basePrice = basePrices[stock.symbol];
      const change = generateRandomChange(basePrice);
      const newPrice = basePrice + change;
      const changePercent = (change / basePrice) * 100;
      
      // Update base price for next iteration (simulate real market movement)
      basePrices[stock.symbol] = newPrice;
      
      return {
        ...stock,
        price: newPrice,
        change,
        changePercent,
        previousClose: basePrice,
        volume: stock.volume + Math.floor(Math.random() * 100000),
      };
    });
    
    setStocks(updatedStocks);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    updatePrices(); // Initial load
    
    const interval = setInterval(updatePrices, refreshInterval);
    return () => clearInterval(interval);
  }, [updatePrices, refreshInterval]);

  const getTopGainers = (count: number = 5) => {
    return [...stocks]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, count);
  };

  const getTopLosers = (count: number = 5) => {
    return [...stocks]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, count);
  };

  const getMostActive = (count: number = 5) => {
    return [...stocks]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, count);
  };

  const getFeatured = (symbols: string[] = ['TSLA', 'AAPL', 'MSFT', 'GOOGL']) => {
    return stocks.filter(stock => symbols.includes(stock.symbol));
  };

  const getStock = (symbol: string) => {
    return stocks.find(stock => stock.symbol === symbol);
  };

  return {
    stocks,
    lastUpdated,
    getTopGainers,
    getTopLosers,
    getMostActive,
    getFeatured,
    getStock,
    refresh: updatePrices,
  };
};
