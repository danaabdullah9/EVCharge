import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MapView from "@/pages/MapView";
import Nearby from "@/pages/Nearby";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="app-container h-screen flex flex-col">
      <Header />
      
      <Switch>
        <Route path="/" component={MapView} />
        <Route path="/nearby" component={Nearby} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      
      <BottomNavigation active={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </div>
  );
}

export default App;
