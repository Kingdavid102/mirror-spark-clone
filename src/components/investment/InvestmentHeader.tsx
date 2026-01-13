const InvestmentHeader = () => {
  const navItems = ["Inventory", "Invest", "Stocks", "Portfolio"];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Tesla Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-[0.3em] text-foreground">
            T Ξ S L Λ
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-tesla-blue hover:text-tesla-blue/80 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Account */}
        <button className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
          Account
        </button>
      </div>
    </header>
  );
};

export default InvestmentHeader;
