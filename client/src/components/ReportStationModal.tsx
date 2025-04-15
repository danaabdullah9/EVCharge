import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StationWithStats, InsertReport } from "@shared/schema";

interface ReportStationModalProps {
  isVisible: boolean;
  station: StationWithStats;
  onClose: () => void;
}

const ReportStationModal = ({ isVisible, station, onClose }: ReportStationModalProps) => {
  const { toast } = useToast();
  
  // Form state
  const [status, setStatus] = useState<string>("available");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [issues, setIssues] = useState<string[]>([]);
  
  // Get star classname
  const getStarClass = (star: number) => {
    if (star <= rating) {
      return "fas fa-star text-amber-500";
    }
    return "far fa-star text-amber-500";
  };
  
  // Issues options
  const availableIssues = [
    'Out of service',
    'Payment issue',
    'Cable damaged',
    'Location issue',
    'App issue',
    'Blocked access'
  ];
  
  // Toggle issue
  const toggleIssue = (issue: string) => {
    if (issues.includes(issue)) {
      setIssues(issues.filter(i => i !== issue));
    } else {
      setIssues([...issues, issue]);
    }
  };
  
  // Submit report mutation
  const submitReportMutation = useMutation({
    mutationFn: async (report: InsertReport) => {
      const response = await apiRequest('POST', '/api/reports', report);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      queryClient.invalidateQueries({ queryKey: [`/api/stations/${station.id}`] });
      
      toast({
        title: "Report submitted",
        description: "Thank you for your report! You earned 20 points.",
        duration: 3000,
      });
      
      // Reset form
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to submit report",
        description: error.toString(),
        variant: "destructive",
        duration: 3000,
      });
    }
  });
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please add a rating",
        description: "Select at least 1 star to rate this station",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const report: InsertReport = {
      stationId: station.id,
      userId: 1, // This would be the actual user ID in a real app
      status,
      rating,
      comment,
      issues
    };
    
    submitReportMutation.mutate(report);
  };
  
  // Reset form
  const resetForm = () => {
    setStatus("available");
    setRating(0);
    setComment("");
    setIssues([]);
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Report</DialogTitle>
          <DialogDescription>
            Reporting on <span className="font-medium">{station.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Status</Label>
              <RadioGroup 
                value={status} 
                onValueChange={setStatus}
                className="grid grid-cols-3 gap-2"
              >
                <div className={`
                  flex flex-col items-center text-center p-2 border rounded-lg cursor-pointer
                  ${status === 'available' ? 'border-green-600' : 'border-gray-200'}
                `}>
                  <RadioGroupItem 
                    value="available" 
                    id="status-available" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="status-available" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <i className="fas fa-check-circle text-green-600 text-2xl mb-1"></i>
                    <span className="text-sm">Available</span>
                  </Label>
                </div>
                
                <div className={`
                  flex flex-col items-center text-center p-2 border rounded-lg cursor-pointer
                  ${status === 'busy' ? 'border-amber-500' : 'border-gray-200'}
                `}>
                  <RadioGroupItem 
                    value="busy" 
                    id="status-busy" 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor="status-busy" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <i className="fas fa-clock text-amber-500 text-2xl mb-1"></i>
                    <span className="text-sm">Busy</span>
                  </Label>
                </div>
                
                <div className={`
                  flex flex-col items-center text-center p-2 border rounded-lg cursor-pointer
                  ${status === 'unavailable' ? 'border-red-500' : 'border-gray-200'}
                `}>
                  <RadioGroupItem 
                    value="unavailable" 
                    id="status-unavailable" 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor="status-unavailable" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <i className="fas fa-times-circle text-red-500 text-2xl mb-1"></i>
                    <span className="text-sm">Unavailable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>Your Rating</Label>
              <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={getStarClass(star)}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="h-24"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Issues (if any)</Label>
              <div className="flex flex-wrap gap-2">
                {availableIssues.map((issue) => (
                  <label
                    key={issue}
                    className={`
                      flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 text-sm cursor-pointer
                      ${issues.includes(issue) ? 'bg-red-100 border border-red-500' : ''}
                    `}
                  >
                    <Checkbox
                      checked={issues.includes(issue)}
                      onCheckedChange={() => toggleIssue(issue)}
                      className="mr-1 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                    />
                    <span>{issue}</span>
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
              disabled={submitReportMutation.isPending}
            >
              {submitReportMutation.isPending ? (
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

export default ReportStationModal;
