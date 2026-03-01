// Emergency shelter types - separate from property marketplace
export interface EmergencyShelter {
  id: string;
  name: string;
  description: string | null;
  country: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  shelter_type: 'temporary_housing' | 'crisis_center' | 'safe_house' | 'refugee_camp' | 'emergency_shelter' | 'community_center';
  capacity: number | null;
  contact_phone: string | null;
  contact_email: string | null;
  available_beds: number | null;
  accepts_families: boolean;
  accepts_pets: boolean;
  wheelchair_accessible: boolean;
  crisis_types: string[];
  status: 'active' | 'full' | 'closed' | 'temporary_closed';
  created_at: string;
  updated_at: string;
}

// Emergency numbers by country
export const EMERGENCY_NUMBERS: Record<string, string> = {
  // North America
  'USA': '911',
  'United States': '911',
  'Canada': '911',
  'Mexico': '911',
  
  // Europe (EU standard)
  'UK': '999 / 112',
  'United Kingdom': '999 / 112',
  'Germany': '112',
  'France': '112',
  'Spain': '112',
  'Italy': '112',
  'Greece': '112',
  'Poland': '112',
  'Romania': '112',
  'Bulgaria': '112',
  'Portugal': '112',
  'Netherlands': '112',
  'Belgium': '112',
  'Austria': '112',
  'Switzerland': '112',
  'Sweden': '112',
  'Norway': '112',
  'Denmark': '112',
  'Finland': '112',
  'Ireland': '112',
  'Czech Republic': '112',
  'Hungary': '112',
  'Slovakia': '112',
  'Croatia': '112',
  'Slovenia': '112',
  'Lithuania': '112',
  'Latvia': '112',
  'Estonia': '112',
  
  // Eastern Europe
  'Ukraine': '112',
  'Russia': '112',
  
  // Middle East
  'Turkey': '112',
  'UAE': '999',
  'Saudi Arabia': '997',
  'Israel': '100',
  
  // Asia
  'Japan': '110 (Police) / 119 (Fire/Medical)',
  'China': '110 (Police) / 119 (Fire) / 120 (Medical)',
  'South Korea': '112 (Police) / 119 (Fire/Medical)',
  'India': '112',
  'Thailand': '191',
  'Singapore': '999',
  'Malaysia': '999',
  'Indonesia': '112',
  'Philippines': '911',
  'Vietnam': '113',
  
  // Oceania
  'Australia': '000',
  'New Zealand': '111',
  
  // South America
  'Brazil': '190 (Police) / 193 (Fire)',
  'Argentina': '911',
  'Chile': '133',
  'Colombia': '123',
  'Peru': '105',
  
  // Africa
  'South Africa': '10111',
  'Egypt': '122',
  'Nigeria': '112',
  'Kenya': '999',
  'Morocco': '19',
};

// Get emergency number for a country
export function getEmergencyNumber(country: string): string {
  const normalized = country.trim();
  return EMERGENCY_NUMBERS[normalized] || '112 (EU Standard)';
}

// Shelter type display names
export const SHELTER_TYPE_LABELS: Record<string, string> = {
  'temporary_housing': 'Temporary Housing',
  'crisis_center': 'Crisis Center',
  'safe_house': 'Safe House',
  'refugee_camp': 'Refugee Camp',
  'emergency_shelter': 'Emergency Shelter',
  'community_center': 'Community Center',
};

// Crisis type display names
export const CRISIS_TYPE_LABELS: Record<string, string> = {
  'war': 'War',
  'earthquake': 'Earthquake',
  'flood': 'Flood',
  'fire': 'Fire',
  'natural_disaster': 'Natural Disaster',
  'humanitarian_crisis': 'Humanitarian Crisis',
};
