"use client"

import { useState, useEffect } from "react"
import mqtt from "mqtt"
import BoatMap from "./boat-map"
import SafetyZoneControls from "./safety-zone"
import { isPointInCircle } from "@/lib/geo-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/design-system/Card/card"

// Type pour les coordonnées GPS
export type Coordinates = {
  lat: number
  lng: number
}

// Type pour la zone de sécurité
export type SafetyZone = {
  center: Coordinates
  radius: number // en kilomètres
}

export default function BoatTrackingSystem() {
  // Position du bateau (simulée pour l'instant)
  const [boatPosition, setBoatPosition] = useState<Coordinates>({
    lat: 48.42, // Coordonnées initiales (près de Brest)
    lng: -4.31,
  })

  // Zone de sécurité (cercle rouge)
  const [safetyZone, setSafetyZone] = useState<SafetyZone>({
    center: {
      lat: 48.42, // Coordonnées initiales du cercle
      lng: -4.31,
    },
    radius: 10, // Rayon initial de 10km
  })

  // État pour savoir si le bateau est dans la zone de sécurité
  const [isInSafetyZone, setIsInSafetyZone] = useState(true)

  // Fonction pour mettre à jour la zone de sécurité
  const updateSafetyZone = (newZone: Partial<SafetyZone>) => {
    setSafetyZone((prev) => ({
      ...prev,
      ...newZone,
    }))
  }

  useEffect(() => {
    const MQTT_BROKER = "wss://eu1.cloud.thethings.network:8883/mqtt"
    const MQTT_TOPIC = "v3/{TON_APP_ID}/devices/{TON_DEVICE_ID}/up"
    const MQTT_USERNAME = "{TON_APP_ID}"
    const MQTT_PASSWORD = "{TON_API_KEY}"

    const client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      protocol: "wss",
      connectTimeout: 30 * 1000,
    })

    client.on("connect", () => {
      console.log("✅ Connecté au broker MQTT")
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) console.error("❌ Erreur de souscription :", err)
      })
    })

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString())
        console.log("📡 Données MQTT reçues :", payload)

        const coordinates = {
          lat: payload.uplink_message.decoded_payload.latitude,
          lng: payload.uplink_message.decoded_payload.longitude,
        }

        setBoatPosition(coordinates)
      } catch (error) {
        console.error("❌ Erreur de parsing MQTT :", error)
      }
    })

    client.on("error", (err) => {
      console.error("❌ Erreur MQTT :", err)
    })

    return () => {
      console.log("🔌 Déconnexion du broker MQTT")
      client.end()
    }
  }, [])

  // Vérifier si le bateau est dans la zone de sécurité
  useEffect(() => {
    const inZone = isPointInCircle(boatPosition, safetyZone.center, safetyZone.radius)
    setIsInSafetyZone(inZone)
  }, [boatPosition, safetyZone])

  return (
    <div className="space-y-6 z-0">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border shadow-lg overflow-hidden h-[500px]">
            <BoatMap boatPosition={boatPosition} safetyZone={safetyZone} isInSafetyZone={isInSafetyZone} />
          </div>
        </div>
        <div>
          <SafetyZoneControls safetyZone={safetyZone} updateSafetyZone={updateSafetyZone} />
        </div>
      </div>

      {!isInSafetyZone && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-semibold text-lg">
            ⚠️ Alerte : Le bateau est en dehors de la zone de sécurité !
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations du bateau</CardTitle>
          <CardDescription>
            Coordonnées GPS en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-4" >
            <div>
              <p className="text-base text-primary">Latitude</p>
              <p className="font-mono text-secondary">{boatPosition.lat.toFixed(6)}°</p>
            </div>
            <div>
              <p className="text-base text-primary">Longitude</p>
              <p className="font-mono text-secondary">{boatPosition.lng.toFixed(6)}°</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

