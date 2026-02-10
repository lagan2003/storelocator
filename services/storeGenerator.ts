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