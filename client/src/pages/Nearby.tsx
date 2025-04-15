import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useUserLocation from "@/hooks/useUserLocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StationWithStats } from "@shared/schema";

const StationCard = ({ station }: { station: StationWithStats }) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mr-3
              ${station.status === 'available' ? 'bg-green-600 text-white' : 
                station.status === 'busy' ? 'bg-amber-500 text-white' : 
                'bg-red-500 text-white'}
            `}>
              <i className="fas fa-plug"></i>
            </div>
            <div>
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-sm text-gray-500">{station.address}</p>
              <div className="flex mt-1 items-center">
                <div className="flex items-center text-amber-500">
                  <i className="fas fa-star text-xs"></i>
                  <span className="text-xs ml-1 text-gray-600">{station.rating}</span>
                </div>
                <span className="text-xs mx-2 text-gray-400">|</span>
                <span className="text-xs text-gray-600">{station.chargerType}</span>
                <span className="text-xs mx-2 text-gray-400">|</span>
                <span className="text-xs text-gray-600">{station.powerOutput} kW</span>
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 text-white h-8"
            onClick={() => window.location.href = '/'}
          >
            <i className="fas fa-directions mr-1"></i> Go
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Nearby = () => {
  const { location: userLocation } = useUserLocation();
  const [radius, setRadius] = useState<string>("5");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: stations, isLoading } = useQuery<StationWithStats[]>({
    queryKey: ['/api/stations'],
    enabled: !!userLocation,
  });
  
  // Sort and filter stations
  const filteredStations = stations ? stations
    .filter(station => {
      if (activeTab === 'all') return true;
      return station.status === activeTab;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'power') return b.powerOutput - a.powerOutput;
      // Default sort by distance
      return a.availability - b.availability;
    }) : [];
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Nearby Stations</h1>
        <div className="w-24">
          <Select
            value={radius}
            onValueChange={setRadius}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="busy">Busy</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4">
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="power">Power</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">Loading nearby stations...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredStations.length === 0 ? (
            <div className="text-center p-8">
              <i className="fas fa-map-marker-slash text-4xl text-gray-400 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-700">No stations found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search parameters</p>
            </div>
          ) : (
            <div>
              {filteredStations.map(station => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nearby;
