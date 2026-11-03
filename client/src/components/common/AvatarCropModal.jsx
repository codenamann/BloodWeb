import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ZoomIn, ZoomOut, Trash2, Check, RefreshCw } from 'lucide-react';
import { uploadAvatar, deleteAvatar } from '../../api/profile.api';
import { optimizeAvatarCrop } from '../../utils/imageOptimizer';
import { toast } from '../ui/toast';

const VIEW_SIZE = 260;

export default function AvatarCropModal({ isOpen, onClose, currentAvatar, onAvatarUpdated }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null);
      setImgObj(null);
      setScale(1);
      setPos({ x: 0, y: 0 });
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        setImageSrc(reader.result);
        setScale(1);
        setPos({ x: 0, y: 0 });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imgObj) return;
    try {
      setLoading(true);
      const webpBlob = await optimizeAvatarCrop(imgObj, scale, pos, VIEW_SIZE);
      const res = await uploadAvatar(webpBlob);
      if (res.status === 'success') {
        toast.success('Optimized WebP photo saved successfully!');
        onAvatarUpdated(res.data.user);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteAvatar();
      if (res.status === 'success') {
        toast.success('Profile photo removed');
        onAvatarUpdated(res.data.user);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="clay-card w-full max-w-md p-6 relative flex flex-col items-center gap-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-black text-stone-900 tracking-tight">Update Profile Photo</h3>
          <p className="text-[11px] text-stone-400 font-semibold mt-0.5">Optimized to WebP automatically</p>
        </div>

        {!imageSrc ? (
          <div className="w-full flex flex-col items-center gap-4 py-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-44 border-2 border-dashed border-stone-300 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#d93829] hover:bg-stone-50/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#d93829]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-stone-700">Click to choose a photo</p>
              <p className="text-xs text-stone-400">JPG, PNG, WebP • Auto-compressed</p>
            </div>
            {currentAvatar && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Remove current photo
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <div
              className="relative overflow-hidden rounded-full shadow-inner border-4 border-white cursor-grab active:cursor-grabbing bg-stone-900"
              style={{ width: VIEW_SIZE, height: VIEW_SIZE }}
              onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y }); }}
              onMouseMove={(e) => isDragging && setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <img
                src={imageSrc}
                alt="Crop preview"
                className="pointer-events-none select-none max-w-none origin-center absolute"
                style={{
                  width: VIEW_SIZE,
                  height: VIEW_SIZE,
                  objectFit: 'cover',
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                }}
              />
            </div>

            <div className="flex items-center gap-3 w-4/5">
              <ZoomOut className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#d93829] cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-stone-400 shrink-0" />
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#d93829] text-white font-bold text-xs hover:bg-[#b82a1d] shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {loading ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
}
