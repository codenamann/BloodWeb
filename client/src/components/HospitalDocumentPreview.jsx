import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

export const HospitalDocumentPreview = ({ document }) => {
  if (!document) return null;

  const { url, originalName, documentType, size } = document;
  const sizeKb = Math.round(size / 1024);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
      <div className="flex items-center justify-between p-3 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          {documentType === 'PDF' ? (
            <FileText className="w-4 h-4 text-red-500" />
          ) : (
            <ImageIcon className="w-4 h-4 text-blue-500" />
          )}
          <div>
            <div className="text-xs font-black text-stone-800">{originalName}</div>
            <div className="text-[10px] font-bold text-stone-400">{sizeKb} KB • {documentType}</div>
          </div>
        </div>
        <a
          href={url.startsWith('/') ? `http://localhost:5000${url}` : url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-black rounded-lg transition-colors"
        >
          View Full
        </a>
      </div>
      <div className="p-4 flex justify-center bg-stone-100">
        {documentType === 'PDF' ? (
          <div className="w-full h-48 sm:h-64 rounded bg-white shadow-sm flex items-center justify-center flex-col gap-2">
             <FileText className="w-8 h-8 text-stone-300" />
             <span className="text-xs font-bold text-stone-400">PDF Preview</span>
          </div>
        ) : (
          <img
            src={url.startsWith('/') ? `http://localhost:5000${url}` : url}
            alt={originalName}
            className="max-h-64 object-contain rounded shadow-sm"
          />
        )}
      </div>
    </div>
  );
};
