import React from 'react';
import { FileText } from 'lucide-react';

export const DocumentUploadSection = ({ uploadedFileName, onFileUpload }) => {
  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
          4
        </span>
        <div>
          <h3 className="text-sm font-black text-stone-900">
            Supporting Document <span className="text-[#d93829]">*</span>
          </h3>
          <p className="text-[11px] text-stone-500 font-medium">
            Upload a valid doctor's requisition note, prescription, or admission slip. This is required for verification.
          </p>
        </div>
      </div>

      <div className="relative border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer bg-[#faf7f2]/60">
        <input
          type="file"
          onChange={onFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <div className="space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600">
            <FileText className="w-5 h-5 text-[#d93829]" />
          </div>
          <div className="text-xs font-black text-stone-800">
            {uploadedFileName ? uploadedFileName : 'Upload Document'}
          </div>
          <p className="text-[10px] text-stone-400 font-semibold">
            PDF, JPG or PNG (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
