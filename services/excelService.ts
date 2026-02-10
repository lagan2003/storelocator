import * as XLSX from 'xlsx';
import { Store, StoreCategory } from '../types';

export const parseExcelFile = async (file: File): Promise<Store[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        const stores: Store[] = json.map((row: any, index: number) => {
          // Flexible column matching
          const lat = row.lat || row.latitude || row.Lat || row.Latitude;
          const lng = row.lng || row.long || row.longitude || row.Lng || row.Longitude;
          const name = row.name || row.Name || row.Store || `Store ${index + 1}`;
          const rawCat = row.category || row.Category || row.Type || 'A';

          // Normalize category
          let category = StoreCategory.A;
          const catStr = String(rawCat).toUpperCase();
          if (catStr.includes('A+') || catStr.includes('PLUS')) {
            category = StoreCategory.A_PLUS;
          } else if (catStr === 'B' || catStr.includes('OUTLET')) {
            category = StoreCategory.B;
          } else {
            category = StoreCategory.A;
          }

          if (lat && lng) {
            return {
              id: `uploaded-${index}`,
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              name,
              category
            };
          }
          return null;
        }).filter((s): s is Store => s !== null);

        resolve(stores);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};