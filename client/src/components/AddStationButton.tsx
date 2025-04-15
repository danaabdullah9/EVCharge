import React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddStationButtonProps {
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}

const AddStationButton: React.FC<AddStationButtonProps> = ({ onClick, className, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed left-4 bottom-36 px-4 h-10 rounded-full shadow-lg flex items-center justify-center text-white z-[750] transition-all duration-200",
        isActive 
          ? "bg-green-700 hover:bg-green-800 ring-2 ring-green-400 ring-opacity-50" 
          : "bg-green-600 hover:bg-green-700",
        className
      )}
      aria-label={isActive ? "Close Add Station" : "Add Station"}
    >
      {isActive ? (
        <X size={16} className="mr-1.5" />
      ) : (
        <Plus size={16} className="mr-1.5" />
      )}
      <span className="text-sm font-medium">{isActive ? "Close Panel" : "Add Station"}</span>
    </button>
  );
};

export default AddStationButton;