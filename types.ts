export enum StoreCategory {
  A_PLUS = 'A+',
  A = 'A',
  B = 'B'
}

export interface Store {
  id: string;
  lat: number;
  lng: number;
  category: StoreCategory;
  name: string;
}

export interface SimulationParams {
  totalStores: number;
  maxDistance: number; // in km
  countAPlus: number;
  countA: number;
  countB: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}