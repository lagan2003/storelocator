import { Store, StoreCategory, LatLng } from '../types';

// Helper to generate a random point within a radius (km) of a center
function generateRandomPoint(center: LatLng, radiusKm: number): LatLng {
  const r = radiusKm / 111.32; // Convert km to degrees (approx)
  const y0 = center.lat;
  const x0 = center.lng;

  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  // Adjust longitude for latitude shrinking
  const xp = x / Math.cos(y0 * (Math.PI / 180));

  return {
    lat: y + y0,
    lng: xp + x0,
  };
}

export const generateStores = (
  center: LatLng,
  countAPlus: number,
  countA: number,
  countB: number,
  maxDistance: number
): Store[] => {
  const stores: Store[] = [];
  let idCounter = 1;

  const addStores = (count: number, category: StoreCategory) => {
    for (let i = 0; i < count; i++) {
      const pos = generateRandomPoint(center, maxDistance);
      stores.push({
        id: `store-${idCounter++}`,
        lat: pos.lat,
        lng: pos.lng,
        category,
        name: `${category} Store ${i + 1}`,
      });
    }
  };

  addStores(countAPlus, StoreCategory.A_PLUS);
  addStores(countA, StoreCategory.A);
  addStores(countB, StoreCategory.B);

  return stores;
};

// Haversine formula to calculate distance between two points in km
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}