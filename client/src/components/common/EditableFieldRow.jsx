import React from 'react';
import { Check, X, Edit3 } from 'lucide-react';

const EditableFieldRow = ({
  label,
  isEditing,
  onEditStart,
  onEditCancel,
  onSave,
  renderInput,
  renderDisplay,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-2">
      <span className="text-stone-500 font-medium text-xs w-24">
        {label}
      </span>

      <div className="flex items-center justify-end gap-2 w-full sm:w-auto flex-1 max-w-sm">
        {isEditing ? renderInput() : renderDisplay()}

        {isEditing ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onSave}
              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onEditCancel}
              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onEditStart}
            className="p-1.5 text-stone-400 hover:text-[#d93829] hover:bg-red-50 rounded-lg cursor-pointer transition-colors shrink-0"
            title={`Edit ${label}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableFieldRow;
