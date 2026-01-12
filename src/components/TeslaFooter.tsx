const footerLinks = [
  "Tesla © 2024",
  "Privacy & Legal",
  "Vehicle Recalls",
  "Contact",
  "News",
  "Get Updates",
  "Locations",
];

const TeslaFooter = () => {
  return (
    <footer className="bg-background py-6 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          {footerLinks.map((link, index) => (
            <a
              key={link}
              href="#"
              className="hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default TeslaFooter;
