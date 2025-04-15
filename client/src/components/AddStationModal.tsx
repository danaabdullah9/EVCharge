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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Charging Station</DialogTitle>
          <DialogDescription>
            Share a charging station with the community and earn 50 points.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Station Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Central Mall EV Station"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="chargerType">Charger Type</Label>
                <Select
                  value={chargerType}
                  onValueChange={setChargerType}
                  required
                >
                  <SelectTrigger id="chargerType">
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
                <Label htmlFor="powerOutput">Max Power (kW)</Label>
                <Input
                  id="powerOutput"
                  type="number"
                  value={powerOutput}
                  onChange={(e) => setPowerOutput(e.target.value)}
                  placeholder="e.g. 150"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="hours">Operating Hours</Label>
              <Select
                value={hours}
                onValueChange={setHours}
                required
              >
                <SelectTrigger id="hours">
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
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 0.75 SAR/kWh"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  'WiFi',
                  'Café',
                  'Restroom',
                  'Shopping',
                  'Parking',
                  'Restaurant'
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className={`
                      flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 text-sm cursor-pointer
                      ${amenities.includes(amenity) ? 'bg-green-100 border border-green-500' : ''}
                    `}
                  >
                    <Checkbox
                      checked={amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      className="mr-1 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={addStationMutation.isPending}
            >
              {addStationMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStationModal;
