
import { useQuery } from "@tanstack/react-query";

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  availability: number;
  reliability: number;
}

export function useStations() {
  const { data: stations, isLoading, error } = useQuery<Station[]>({
    queryKey: ["stations"],
    queryFn: async () => {
      const response = await fetch("/api/stations");
      if (!response.ok) {
        throw new Error("Failed to fetch stations");
      }
      return response.json();
    }
  });

  return { stations, isLoading, error };
}
