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
    { id: 'map', name: 'Explore', path: '/', icon: 'fa-location-dot' },
    { id: 'nearby', name: 'Near You', path: '/nearby', icon: 'fa-charging-station' },
    { id: 'favorites', name: 'Saved', path: '/favorites', icon: 'fa-star' },
    { id: 'profile', name: 'Account', path: '/profile', icon: 'fa-circle-user' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center px-2 shadow-md z-[1000]">
      {navItems.map((item) => (
        <Link 
          key={item.id}
          href={item.path}
          onClick={() => handleNavigate(item.path, item.id)} 
          className="flex-1"
        >
          <div 
            className={cn(
              "flex flex-col items-center justify-center h-full relative transition-all duration-200",
              isActive(item.path) ? "text-green-600 scale-105" : "text-gray-400 hover:text-gray-600"
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