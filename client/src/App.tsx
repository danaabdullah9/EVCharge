import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MapView from "@/pages/MapView";
import Nearby from "@/pages/Nearby";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import CarPlayButton from "@/components/CarPlayButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddStationModal from "@/components/AddStationModal";
import StatusIndicator from "@/components/StatusIndicator";
import useUserLocation from "@/hooks/useUserLocation";

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [location] = useLocation();
  const { toast } = useToast();
  const { location: userLocation } = useUserLocation();
  const [addStationModalVisible, setAddStationModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);

  // Handle adding a new station
  const handleAddStation = () => {
    setAddStationModalVisible(true);
  };

  return (
    <div className="app-container h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 relative flex flex-col">
        <Switch>
          <Route path="/" component={MapView} />
          <Route path="/nearby" component={Nearby} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
        
        {/* Add Station Button - Only on Explorer (Map) page */}
        {location === "/" && (
          <div className="fixed left-4 bottom-24 z-[950]">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg w-12 h-12"
              onClick={handleAddStation}
            >
              <i className="fas fa-plus text-xl"></i>
            </Button>
          </div>
        )}
        
        {/* Filter Button - Only on Explorer (Map) page */}
        {location === "/" && (
          <div className="fixed left-4 bottom-40 z-[950]">
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-50 rounded-full p-4 shadow-lg border border-gray-200 w-12 h-12"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <i className="fas fa-sliders text-gray-800"></i>
            </Button>
          </div>
        )}
        
        {/* Status Filter Sheet - Only on Explorer (Map) page */}
        {location === "/" && filtersVisible && (
          <div className="fixed left-0 bottom-20 ml-20 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[950]">
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
        
        {/* CarPlay Button - Positioned at the bottom above nav */}
        <div className="fixed bottom-16 left-0 right-0 z-[900] px-4 pb-2">
          <CarPlayButton 
            onClick={() => {
              toast({
                title: "Car screen integration",
                description: "Connect your phone to your car to use this app via CarPlay or Android Auto",
                duration: 3000,
              });
            }}
          />
        </div>
      </div>
      
      <BottomNavigation active={activeTab} onTabChange={setActiveTab} />
      <Toaster />
      
      {/* Add Station Modal */}
      <AddStationModal 
        isVisible={addStationModalVisible}
        onClose={() => setAddStationModalVisible(false)}
        userLocation={userLocation}
      />
    </div>
  );
}

export default App;
