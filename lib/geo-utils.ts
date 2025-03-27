import type { Coordinates } from "@/ui/components/Tracking/boat-tracking-system"

/**
 * Calcule la distance entre deux points en utilisant la formule de Haversine
 * @param point1 Premier point (latitude, longitude)
 * @param point2 Deuxième point (latitude, longitude)
 * @returns Distance en kilomètres
 */
export function haversineDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371 // Rayon de la Terre en kilomètres

  const dLat = toRadians(point2.lat - point1.lat)
  const dLon = toRadians(point2.lng - point1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convertit les degrés en radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Vérifie si un point est à l'intérieur d'un cercle
 * @param point Point à vérifier (latitude, longitude)
 * @param center Centre du cercle (latitude, longitude)
 * @param radiusKm Rayon du cercle en kilomètres
 * @returns true si le point est dans le cercle, false sinon
 */
export function isPointInCircle(point: Coordinates, center: Coordinates, radiusKm: number): boolean {
  const distance = haversineDistance(point, center)
  return distance <= radiusKm
}

