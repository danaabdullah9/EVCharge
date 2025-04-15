
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
      className={`flex items-center justify-center w-full gap-3 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-xl border border-white/20 backdrop-blur-sm ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <motion.div
          className="mr-3 flex items-center justify-center bg-white/20 rounded-full p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <i className="fas fa-car-side text-2xl text-white"></i>
        </motion.div>
        <div className="text-left">
          <p className="font-bold text-base">Add to Car Screen</p>
          <p className="text-xs opacity-90">CarPlay & Android Auto</p>
        </div>
      </div>
    </Button>
  );
};

export default CarPlayButton;
