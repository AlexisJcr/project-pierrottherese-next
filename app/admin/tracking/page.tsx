import BoatTrackingSystem from "@/ui/components/Tracking/boat-tracking-system"
import Navbar from "@/ui/components/Navbar/navbar"

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6 text-primary">Suivi du bateau</h1>
          <BoatTrackingSystem />
        </div>
      </main>
    </div>
  )
}

