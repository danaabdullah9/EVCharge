import { useState, useEffect } from 'react';

type LocationTuple = [number, number] | null;

export function useUserLocation() {
  const [location, setLocation] = useState<LocationTuple>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { location, error, loading, getLocation };
}

export default useUserLocation;