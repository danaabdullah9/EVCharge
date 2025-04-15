import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { useStations } from "@/hooks/useStations";
import StationMarker from "@/components/StationMarker";
import { useUserLocation } from "@/hooks/useUserLocation";
import { cn } from "@/lib/utils";
import { MdRefresh, MdFilterList } from "react-icons/md";

export default function MapView() {
  const { stations, isLoading } = useStations();
  const { location, error: locationError, getLocation } = useUserLocation();
  const [showFilters, setShowFilters] = useState(false);

  // Update map center when user location changes
  function MapCenter() {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView([location.latitude, location.longitude], 13);
      }
    }, [location, map]);
    return null;
  }

  return (
    <div className="relative flex-1">
      <MapContainer
        center={[24.7136, 46.6753]} // Default to Riyadh
        zoom={13}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenter />

        {stations?.map((station) => (
          <StationMarker key={station.id} station={station} />
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "bg-background/80 backdrop-blur-sm hover:bg-background/90",
            showFilters && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => setShowFilters(!showFilters)}
        >
          <MdFilterList className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={getLocation}
        >
          <MdRefresh className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default MapView;