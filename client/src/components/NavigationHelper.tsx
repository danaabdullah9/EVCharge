import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NavigationHelperProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
  latitude: number;
  longitude: number;
}

const NavigationHelper: React.FC<NavigationHelperProps> = ({
  isOpen,
  onClose,
  stationName,
  latitude,
  longitude
}) => {
  // Determine the user's operating system/device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  // Function to open Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`;
    window.open(url, '_blank');
    onClose();
  };
  
  // Function to open Apple Maps (for iOS devices)
  const openAppleMaps = () => {
    const url = `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    window.open(url, '_blank');
    onClose();
  };
  
  // Function to open Waze
  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    window.open(url, '_blank');
    onClose();
  };
  
  // Copy coordinates to clipboard
  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${latitude},${longitude}`);
    onClose();
    // You would typically show a toast notification here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Navigate to Station</DialogTitle>
          <DialogDescription>
            Choose your preferred navigation app to get directions to {stationName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Google Maps - Works on all platforms */}
          <Button 
            onClick={openGoogleMaps}
            className="flex items-center justify-start gap-3 h-auto py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#34A853" d="M12 12.75c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                <path fill="#4285F4" d="M12 3C8.13 3 5 6.13 5 10c0 3.87 3.13 7 7 7a7 7 0 0 0 7-7c0-3.87-3.13-7-7-7zm0 11.5A4.5 4.5 0 0 1 7.5 10 4.5 4.5 0 0 1 12 5.5 4.5 4.5 0 0 1 16.5 10a4.5 4.5 0 0 1-4.5 4.5z"/>
                <path fill="#FBBC05" d="M12 8.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z"/>
                <path fill="#EA4335" d="M20 10c0 4.42-3.58 8-8 8a7.89 7.89 0 0 1-5.5-2.21l-5.36 5.36A9.97 9.97 0 0 0 12 24c6.63 0 12-5.37 12-12 0-6.63-5.37-12-12-12C5.37 0 0 5.37 0 12c0 1.52.35 2.94.95 4.22l5.36-5.36A7.89 7.89 0 0 1 4 10c0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Google Maps</span>
              <span className="text-xs text-gray-500">Works on all devices</span>
            </div>
          </Button>
          
          {/* Apple Maps - iOS only */}
          {isIOS && (
            <Button 
              onClick={openAppleMaps}
              className="flex items-center justify-start gap-3 h-auto py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#157EFB" d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm0 15c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7.1-5.6l-5.8-5.8c-.7-.7-1.8-.7-2.5 0l-5.8 5.8c-.7.7-.7 1.8 0 2.5l5.8 5.8c.7.7 1.8.7 2.5 0l5.8-5.8c.7-.7.7-1.8 0-2.5z"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Apple Maps</span>
                <span className="text-xs text-gray-500">iOS and macOS</span>
              </div>
            </Button>
          )}
          
          {/* Waze - Popular in Saudi Arabia */}
          <Button 
            onClick={openWaze}
            className="flex items-center justify-start gap-3 h-auto py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#33CCFF" d="M20.1 11.2c0-4.8-3.9-8.7-8.7-8.7s-8.7 3.9-8.7 8.7c0 2.3.9 4.5 2.5 6.1.3.3.6.5.9.7.1.1.3.2.4.3.8.6 1.8 1 2.8 1.3.7.2 1.4.2 2.1.2.7 0 1.4-.1 2.1-.2 1-.2 2-.7 2.8-1.3.1-.1.3-.2.4-.3.3-.2.6-.5.9-.7 1.6-1.6 2.5-3.8 2.5-6.1z"/>
                <path fill="#FFC700" d="M13.5 7.2c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm-5.1 3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm9.6 0c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Waze</span>
              <span className="text-xs text-gray-500">Popular in Saudi Arabia</span>
            </div>
          </Button>
          
          {/* Copy coordinates */}
          <Button 
            onClick={copyCoordinates}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <i className="fas fa-copy"></i>
            Copy Coordinates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationHelper;