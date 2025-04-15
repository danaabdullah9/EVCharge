import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: string;
  availability: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  availability,
  animate = true,
  size = 'md',
  showText = true,
  className = ''
}) => {
  // Size mapping
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-600',
          textColor: 'text-green-600',
          label: 'Available'
        };
      case 'busy':
        return {
          color: 'bg-amber-500',
          textColor: 'text-amber-500',
          label: 'Busy'
        };
      case 'unavailable':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-500',
          label: 'Unavailable'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          label: status
        };
    }
  };
  
  const { color, textColor, label } = getStatusInfo(status);
  
  // Pulse animation variants
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    noPulse: {
      scale: 1,
      opacity: 1
    }
  };
  
  // For 'busy' status, we show a pulsing animation based on availability
  const pulseSpeed = 
    status === 'busy' && availability > 60 ? 3 : 
    status === 'busy' && availability > 30 ? 2 : 
    1.5;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <motion.div 
          className={`${color} rounded-full ${sizeMap[size]}`}
          variants={pulseVariants}
          animate={animate && status !== 'unavailable' ? 'pulse' : 'noPulse'}
          transition={{
            duration: pulseSpeed,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {status === 'busy' && animate && (
          <motion.div 
            className={`absolute -inset-1 ${color} rounded-full opacity-30`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ 
              duration: pulseSpeed,
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </div>
      
      {showText && (
        <span className={`ml-2 font-medium ${textColor} ${textSizeMap[size]}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;