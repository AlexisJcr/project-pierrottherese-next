import Image from 'next/image';

import placeholder1 from "@/ui/design-system/image/wallpaper1.jpg"
import placeholder2 from "@/ui/design-system/image/wallpaper2.jpg"
import placeholder3 from "@/ui/design-system/image/wallpaper3.jpg"

const Card = ({ title, text, imageSrc }: { title: string, text: string, imageSrc: any }) => (
  <div className="relative overflow-hidden rounded-lg shadow-lg">
    <Image src={imageSrc} alt="Image" layout="fill" objectFit="cover" className="absolute inset-0 z-0" />
    <div className="relative h-[30rem] z-10 p-6 bg-black bg-opacity-65 ">
      <h3 className="text-3xl text-center font-semibold text-white mb-2">{title}</h3>
      <p className="text-white text-[18px] leading-loose font-normal ">{text}</p>
    </div>
  </div>
);

const About = () => {
  const cards = [
    {
      title: "Qui suis-je ?",
      text: "Apprenti développeur fullstack spécialisé dans le Web et l'IoT. Passionné par le numérique, je souhaite développer mes compétences en programmation. Curieux et engagé, je m'informes sur les technologies et innovations du moment.",
      imageSrc: placeholder1
    },
    {
      title: "Mon parcours",
      text: "Diplômé en BTS Systèmes Numériques Informatique et Réseaux, je souhaite poursuivre mes études en Ingénierie Numérique, ou en Licence puis Master en Conception et Développement d'Application.",
      imageSrc: placeholder2
    },
    {
      title: "Loisirs",
      text: "Passionné par les voyages et la découverte de nouvelles cultures, j'ai eu l'occasion de partir à deux reprises en voyage humanitaire au Vietnam en février 2024 et juin 2025. Deux expériences inoubliables et enrichissantes. J'apprends également la guitare en autodidacte depuis maintenant 3 ans.",
      imageSrc: placeholder3
    }
  ];

  return (
    <section id="about" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-[40px] font-medium text-center mb-12">À propos de moi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

