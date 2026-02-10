import React, { useState, useRef } from 'react';
import { SimulationParams } from '../types';
import { RefreshCw, MapPin, BarChart3, Info, Upload, FileSpreadsheet, Trash2 } from 'lucide-react';

interface SidebarProps {
  params: SimulationParams;
  onUpdateParams: (params: SimulationParams) => void;
  onGenerate: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onFileUpload: (file: File) => void;
  onClearFile: () => void;
  hasUploadedData: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  params,
  onUpdateParams,
  onGenerate,
  onAnalyze,
  isAnalyzing,
  onFileUpload,
  onClearFile,
  hasUploadedData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateParams({
      ...params,
      [name]: parseInt(value) || 0,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleClear = () => {
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClearFile();
  };

  // Calculate actual total based on categories for display
  const categorizedTotal = params.countAPlus + params.countA + params.countB;

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-blue-600" />
          Store Locator
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure parameters or upload data to simulate store distribution.
        </p>
      </div>

      <div className="p-6 space-y-6 flex-1">
        
        {/* File Upload Section */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition cursor-pointer relative"
             onClick={() => !hasUploadedData && fileInputRef.current?.click()}>
           
           {!hasUploadedData ? (
             <>
               <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
               <p className="text-sm font-medium text-gray-600">Upload Excel File</p>
               <p className="text-xs text-gray-400 mt-1">.xlsx or .xls (Lat, Lng, Category)</p>
             </>
           ) : (
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-left">
                  <FileSpreadsheet className="text-green-600 h-8 w-8" />
                  <div>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{fileName}</p>
                    <p className="text-xs text-green-600 font-medium">Data Loaded</p>
                  </div>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); handleClear(); }}
                 className="p-2 hover:bg-red-50 text-red-500 rounded-full transition"
                 title="Clear File"
               >
                 <Trash2 size={18} />
               </button>
             </div>
           )}
           <input
             type="file"
             ref={fileInputRef}
             className="hidden"
             accept=".xlsx, .xls"
             onChange={handleFileChange}
             disabled={hasUploadedData}
           />
        </div>

        {/* Global Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Configuration
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Distance (km)
            </label>
            <input
              type="number"
              name="maxDistance"
              value={params.maxDistance}
              onChange={handleChange}
              min="1"
              max="10000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {hasUploadedData && (
              <p className="text-xs text-blue-600 mt-1">Filtering uploaded stores by distance from center.</p>
            )}
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {hasUploadedData ? 'Visible Stores' : 'Target Total Stores'}
                </label>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {hasUploadedData ? 'Count' : 'Limit'}
                </span>
             </div>
            <input
              type="number"
              name="totalStores"
              value={hasUploadedData ? categorizedTotal : params.totalStores}
              onChange={handleChange}
              min="0"
              disabled={hasUploadedData}
              className={`w-full px-4 py-2 border rounded-md outline-none transition ${
                hasUploadedData 
                  ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Category Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Category Breakdown
            {hasUploadedData && <span className="ml-2 text-xs font-normal text-gray-500">(Read-only)</span>}
          </h2>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <label className="block text-sm font-bold text-purple-900 mb-1">
              A+ Category Stores
            </label>
            <div className="flex items-center">
               <input
                type="number"
                name="countAPlus"
                value={params.countAPlus}
                onChange={handleChange}
                min="0"
                disabled={hasUploadedData}
                className={`w-full px-4 py-2 border rounded-md outline-none transition ${
                   hasUploadedData 
                    ? 'bg-purple-50 border-transparent text-purple-800 font-bold' 
                    : 'border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <label className="block text-sm font-bold text-green-900 mb-1">
              A Category Stores
            </label>
            <input
              type="number"
              name="countA"
              value={params.countA}
              onChange={handleChange}
              min="0"
              disabled={hasUploadedData}
              className={`w-full px-4 py-2 border rounded-md outline-none transition ${
                 hasUploadedData 
                  ? 'bg-green-50 border-transparent text-green-800 font-bold' 
                  : 'border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500'
              }`}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-1">
              B Category Stores
            </label>
            <input
              type="number"
              name="countB"
              value={params.countB}
              onChange={handleChange}
              min="0"
              disabled={hasUploadedData}
              className={`w-full px-4 py-2 border rounded-md outline-none transition ${
                 hasUploadedData 
                  ? 'bg-blue-50 border-transparent text-blue-800 font-bold' 
                  : 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>

          {!hasUploadedData && categorizedTotal > params.totalStores && (
             <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded text-sm">
                <Info size={16} className="mt-0.5 shrink-0"/>
                <span>
                  Sum of categories ({categorizedTotal}) exceeds target limit ({params.totalStores}). 
                  We will visualize {categorizedTotal} stores.
                </span>
             </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-lg font-medium transition shadow-lg hover:shadow-xl active:scale-95"
        >
          <RefreshCw size={18} />
          {hasUploadedData ? 'Refresh Filter' : 'Generate Map'}
        </button>
        
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || categorizedTotal === 0}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
             <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <BarChart3 size={18} className="text-indigo-600" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;