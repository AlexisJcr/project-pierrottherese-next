import Image from "next/image";

import logoCroixRouge from "@/ui/design-system/image/logo-croixrouge-noir.png";
import logoUBO from "@/ui/design-system/image/logo-ubo-noir.png"

import formaSTI from "@/ui/design-system/image/forma-sti.jpg"
import formaSN from "@/ui/design-system/image/forma-sn.jpg"
import formaLicence from "@/ui/design-system/image/forma-licence.jpg"

const TimelineItem = ({
  date,
  title,
  subtitle,
  logoUrl
}: {
  date: string;
  title: string;
  subtitle: string;
  logoUrl: any;
}) => (
  <div className="mb-8 flex justify-between items-center w-full">
    <div className="order-1 w-5/12">
      <div className="bg-primary rounded-lg shadow-xl px-6 py-4">
        <h3 className="mb-3 font-bold text-gray-50 text-xl">{title}</h3>
        <p className="text-base leading-snug tracking-wide text-gray-200 text-opacity-100">{subtitle}</p>
        <p className="mt-2 font-medium text-sm text-gray-300">{date}</p>
      </div>
    </div>
    <div className="z-20 flex items-center order-1 bg-black shadow-xl w-16 h-8 rounded-lg">
      <h1 className="mx-auto font-semibold text-lg text-white">{date.split('-')[0]}</h1>
    </div>
    <div className="order-1 w-5/12 flex justify-center">
      <Image src={logoUrl} alt={`Logo de ${subtitle}`} width={180} height={180}/>
    </div>
  </div>
);

const InfoCard = ({ title, text, imageSrc }: { title: string; text: string, imageSrc: any }) => (
  <div className="relative overflow-hidden rounded-lg shadow-lg">
    <Image
      src={imageSrc}
      alt={title}
      layout="fill"
      objectFit="cover"
      className="absolute inset-0 z-0"
    />
    <div className="relative z-10 p-6 bg-black bg-opacity-70 h-full">
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <div className="w-full h-1 bg-tertiary mb-4"></div>
      <p className="text-white text-[18px] font-normal leading-loose">{text}</p>
    </div>
  </div>
);

const Formation = () => {
  const timelineItems = [
    // { date: "2026-2028", title: "[Prévision] Master Développement logiciel des systèmes d'information", subtitle: "Université de Bretagne Occidentale - Brest" },
    {
      date: "2025-2026",
      title: "Licence Informatique Conception et Développement d'Applications",
      subtitle: "Université de Bretagne Occidentale - Brest",
      logoUrl: logoUBO
    },
    {
      date: "2022-2024",
      title: "BTS Systèmes Numériques Informatique et Réseaux",
      subtitle: "La Croix Rouge La Salle - Brest",
      logoUrl: logoCroixRouge
    },
    {
      date: "2020-2022",
      title: "Baccalauréat STI2D SIN",
      subtitle: "La Croix Rouge La Salle - Brest",
      logoUrl: logoCroixRouge
    },
  ];

  const infoCards = [
    {
      title: "Baccalauréat Technologique STI2D, Systèmes d'Information et Numérique",
      text: "J’ai obtenu mon Baccalauréat Technologique en Sciences de l’industrie et du développement durable avec l’option Systèmes d’Information et Numérique en 2022. Mon intérêt pour le monde numérique, déjà grandissant à l'époque, m’a conduit à suivre cette voie technologique. J'ai pu me plonger dans l'apprentissage des règles et coutumes des projets et du monde numérique.",
      imageSrc: formaSTI,
    },
    {
      title: "BTS Systèmes Numériques, Informatique et Réseaux",
      text: "J'ai poursuivi mes études avec un BTS Systèmes Numériques Informatique et Réseaux et l'ai obtenu en juin 2024 en tant que major de promotion et second de l'Académie de Rennes. Ce BTS m'a permis d'acquérir de nombreuses compétences dans le développement informatique ainsi que dans le monde du réseau et des systèmes communicants.",
      imageSrc: formaSN,
    },
    {
      title: "Licence Informatique Conception et Développement d'Applications",
      text: "Après une année de césure, je compte poursuivre mes études en 2025 en Licence Informatique Conception et Développement d'Application afin de me spécialiser dans la création de logiciels, de sites web et d'IHM.",
      imageSrc: formaLicence,
    },
  ];

  return (
    <section id="formation" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Formation</h2>
          <div className="bg-gray-200 rounded-lg">

          
          <div className="wrap overflow-hidden p-10 h-full">
            {timelineItems.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </div>
        </div>

        <div className="wrap overflow-hidden p-10 h-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
     
    </section>
  );
};

export default Formation;
