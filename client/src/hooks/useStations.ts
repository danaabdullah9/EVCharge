
import { useQuery } from "@tanstack/react-query";
import { StationWithStats } from "@shared/schema";

export function useStations() {
  const { data, isLoading, isError, error } = useQuery<StationWithStats[]>({
    queryKey: ['/api/stations'],
    staleTime: 60000
  });

  return {
    stations: data || [],
    isLoading,
    isError,
    error
  };
}

export default useStations;
