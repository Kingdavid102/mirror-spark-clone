import { Wallet, TrendingUp, BarChart3, Clock } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Wallet,
      category: "Wallet",
      title: "Deposit or withdraw",
    },
    {
      icon: TrendingUp,
      category: "Investments",
      title: "Create a plan",
    },
    {
      icon: BarChart3,
      category: "Stocks",
      title: "Market overview",
    },
    {
      icon: Clock,
      category: "Portfolio",
      title: "Track performance",
    },
  ];

  return (
    <section className="bg-background py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.title}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="text-left">
                <p className="text-xs text-muted-foreground">{action.category}</p>
                <p className="text-sm font-medium text-foreground">{action.title}</p>
              </div>
              <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
