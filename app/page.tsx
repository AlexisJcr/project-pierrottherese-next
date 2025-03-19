"use client";
import Navbar from "@/ui/components/Navbar/navbar"
import Parallax from "@/ui/components/Vitrine/parallax"
import Missions from "@/ui/components/Vitrine/missions"

export default function Vitrine() {
  return (
    <div className="relative w-full">
      <Navbar></Navbar>
      <Parallax></Parallax>
      <Missions></Missions>
    </div>
  );
}
