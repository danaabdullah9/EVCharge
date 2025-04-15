import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CarPlayButtonProps {
  onClick: () => void;
  className?: string;
}

const CarPlayButton: React.FC<CarPlayButtonProps> = ({ 
  onClick, 
  className = ""
}) => {
  return (
    <Button
      className={`flex items-center justify-center w-full gap-3 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <motion.div
          className="mr-3 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <path d="M8 14a2 2 0 0 1 4 0" />
            <path d="M12 14a2 2 0 0 1 4 0" />
          </svg>
        </motion.div>
        <div className="text-left">
          <p className="font-bold text-lg">Add to Car Screen</p>
          <p className="text-xs opacity-80">CarPlay & Android Auto</p>
        </div>
      </div>
    </Button>
  );
};

export default CarPlayButton;