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

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [location] = useLocation();
  const { toast } = useToast();

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
        
        {location === "/" && (
          <div className="absolute bottom-16 left-0 right-0">
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
        )}
      </div>
      
      <BottomNavigation active={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </div>
  );
}

export default App;
