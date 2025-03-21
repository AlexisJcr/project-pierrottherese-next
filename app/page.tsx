"use client";
import Navbar from "@/ui/components/Navbar/navbar"
import Parallax from "@/ui/components/Vitrine/parallax"
import Missions from "@/ui/components/Vitrine/missions-section"
import Calendrier from "@/ui/components/Vitrine/calendar-section"
import Contacts from "@/ui/components/Vitrine/contacts-section"

export default function Vitrine() {
  return (
    <div className="relative w-full">
      <Navbar />
      <Parallax />
      <Missions />
      <Calendrier />
      <Contacts />
    </div>
  );
}
