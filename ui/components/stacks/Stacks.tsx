"use client";

import { motion } from "framer-motion";
import * as SimpleIcons from "simple-icons";

import { IconCloud } from "@/ui/design-system/iconcloud/IconCloud";

const techStacks = [
  { name: "Next.js", icon: SimpleIcons.siNextdotjs },
  { name: "React", icon: SimpleIcons.siReact },
  { name: "JavaScript", icon: SimpleIcons.siJavascript },
  { name: "TypeScript", icon: SimpleIcons.siTypescript },
  { name: "Node.js", icon: SimpleIcons.siNodedotjs },
  { name: "HTML5", icon: SimpleIcons.siHtml5 },
  { name: "CSS3", icon: SimpleIcons.siCss3 },
  { name: "Tailwind CSS", icon: SimpleIcons.siTailwindcss },
  { name: "C++", icon: SimpleIcons.siCplusplus },
  { name: "Python", icon: SimpleIcons.siPython },
  { name: "Java", icon: SimpleIcons.siIntellijidea },

  { name: "MySQL", icon: SimpleIcons.siMysql },

];

const slugs = [
  "javascript",
  "typescript",
  "html5",
  "css3",
  "C++",
  "java",
  "react",
  "nodedotjs",
  "nextdotjs",

  "mysql",
  "postgresql",

  "git",
  "github",
  "vercel",

  "android",
  "flutter",
  "dart",

  "visualstudiocode",
  "figma",
];

const TechStacks = () => {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
  );

  return (
    <section id="tech-stacks" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-white"
        >
          Technologies
        </motion.h2>

        <div className="flex flex-row justify-between gap-[5rem] items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 w-full">
            {techStacks.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-gray-500 bg-opacity-30 rounded-full mb-4 p-3">
                  {/* SVG pour chaque icône */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="64"
                    height="64"
                    fill={`#${tech.icon.hex}`} // Couleur hexadécimale de l'icône
                  >
                    <path d={tech.icon.path} /> {/* Chemin de l'icône */}
                  </svg>
                </div>
                <span className="text-white text-center">{tech.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="relative flex overflow-hidden">
            <IconCloud images={images} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStacks;
