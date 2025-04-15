import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const Header = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user/profile']
  });
  
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
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center h-14 relative">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white mr-2">
          <i className="fas fa-bolt"></i>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>
      
      <form 
        className="search-bar relative flex-1 mx-4"
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
              <Avatar className="h-8 w-8 border-2 border-green-600">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("profile")}>
              <i className="fas fa-user mr-2"></i> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileAction("settings")}>
              <i className="fas fa-cog mr-2"></i> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("logout")}>
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
