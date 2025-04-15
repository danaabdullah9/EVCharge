import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { InsertStation } from "@shared/schema";

interface AddStationPopupProps {
  isVisible: boolean;
  onClose: () => void;
  userLocation: [number, number] | null;
}

const AddStationPopup = ({ isVisible, onClose, userLocation }: AddStationPopupProps) => {
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [powerOutput, setPowerOutput] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  
  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  // Handle form submission
  const addStationMutation = useMutation({
    mutationFn: async (station: InsertStation) => {
      return await apiRequest('POST', '/api/stations', station);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Station Added",
        description: "Your new charging station has been added successfully. You earned 50 points!",
        duration: 5000,
      });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add the station. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error adding station:", error);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Unable to determine your location. Please enable location services.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    // Create station object
    const [latitude, longitude] = userLocation;
    
    const newStation: InsertStation = {
      name,
      address,
      latitude,
      longitude,
      chargerType,
      powerOutput: parseInt(powerOutput),
      hours,
      amenities: amenities.join(", "),
      price: price || "Free",
      status: "available",
      createdBy: 1  // Using default user ID for demo
    };
    
    addStationMutation.mutate(newStation);
  };
  
  // Reset form fields
  const resetForm = () => {
    setName("");
    setAddress("");
    setChargerType("");
    setPowerOutput("");
    setHours("");
    setPrice("");
    setAmenities([]);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute left-4 bottom-32 bg-white p-5 rounded-lg shadow-lg border border-gray-200 z-[900] w-[320px] max-h-[500px] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-green-700">Add New Charging Station</h3>
        <button 
          onClick={onClose}
          className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium flex items-center mb-1">
            <i className="fas fa-charging-station text-green-600 mr-2 text-xs"></i>
            Station Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Central Mall EV Station"
            className="h-9 text-sm"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="address" className="text-sm font-medium flex items-center mb-1">
            <i className="fas fa-map-marker-alt text-green-600 mr-2 text-xs"></i>
            Address
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address"
            className="h-9 text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="chargerType" className="text-sm font-medium flex items-center mb-1">
              <i className="fas fa-plug text-green-600 mr-2 text-xs"></i>
              Charger Type
            </Label>
            <Select
              value={chargerType}
              onValueChange={setChargerType}
              required
            >
              <SelectTrigger id="chargerType" className="h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CCS">CCS</SelectItem>
                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                <SelectItem value="Type 2">Type 2</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
                <SelectItem value="Multiple">Multiple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="powerOutput" className="text-sm font-medium flex items-center mb-1">
              <i className="fas fa-bolt text-green-600 mr-2 text-xs"></i>
              Power (kW)
            </Label>
            <Input
              id="powerOutput"
              type="number"
              value={powerOutput}
              onChange={(e) => setPowerOutput(e.target.value)}
              placeholder="e.g. 150"
              className="h-9 text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="hours" className="text-sm font-medium flex items-center mb-1">
            <i className="fas fa-clock text-green-600 mr-2 text-xs"></i>
            Operating Hours
          </Label>
          <Select
            value={hours}
            onValueChange={setHours}
            required
          >
            <SelectTrigger id="hours" className="h-9 text-sm">
              <SelectValue placeholder="Select hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24/7">24/7</SelectItem>
              <SelectItem value="6 AM - 10 PM">Daytime (6 AM - 10 PM)</SelectItem>
              <SelectItem value="8 AM - 6 PM">Business (8 AM - 6 PM)</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
            disabled={addStationMutation.isPending}
          >
            {addStationMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1"></i>
                Adding...
              </>
            ) : (
              <>
                <Plus size={14} className="mr-1" />
                Add Station
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStationPopup;