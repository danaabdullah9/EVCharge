import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Logo from "./Logo";

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
  
  // Navigation items configuration
  const navItems = [
    { 
      route: '/', 
      tab: 'map', 
      label: 'Map', 
      icon: 'fa-map-marker-alt',
      ariaLabel: 'View map of charging stations'
    },
    { 
      route: '/nearby', 
      tab: 'nearby', 
      label: 'Nearby', 
      icon: 'fa-bolt',
      ariaLabel: 'Find nearby charging stations'
    },
    { 
      route: '/favorites', 
      tab: 'favorites', 
      label: 'Favorites', 
      icon: 'fa-heart',
      ariaLabel: 'View your favorite stations' 
    },
    { 
      route: '/profile', 
      tab: 'profile', 
      label: 'Profile', 
      icon: 'fa-user',
      ariaLabel: 'Go to your profile'
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg fixed bottom-0 left-0 right-0 z-20 h-16 flex items-center justify-around">
      {/* Add button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => console.log("Add station")}
          className="bg-gradient-to-tr from-green-600 to-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          aria-label="Add new charging station"
        >
          <i className="fas fa-plus text-lg"></i>
        </button>
      </div>
      
      {navItems.map((item, index) => (
        <button
          key={item.tab}
          className={`relative flex flex-col items-center justify-center px-3 ${
            location === item.route 
              ? 'text-green-600' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
          onClick={() => handleNavigation(item.route, item.tab)}
          aria-label={item.ariaLabel}
        >
          <i className={`fas ${item.icon} text-lg`}></i>
          <span className="text-xs mt-1">{item.label}</span>
          
          {location === item.route && (
            <motion.div 
              className="absolute bottom-0 w-full h-1 bg-green-600 rounded-t-full" 
              layoutId="bottomNavIndicator"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
