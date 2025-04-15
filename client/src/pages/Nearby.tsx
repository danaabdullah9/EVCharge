import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import useUserLocation from "@/hooks/useUserLocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { calculateDistance, formatDistance } from '@/lib/mapUtils';
import { StationWithStats } from "@shared/schema";
import StatusIndicator from '@/components/StatusIndicator';
import SmartRecommendation from '@/components/SmartRecommendation';
import { useLocation } from 'wouter';

const FILTERS = {
  ALL: 'all',
  AVAILABLE: 'available',
  FAST_CHARGING: 'fast'
};

interface StationCardProps {
  station: StationWithStats;
  distance: number;
  onNavigate: () => void;
}

const StationCard = ({ station, distance, onNavigate }: StationCardProps) => {
  const formattedDistance = formatDistance(distance);
  
  return (
    <Card className="mb-3 overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex justify-between">
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <StatusIndicator 
                  status={station.status} 
                  availability={station.availability}
                  size="sm"
                />
              </div>
              <Badge className="bg-gray-200 text-gray-700">
                {formattedDistance}
              </Badge>
            </div>
            
            <h3 className="font-semibold">{station.name}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{station.address}</p>
            
            <div className="flex items-center text-sm">
              <span className="flex items-center mr-3">
                <i className="fas fa-plug text-gray-500 mr-1"></i> {station.chargerType}
              </span>
              <span className="flex items-center">
                <i className="fas fa-bolt text-gray-500 mr-1"></i> {station.powerOutput} kW
              </span>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex text-amber-500 text-sm mr-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <i 
                    key={star} 
                    className={`${star <= Math.round(station.rating) ? 'fas' : 'far'} fa-star text-xs`}
                  ></i>
                ))}
              </div>
              <span className="text-xs text-gray-500">({station.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-between bg-gray-50 p-3">
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 h-8 w-8 rounded-full ${station.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <i className={`${station.isFavorite ? 'fas' : 'far'} fa-heart`}></i>
            </Button>
            
            <Button
              className="bg-blue-600 hover:bg-blue-700 h-8 w-8 p-0"
              size="icon"
              onClick={onNavigate}
            >
              <i className="fas fa-directions"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Nearby = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: stations, isLoading } = useQuery<StationWithStats[]>({
    queryKey: ['/api/stations'],
  });
  const { location: userLocation, refreshLocation } = useUserLocation();
  const [_, setLocation] = useLocation();
  
  // Calculate and sort stations by distance
  const stationsWithDistance = useMemo(() => {
    if (!stations || !userLocation) return [];
    
    return stations
      .map(station => {
        const distance = calculateDistance(
          userLocation[0],
          userLocation[1],
          station.latitude,
          station.longitude
        );
        
        return {
          ...station,
          distance
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [stations, userLocation]);
  
  // Apply filters and search
  const filteredStations = useMemo(() => {
    let result = stationsWithDistance;
    
    // Apply the active filter
    if (activeFilter === FILTERS.AVAILABLE) {
      result = result.filter(station => station.status === 'available');
    } else if (activeFilter === FILTERS.FAST_CHARGING) {
      result = result.filter(station => station.powerOutput >= 100);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        station =>
          station.name.toLowerCase().includes(query) ||
          station.address.toLowerCase().includes(query) ||
          station.chargerType.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [stationsWithDistance, activeFilter, searchQuery]);
  
  // Handle navigation to a station
  const handleNavigate = (station: StationWithStats) => {
    // This would typically open the navigation helper or navigate to the map
    toast({
      title: "Navigation Started",
      description: `Navigating to ${station.name}`,
      duration: 3000,
    });
  };
  
  // Get the top 3 stations for the "Smart Recommendation" section
  const topStations = useMemo(() => {
    return stationsWithDistance.slice(0, 3);
  }, [stationsWithDistance]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50 pb-16">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white z-10 shadow-sm p-4">
        <div className="relative mb-3">
          <Input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-200"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-gray-400"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times"></i>
            </Button>
          )}
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            className={`flex-1 rounded-md text-sm ${
              activeFilter === FILTERS.ALL
                ? 'bg-white shadow-sm'
                : 'bg-transparent hover:bg-gray-200'
            }`}
            onClick={() => setActiveFilter(FILTERS.ALL)}
          >
            All
          </Button>
          <Button
            className={`flex-1 rounded-md text-sm ${
              activeFilter === FILTERS.AVAILABLE
                ? 'bg-white shadow-sm'
                : 'bg-transparent hover:bg-gray-200'
            }`}
            onClick={() => setActiveFilter(FILTERS.AVAILABLE)}
          >
            Available
          </Button>
          <Button
            className={`flex-1 rounded-md text-sm ${
              activeFilter === FILTERS.FAST_CHARGING
                ? 'bg-white shadow-sm'
                : 'bg-transparent hover:bg-gray-200'
            }`}
            onClick={() => setActiveFilter(FILTERS.FAST_CHARGING)}
          >
            Fast Charging
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        {/* Smart Recommendation Section */}
        <div className="mb-5">
          <SmartRecommendation 
            stations={topStations}
            userLocation={userLocation}
            onNavigate={handleNavigate}
          />
        </div>
        
        {/* Station List */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Nearby Stations</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 p-0 h-auto flex items-center"
              onClick={refreshLocation}
            >
              <i className="fas fa-sync-alt mr-1 text-xs"></i>
              <span className="text-sm">Update</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                <p className="text-gray-600">Finding nearby stations...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredStations.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-map-marker-alt text-4xl text-gray-400 mb-3"></i>
                  <h3 className="text-lg font-medium text-gray-700">No stations found</h3>
                  <p className="text-gray-500 mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : activeFilter !== FILTERS.ALL
                      ? "Try changing your filter"
                      : "No stations nearby"}
                  </p>
                  <Button
                    className="mt-4 bg-blue-600"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter(FILTERS.ALL);
                      refreshLocation();
                    }}
                  >
                    Reset
                  </Button>
                </div>
              ) : (
                <div>
                  {filteredStations.map(station => (
                    <StationCard
                      key={station.id}
                      station={station}
                      distance={station.distance || 0}
                      onNavigate={() => handleNavigate(station)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nearby;
