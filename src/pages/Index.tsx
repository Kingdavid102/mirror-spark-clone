import TeslaHeader from "@/components/TeslaHeader";
import HeroSection from "@/components/HeroSection";
import VehicleCards from "@/components/VehicleCards";
import EnergyCarousel from "@/components/EnergyCarousel";
import DiscoverSection from "@/components/DiscoverSection";
import CorporateGovernance from "@/components/CorporateGovernance";
import QuestionBar from "@/components/QuestionBar";
import TeslaFooter from "@/components/TeslaFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TeslaHeader />
      
      {/* Main Hero with Vehicle Carousel */}
      <HeroSection />
      
      {/* Vehicle Cards */}
      <VehicleCards />
      
      {/* Energy Products Carousel */}
      <EnergyCarousel />
      
      {/* Discover Section - FSD and Features */}
      <DiscoverSection />
      
      {/* Corporate Governance Section */}
      <CorporateGovernance />
      
      {/* Footer */}
      <TeslaFooter />
      
      {/* Fixed Question Bar */}
      <QuestionBar />
    </div>
  );
};

export default Index;
