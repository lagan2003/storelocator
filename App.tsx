import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import AIAnalysisModal from './components/AIAnalysisModal';
import { SimulationParams, Store, LatLng } from './types';
import { generateStores } from './services/storeGenerator';
import { analyzeStoreDistribution } from './services/geminiService';

// Default user location or center (e.g., Dallas, TX)
const DEFAULT_CENTER: LatLng = { lat: 32.7767, lng: -96.7970 };

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    totalStores: 100,
    maxDistance: 50, // km
    countAPlus: 10,
    countA: 40,
    countB: 50
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  
  // AI Analysis State
  const [analysis, setAnalysis] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize with geolocation if available, else default
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.warn("Geolocation access denied or failed. Using default center.");
        }
      );
    }
  }, []);

  const handleGenerate = () => {
    // Generate new stores based on current params and center
    const newStores = generateStores(
      center,
      params.countAPlus,
      params.countA,
      params.countB,
      params.maxDistance
    );
    setStores(newStores);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeStoreDistribution(params, stores, `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
      setAnalysis(result);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("An error occurred during analysis. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Sidebar (30% width on desktop, full on mobile) */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-full z-10 shadow-xl">
        <Sidebar 
          params={params}
          onUpdateParams={setParams}
          onGenerate={handleGenerate}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Right Map Area */}
      <div className="flex-1 h-full relative bg-gray-200">
        <MapContainer 
          stores={stores}
          center={center}
          maxDistance={params.maxDistance}
        />
        
        {/* Floating Legend for Map */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg border border-gray-200 text-xs hidden sm:block">
          <h4 className="font-bold mb-2 text-gray-700">Map Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="http://maps.google.com/mapfiles/ms/icons/purple-dot.png" className="w-4 h-4" alt="A+"/>
              <span>A+ Category</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" className="w-4 h-4" alt="A"/>
              <span>A Category</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" className="w-4 h-4" alt="B"/>
              <span>B Category</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AIAnalysisModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysis={analysis}
      />
    </div>
  );
};

export default App;