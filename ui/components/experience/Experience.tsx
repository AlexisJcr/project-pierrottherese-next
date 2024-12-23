const ExperienceCard = ({ title }: { title: string }) => (
    <div className="bg-secondary rounded-lg shadow-lg p-6">
      <h3 className="text-2xl text-center font-bold mb-2">{title}</h3>
      <div className="w-full h-1 bg-tertiary mb-4"></div>
      <p className="text-gray-700"></p>
    </div>
  );
  
  const Experience = () => {
    const experiences = [
      { title: "Expérience Etudiant" },
      { title: "Expérience Professionnelle" },
    ];
  
    return (
      <section id="experience" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Expérience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Experience;
  
  