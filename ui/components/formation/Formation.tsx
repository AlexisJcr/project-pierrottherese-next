import Image from "next/image";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

import logoCroixRouge from "@/ui/design-system/image/logo-croixrouge-blanc.png";
import logoUBO from "@/ui/design-system/image/logo-ubo-blanc.png";

import formaSTI from "@/ui/design-system/image/forma-sti.jpg";
import formaSN from "@/ui/design-system/image/forma-sn.jpg";
import formaLicence from "@/ui/design-system/image/forma-licence.jpg";

const InfoCard = ({
  title,
  text,
  imageSrc,
}: {
  title: string;
  text: string;
  imageSrc: any;
}) => (
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
      <div className="w-full h-[0.1rem] bg-blue-500 mb-4"></div>
      <p className="text-white text-[18px] font-normal leading-loose">{text}</p>
    </div>
  </div>
);

const formationData = [
  // { date: "2026-2028", title: "[Prévision] Master Développement logiciel des systèmes d'information", subtitle: "Université de Bretagne Occidentale - Brest" },
  {
    date: "2025 - 2026",
    degree: "Licence Informatique Conception et Développement d'Applications",
    institution: "Université de Bretagne Occidentale",
    location: "Brest, Bretagne, France",
    logoUrl: logoUBO,
  },
  {
    date: "2022 - 2024",
    degree: "BTS Systèmes Numériques Informatique et Réseaux",
    institution: "La Croix Rouge La Salle",
    location: "Brest, Bretagne, France",
    logoUrl: logoCroixRouge,
  },
  {
    date: "2020 - 2022",
    degree: "Baccalauréat STI2D SIN",
    institution: "La Croix Rouge La Salle",
    location: "Brest, Bretagne, France",
    logoUrl: logoCroixRouge,
  },
];

const infoCards = [
  {
    title:
      "Baccalauréat Technologique STI2D, Systèmes d'Information et Numérique",
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

const Formation = () => {
  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-4 z-1">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          Formation
        </motion.h2>
        <div className="space-y-12">
          {formationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-700 rounded-lg p-6 shadow-lg flex items-center justify-between"
            >
              <div className="">
                <div className="flex items-center mb-4">
                  <GraduationCap className="text-blue-500 mr-2" size={32} />
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                </div>
                <p className="text-gray-200 mb-2 text-lg">{edu.institution}</p>
                <div className="flex items-center text-gray-200 mb-2 text-lg">
                  <Calendar className="mr-2 text-blue-300" size={16} />
                  <span>{edu.date}</span>
                </div>
                <div className="flex items-center text-gray-200 mb-4 text-lg">
                  <MapPin className="mr-2 text-blue-300" size={16} />
                  <span>{edu.location}</span>
                </div>
              </div>
              <div className="">
                  <Image src={edu.logoUrl} height={150} width={150} alt="logo"></Image>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="wrap overflow-hidden p-10 h-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-gray-900">
        {infoCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default Formation;
