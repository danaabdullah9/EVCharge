
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useStations } from '@/hooks/useStations';
import AddStationModal from '@/components/AddStationModal';
import ReportStationModal from '@/components/ReportStationModal';
import StationMarker from '@/components/StationMarker';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SmartRecommendation from '@/components/SmartRecommendation';

function MapView() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { userLocation } = useUserLocation();
  const { stations, isLoading } = useStations();
  const { toast } = useToast();
  
  const mapRef = useRef(null);

  return (
    <div className="h-full relative">
      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={13}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {stations?.map(station => (
            <StationMarker
              key={station.id}
              station={station}
              onClick={() => setSelectedStation(station)}
            />
          ))}
          
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      )}

      <div className="absolute bottom-4 right-4 z-[400]">
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Add Station
        </Button>
      </div>

      {selectedStation && (
        <SmartRecommendation
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onReport={() => {
            setSelectedStation(null);
            setShowReportModal(true);
          }}
        />
      )}

      <AddStationModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ReportStationModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}

export default MapView;
