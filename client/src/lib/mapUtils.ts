import { LatLngTuple } from "leaflet";

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Get Saudi Arabia's bounds
export const saudiBounds: [LatLngTuple, LatLngTuple] = [
  [16.3479, 34.9536], // Southwest
  [32.1581, 55.6666]  // Northeast
];

// Get center of Saudi Arabia
export const saudiCenter: LatLngTuple = [24.7136, 46.6753];

// Format points for display
export const formatPoints = (points: number): string => {
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Parse station status to display text
export const statusToText = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'busy':
      return 'Busy';
    case 'unavailable':
      return 'Unavailable';
    default:
      return status;
  }
};

// Get availability text based on percentage
export const getAvailabilityText = (availability: number): string => {
  if (availability >= 80) return "High";
  if (availability >= 40) return "Medium";
  return "Low";
};

// Get reliability text based on percentage
export const getReliabilityText = (reliability: number): string => {
  if (reliability >= 90) return "Excellent";
  if (reliability >= 70) return "Very Good";
  if (reliability >= 50) return "Good";
  if (reliability >= 30) return "Fair";
  return "Poor";
};
