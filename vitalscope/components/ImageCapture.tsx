import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageCaptureProps {
  onImagesSelected: (images: string[]) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImagesSelected }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newPreviews: string[] = [];
      
      let processedCount = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newPreviews.push(reader.result as string);
          }
          processedCount++;
          if (processedCount === files.length) {
            const updated = [...previews, ...newPreviews];
            setPreviews(updated);
            onImagesSelected(updated);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesSelected(updated);
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={triggerInput}
        className="border-2 border-dashed border-teal-300 bg-teal-50 rounded-2xl p-8 text-center cursor-pointer hover:bg-teal-100 transition-colors flex flex-col items-center justify-center gap-3"
      >
        <div className="p-4 bg-teal-200 rounded-full text-teal-700">
          <Camera size={32} />
        </div>
        <div>
          <p className="font-bold text-teal-900">写真を撮影 / アップロード</p>
          <p className="text-sm text-teal-600 mt-1">成分表示や商品パッケージを撮影</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={handleFileChange}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCapture;