const MarketNews = () => {
  return (
    <section className="bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Market News
            </h2>
            <p className="text-muted-foreground">
              Latest headlines impacting your watchlist.
            </p>
          </div>
          <a
            href="#"
            className="text-tesla-blue hover:underline font-medium"
          >
            View stocks
          </a>
        </div>

        {/* No News Placeholder */}
        <div className="py-8">
          <p className="text-muted-foreground">No news available yet.</p>
        </div>
      </div>
    </section>
  );
};

export default MarketNews;
