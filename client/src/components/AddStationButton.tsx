import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddStationButtonProps {
  onClick: () => void;
  className?: string;
}

const AddStationButton: React.FC<AddStationButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed left-4 bottom-24 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-200 z-[750]",
        className
      )}
      aria-label="Add Station"
    >
      <Plus size={18} className="text-green-600" />
    </button>
  );
};

export default AddStationButton;