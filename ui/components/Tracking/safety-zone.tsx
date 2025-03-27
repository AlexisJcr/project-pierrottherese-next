"use client"

import { useState, useEffect } from "react"
import { Input } from "@/ui/design-system/Input/input"
import { Label } from "@/ui/design-system/Label/label"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/design-system/Card/card"
import type { SafetyZone } from "./boat-tracking-system"

type SafetyZoneControlsProps = {
  safetyZone: SafetyZone
  updateSafetyZone: (newZone: Partial<SafetyZone>) => void
}

export default function SafetyZoneControls({ safetyZone, updateSafetyZone }: SafetyZoneControlsProps) {
  // États locaux pour les champs de formulaire
  const [centerLat, setCenterLat] = useState(safetyZone.center.lat.toString())
  const [centerLng, setCenterLng] = useState(safetyZone.center.lng.toString())
  const [radius, setRadius] = useState(safetyZone.radius.toString())

  // Mettre à jour les états locaux lorsque les props changent
  useEffect(() => {
    setCenterLat(safetyZone.center.lat.toString())
    setCenterLng(safetyZone.center.lng.toString())
    setRadius(safetyZone.radius.toString())
  }, [safetyZone])

  // Fonction pour appliquer les changements
  const handleApplyChanges = () => {
    const lat = Number.parseFloat(centerLat)
    const lng = Number.parseFloat(centerLng)
    const rad = Number.parseFloat(radius)

    // Validation des entrées
    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      alert("Veuillez entrer des valeurs numériques valides")
      return
    }

    if (lat < -90 || lat > 90) {
      alert("La latitude doit être comprise entre -90 et 90 degrés")
      return
    }

    if (lng < -180 || lng > 180) {
      alert("La longitude doit être comprise entre -180 et 180 degrés")
      return
    }

    if (rad <= 0) {
      alert("Le rayon doit être supérieur à 0")
      return
    }

    // Mettre à jour la zone de sécurité
    updateSafetyZone({
      center: { lat, lng },
      radius: rad,
    })
  }

  // Fonction pour mettre à jour en temps réel
  const handleChange = (field: "lat" | "lng" | "radius", value: string) => {
    const numValue = Number.parseFloat(value)

    if (!isNaN(numValue)) {
      if (field === "lat") {
        setCenterLat(value)
        updateSafetyZone({ center: { ...safetyZone.center, lat: numValue } })
      } else if (field === "lng") {
        setCenterLng(value)
        updateSafetyZone({ center: { ...safetyZone.center, lng: numValue } })
      } else if (field === "radius") {
        setRadius(value)
        updateSafetyZone({ radius: numValue })
      }
    } else {
      // Mettre à jour uniquement l'état local pour permettre l'édition
      if (field === "lat") setCenterLat(value)
      else if (field === "lng") setCenterLng(value)
      else if (field === "radius") setRadius(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone de sécurité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="center-lat">Latitude du centre</Label>
          <Input
            id="center-lat"
            type="text"
            value={centerLat}
            onChange={(e) => handleChange("lat", e.target.value)}
            placeholder="Latitude (ex: 48.42)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="center-lng">Longitude du centre</Label>
          <Input
            id="center-lng"
            type="text"
            value={centerLng}
            onChange={(e) => handleChange("lng", e.target.value)}
            placeholder="Longitude (ex: -4.31)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="radius">Rayon (km)</Label>
          <Input
            id="radius"
            type="text"
            value={radius}
            onChange={(e) => handleChange("radius", e.target.value)}
            placeholder="Rayon en km (ex: 10)"
          />
        </div>

        <Button onClick={handleApplyChanges} className="w-full">
          Appliquer les changements
        </Button>
      </CardContent>
    </Card>
  )
}

