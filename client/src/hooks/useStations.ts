import { useQuery } from "@tanstack/react-query";
import { StationWithStats } from "@shared/schema";

export default function useStations() {
  const { data, isLoading, isError, error } = useQuery<StationWithStats[]>({
    queryKey: ['/api/stations'],
    staleTime: 60000, // 1 minute
  });

  return {
    stations: data || [],
    isLoading,
    isError,
    error,
  };
};

export default useStations;
