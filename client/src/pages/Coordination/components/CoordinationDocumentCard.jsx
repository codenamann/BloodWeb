import React from 'react';
import { CheckCircle2, ExternalLink, FileText } from 'lucide-react';

export const CoordinationDocumentCard = ({ request }) => {
  const document = request?.hospitalDocument;
  if (!document) return null;

  const { url, documentType } = document;
  const fullUrl = url?.startsWith('/') ? `http://localhost:5000${url}` : url;

  return (
    <div className="clay-card p-4 sm:p-4.5 bg-white/95 space-y-2.5 shadow-sm shrink-0">
      {/* Header: Short Heading on Left, View Button on Right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-black text-stone-900 tracking-tight truncate">
            Verify Document
          </span>
        </div>

        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-black rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>View</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </a>
      </div>

      {/* Document Visual Preview without file name */}
      <div className="rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 flex items-center justify-center">
        {documentType === 'PDF' ? (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-36 flex flex-col items-center justify-center gap-2 bg-white hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <FileText className="w-8 h-8 text-rose-500" />
            <span className="text-xs font-bold text-stone-500">
              View PDF Document
            </span>
          </a>
        ) : (
          <img
            src={fullUrl}
            alt="Hospital Verification Document"
            className="w-full h-36 sm:h-40 object-cover hover:scale-105 transition-transform duration-300 bg-stone-900/5 cursor-pointer"
            onClick={() => window.open(fullUrl, '_blank')}
            title="Click to view full image"
          />
        )}
      </div>
    </div>
  );
};

export default CoordinationDocumentCard;
