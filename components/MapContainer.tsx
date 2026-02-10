import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, CircleF } from '@react-google-maps/api';
import { Store, StoreCategory, LatLng } from '../types';

// Declare google to avoid namespace errors if types are missing
declare const google: any;

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

// Provided Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyA5IdYM0Pqd7T6xR2reBQAQNHvzTtE-QVU";

// Default Center (Approximate geographic center of US for initial view, or Earth view)
const DEFAULT_CENTER = {
  lat: 39.8283,
  lng: -98.5795
};

const DEFAULT_ZOOM = 4;

interface MapContainerProps {
  stores: Store[];
  center: LatLng;
  maxDistance: number;
}

const getMarkerIcon = (category: StoreCategory) => {
  // Using standard Google Chart icons for color differentiation
  // A+ = Purple, A = Green, B = Blue
  switch (category) {
    case StoreCategory.A_PLUS:
      return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    case StoreCategory.A:
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    case StoreCategory.B:
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    default:
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  }
};

const MapContainer: React.FC<MapContainerProps> = ({ stores, center, maxDistance }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState<any | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const onLoad = useCallback((map: any) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update map bounds when stores change to fit markers
  React.useEffect(() => {
    if (map && stores.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      stores.forEach((store) => {
        bounds.extend({ lat: store.lat, lng: store.lng });
      });
      // Also include the center/circle
      bounds.extend(center);
      
      // We want to zoom out enough to see the circle too roughly
      // Approximate circle bounds
      const earthRadius = 6371; 
      const distLat = (maxDistance / earthRadius) * (180 / Math.PI);
      const distLng = distLat / Math.cos(center.lat * (Math.PI / 180));
      
      bounds.extend({ lat: center.lat + distLat, lng: center.lng + distLng });
      bounds.extend({ lat: center.lat - distLat, lng: center.lng - distLng });
      
      map.fitBounds(bounds);
    }
  }, [map, stores, center, maxDistance]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500 p-8 text-center">
        <div>
          <h3 className="text-xl font-bold mb-2">Error Loading Maps</h3>
          <p>The provided API Key may be invalid or restricted.</p>
          <p className="text-sm mt-2 font-mono bg-gray-200 p-2 rounded">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeId: 'terrain',
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {/* Simulation Radius Circle */}
      <CircleF
        center={center}
        radius={maxDistance * 1000} // Convert km to meters
        options={{
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          strokeColor: '#3B82F6',
          strokeOpacity: 0.4,
          strokeWeight: 2,
          clickable: false,
        }}
      />

      {/* Center Marker */}
      <MarkerF
        position={center}
        icon={{
          url: "http://maps.google.com/mapfiles/kml/shapes/target.png",
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16)
        }}
        zIndex={1000}
        title="Search Center"
      />

      {/* Store Markers */}
      {stores.map((store) => (
        <MarkerF
          key={store.id}
          position={{ lat: store.lat, lng: store.lng }}
          icon={getMarkerIcon(store.category)}
          onClick={() => setSelectedStore(store)}
        />
      ))}

      {/* Info Window */}
      {selectedStore && (
        <InfoWindowF
          position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
          onCloseClick={() => setSelectedStore(null)}
        >
          <div className="p-2 min-w-[150px]">
            <h3 className="font-bold text-gray-900">{selectedStore.name}</h3>
            <span className={`
              inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold
              ${selectedStore.category === StoreCategory.A_PLUS ? 'bg-purple-100 text-purple-800' : ''}
              ${selectedStore.category === StoreCategory.A ? 'bg-green-100 text-green-800' : ''}
              ${selectedStore.category === StoreCategory.B ? 'bg-blue-100 text-blue-800' : ''}
            `}>
              Category {selectedStore.category}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Lat: {selectedStore.lat.toFixed(4)}<br/>
              Lng: {selectedStore.lng.toFixed(4)}
            </p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default MapContainer;