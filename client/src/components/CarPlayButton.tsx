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
      className={`flex items-center justify-center w-full gap-3 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-xl ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <motion.div
          className="mr-3 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <i className="fas fa-car-side text-3xl text-white"></i>
        </motion.div>
        <div className="text-left">
          <p className="font-bold text-lg">Add to Car Screen</p>
          <p className="text-xs opacity-90">CarPlay & Android Auto</p>
        </div>
      </div>
    </Button>
  );
};

export default CarPlayButton;