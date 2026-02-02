import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Gauge, Timer, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeslaHeader from "@/components/TeslaHeader";
import TeslaFooter from "@/components/TeslaFooter";

// Import vehicle images
import modelSImage from "@/assets/model-s-menu.png";
import model3Image from "@/assets/model-3-menu.png";
import modelYImage from "@/assets/model-y-menu.png";
import modelXImage from "@/assets/model-x-menu.png";
import cybertruckImage from "@/assets/cybertruck-menu.png";

interface VehicleData {
  name: string;
  tagline: string;
  image: string;
  range: string;
  acceleration: string;
  topSpeed: string;
  price: string;
  description: string;
  features: string[];
}

const vehicleData: Record<string, VehicleData> = {
  "model-s": {
    name: "Model S",
    tagline: "Built for Speed & Endurance",
    image: modelSImage,
    range: "405 mi",
    acceleration: "1.99s",
    topSpeed: "200 mph",
    price: "$74,990",
    description: "Model S Plaid has the quickest acceleration of any vehicle in production. Updated battery architecture enables both greater range and faster charging speeds.",
    features: [
      "Tri Motor All-Wheel Drive",
      "1,020 horsepower",
      "Carbon fiber spoiler",
      "17\" Cinematic Display",
      "Wireless gaming capability",
      "Premium audio with 22 speakers",
    ],
  },
  "model-3": {
    name: "Model 3",
    tagline: "The Standard for Electric Vehicles",
    image: model3Image,
    range: "333 mi",
    acceleration: "3.1s",
    topSpeed: "162 mph",
    price: "$38,990",
    description: "Model 3 is designed for electric-powered performance, with quick acceleration, long range and fast charging.",
    features: [
      "Dual Motor All-Wheel Drive",
      "15\" touchscreen display",
      "Autopilot included",
      "360° cameras",
      "Premium connectivity",
      "Over-the-air updates",
    ],
  },
  "model-y": {
    name: "Model Y",
    tagline: "Versatility for Any Adventure",
    image: modelYImage,
    range: "330 mi",
    acceleration: "3.5s",
    topSpeed: "155 mph",
    price: "$44,990",
    description: "Model Y is a fully electric, mid-size SUV with unparalleled protection and versatile cargo space.",
    features: [
      "Dual Motor All-Wheel Drive",
      "76 cu ft cargo space",
      "Third row seating option",
      "Glass roof with UV protection",
      "Tow up to 3,500 lbs",
      "HEPA air filtration",
    ],
  },
  "model-x": {
    name: "Model X",
    tagline: "The Most Capable SUV",
    image: modelXImage,
    range: "348 mi",
    acceleration: "2.5s",
    topSpeed: "163 mph",
    price: "$79,990",
    description: "Model X has the most storage and towing capacity of any electric SUV, with Falcon Wing doors for easy access to the second and third rows.",
    features: [
      "Tri Motor All-Wheel Drive",
      "Falcon Wing doors",
      "Seating for up to 7",
      "Bioweapon Defense Mode",
      "17\" Cinematic Display",
      "5,000 lb towing capacity",
    ],
  },
  "cybertruck": {
    name: "Cybertruck",
    tagline: "Built Tough. Built Different.",
    image: cybertruckImage,
    range: "340 mi",
    acceleration: "2.6s",
    topSpeed: "130 mph",
    price: "$79,990",
    description: "Cybertruck is built with an exterior shell made for ultimate durability and passenger protection. Ultra-hard stainless steel exoskeleton.",
    features: [
      "Tri Motor All-Wheel Drive",
      "Armor Glass windows",
      "100 cu ft storage",
      "Tesla Vision technology",
      "14,000 lb towing",
      "Vault storage bed",
    ],
  },
};

const VehicleDetail = () => {
  const { model } = useParams<{ model: string }>();
  const navigate = useNavigate();
  
  const vehicle = model ? vehicleData[model] : null;

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TeslaHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-secondary to-background">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-6 p-2 rounded-full hover:bg-secondary transition-colors z-10"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          
          <div className="container mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
              {vehicle.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {vehicle.tagline}
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <img 
                src={vehicle.image} 
                alt={vehicle.name}
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{vehicle.range}</div>
                <div className="text-sm text-muted-foreground">Range (EPA est.)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{vehicle.acceleration}</div>
                <div className="text-sm text-muted-foreground">0-60 mph</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{vehicle.topSpeed}</div>
                <div className="text-sm text-muted-foreground">Top Speed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed text-center">
              {vehicle.description}
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicle.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {index % 4 === 0 && <Zap className="w-5 h-5 text-primary" />}
                    {index % 4 === 1 && <Gauge className="w-5 h-5 text-primary" />}
                    {index % 4 === 2 && <Timer className="w-5 h-5 text-primary" />}
                    {index % 4 === 3 && <Shield className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Starting at {vehicle.price}
            </div>
            <p className="text-muted-foreground mb-8">After Federal Tax Credit</p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                Order Now
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8"
              >
                Schedule Test Drive
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <TeslaFooter />
    </div>
  );
};

export default VehicleDetail;
