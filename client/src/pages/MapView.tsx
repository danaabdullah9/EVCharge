import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import useUserLocation from "@/hooks/useUserLocation";
import useStations from "@/hooks/useStations";
import StationMarker from "@/components/StationMarker";
import BottomSheet from "@/components/BottomSheet";
import AddStationModal from "@/components/AddStationModal";
import ReportStationModal from "@/components/ReportStationModal";
import NavigationHelper from "@/components/NavigationHelper";
import StatusIndicator from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StationWithStats } from "@shared/schema";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icon issues
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// MapController component for handling map controls
const MapController = ({ userLocation, onLocationUpdate }: { userLocation: [number, number], onLocationUpdate: () => void }) => {
  const map = useMap();

  // Center on user location
  const centerOnUser = () => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
    onLocationUpdate();
  };

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
      <Button 
        variant="secondary" 
        size="icon"
        className="bg-white rounded-full shadow-md hover:bg-gray-50 w-10 h-10" 
        onClick={centerOnUser}
      >
        <i className="fas fa-location-crosshairs text-blue-600"></i>
      </Button>
      <Button 
        variant="secondary" 
        size="icon"
        className="bg-white rounded-full shadow-md hover:bg-gray-50 w-10 h-10" 
        onClick={() => map.zoomIn()}
      >
        <i className="fas fa-plus text-gray-800"></i>
      </Button>
      <Button 
        variant="secondary" 
        size="icon"
        className="bg-white rounded-full shadow-md hover:bg-gray-50 w-10 h-10" 
        onClick={() => map.zoomOut()}
      >
        <i className="fas fa-minus text-gray-800"></i>
      </Button>
      <Button 
        variant="secondary" 
        size="icon"
        className="bg-white rounded-full shadow-md hover:bg-gray-50 w-10 h-10" 
        onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/stations'] })}
      >
        <i className="fas fa-rotate text-gray-800"></i>
      </Button>
    </div>
  );
};

// UserLocationMarker component
const UserLocationMarker = ({ position }: { position: [number, number] }) => {
  return (
    <Marker 
      position={position} 
      icon={new Icon({
        iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233B82F6" width="36" height="36"><circle cx="12" cy="12" r="10" fill="%233B82F6" stroke="white" stroke-width="2"/></svg>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
};

const MapView = () => {
  const { toast } = useToast();
  
  // Get user location
  const { location: userLocation, refreshLocation } = useUserLocation();
  
  // Get stations
  const { stations, isLoading } = useStations();
  
  // State for bottom sheet
  const [selectedStation, setSelectedStation] = useState<StationWithStats | null>(null);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  
  // State for modals
  const [addStationModalVisible, setAddStationModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [navigationModalVisible, setNavigationModalVisible] = useState(false);
  
  // Filter menu
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter stations by status
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
  
  // Handle station selection
  const handleStationSelect = (station: StationWithStats) => {
    setSelectedStation(station);
    setBottomSheetExpanded(true);
  };
  
  // Handle adding a new station
  const handleAddStation = () => {
    setAddStationModalVisible(true);
  };
  
  // Handle reporting a station
  const handleShowReportForm = () => {
    if (selectedStation) {
      setReportModalVisible(true);
    }
  };
  
  // Handle favorite toggle
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ stationId, isFavorite }: { stationId: number, isFavorite: boolean }) => {
      if (isFavorite) {
        // Remove from favorites
        await apiRequest('DELETE', `/api/favorites/${stationId}`);
      } else {
        // Add to favorites
        await apiRequest('POST', '/api/favorites', { stationId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      
      if (selectedStation) {
        const newIsFavorite = !selectedStation.isFavorite;
        setSelectedStation({ ...selectedStation, isFavorite: newIsFavorite });
        
        toast({
          title: newIsFavorite ? "Added to favorites" : "Removed from favorites",
          description: `${selectedStation.name} has been ${newIsFavorite ? 'added to' : 'removed from'} your favorites.`,
          duration: 3000,
        });
      }
    }
  });
  
  // Handle favoriting a station
  const handleToggleFavorite = () => {
    if (selectedStation) {
      toggleFavoriteMutation.mutate({ 
        stationId: selectedStation.id, 
        isFavorite: selectedStation.isFavorite 
      });
    }
  };
  
  // Handle navigation
  const handleStartNavigation = () => {
    if (selectedStation) {
      // Show the navigation helper modal
      setNavigationModalVisible(true);
    }
  };
  
  // Share station
  const handleShareStation = () => {
    if (selectedStation) {
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: selectedStation.name,
          text: `Check out this EV charging station: ${selectedStation.name}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        toast({
          title: "Share link copied",
          description: "Link to this station has been copied to clipboard.",
          duration: 3000,
        });
      }
    }
  };
  
  // Default position (Saudi Arabia's center)
  const saudiArabiaCenter: [number, number] = [24.7136, 46.6753];
  const defaultPosition = userLocation || saudiArabiaCenter;

  return (
    <main className="flex-1 relative overflow-hidden">
      <div className="map-container relative h-full">
        {userLocation ? (
          <MapContainer 
            center={defaultPosition} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {userLocation && (
              <UserLocationMarker position={userLocation} />
            )}
            
            {stations.map((station) => (
              <StationMarker 
                key={station.id}
                station={station}
                onSelect={() => handleStationSelect(station)}
              />
            ))}
            
            <MapController userLocation={defaultPosition} onLocationUpdate={refreshLocation} />
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Add Station Button */}
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 absolute left-4 bottom-24 shadow-lg w-12 h-12"
          onClick={handleAddStation}
        >
          <i className="fas fa-plus text-xl"></i>
        </Button>
        
        {/* Filter Button */}
        <div className="absolute left-4 bottom-40 flex flex-col gap-2">
          <Button 
            variant="outline"
            className="bg-white hover:bg-gray-50 rounded-full p-4 shadow-lg border border-gray-200 w-12 h-12"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <i className="fas fa-sliders text-gray-800"></i>
          </Button>
        </div>
      </div>
      
      {/* Bottom Sheet */}
      {selectedStation && (
        <BottomSheet 
          station={selectedStation} 
          isExpanded={bottomSheetExpanded}
          onToggleExpand={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          onToggleFavorite={handleToggleFavorite}
          onShareStation={handleShareStation}
          onStartNavigation={handleStartNavigation}
          onAddReport={handleShowReportForm}
        />
      )}
      
      {/* Add Station Modal */}
      <AddStationModal 
        isVisible={addStationModalVisible}
        onClose={() => setAddStationModalVisible(false)}
        userLocation={userLocation}
      />
      
      {/* Report Station Modal */}
      {selectedStation && (
        <ReportStationModal 
          isVisible={reportModalVisible}
          station={selectedStation}
          onClose={() => setReportModalVisible(false)}
        />
      )}
      
      {/* Navigation Helper Modal */}
      {selectedStation && (
        <NavigationHelper
          isOpen={navigationModalVisible}
          onClose={() => setNavigationModalVisible(false)}
          stationName={selectedStation.name}
          latitude={selectedStation.latitude}
          longitude={selectedStation.longitude}
        />
      )}
      
      {/* Status Filter Sheet */}
      {filtersVisible && (
        <div className="absolute left-0 bottom-20 ml-20 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-20">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Filter by Status</h3>
            <div className="flex flex-col gap-2 mt-1">
              <Button 
                variant={activeStatusFilter === null ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setActiveStatusFilter(null)}
              >
                <i className="fas fa-circle text-gray-400 mr-2"></i> All
              </Button>
              <Button 
                variant={activeStatusFilter === 'available' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setActiveStatusFilter('available')}
              >
                <StatusIndicator status="available" availability={100} showText size="sm" />
              </Button>
              <Button 
                variant={activeStatusFilter === 'busy' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setActiveStatusFilter('busy')}
              >
                <StatusIndicator status="busy" availability={50} showText size="sm" />
              </Button>
              <Button 
                variant={activeStatusFilter === 'unavailable' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setActiveStatusFilter('unavailable')}
              >
                <StatusIndicator status="unavailable" availability={0} showText size="sm" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MapView;
