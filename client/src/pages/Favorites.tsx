import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Station } from "@shared/schema";

const FavoriteStationCard = ({ 
  station, 
  onRemoveFavorite 
}: { 
  station: Station, 
  onRemoveFavorite: (id: number) => void 
}) => {
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
                <span className="text-xs text-gray-600">{station.chargerType}</span>
                <span className="text-xs mx-2 text-gray-400">|</span>
                <span className="text-xs text-gray-600">{station.powerOutput} kW</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              className="bg-blue-600 text-white h-8"
              onClick={() => window.location.href = '/'}
            >
              <i className="fas fa-directions mr-1"></i> Go
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => onRemoveFavorite(station.id)}
            >
              <i className="fas fa-heart-broken mr-1"></i> Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Favorites = () => {
  const { toast } = useToast();
  
  // Fetch favorite stations
  const { data: favorites, isLoading } = useQuery<Station[]>({
    queryKey: ['/api/favorites']
  });
  
  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (stationId: number) => {
      await apiRequest('DELETE', `/api/favorites/${stationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      
      toast({
        title: "Removed from favorites",
        description: "Station has been removed from your favorites.",
        duration: 3000,
      });
    }
  });
  
  const handleRemoveFavorite = (stationId: number) => {
    removeFavoriteMutation.mutate(stationId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4">Favorite Stations</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">Loading favorites...</p>
          </div>
        </div>
      ) : (
        <>
          {!favorites || favorites.length === 0 ? (
            <div className="text-center p-8">
              <i className="far fa-heart text-4xl text-gray-400 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-700">No favorites yet</h3>
              <p className="text-gray-500 mt-1">Add stations to your favorites to view them here</p>
              <Button 
                className="mt-4 bg-blue-600"
                onClick={() => window.location.href = '/'}
              >
                Explore Stations
              </Button>
            </div>
          ) : (
            <div>
              {favorites.map(station => (
                <FavoriteStationCard 
                  key={station.id} 
                  station={station} 
                  onRemoveFavorite={handleRemoveFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
