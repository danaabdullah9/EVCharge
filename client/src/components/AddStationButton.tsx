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
        "fixed left-4 bottom-24 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center text-white z-[750]",
        className
      )}
      aria-label="Add Station"
    >
      <Plus size={20} />
    </button>
  );
};

export default AddStationButton;