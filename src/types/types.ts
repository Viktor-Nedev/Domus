// DOMUS Platform Types

export type UserRole = 'buyer' | 'broker' | 'admin';
export type AccountType = 'buyer' | 'broker' | 'reclaim_seeker';
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';
export type PropertyStatus = 'active' | 'sold' | 'pending';
export type PropertyPurpose = 'investment' | 'primary_residence' | 'vacation_home';
export type SituationType = 'war' | 'natural_disaster' | 'climate_refugee' | 'other';
export type ReclaimStatus = 'seeking' | 'matched' | 'housed';
export type ApplicationStatus = 'pending' | 'viewed' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  name: string;
  account_type: AccountType;
  role: UserRole;
  phone?: string;
  currency_pref: string;
  agency_name?: string;
  license_number?: string;
  notification_email: boolean;
  notification_sms: boolean;
  notification_push: boolean;
  created_at: string;
  last_login?: string;
}

export interface Property {
  id: string;
  broker_id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  currency: string;
  price_eur: number;
  size_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  construction_type?: string;
  year_built?: number;
  parking: boolean;
  furnished: boolean;
  elevator: boolean;
  balcony: boolean;
  heating_type?: string;
  country: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  photos: string[];
  virtual_tour_link?: string;
  energy_certificate?: string;
  ownership_type?: string;
  availability_date?: string;
  created_at: string;
  updated_at: string;
  status: PropertyStatus;
  views_count: number;
  domus_score: number;
  broker?: Profile;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  saved_date: string;
  notes?: string;
  property?: Property;
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  property_id?: string;
  last_message_at: string;
  last_message_preview?: string;
  unread_count_1: number;
  unread_count_2: number;
  status: string;
  created_at: string;
  participant_1?: Profile;
  participant_2?: Profile;
  property?: Property;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  message_text: string;
  read_status: boolean;
  created_at: string;
  attachments?: string[];
  sender?: Profile;
  receiver?: Profile;
}

export interface MessageTemplate {
  id: string;
  broker_id: string;
  template_name: string;
  template_text: string;
  created_at: string;
  usage_count: number;
}

export interface CurrencyRate {
  currency_code: string;
  rate_to_eur: number;
  last_updated: string;
}

export interface MarketData {
  id: string;
  country: string;
  city: string;
  neighborhood?: string;
  date: string;
  avg_price_sqm: number;
  property_type?: PropertyType;
  source?: string;
  transaction_count: number;
  created_at: string;
}

export interface BuyerPreferences {
  id: string;
  user_id: string;
  budget_min?: number;
  budget_max?: number;
  property_types?: PropertyType[];
  countries?: string[];
  cities?: string[];
  purpose?: PropertyPurpose;
  bedrooms_min?: number;
  bedrooms_max?: number;
  size_min?: number;
  size_max?: number;
  proximity_transport: number;
  proximity_schools: number;
  proximity_nightlife: number;
  proximity_quiet: number;
  proximity_green: number;
  proximity_shopping: number;
  proximity_medical: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyMatch {
  property: Property;
  match_score: number;
  reasons: string[];
}

// DOMUS RECLAIM Types
export interface ReclaimSeeker {
  id: string;
  user_id: string;
  situation_type: SituationType;
  origin_country: string;
  current_location?: string;
  family_size_adults: number;
  family_size_children: number;
  family_size_elderly: number;
  special_needs?: string;
  current_housing?: string;
  support_org?: string;
  documentation_status?: string;
  budget_source?: string;
  budget_amount?: number;
  preferred_countries?: string[];
  urgent_status: boolean;
  status: ReclaimStatus;
  created_at: string;
  updated_at: string;
}

export interface ReclaimListing {
  id: string;
  property_id: string;
  is_reclaim_property: boolean;
  special_terms_type?: string[];
  reduced_price?: number;
  original_price?: number;
  accepts_vouchers: boolean;
  flexible_terms?: string;
  languages_spoken?: string[];
  near_support_center: boolean;
  support_center_distance?: number;
  near_language_school: boolean;
  max_family_size?: number;
  pet_friendly: boolean;
  accessibility_features?: string[];
  utilities_included: boolean;
  furnished: boolean;
  transportation_help: boolean;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface ReclaimApplication {
  id: string;
  seeker_id: string;
  property_id: string;
  message?: string;
  status: ApplicationStatus;
  applied_date: string;
  response_date?: string;
  helper_notes?: string;
  created_at: string;
  property?: Property;
  seeker?: ReclaimSeeker;
}

export interface ReclaimMatch {
  id: string;
  seeker_id: string;
  property_id: string;
  match_score: number;
  ai_explanation?: string;
  reasons?: string[];
  viewed_by_seeker: boolean;
  viewed_by_helper: boolean;
  created_at: string;
  property?: Property;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  type: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  countries_active?: string[];
  services_offered?: string[];
  logo_url?: string;
  verified: boolean;
  description?: string;
  created_at: string;
}

export interface ReclaimStory {
  id: string;
  title: string;
  story: string;
  seeker_anonymous_id?: string;
  helper_name?: string;
  property_location?: string;
  origin_country?: string;
  situation_type?: string;
  date: string;
  approved: boolean;
  featured: boolean;
  featured_image?: string;
  created_at: string;
}

export interface DealAnalysis {
  domus_score: number;
  reasons: string[];
  rental_yield?: number;
  market_comparison?: string;
  price_trend?: string;
}

// Form types
export interface PropertyFormData {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  currency: string;
  size_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  construction_type?: string;
  year_built?: number;
  parking: boolean;
  furnished: boolean;
  elevator: boolean;
  balcony: boolean;
  heating_type?: string;
  country: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  photos: string[];
  virtual_tour_link?: string;
  energy_certificate?: string;
  ownership_type?: string;
  availability_date?: string;
}

export interface MessageFormData {
  receiver_id: string;
  property_id?: string;
  message_text: string;
}

// Currency conversion
export const SUPPORTED_CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
];

export const getCurrencySymbol = (code: string): string => {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code;
};

// Review System Types
export interface PropertyReview {
  id: string;
  property_id: string;
  user_id: string;
  rating_overall: number;
  rating_property?: number;
  rating_location?: number;
  rating_communication?: number;
  rating_value?: number;
  review_text?: string;
  verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
  };
  tags?: ReviewTag[];
}

export interface ReviewTag {
  id: string;
  review_id: string;
  tag_name: string;
  created_at: string;
}

export interface ReviewHelpfulVote {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
}
