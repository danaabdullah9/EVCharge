import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { StationWithStats } from "@shared/schema";

interface StationMarkerProps {
  station: StationWithStats;
  onSelect: () => void;
}

const StationMarker = ({ station, onSelect }: StationMarkerProps) => {
  // Get marker color based on status
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10B981'; // green
      case 'busy':
        return '#F59E0B'; // amber
      case 'unavailable':
        return '#EF4444'; // red
      default:
        return '#9CA3AF'; // gray
    }
  };
  
  // Create SVG icon
  const createMarkerIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}" width="36" height="36"><circle cx="12" cy="12" r="11" fill="${encodeURIComponent(color)}" stroke="white" stroke-width="2"/><path d="M9 10 L10 10 L10 16 L14 16 L14 10 L15 10 L15 7 L9 7 Z M12 6 L12 4 M14 6 L16 4 M10 6 L8 4" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  return (
    <Marker
      position={[station.latitude, station.longitude]}
      icon={createMarkerIcon(getMarkerColor(station.status))}
      eventHandlers={{
        click: onSelect
      }}
    >
      <Popup>
        <div className="text-center">
          <h3 className="font-bold">{station.name}</h3>
          <p className="text-sm">{station.chargerType} • {station.powerOutput}kW</p>
          <button 
            className="text-xs bg-blue-600 text-white py-1 px-2 rounded mt-1"
            onClick={onSelect}
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
