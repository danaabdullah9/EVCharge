import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StationWithStats } from "@shared/schema";
import NavigationHelper from './NavigationHelper';

interface BottomSheetProps {
  station: StationWithStats;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleFavorite: () => void;
  onShareStation: () => void;
  onStartNavigation: () => void;
  onAddReport: () => void;
}

const BottomSheet = ({
  station,
  isExpanded,
  onToggleExpand,
  onToggleFavorite,
  onShareStation,
  onStartNavigation,
  onAddReport
}: BottomSheetProps) => {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isNavigationDialogOpen, setIsNavigationDialogOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // Handle drag behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;
    const delta = e.touches[0].clientY - dragStart;
    if (delta > 0) { // Only allow downward dragging when expanded
      setDragDelta(delta);
      
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (dragDelta > 80) {
      onToggleExpand();
    }
    
    // Reset position
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    
    setDragStart(null);
    setDragDelta(0);
  };
  
  // Reset position when expanded state changes
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  }, [isExpanded]);
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 text-white';
      case 'busy':
        return 'bg-amber-500 text-white';
      case 'unavailable':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return status;
    }
  };
  
  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-amber-500"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-amber-500"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-amber-500"></i>);
      }
    }
    
    return stars;
  };
  
  // Format amenities
  const formatAmenities = (amenities: string[]) => {
    const amenityIcons: Record<string, string> = {
      'WiFi': 'fa-wifi',
      'Café': 'fa-coffee',
      'Restroom': 'fa-restroom',
      'Shopping': 'fa-shopping-bag',
      'Parking': 'fa-parking',
      'Restaurant': 'fa-utensils'
    };
    
    return amenities.map((amenity, index) => (
      <span key={index} className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full inline-flex items-center mr-2 mb-2">
        <i className={`fas ${amenityIcons[amenity] || 'fa-plus'} mr-1`}></i> {amenity}
      </span>
    ));
  };
  
  // Get availability text
  const getAvailabilityText = (availability: number) => {
    if (availability >= 80) return "High";
    if (availability >= 40) return "Medium";
    return "Low";
  };
  
  // Get reliability text
  const getReliabilityText = (reliability: number) => {
    if (reliability >= 90) return "Excellent";
    if (reliability >= 70) return "Very Good";
    if (reliability >= 50) return "Good";
    if (reliability >= 30) return "Fair";
    return "Poor";
  };

  return (
    <div 
      ref={sheetRef}
      className={`bottom-sheet bg-white rounded-t-3xl absolute bottom-0 left-0 w-full z-10 shadow-lg transition-transform duration-300 ease-out overflow-hidden ${
        isExpanded ? 'max-h-[85vh]' : 'max-h-[25vh]'
      } ${
        isExpanded ? '' : 'translate-y-[calc(100%-100px)]'
      }`}
    >
      {/* Drag Handle */}
      <div 
        className="h-10 flex justify-center items-center cursor-pointer"
        onClick={onToggleExpand}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Collapsed View */}
      <div className={`px-6 pb-4 ${isExpanded ? 'hidden' : 'block'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`${getStatusColor(station.status)} w-8 h-8 rounded-full flex items-center justify-center mr-3`}>
              <i className="fas fa-plug"></i>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{station.name}</h2>
              <p className="text-sm text-gray-500">{station.address}</p>
            </div>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={onStartNavigation}
          >
            <i className="fas fa-directions mr-1"></i> Navigate
          </Button>
        </div>
      </div>
      
      {/* Expanded View */}
      <div className={`px-6 pb-20 overflow-y-auto ${isExpanded ? 'block' : 'hidden'} max-h-[calc(85vh-40px)]`}>
        {/* Station Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <h2 className="font-semibold text-xl mr-2">{station.name}</h2>
              <Badge className={getStatusColor(station.status)}>
                {getStatusText(station.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{station.address}</p>
            
            {/* Rating */}
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {renderStars(station.rating)}
              </div>
              <span className="text-sm ml-1 text-gray-600">{station.rating}</span>
              <span className="text-sm ml-1 text-gray-500">({station.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="p-2 rounded-full hover:bg-gray-100 h-10 w-10"
              onClick={onToggleFavorite}
            >
              <i className={`${station.isFavorite ? 'fas text-red-500' : 'far text-gray-400'} fa-heart`}></i>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="p-2 rounded-full hover:bg-gray-100 h-10 w-10"
              onClick={onShareStation}
            >
              <i className="fas fa-share-alt text-gray-600"></i>
            </Button>
          </div>
        </div>
        
        {/* Station Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 className="font-medium mb-3">Station Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Charger Type</p>
              <p className="font-medium">{station.chargerType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Power Output</p>
              <p className="font-medium">{station.powerOutput} kW</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Operating Hours</p>
              <p className="font-medium">{station.hours}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{station.price || 'Free'}</p>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-500">Amenities</p>
            <div className="flex flex-wrap mt-1">
              {formatAmenities(station.amenities as string[])}
            </div>
          </div>
        </div>
        
        {/* Availability & Reliability */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 className="font-medium mb-3">Current Status</h3>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Availability</span>
              <span className="text-sm font-medium">
                {getAvailabilityText(station.availability)}
              </span>
            </div>
            <Progress 
              value={station.availability} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Reliability Score</span>
              <span className="text-sm font-medium">
                {getReliabilityText(station.reliability)}
              </span>
            </div>
            <Progress 
              value={station.reliability} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          <div className="mt-3 text-sm">
            <span className="text-gray-600">
              <i className="fas fa-clock text-gray-400 mr-1"></i>
              <span>Last updated {station.lastReported}</span>
            </span>
          </div>
        </div>
        
        {/* User Reports */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Recent Reports</h3>
            <Button variant="link" className="text-blue-600 p-0 h-auto">See all</Button>
          </div>
          
          {station.reports && station.reports.length > 0 ? (
            station.reports.map((report, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <Avatar className="w-8 h-8 mr-3">
                      <AvatarImage src={report.user.profileImage || ''} />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {report.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{report.user.username}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {renderStars(report.rating)}
                  </div>
                </div>
                <p className="text-sm mt-2">{report.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No reports yet</p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
            onClick={() => setIsNavigationDialogOpen(true)}
          >
            <i className="fas fa-directions mr-1"></i> Navigate
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
            onClick={onAddReport}
          >
            <i className="fas fa-comment-alt mr-1"></i> Add Report
          </Button>
        </div>
      </div>
      
      {/* Navigation Helper Dialog */}
      <NavigationHelper 
        isOpen={isNavigationDialogOpen}
        onClose={() => setIsNavigationDialogOpen(false)}
        stationName={station.name}
        latitude={station.latitude}
        longitude={station.longitude}
      />
    </div>
  );
};

export default BottomSheet;
