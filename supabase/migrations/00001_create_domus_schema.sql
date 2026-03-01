-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('buyer', 'broker', 'admin');

-- Create account type enum
CREATE TYPE public.account_type AS ENUM ('buyer', 'broker');

-- Create property type enum
CREATE TYPE public.property_type AS ENUM ('apartment', 'house', 'land', 'commercial');

-- Create property status enum
CREATE TYPE public.property_status AS ENUM ('active', 'sold', 'pending');

-- Create purpose enum
CREATE TYPE public.property_purpose AS ENUM ('investment', 'primary_residence', 'vacation_home');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type public.account_type NOT NULL,
  role public.user_role NOT NULL DEFAULT 'buyer',
  phone TEXT,
  currency_pref TEXT NOT NULL DEFAULT 'EUR',
  agency_name TEXT,
  license_number TEXT,
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT false,
  notification_push BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  CONSTRAINT valid_currency CHECK (currency_pref IN ('EUR', 'USD', 'GBP', 'BGN', 'RON', 'TRY', 'CHF', 'SEK', 'NOK', 'DKK', 'CZK', 'PLN', 'HUF'))
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type public.property_type NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  price_eur NUMERIC NOT NULL,
  size_sqm NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  construction_type TEXT,
  year_built INTEGER,
  parking BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  heating_type TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  photos TEXT[] DEFAULT '{}',
  virtual_tour_link TEXT,
  energy_certificate TEXT,
  ownership_type TEXT,
  availability_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status public.property_status NOT NULL DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  domus_score INTEGER DEFAULT 0,
  CONSTRAINT valid_coordinates CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180),
  CONSTRAINT valid_score CHECK (domus_score BETWEEN 0 AND 100)
);

-- Create saved_properties table
CREATE TABLE public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  saved_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, property_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_preview TEXT,
  unread_count_1 INTEGER DEFAULT 0,
  unread_count_2 INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id, property_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attachments TEXT[]
);

-- Create message_templates table (for brokers)
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

-- Create currency_rates table
CREATE TABLE public.currency_rates (
  currency_code TEXT PRIMARY KEY,
  rate_to_eur NUMERIC NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create market_data table
CREATE TABLE public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  date DATE NOT NULL,
  avg_price_sqm NUMERIC NOT NULL,
  property_type public.property_type,
  source TEXT,
  transaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create buyer_preferences table
CREATE TABLE public.buyer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  budget_min NUMERIC,
  budget_max NUMERIC,
  property_types public.property_type[],
  countries TEXT[],
  cities TEXT[],
  purpose public.property_purpose,
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  size_min NUMERIC,
  size_max NUMERIC,
  proximity_transport INTEGER DEFAULT 5,
  proximity_schools INTEGER DEFAULT 5,
  proximity_nightlife INTEGER DEFAULT 5,
  proximity_quiet INTEGER DEFAULT 5,
  proximity_green INTEGER DEFAULT 5,
  proximity_shopping INTEGER DEFAULT 5,
  proximity_medical INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_properties_broker ON properties(broker_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(country, city);
CREATE INDEX idx_properties_price ON properties(price_eur);
CREATE INDEX idx_properties_score ON properties(domus_score);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX idx_saved_properties_user ON saved_properties(user_id);

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create trigger function for user sync
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, email, name, account_type, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::account_type, 'buyer'::account_type),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role 
         ELSE COALESCE((NEW.raw_user_meta_data->>'account_type')::user_role, 'buyer'::user_role) 
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user sync
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Public profiles view
CREATE VIEW public_profiles AS
  SELECT id, name, account_type, role, agency_name FROM profiles;

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Brokers can insert their own properties" ON properties
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = broker_id AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND account_type = 'broker'
  ));

CREATE POLICY "Brokers can update their own properties" ON properties
  FOR UPDATE TO authenticated
  USING (auth.uid() = broker_id)
  WITH CHECK (auth.uid() = broker_id);

CREATE POLICY "Brokers can delete their own properties" ON properties
  FOR DELETE TO authenticated
  USING (auth.uid() = broker_id);

CREATE POLICY "Admins have full access to properties" ON properties
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Saved properties policies
CREATE POLICY "Users can view their own saved properties" ON saved_properties
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved properties" ON saved_properties
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved properties" ON saved_properties
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT TO authenticated 
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE TO authenticated 
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received" ON messages
  FOR UPDATE TO authenticated 
  USING (auth.uid() = receiver_id);

-- Message templates policies
CREATE POLICY "Brokers can manage their own templates" ON message_templates
  FOR ALL TO authenticated 
  USING (auth.uid() = broker_id)
  WITH CHECK (auth.uid() = broker_id);

-- Buyer preferences policies
CREATE POLICY "Users can manage their own preferences" ON buyer_preferences
  FOR ALL TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Market data policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market data" ON market_data
  FOR SELECT TO authenticated USING (true);

-- Currency rates policies (read-only for all authenticated users)
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view currency rates" ON currency_rates
  FOR SELECT TO authenticated USING (true);

-- Insert initial currency rates (will be updated by Edge Function)
INSERT INTO currency_rates (currency_code, rate_to_eur) VALUES
  ('EUR', 1.0),
  ('USD', 1.08),
  ('GBP', 0.85),
  ('BGN', 1.96),
  ('RON', 4.97),
  ('TRY', 36.50),
  ('CHF', 0.94),
  ('SEK', 11.30),
  ('NOK', 11.80),
  ('DKK', 7.46),
  ('CZK', 24.50),
  ('PLN', 4.30),
  ('HUF', 395.00)
ON CONFLICT (currency_code) DO NOTHING;