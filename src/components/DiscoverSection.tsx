import fsdImage from "@/assets/fsd.jpg";
import modelXFeatures from "@/assets/model-x-features.jpg";

const DiscoverSection = () => {
  return (
    <section className="py-4 px-4 bg-background">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Full Self-Driving */}
        <div className="relative h-[600px] rounded-lg overflow-hidden group">
          <img
            src={fsdImage}
            alt="Full Self-Driving"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Pause Button */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-background/40 backdrop-blur rounded-lg flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-background rounded" />
              <div className="w-1 h-4 bg-background rounded" />
            </div>
          </button>
          
          {/* Content */}
          <div className="absolute bottom-12 left-8 right-8">
            <h2 className="tesla-card-title">Full Self-Driving (Supervised)</h2>
            <div className="flex gap-3 mt-5">
              <button className="tesla-btn-primary">Demo Drive</button>
              <button className="tesla-btn-white">View Report</button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative h-[600px] rounded-lg overflow-hidden group">
          <img
            src={modelXFeatures}
            alt="Features That Come Standard"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-12 left-8 right-8">
            <h2 className="tesla-card-title">
              Features That<br />Come Standard
            </h2>
            <div className="flex gap-3 mt-5">
              <button className="tesla-btn-primary">Discover</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
