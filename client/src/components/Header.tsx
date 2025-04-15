import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import Logo from "./Logo";
import SaudiAvatar from "./SaudiAvatar";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user/profile']
  });
  
  // Monitor scroll position for header styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (location === "/nearby") return "Nearby Stations";
    if (location === "/favorites") return "Favorites";
    if (location === "/profile") return "Profile";
    return "EV Spots";
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search operation
    console.log("Searching for:", searchQuery);
  };
  
  // Handle profile menu
  const handleProfileAction = (action: string) => {
    if (action === "profile") {
      setLocation("/profile");
    } else if (action === "settings") {
      // Open settings page
    } else if (action === "logout") {
      // Logout logic
    }
  };

  return (
    <header className={`bg-white border-b sticky top-0 z-20 transition-all duration-200 ${
      isScrolled ? 'shadow-md border-transparent' : 'border-gray-200'
    } py-2 px-4 flex justify-between items-center h-14 relative`}>
      <div className="flex items-center">
        <div onClick={() => setLocation("/")} className="cursor-pointer flex items-center">
          <Logo size="sm" className="mr-2" />
          <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{getPageTitle()}</h1>
          <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
            {location === "/" ? "EV Spots" : ""}
          </h1>
        </div>
      </div>
      
      <form 
        className="search-bar relative flex-1 mx-2 sm:mx-4 max-w-md lg:max-w-xl"
        onSubmit={handleSearch}
      >
        <Input
          type="text" 
          placeholder="Search locations..." 
          className="w-full py-1.5 px-10 bg-gray-100 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
        <Button 
          type="button"
          variant="ghost" 
          size="icon"
          className="absolute right-1 top-0.5 text-gray-400 h-7 w-7"
          onClick={() => {
            // In a real app, this would open a filter modal
            console.log("Filter clicked");
          }}
        >
          <i className="fas fa-filter"></i>
        </Button>
      </form>
      
      <div className="flex items-center">
        <div className="relative mr-1">
          <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1">2</span>
          <Button 
            variant="ghost" 
            size="icon"
            className="p-2 rounded-full hover:bg-gray-100 h-9 w-9"
            aria-label="Notifications"
            onClick={() => {
              // In a real app, this would open a notifications drawer
              console.log("Notifications clicked");
            }}
          >
            <i className="fas fa-bell text-gray-600"></i>
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ml-1">
              <SaudiAvatar 
                username={user?.username} 
                profileImage={user?.profileImage}
                size="sm"
                className="border-2 border-green-600"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 flex items-center">
              <SaudiAvatar 
                username={user?.username} 
                profileImage={user?.profileImage}
                size="md"
                className="mr-3"
              />
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="px-3 py-1">
              <div className="text-xs font-medium text-green-600">
                {user?.points || 0} points
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (user?.points || 0) / 2)}%` }}
                ></div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("profile")} className="cursor-pointer">
              <i className="fas fa-user mr-2"></i> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileAction("settings")} className="cursor-pointer">
              <i className="fas fa-cog mr-2"></i> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("logout")} className="cursor-pointer">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
