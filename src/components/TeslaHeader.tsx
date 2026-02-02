import { useState } from "react";
import { Menu, X, HelpCircle, Globe, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Vehicles", href: "#vehicles" },
  { label: "Energy", href: "#energy" },
  { label: "Charging", href: "#charging" },
  { label: "Discover", href: "#discover" },
  { label: "Shop", href: "#shop" },
];

const TeslaHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-[1800px] mx-auto">
          {/* Tesla Logo */}
          <a href="/" className="flex-shrink-0">
            <span className="text-lg font-semibold tracking-[0.3em] text-foreground">
              T E S L A
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="tesla-nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <HelpCircle className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Globe className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={handleAccountClick}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
};

export default TeslaHeader;
