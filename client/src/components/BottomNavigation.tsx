import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  active: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ active, onTabChange }) => {
  const [location] = useLocation();
  
  const handleNavigate = (path: string, tab: string) => {
    // Only navigate if we're not already on this page
    if (location !== path) {
      onTabChange(tab);
    }
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const navItems = [
    { id: 'map', name: 'Map', path: '/', icon: 'fa-map' },
    { id: 'nearby', name: 'Nearby', path: '/nearby', icon: 'fa-bolt' },
    { id: 'favorites', name: 'Favorites', path: '/favorites', icon: 'fa-heart' },
    { id: 'profile', name: 'Profile', path: '/profile', icon: 'fa-user' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 shadow-lg z-50">
      {navItems.map((item) => (
        <Link 
          key={item.id}
          href={item.path}
          onClick={() => handleNavigate(item.path, item.id)} 
          className="flex-1"
        >
          <div 
            className={cn(
              "flex flex-col items-center justify-center h-full relative transition-colors duration-200",
              isActive(item.path) ? "text-green-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {isActive(item.path) && (
              <motion.div
                className="absolute -top-2 w-12 h-1 bg-green-600 rounded-full"
                layoutId="bottomNavIndicator"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            <i className={`fas ${item.icon} text-lg`}></i>
            
            <span className="text-xs mt-1 font-medium">{item.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;