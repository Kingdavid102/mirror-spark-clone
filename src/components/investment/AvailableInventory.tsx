import modelXInventory from "@/assets/model-x-inventory.jpg";
import model3Inventory from "@/assets/model-3-inventory.jpg";
import modelXPlaidInventory from "@/assets/model-x-plaid-inventory.jpg";

interface VehicleCard {
  image: string;
  name: string;
  range: string;
  acceleration: string;
  topSpeed: string;
  price: string;
}

const vehicles: VehicleCard[] = [
  {
    image: modelXInventory,
    name: "Tesla Model X",
    range: "410mi",
    acceleration: "3.1s",
    topSpeed: "130mph",
    price: "$36,000.00*",
  },
  {
    image: model3Inventory,
    name: "Tesla Model 3 Long Range",
    range: "410mi",
    acceleration: "3.1s",
    topSpeed: "130mph",
    price: "$47,240.00*",
  },
  {
    image: modelXPlaidInventory,
    name: "Tesla Model X Plaid",
    range: "410mi",
    acceleration: "3.1s",
    topSpeed: "130mph",
    price: "$94,990.00*",
  },
];

const AvailableInventory = () => {
  return (
    <section className="bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Available Inventory
            </h2>
            <p className="text-muted-foreground">
              Explore a curated selection ready for delivery.
            </p>
          </div>
          <a
            href="#"
            className="text-tesla-blue hover:underline font-medium"
          >
            View all
          </a>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {vehicle.name}
                </h3>

                {/* Specs */}
                <div className="flex gap-6 mb-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{vehicle.range}</p>
                    <p className="text-muted-foreground text-xs">Range</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.acceleration}</p>
                    <p className="text-muted-foreground text-xs">0-60 mph</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.topSpeed}</p>
                    <p className="text-muted-foreground text-xs">Top Speed</p>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Starting at {vehicle.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      After Est. Gas Savings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                      Learn
                    </button>
                    <button className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors">
                      Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableInventory;
