import { useState } from "react";
import { ChevronRight, ChevronLeft, X, HelpCircle, Globe, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Vehicle images
import modelSImage from "@/assets/model-s-menu.png";
import model3Image from "@/assets/model-3-menu.png";
import modelYImage from "@/assets/model-y-menu.png";
import modelXImage from "@/assets/model-x-menu.png";
import cybertruckImage from "@/assets/cybertruck-menu.png";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const vehicles = [
  { name: "Model S", image: modelSImage, learnLink: "#model-s", orderLink: "#order-s" },
  { name: "Model 3", image: model3Image, learnLink: "#model-3", orderLink: "#order-3" },
  { name: "Model Y", image: modelYImage, learnLink: "#model-y", orderLink: "#order-y" },
  { name: "Model X", image: modelXImage, learnLink: "#model-x", orderLink: "#order-x" },
  { name: "Cybertruck", image: cybertruckImage, learnLink: "#cybertruck", orderLink: "#order-cybertruck" },
];

const vehicleSubLinks = [
  "Full Self-Driving (Supervised)",
  "Current Offers",
  "Demo Drive",
  "Trade-in",
  "Vehicle Safety Report",
  "Pre-Owned",
  "Trip Planner",
  "Features",
  "Help Me Choose",
  "Compare",
  "Safety",
  "Fleet",
  "Semi",
  "Roadster",
  "Robotaxi",
];

const mainMenuItems = [
  { label: "Vehicles", expandable: true },
  { label: "Energy", expandable: true },
  { label: "Charging", expandable: true },
  { label: "Discover", expandable: true },
  { label: "Shop", expandable: false },
  { label: "Support", expandable: false },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMenuItemClick = (label: string, expandable: boolean) => {
    if (expandable) {
      setActiveSubmenu(label);
    } else {
      onClose();
    }
  };

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  const handleAccountClick = () => {
    onClose();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[100] bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        {activeSubmenu ? (
          <>
            <button 
              onClick={handleBackClick}
              className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <span className="text-base font-medium text-foreground">{activeSubmenu}</span>
          </>
        ) : (
          <span className="text-lg font-semibold tracking-[0.3em] text-foreground">
            T E S L A
          </span>
        )}
        <button 
          onClick={onClose}
          className="p-2 -mr-2 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Menu Content */}
      <div className="overflow-y-auto h-[calc(100vh-72px)]">
        {!activeSubmenu ? (
          // Main Menu
          <div className="flex flex-col px-6 py-4">
            {mainMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleMenuItemClick(item.label, item.expandable)}
                className="flex items-center justify-between py-4 text-lg font-medium text-foreground hover:text-muted-foreground transition-colors text-left"
              >
                <span>{item.label}</span>
                {item.expandable && <ChevronRight className="w-5 h-5" />}
              </button>
            ))}
            
            {/* Bottom Links */}
            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <button className="flex items-center gap-3 py-2 text-base text-foreground hover:text-muted-foreground transition-colors">
                <Globe className="w-5 h-5" />
                <div className="text-left">
                  <span className="block font-medium">United States</span>
                  <span className="block text-sm text-muted-foreground">English</span>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto" />
              </button>
              
              <button 
                onClick={handleAccountClick}
                className="flex items-center gap-3 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{user ? "My Account" : "Account"}</span>
              </button>
            </div>
          </div>
        ) : activeSubmenu === "Vehicles" ? (
          // Vehicles Submenu
          <div className="px-4 py-4">
            {/* Vehicle Cards with Images */}
            <div className="space-y-2">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.name}
                  className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-36 h-20 flex-shrink-0">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-semibold text-foreground">{vehicle.name}</span>
                    <div className="flex items-center gap-4">
                      <a 
                        href={vehicle.learnLink}
                        onClick={onClose}
                        className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      >
                        Learn
                      </a>
                      <a 
                        href={vehicle.orderLink}
                        onClick={onClose}
                        className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      >
                        Order
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Inventory Link */}
              <div className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-36 h-20 flex-shrink-0 flex items-center justify-center">
                  <div className="flex -space-x-8">
                    <img 
                      src={model3Image} 
                      alt="Inventory"
                      className="w-16 h-12 object-contain"
                    />
                    <img 
                      src={modelYImage} 
                      alt="Inventory"
                      className="w-16 h-12 object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-foreground">Inventory</span>
                  <div className="flex items-center gap-4">
                    <a 
                      href="#inventory-new"
                      onClick={onClose}
                      className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    >
                      New
                    </a>
                    <a 
                      href="#inventory-preowned"
                      onClick={onClose}
                      className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    >
                      Pre-Owned
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Vehicle Links */}
            <div className="mt-6 pt-4 border-t border-border">
              {vehicleSubLinks.map((link) => (
                <a 
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={onClose}
                  className="block py-3 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ) : (
          // Other Submenus (placeholder)
          <div className="px-6 py-4">
            <p className="text-muted-foreground">Content for {activeSubmenu} coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
