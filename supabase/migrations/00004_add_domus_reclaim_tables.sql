-- Add RECLAIM SEEKER account type support
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'reclaim_seeker' AND enumtypid = 'account_type'::regtype) THEN
    ALTER TYPE account_type ADD VALUE 'reclaim_seeker';
  END IF;
END $$;

-- Create reclaim_seekers table
CREATE TABLE IF NOT EXISTS reclaim_seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  situation_type TEXT NOT NULL CHECK (situation_type IN ('war', 'natural_disaster', 'climate_refugee', 'other')),
  origin_country TEXT NOT NULL,
  current_location TEXT,
  family_size_adults INTEGER DEFAULT 1,
  family_size_children INTEGER DEFAULT 0,
  family_size_elderly INTEGER DEFAULT 0,
  special_needs TEXT,
  current_housing TEXT,
  support_org TEXT,
  documentation_status TEXT,
  budget_source TEXT,
  budget_amount DECIMAL(10, 2),
  preferred_countries TEXT[],
  urgent_status BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'seeking' CHECK (status IN ('seeking', 'matched', 'housed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reclaim_listings table
CREATE TABLE IF NOT EXISTS reclaim_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE UNIQUE NOT NULL,
  is_reclaim_property BOOLEAN DEFAULT true,
  special_terms_type TEXT[],
  reduced_price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  accepts_vouchers BOOLEAN DEFAULT false,
  flexible_terms TEXT,
  languages_spoken TEXT[],
  near_support_center BOOLEAN DEFAULT false,
  support_center_distance DECIMAL(5, 2),
  near_language_school BOOLEAN DEFAULT false,
  max_family_size INTEGER,
  pet_friendly BOOLEAN DEFAULT false,
  accessibility_features TEXT[],
  utilities_included BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  transportation_help BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reclaim_applications table
CREATE TABLE IF NOT EXISTS reclaim_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES reclaim_seekers(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'accepted', 'rejected')),
  applied_date TIMESTAMPTZ DEFAULT NOW(),
  response_date TIMESTAMPTZ,
  helper_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seeker_id, property_id)
);

-- Create reclaim_matches table
CREATE TABLE IF NOT EXISTS reclaim_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES reclaim_seekers(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  ai_explanation TEXT,
  reasons TEXT[],
  viewed_by_seeker BOOLEAN DEFAULT false,
  viewed_by_helper BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seeker_id, property_id)
);

-- Create partner_organizations table
CREATE TABLE IF NOT EXISTS partner_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  countries_active TEXT[],
  services_offered TEXT[],
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reclaim_stories table
CREATE TABLE IF NOT EXISTS reclaim_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  seeker_anonymous_id TEXT,
  helper_name TEXT,
  property_location TEXT,
  origin_country TEXT,
  situation_type TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reclaim_seekers_user_id ON reclaim_seekers(user_id);
CREATE INDEX IF NOT EXISTS idx_reclaim_seekers_status ON reclaim_seekers(status);
CREATE INDEX IF NOT EXISTS idx_reclaim_listings_property_id ON reclaim_listings(property_id);
CREATE INDEX IF NOT EXISTS idx_reclaim_applications_seeker_id ON reclaim_applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_reclaim_applications_property_id ON reclaim_applications(property_id);
CREATE INDEX IF NOT EXISTS idx_reclaim_applications_status ON reclaim_applications(status);
CREATE INDEX IF NOT EXISTS idx_reclaim_matches_seeker_id ON reclaim_matches(seeker_id);
CREATE INDEX IF NOT EXISTS idx_reclaim_matches_property_id ON reclaim_matches(property_id);