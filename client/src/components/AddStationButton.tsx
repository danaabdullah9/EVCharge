import React from 'react';
import { Plus } from 'lucide-react';

interface AddStationButtonProps {
  onClick: () => void;
}

const AddStationButton: React.FC<AddStationButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed left-4 bottom-24 z-[750]">
      <button
        onClick={onClick}
        className="w-12 h-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700 transition-all"
        aria-label="Add Station"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );
};

export default AddStationButton;