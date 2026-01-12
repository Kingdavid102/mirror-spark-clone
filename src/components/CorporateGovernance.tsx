import corporateHero from "@/assets/corporate-hero.jpg";
import InvestorRelationsHeader from "./InvestorRelationsHeader";

interface Person {
  firstName: string;
  lastName: string;
}

const leadership: Person[] = [
  { firstName: "Elon", lastName: "Musk" },
  { firstName: "Tom", lastName: "Zhu" },
  { firstName: "Vaibhav", lastName: "Taneja" },
];

const boardMembers: Person[] = [
  { firstName: "Elon", lastName: "Musk" },
  { firstName: "Robyn M.", lastName: "Denholm" },
  { firstName: "Ira", lastName: "Ehrenpreis" },
  { firstName: "Joe", lastName: "Gebbia" },
  { firstName: "James", lastName: "Murdoch" },
  { firstName: "Kimbal", lastName: "Musk" },
  { firstName: "JB", lastName: "Straubel" },
  { firstName: "Kathleen", lastName: "Wilson-Thompson" },
];

const CorporateGovernance = () => {
  return (
    <section className="bg-background">
      {/* IR Header */}
      <InvestorRelationsHeader />
      
      {/* Hero Image */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src={corporateHero}
          alt="Tesla Fleet at Supercharger"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Title */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-background">
            Corporate Governance
          </h1>
        </div>
      </div>

      {/* Leadership & Board */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Leadership */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-lg font-medium text-foreground">Leadership</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {leadership.map((person) => (
                <div key={`${person.firstName}-${person.lastName}`}>
                  <p className="text-lg font-normal text-foreground">
                    {person.firstName}
                  </p>
                  <p className="text-lg font-normal text-foreground">
                    {person.lastName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Board of Directors */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-lg font-medium text-foreground">Board of Directors</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
              {boardMembers.map((person) => (
                <div key={`${person.firstName}-${person.lastName}`}>
                  <p className="text-lg font-normal text-foreground">
                    {person.firstName}
                  </p>
                  <p className="text-lg font-normal text-foreground">
                    {person.lastName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateGovernance;
