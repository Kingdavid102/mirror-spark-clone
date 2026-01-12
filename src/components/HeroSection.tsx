import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import modelYHero from "@/assets/model-y-hero.jpg";
import model3Promo from "@/assets/model-3-promo.avif";
import modelYPromo from "@/assets/model-y-promo.avif";

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  primaryBtn: string;
  secondaryBtn: string;
  textDark?: boolean;
}

const slides: HeroSlide[] = [
  {
    title: "Model Y",
    subtitle: "0% APR Available",
    image: modelYHero,
    primaryBtn: "Order Now",
    secondaryBtn: "View Inventory",
    textDark: true,
  },
  {
    title: "Model 3",
    subtitle: "Starting at $32,740",
    image: model3Promo,
    primaryBtn: "Order Now",
    secondaryBtn: "Learn More",
    textDark: true,
  },
  {
    title: "Meet Model Y",
    subtitle: "The Safest SUV Ever",
    image: modelYPromo,
    primaryBtn: "Order Now",
    secondaryBtn: "Compare",
    textDark: true,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover transition-all duration-700"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start h-full pt-32 text-center">
        <h1
          className={`text-4xl md:text-5xl font-medium tracking-tight animate-fade-in ${
            slide.textDark ? "text-foreground" : "text-background"
          }`}
        >
          {slide.title}
        </h1>
        <p
          className={`mt-2 text-sm md:text-base animate-fade-in ${
            slide.textDark ? "text-primary" : "text-background/90"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {slide.subtitle}
        </p>
        <div
          className="flex gap-4 mt-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <button className="tesla-btn-primary min-w-[140px]">
            {slide.primaryBtn}
          </button>
          <button className="tesla-btn-secondary min-w-[140px]">
            {slide.secondaryBtn}
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-foreground" : "bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
