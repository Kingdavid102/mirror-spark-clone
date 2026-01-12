import modelYPromo from "@/assets/model-y-promo.avif";
import model3Promo from "@/assets/model-3-promo.avif";

interface VehicleCard {
  category: string;
  name: string;
  image: string;
}

const vehicles: VehicleCard[] = [
  {
    category: "Midsize SUV",
    name: "Model Y",
    image: modelYPromo,
  },
  {
    category: "Sport Sedan",
    name: "Model 3",
    image: model3Promo,
  },
];

const VehicleCards = () => {
  return (
    <section className="py-4 px-4 bg-background">
      <div className="grid md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.name}
            className="relative h-[500px] rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Category Label */}
            <div className="absolute top-4 left-4">
              <span className="text-sm font-medium text-primary">
                {vehicle.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VehicleCards;
