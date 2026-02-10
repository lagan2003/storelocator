import React from 'react';
import { X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, onClose, analysis }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Gemini Insights</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto prose prose-indigo max-w-none text-gray-700">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;