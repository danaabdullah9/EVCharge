import { useLocation } from "wouter";

interface BottomNavigationProps {
  active: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ active, onTabChange }: BottomNavigationProps) => {
  const [location, setLocation] = useLocation();
  
  const handleNavigation = (route: string, tab: string) => {
    setLocation(route);
    onTabChange(tab);
  };

  return (
    <nav className="bg-white border-t border-gray-200 h-14 flex items-center justify-around">
      <button 
        className={`flex flex-col items-center justify-center w-20 ${location === '/' ? 'text-green-600' : 'text-gray-500'}`}
        onClick={() => handleNavigation('/', 'map')}
      >
        <i className="fas fa-map-marker-alt text-lg"></i>
        <span className="text-xs mt-1">Map</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${location === '/nearby' ? 'text-green-600' : 'text-gray-500'}`}
        onClick={() => handleNavigation('/nearby', 'nearby')}
      >
        <i className="fas fa-bolt text-lg"></i>
        <span className="text-xs mt-1">Nearby</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${location === '/favorites' ? 'text-green-600' : 'text-gray-500'}`}
        onClick={() => handleNavigation('/favorites', 'favorites')}
      >
        <i className="fas fa-heart text-lg"></i>
        <span className="text-xs mt-1">Favorites</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${location === '/profile' ? 'text-green-600' : 'text-gray-500'}`}
        onClick={() => handleNavigation('/profile', 'profile')}
      >
        <i className="fas fa-user text-lg"></i>
        <span className="text-xs mt-1">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
