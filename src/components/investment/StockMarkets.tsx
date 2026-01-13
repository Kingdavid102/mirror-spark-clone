const StockMarkets = () => {
  const featured = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: "$229.35", change: "+2.91 (+1.27%)", positive: true },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: "$522.04", change: "-10.91 (-2.09%)", positive: false },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: "$201.42", change: "-3.54 (-1.76%)", positive: false },
  ];

  const topGainers = [
    { symbol: "TMO", change: "+5.00%", color: "bg-blue-600" },
    { symbol: "NVDA", change: "+4.94%", color: "bg-green-600" },
    { symbol: "PYPL", change: "+4.86%", color: "bg-blue-500" },
    { symbol: "CVS", change: "+4.83%", color: "bg-red-500" },
    { symbol: "VZ", change: "+4.78%", color: "bg-red-600" },
  ];

  const topLosers = [
    { symbol: "HON", change: "-4.93%", color: "bg-red-700" },
    { symbol: "NEE", change: "-4.91%", color: "bg-green-500" },
    { symbol: "GS", change: "-4.90%", color: "bg-yellow-500" },
    { symbol: "HD", change: "-4.88%", color: "bg-orange-500" },
    { symbol: "DIS", change: "-4.66%", color: "bg-blue-700" },
  ];

  const mostActive = [
    { symbol: "PYPL", volume: "Vol 98.3M", color: "bg-blue-500" },
    { symbol: "FTNT", volume: "Vol 97.2M", color: "bg-red-600" },
    { symbol: "WFC", volume: "Vol 95.3M", color: "bg-yellow-600" },
    { symbol: "ABNB", volume: "Vol 93.8M", color: "bg-pink-500" },
    { symbol: "JPM", volume: "Vol 93.7M", color: "bg-gray-600" },
  ];

  return (
    <section className="bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Stock Markets</h2>
            <p className="text-gray-400">
              Featured picks, top gainers, losers, and most active.
            </p>
          </div>
          <a href="#" className="text-tesla-blue hover:underline font-medium">
            Open markets
          </a>
        </div>

        {/* Stock Cards Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Featured */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Featured</h3>
              <a href="#" className="text-xs text-gray-400 hover:text-white">
                See all
              </a>
            </div>
            <div className="space-y-4">
              {featured.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-xs font-medium">
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
                    <p className="font-medium text-sm">{stock.price}</p>
                    <p className={`text-xs ${stock.positive ? "text-green-400" : "text-red-400"}`}>
                      {stock.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold mb-4">Top Gainers</h3>
            <div className="space-y-3">
              {topGainers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${stock.color} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <p className="font-medium">{stock.symbol}</p>
                  </div>
                  <p className="text-green-400 text-sm">{stock.change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold mb-4">Top Losers</h3>
            <div className="space-y-3">
              {topLosers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${stock.color} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <p className="font-medium">{stock.symbol}</p>
                  </div>
                  <p className="text-red-400 text-sm">{stock.change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold mb-4">Most Active</h3>
            <div className="space-y-3">
              {mostActive.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${stock.color} rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <p className="font-medium">{stock.symbol}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{stock.volume}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StockMarkets;
