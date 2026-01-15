import { useAuth } from '@/hooks/useAuth';
import AuthenticatedHeader from "./AuthenticatedHeader";
import InvestmentHero from "./InvestmentHero";
import QuickActions from "./QuickActions";
import EnhancedInventory from "./EnhancedInventory";
import LiveStockMarkets from "./LiveStockMarkets";
import UserPortfolio from "./UserPortfolio";
import MarketNews from "./MarketNews";
import PortfolioCTA from "./PortfolioCTA";
import InvestmentFooter from "./InvestmentFooter";

const TeslaInvestmentPlatform = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background">
      <AuthenticatedHeader />
      <InvestmentHero />
      <QuickActions />
      <EnhancedInventory />
      <LiveStockMarkets />
      {user && <UserPortfolio />}
      <MarketNews />
      {!user && <PortfolioCTA />}
      <InvestmentFooter />
    </div>
  );
};

export default TeslaInvestmentPlatform;
