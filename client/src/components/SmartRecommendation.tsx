import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StationWithStats } from "@shared/schema";
import StatusIndicator from './StatusIndicator';
import { formatDistance } from '@/lib/mapUtils';
import { useLocation } from 'wouter';

interface SmartRecommendationProps {
  stations: StationWithStats[];
  userLocation: [number, number] | null;
  onNavigate: (station: StationWithStats) => void;
}

const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  stations,
  userLocation,
  onNavigate
}) => {
  const [_, setLocation] = useLocation();
  
  // If no stations, return empty component
  if (!stations || stations.length === 0) {
    return null;
  }
  
  // Get the best station based on a scoring algorithm
  const getBestStation = () => {
    if (!stations.length) return null;
    
    // Score each station based on:
    // - Availability (40% weight)
    // - Reliability (30% weight)
    // - Rating (15% weight)
    // - Proximity/distance (15% weight) - if user location available
    
    const scoredStations = stations.map(station => {
      let score = 0;
      
      // Availability score (0-40)
      score += (station.availability * 0.4);
      
      // Reliability score (0-30)
      score += (station.reliability * 0.3);
      
      // Rating score (0-15)
      score += ((station.rating / 5) * 15);
      
      // Proximity score (0-15) - if user location available
      if (userLocation) {
        // Calculate distance in km
        const distance = calculateDistance(
          userLocation[0], 
          userLocation[1], 
          station.latitude, 
          station.longitude
        );
        
        // Closer stations get higher scores
        // We use an inverse relationship - 15 * (1 / distance)
        // But capped at 15 and with a minimum distance of 0.1 to avoid division by zero
        const proximityScore = Math.min(15, 15 * (1 / Math.max(0.1, distance)));
        score += proximityScore;
      }
      
      return {
        ...station,
        score
      };
    });
    
    // Sort by score (highest first)
    scoredStations.sort((a, b) => b.score - a.score);
    
    // Return the top station
    return scoredStations[0];
  };
  
  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  
  // Get distance text if user location is available
  const getDistanceText = (station: StationWithStats) => {
    if (!userLocation) return null;
    
    const distance = calculateDistance(
      userLocation[0], 
      userLocation[1], 
      station.latitude, 
      station.longitude
    );
    
    return formatDistance(distance);
  };
  
  const bestStation = getBestStation();
  if (!bestStation) return null;
  
  const distanceText = getDistanceText(bestStation);
  
  return (
    <Card className="shadow-md border-0 bg-gradient-to-r from-white to-gray-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Smart Recommendation</h3>
            <h2 className="font-semibold text-lg">{bestStation.name}</h2>
          </div>
          <div className="flex items-center">
            <StatusIndicator 
              status={bestStation.status}
              availability={bestStation.availability}
              size="sm"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-3">
              <i className="fas fa-bolt text-green-600 mr-1"></i> {bestStation.powerOutput} kW
            </span>
            {distanceText && (
              <span>
                <i className="fas fa-map-marker-alt text-blue-600 mr-1"></i> {distanceText}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex text-amber-500 text-sm mr-1">
              {[1, 2, 3, 4, 5].map(star => (
                <i 
                  key={star} 
                  className={`${star <= Math.round(bestStation.rating) ? 'fas' : 'far'} fa-star`}
                ></i>
              ))}
            </div>
            <span className="text-xs text-gray-500">({bestStation.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex flex-col text-sm mb-3">
          <div className="inline-flex items-center text-gray-600">
            <i className="fas fa-plug text-gray-400 mr-2 w-4"></i> {bestStation.chargerType}
          </div>
          <div className="inline-flex items-center text-gray-600 mt-1">
            <i className="fas fa-map-pin text-gray-400 mr-2 w-4"></i> {bestStation.address}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onNavigate(bestStation)}
            className="flex-1 bg-blue-600"
          >
            <i className="fas fa-directions mr-1"></i> Navigate
          </Button>
          <Button 
            onClick={() => setLocation('/')}
            variant="outline" 
            className="flex-1"
          >
            View on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendation;