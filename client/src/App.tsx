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
import StatusIndicator from "@/components/StatusIndicator";

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [location] = useLocation();
  const { toast } = useToast();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);

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
        
        {/* Filter Button - Only on Explorer (Map) page */}
        {location === "/" && (
          <div className="fixed left-4 bottom-48 z-[950]">
            <Button 
              variant="outline"
              className={`
                rounded-full px-4 shadow-lg h-10 flex items-center transition-all duration-200
                ${filtersVisible 
                  ? "bg-gray-100 border-gray-300 ring-2 ring-gray-300 ring-opacity-50" 
                  : "bg-white hover:bg-gray-50 border-gray-200"}
              `}
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <i className={`fas ${filtersVisible ? 'fa-times' : 'fa-sliders'} text-gray-800 mr-1.5`}></i>
              <span className="text-sm font-medium">{filtersVisible ? 'Close Filter' : 'Filter'}</span>
            </Button>
          </div>
        )}
        
        {/* Status Filter Sheet - Only on Explorer (Map) page */}
        {location === "/" && (
          <div className={`
            fixed left-4 bottom-40 lg:left-20 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-[950] 
            w-[280px] sm:w-[320px] max-h-[280px] overflow-y-auto custom-scrollbar
            transition-all duration-300
            ${filtersVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
          `}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xs text-gray-700">Filter by Status</h3>
                <button 
                  onClick={() => setFiltersVisible(false)}
                  className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <i className="fas fa-times text-gray-600 text-xs"></i>
                </button>
              </div>
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
        <div className="fixed bottom-20 left-0 right-0 z-[900] px-4 pb-2">
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
    </div>
  );
}

export default App;
