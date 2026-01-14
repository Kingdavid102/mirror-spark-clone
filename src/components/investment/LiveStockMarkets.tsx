import { useStockPrices } from '@/hooks/useStockPrices';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const formatPrice = (price: number) => `$${price.toFixed(2)}`;
const formatChange = (change: number, percent: number) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
};
const formatVolume = (volume: number) => {
  if (volume >= 1000000) return `Vol ${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `Vol ${(volume / 1000).toFixed(1)}K`;
  return `Vol ${volume}`;
};

const getSymbolColor = (symbol: string) => {
  const colors: Record<string, string> = {
    TSLA: 'bg-red-600',
    AAPL: 'bg-gray-700',
    MSFT: 'bg-blue-600',
    GOOGL: 'bg-yellow-500',
    NVDA: 'bg-green-600',
    AMZN: 'bg-orange-500',
    META: 'bg-blue-500',
    JPM: 'bg-gray-600',
    TMO: 'bg-blue-600',
    PYPL: 'bg-blue-500',
    CVS: 'bg-red-500',
    VZ: 'bg-red-600',
    HON: 'bg-red-700',
    NEE: 'bg-green-500',
    GS: 'bg-yellow-500',
    HD: 'bg-orange-500',
    DIS: 'bg-blue-700',
    FTNT: 'bg-red-600',
    WFC: 'bg-yellow-600',
    ABNB: 'bg-pink-500',
  };
  return colors[symbol] || 'bg-gray-500';
};

const LiveStockMarkets = () => {
  const { 
    lastUpdated, 
    getTopGainers, 
    getTopLosers, 
    getMostActive, 
    getFeatured,
    refresh 
  } = useStockPrices(3000);

  const featured = getFeatured(['TSLA', 'AAPL', 'MSFT', 'GOOGL']);
  const topGainers = getTopGainers(5);
  const topLosers = getTopLosers(5);
  const mostActive = getMostActive(5);

  return (
    <section className="bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">Stock Markets</h2>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
            <p className="text-gray-400">
              Real-time prices updating every 3 seconds. Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={refresh}
              className="flex items-center gap-2 text-tesla-blue hover:text-tesla-blue/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a href="#" className="text-tesla-blue hover:underline font-medium">
              Open markets
            </a>
          </div>
        </div>

        {/* Stock Cards Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Featured */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-tesla-blue" />
                <h3 className="font-semibold">Featured</h3>
              </div>
              <a href="#" className="text-xs text-gray-400 hover:text-white">
                See all
              </a>
            </div>
            <div className="space-y-4">
              {featured.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getSymbolColor(stock.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {stock.symbol} • {stock.name}
                      </p>
                      <p className="text-xs text-gray-500">{stock.sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm tabular-nums">{formatPrice(stock.price)}</p>
                    <p className={`text-xs tabular-nums ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatChange(stock.change, stock.changePercent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {topGainers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getSymbolColor(stock.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-xs text-gray-500 tabular-nums">{formatPrice(stock.price)}</p>
                    </div>
                  </div>
                  <p className="text-green-400 text-sm font-medium tabular-nums">+{stock.changePercent.toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <h3 className="font-semibold">Top Losers</h3>
            </div>
            <div className="space-y-3">
              {topLosers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getSymbolColor(stock.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-xs text-gray-500 tabular-nums">{formatPrice(stock.price)}</p>
                    </div>
                  </div>
                  <p className="text-red-400 text-sm font-medium tabular-nums">{stock.changePercent.toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-tesla-blue" />
              <h3 className="font-semibold">Most Active</h3>
            </div>
            <div className="space-y-3">
              {mostActive.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getSymbolColor(stock.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className={`text-xs tabular-nums ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm tabular-nums">{formatVolume(stock.volume)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStockMarkets;
