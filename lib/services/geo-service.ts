import { Country } from '@/app/api/geo/countries/route';
import { State, defaultStates } from '@/app/api/geo/states/[country]/route';

// Interface for the GeoService
export interface GeoService {
  getCountries: () => Promise<Country[]>;
  getStates: (countryCode: string) => Promise<State[]>;
  getDefaultState: (countryCode: string) => string | null;
}

// Implementation of the GeoService
const geoService: GeoService = {
  /**
   * Get all countries
   * @returns A promise that resolves to an array of Country objects
   */
  getCountries: async (): Promise<Country[]> => {
    try {
      const response = await fetch('/api/geo/countries');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },
  
  /**
   * Get states/provinces for a specific country
   * @param countryCode The ISO country code
   * @returns A promise that resolves to an array of State objects
   */
  getStates: async (countryCode: string): Promise<State[]> => {
    if (!countryCode) return [];
    
    try {
      const response = await fetch(`/api/geo/states/${countryCode}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch states for ${countryCode}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching states for ${countryCode}:`, error);
      return [];
    }
  },
  
  /**
   * Get the default state code for a country
   * @param countryCode The ISO country code
   * @returns The default state code or null if not found
   */
  getDefaultState: (countryCode: string): string | null => {
    if (!countryCode) return null;
    return defaultStates[countryCode] || null;
  }
};

export default geoService; 