import Image from "next/image";

import Navbar from "@/ui/components/navbar/Navbar"
import Home from "@/ui/components/home/Home"

import About from "@/ui/components/about/About"
import Formation from "@/ui/components/formation/Formation"
import Experience from "@/ui/components/experience/Experience"
import Skills from "@/ui/components/skills/Skills"

export default function Portfolio() {
  return (
    <div className="w-full">
      <Navbar />
      <Home />
      <About />
      <Formation />
      <Experience />
      <Skills />
    </div>
  );
}
