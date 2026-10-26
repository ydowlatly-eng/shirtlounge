import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#151822]/95 border border-[#2d3445] text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold">
        <Sparkles className="w-4 h-4 text-[#d4f800] shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
