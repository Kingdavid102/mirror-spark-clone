const InvestorRelationsHeader = () => {
  const navLinks = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Impact", href: "#impact" },
    { label: "SEC Filings", href: "#sec" },
    { label: "Corporate Governance", href: "#governance" },
    { label: "Press Releases", href: "#press" },
  ];

  return (
    <header className="bg-foreground py-4">
      <nav className="flex items-center justify-between px-6 max-w-[1800px] mx-auto">
        {/* Tesla Logo + IR Label */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-[0.3em] text-background">
            T E S L A
          </span>
          <span className="text-sm font-medium text-red-500">
            Investor Relations
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-background/80 hover:text-background transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Account Button */}
        <button className="text-sm font-medium text-background/80 hover:text-background transition-colors">
          Account
        </button>
      </nav>
    </header>
  );
};

export default InvestorRelationsHeader;
