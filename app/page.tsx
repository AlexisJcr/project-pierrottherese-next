"use client";

import Particles from "@/ui/design-system/particles/Particles"

import Navbar from "@/ui/components/navbar/Navbar"
import Home from "@/ui/components/home/Home"

import About from "@/ui/components/about/About"
import Formation from "@/ui/components/formation/Formation"
import Experience from "@/ui/components/experience/Experience"

import Skills from "@/ui/components/skills/Skills"
import Stacks from "@/ui/components/stacks/Stacks"

import Loisirs from "@/ui/components/loisirs/Loisirs"

export default function Portfolio() {
  return (
    <div className="relative w-full bg-primary">
    <Particles className="absolute inset-0 z-1" quantity={250} color="#fff" />
      <Navbar />
      <Home />
      <About />
      <Formation />
      {/* <Experience /> */}
      <Skills />
      <Stacks />
      <Loisirs />
    </div>
  );
}
