import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import solarPanels from "@/assets/solar-panels.jpg";
import powerwall from "@/assets/powerwall.jpg";
import megapack from "@/assets/megapack.jpg";
import solarRoof from "@/assets/solar-roof.jpg";

interface EnergyProduct {
  title: string;
  subtitle: string;
  image: string;
  primaryBtn: string;
  secondaryBtn?: string;
}

const products: EnergyProduct[] = [
  {
    title: "Solar Panels",
    subtitle: "Power Your Home and Reduce Your Electricity Bill",
    image: solarPanels,
    primaryBtn: "Order Now",
    secondaryBtn: "Learn More",
  },
  {
    title: "Powerwall",
    subtitle: "Keep Your Lights On During Outages",
    image: powerwall,
    primaryBtn: "Order Now",
    secondaryBtn: "Learn More",
  },
  {
    title: "Megapack",
    subtitle: "Massive Batteries for Massive Energy Support",
    image: megapack,
    primaryBtn: "Learn More",
  },
  {
    title: "Solar Roof",
    subtitle: "Generate Clean Energy With Your Roof",
    image: solarRoof,
    primaryBtn: "Order Now",
    secondaryBtn: "Learn More",
  },
];

const EnergyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -window.innerWidth * 0.7 : window.innerWidth * 0.7;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) => Math.min(products.length - 1, prev + 1));
    }
  };

  return (
    <section className="relative py-4 bg-background">
      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory"
      >
        {products.map((product, index) => (
          <div
            key={product.title}
            className="relative flex-shrink-0 w-[calc(100vw-32px)] md:w-[calc(70vw-32px)] h-[600px] rounded-lg overflow-hidden snap-start"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-12 left-8 right-8">
              <h2 className="tesla-card-title">{product.title}</h2>
              <p className="tesla-card-subtitle mt-1 max-w-md">{product.subtitle}</p>
              <div className="flex gap-3 mt-5">
                <button className="tesla-btn-primary">
                  {product.primaryBtn}
                </button>
                {product.secondaryBtn && (
                  <button className="tesla-btn-white">
                    {product.secondaryBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollRef.current?.scrollTo({
                left: index * (window.innerWidth * 0.7),
                behavior: "smooth",
              });
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-foreground" : "bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default EnergyCarousel;
