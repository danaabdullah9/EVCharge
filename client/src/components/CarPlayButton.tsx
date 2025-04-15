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
      className={`flex items-center justify-center w-full gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl ${className}`}
      onClick={onClick}
    >
      <i className="fas fa-car text-xl"></i>
      <div className="flex flex-col items-center text-sm">
        <span>Add to Car Screen</span>
        <span className="text-xs text-white/80">CarPlay & Android Auto</span>
      </div>
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