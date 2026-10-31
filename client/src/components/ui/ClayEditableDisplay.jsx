import React from 'react';
import { Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const ClayEditableDisplay = ({
  value = '',
  onEdit,
  placeholder = '',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={value}
          disabled={true}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300 outline-none
            bg-[#faf7f2] border border-transparent text-stone-600 cursor-default pr-8 truncate
          `}
        />
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          onClick={onEdit}
          type="button"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#d93829] transition-colors cursor-pointer rounded-md"
          title="Edit"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ClayEditableDisplay;
