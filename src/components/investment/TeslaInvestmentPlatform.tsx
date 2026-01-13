import InvestmentHeader from "./InvestmentHeader";
import InvestmentHero from "./InvestmentHero";
import QuickActions from "./QuickActions";
import AvailableInventory from "./AvailableInventory";
import StockMarkets from "./StockMarkets";
import MarketNews from "./MarketNews";
import PortfolioCTA from "./PortfolioCTA";
import InvestmentFooter from "./InvestmentFooter";

const TeslaInvestmentPlatform = () => {
  return (
    <div className="bg-background">
      <InvestmentHeader />
      <InvestmentHero />
      <QuickActions />
      <AvailableInventory />
      <StockMarkets />
      <MarketNews />
      <PortfolioCTA />
      <InvestmentFooter />
    </div>
  );
};

export default TeslaInvestmentPlatform;
