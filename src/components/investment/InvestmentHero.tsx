import { TrendingUp, BarChart3, Car } from "lucide-react";

const InvestmentHero = () => {
  const quickActions = [
    { label: "Live Stocks", value: "Realtime" },
    { label: "Wallet", value: "Crypto" },
    { label: "EV Inventory", value: "Premium" },
  ];

  const featureCards = [
    {
      category: "Investments",
      title: "Automated",
      description: "Flexible plans, recurring contributions.",
    },
    {
      category: "Stocks",
      title: "Realtime",
      description: "Quotes, news, and watchlists.",
    },
    {
      category: "Wallet",
      title: "Crypto",
      description: "Deposit and withdraw easily.",
    },
    {
      category: "Marketplace",
      title: "Tesla",
      description: "Curated EV selection.",
    },
  ];

  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-light mb-6">
              <span className="italic">Invest.</span>{" "}
              <span className="italic">Trade.</span>{" "}
              <span className="italic">Drive.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
              All-in-one platform for crypto wallet funding, automated
              investments, live stocks, and premium EV inventory.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition-colors">
                <TrendingUp className="w-4 h-4" />
                Start Investing
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-600 rounded-md font-medium hover:bg-white/5 transition-colors">
                <BarChart3 className="w-4 h-4" />
                Explore Stocks
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-600 rounded-md font-medium hover:bg-white/5 transition-colors">
                <Car className="w-4 h-4" />
                View Inventory
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className="flex-1 px-4 py-3 border border-gray-700 rounded-lg bg-white/5"
                >
                  <p className="text-xs text-gray-500">{action.label}</p>
                  <p className="text-lg font-medium">{action.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="p-5 bg-white/5 border border-gray-800 rounded-xl hover:bg-white/10 transition-colors"
              >
                <p className="text-xs text-gray-500 mb-1">{card.category}</p>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentHero;
