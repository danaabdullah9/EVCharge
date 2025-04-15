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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { InsertStation } from "@shared/schema";

interface AddStationModalProps {
  isVisible: boolean;
  onClose: () => void;
  userLocation: [number, number] | null;
}

const AddStationModal = ({ isVisible, onClose, userLocation }: AddStationModalProps) => {
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [powerOutput, setPowerOutput] = useState("");
  const [hours, setHours] = useState("24/7");
  const [price, setPrice] = useState("");
  
  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  
  // Mutation to add station
  const addStationMutation = useMutation({
    mutationFn: async (station: InsertStation) => {
      const response = await apiRequest('POST', '/api/stations', station);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      
      toast({
        title: "Station added successfully",
        description: "Thank you for contributing! You earned 50 points.",
        duration: 3000,
      });
      
      // Reset form
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to add station",
        description: error.toString(),
        variant: "destructive",
        duration: 3000,
      });
    }
  });
  
  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation) {
      toast({
        title: "Location error",
        description: "Could not determine your location. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const [latitude, longitude] = userLocation;
    
    const newStation: InsertStation = {
      name,
      address,
      chargerType,
      powerOutput: parseFloat(powerOutput),
      hours,
      price: price || "Free",
      amenities,
      latitude,
      longitude,
      status: "available",
      createdBy: 1 // This would be the actual user ID in a real app
    };
    
    addStationMutation.mutate(newStation);
  };
  
  // Reset form
  const resetForm = () => {
    setName("");
    setAddress("");
    setChargerType("");
    setPowerOutput("");
    setHours("24/7");
    setPrice("");
    setAmenities([]);
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95%] rounded-xl border border-gray-200 shadow-2xl py-6 mt-12 mb-4">
        <button 
          className="absolute right-4 top-4 rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times text-gray-600"></i>
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-700">Add New Charging Station</DialogTitle>
          <DialogDescription className="flex items-center mt-2">
            <i className="fas fa-award text-green-600 mr-2"></i>
            Share a charging station with the community and earn 50 points.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                <i className="fas fa-charging-station text-green-600 mr-2"></i>
                Station Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Central Mall EV Station"
                  className="pl-10 focus-within:border-green-600"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-tag text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center">
                <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
                Address
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  className="pl-10 focus-within:border-green-600"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-location-dot text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="chargerType" className="flex items-center">
                  <i className="fas fa-plug text-green-600 mr-2"></i>
                  Charger Type
                </Label>
                <Select
                  value={chargerType}
                  onValueChange={setChargerType}
                  required
                >
                  <SelectTrigger id="chargerType" className="focus:ring-green-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CCS">CCS</SelectItem>
                    <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                    <SelectItem value="Type 2">Type 2</SelectItem>
                    <SelectItem value="Tesla">Tesla</SelectItem>
                    <SelectItem value="CCS / Type 2">CCS / Type 2</SelectItem>
                    <SelectItem value="Multiple Types">Multiple Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="powerOutput" className="flex items-center">
                  <i className="fas fa-bolt text-green-600 mr-2"></i>
                  Max Power (kW)
                </Label>
                <div className="relative">
                  <Input
                    id="powerOutput"
                    type="number"
                    value={powerOutput}
                    onChange={(e) => setPowerOutput(e.target.value)}
                    placeholder="e.g. 150"
                    className="pl-10 focus-within:border-green-600"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fas fa-gauge-high text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="hours" className="flex items-center">
                <i className="fas fa-clock text-green-600 mr-2"></i>
                Operating Hours
              </Label>
              <Select
                value={hours}
                onValueChange={setHours}
                required
              >
                <SelectTrigger id="hours" className="focus:ring-green-600">
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24/7">24/7</SelectItem>
                  <SelectItem value="6 AM - 10 PM">Daytime only (6 AM - 10 PM)</SelectItem>
                  <SelectItem value="8 AM - 6 PM">Business hours (8 AM - 6 PM)</SelectItem>
                  <SelectItem value="Custom">Custom hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price" className="flex items-center">
                <i className="fas fa-tag text-green-600 mr-2"></i>
                Price (optional)
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 0.75 SAR/kWh"
                  className="pl-10 focus-within:border-green-600"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-money-bill text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="flex items-center">
                <i className="fas fa-concierge-bell text-green-600 mr-2"></i>
                <span>Amenities Available</span>
              </Label>
              <div className="flex flex-wrap gap-3 mt-1">
                {[
                  { name: 'WiFi', icon: 'fa-wifi' },
                  { name: 'Café', icon: 'fa-coffee' },
                  { name: 'Restroom', icon: 'fa-toilet' },
                  { name: 'Shopping', icon: 'fa-shopping-bag' },
                  { name: 'Parking', icon: 'fa-parking' },
                  { name: 'Restaurant', icon: 'fa-utensils' }
                ].map(({ name, icon }) => (
                  <label
                    key={name}
                    className={`
                      flex items-center gap-2 rounded-full px-3 py-2 text-sm cursor-pointer transition-all
                      ${amenities.includes(name) 
                        ? 'bg-green-100 border border-green-500 text-green-800 shadow-sm' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                    `}
                  >
                    <Checkbox
                      checked={amenities.includes(name)}
                      onCheckedChange={() => toggleAmenity(name)}
                      className="mr-1 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                    />
                    <i className={`fas ${icon} mr-1 ${amenities.includes(name) ? 'text-green-600' : ''}`}></i>
                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
              disabled={addStationMutation.isPending}
            >
              {addStationMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStationModal;
