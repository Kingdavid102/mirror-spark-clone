const PortfolioCTA = () => {
  return (
    <section className="bg-gradient-to-b from-[#0a1628] to-[#0d1f3c] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to build your portfolio?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Create an investment plan, follow stocks, and shop inventory in one place.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 border border-white font-medium rounded-md hover:bg-white/10 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCTA;
