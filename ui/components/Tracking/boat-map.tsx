"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Coordinates, SafetyZone } from "./boat-tracking-system"

type BoatMapProps = {
  boatPosition: Coordinates
  safetyZone: SafetyZone
  isInSafetyZone: boolean
}

export default function BoatMap({ boatPosition, safetyZone, isInSafetyZone }: BoatMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const boatMarkerRef = useRef<L.Marker | null>(null)
  const safetyCircleRef = useRef<L.Circle | null>(null)
  const mapInitialized = useRef(false)

  // Correction des icônes Leaflet en Next.js
useEffect(() => {
  // Correction des icônes Leaflet qui ne fonctionnent pas correctement avec Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  })
}, [])

  // Initialiser la carte
  useEffect(() => {
    if (!mapInitialized.current) {
      const map = L.map("map").setView([boatPosition.lat, boatPosition.lng], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Créer le marqueur du bateau
      const boatIcon = L.icon({
        iconUrl: "/boat-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })

      const boatMarker = L.marker([boatPosition.lat, boatPosition.lng], { icon: boatIcon })
        .addTo(map)
        .bindPopup("Position du bateau")

      // Créer le cercle de sécurité
      const safetyCircle = L.circle([safetyZone.center.lat, safetyZone.center.lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.2,
        radius: safetyZone.radius * 1000, // Convertir km en mètres
      }).addTo(map)

      mapRef.current = map
      boatMarkerRef.current = boatMarker
      safetyCircleRef.current = safetyCircle
      mapInitialized.current = true
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        boatMarkerRef.current = null
        safetyCircleRef.current = null
        mapInitialized.current = false
      }
    }
  }, [boatPosition.lat, boatPosition.lng, safetyZone.center.lat, safetyZone.center.lng, safetyZone.radius])

  // Mettre à jour la position du bateau
  useEffect(() => {
    if (mapInitialized.current && boatMarkerRef.current) {
      boatMarkerRef.current.setLatLng([boatPosition.lat, boatPosition.lng])

      // Mettre à jour la popup avec des informations supplémentaires
      boatMarkerRef.current.bindPopup(`
        <b>Position du bateau</b><br>
        Latitude: ${boatPosition.lat.toFixed(6)}°<br>
        Longitude: ${boatPosition.lng.toFixed(6)}°<br>
        <span style="color: ${isInSafetyZone ? "green" : "red"}">
          ${isInSafetyZone ? "✓ Dans la zone de sécurité" : "⚠️ Hors de la zone de sécurité"}
        </span>
      `)
    }
  }, [boatPosition, isInSafetyZone])

  // Mettre à jour la zone de sécurité
  useEffect(() => {
    if (mapInitialized.current && safetyCircleRef.current) {
      safetyCircleRef.current.setLatLng([safetyZone.center.lat, safetyZone.center.lng])
      safetyCircleRef.current.setRadius(safetyZone.radius * 1000) // Convertir km en mètres
    }
  }, [safetyZone])

  return <div id="map" className="h-full w-full" />
}

