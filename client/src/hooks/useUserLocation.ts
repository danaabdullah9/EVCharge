import { useState, useEffect } from "react";

type LocationTuple = [number, number] | null;

export default function useUserLocation() {
  const [location, setLocation] = useState<LocationTuple>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
        
        // Fallback to Saudi Arabia center if geolocation fails
        setLocation([24.7136, 46.6753]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Get location on mount
  useEffect(() => {
    getLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refreshLocation: getLocation
  };
};

export default useUserLocation;
