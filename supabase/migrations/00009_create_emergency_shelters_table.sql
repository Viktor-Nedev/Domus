-- Create emergency_shelters table for humanitarian crisis accommodation
CREATE TABLE IF NOT EXISTS emergency_shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  shelter_type TEXT NOT NULL CHECK (shelter_type IN ('temporary_housing', 'crisis_center', 'safe_house', 'refugee_camp', 'emergency_shelter', 'community_center')),
  capacity INTEGER,
  contact_phone TEXT,
  contact_email TEXT,
  available_beds INTEGER,
  accepts_families BOOLEAN DEFAULT true,
  accepts_pets BOOLEAN DEFAULT false,
  wheelchair_accessible BOOLEAN DEFAULT false,
  crisis_types TEXT[] DEFAULT ARRAY['war', 'earthquake', 'flood', 'fire', 'natural_disaster', 'humanitarian_crisis'],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'closed', 'temporary_closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster country searches
CREATE INDEX IF NOT EXISTS idx_emergency_shelters_country ON emergency_shelters(country);
CREATE INDEX IF NOT EXISTS idx_emergency_shelters_status ON emergency_shelters(status);

-- Enable RLS
ALTER TABLE emergency_shelters ENABLE ROW LEVEL SECURITY;

-- Public read access for emergency shelters
CREATE POLICY "Emergency shelters are publicly readable"
  ON emergency_shelters FOR SELECT
  TO public
  USING (true);

-- Insert sample emergency shelters data
INSERT INTO emergency_shelters (name, description, country, city, address, latitude, longitude, shelter_type, capacity, contact_phone, available_beds, accepts_families, wheelchair_accessible, crisis_types) VALUES
-- USA
('Red Cross Emergency Shelter NYC', 'Emergency shelter providing temporary housing for disaster victims', 'USA', 'New York', '520 West 49th Street, New York, NY 10019', 40.7649, -73.9903, 'emergency_shelter', 200, '+1-800-733-2767', 150, true, true, ARRAY['fire', 'flood', 'natural_disaster', 'humanitarian_crisis']),
('LA Crisis Housing Center', 'Safe housing for families affected by emergencies', 'USA', 'Los Angeles', '1531 James M Wood Blvd, Los Angeles, CA 90015', 34.0407, -118.2678, 'crisis_center', 150, '+1-213-389-1500', 100, true, true, ARRAY['fire', 'earthquake', 'humanitarian_crisis']),
('Miami Emergency Relief Shelter', 'Temporary accommodation for hurricane and flood victims', 'USA', 'Miami', '701 NW 2nd Ave, Miami, FL 33136', 25.7814, -80.1977, 'temporary_housing', 180, '+1-305-326-7000', 120, true, false, ARRAY['flood', 'natural_disaster']),

-- UK
('London Emergency Housing', 'Crisis accommodation for displaced individuals and families', 'UK', 'London', '44 Baker Street, London W1U 7AL', 51.5194, -0.1585, 'emergency_shelter', 120, '+44-20-7946-0000', 80, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),
('Manchester Safe House', 'Temporary shelter for emergency situations', 'UK', 'Manchester', '1 Piccadilly Gardens, Manchester M1 1RG', 53.4808, -2.2374, 'safe_house', 80, '+44-161-234-5000', 60, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- Germany
('Berlin Refugee Center', 'Emergency accommodation for refugees and crisis victims', 'Germany', 'Berlin', 'Oranienburger Str. 285, 13437 Berlin', 52.5200, 13.4050, 'refugee_camp', 300, '+49-30-90229-0', 250, true, true, ARRAY['war', 'humanitarian_crisis']),
('Munich Crisis Shelter', 'Temporary housing for disaster victims', 'Germany', 'Munich', 'Dachauer Str. 128, 80637 München', 48.1351, 11.5820, 'crisis_center', 150, '+49-89-233-0', 100, true, true, ARRAY['fire', 'flood', 'natural_disaster']),

-- France
('Paris Emergency Center', 'Centre d''hébergement d''urgence', 'France', 'Paris', '12 Rue de Charonne, 75011 Paris', 48.8534, 2.3776, 'emergency_shelter', 180, '+33-1-42-74-46-00', 140, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),

-- Spain
('Barcelona Crisis Housing', 'Alojamiento de emergencia para víctimas de crisis', 'Spain', 'Barcelona', 'Carrer de Llacuna, 162, 08018 Barcelona', 41.3995, 2.1909, 'temporary_housing', 130, '+34-93-256-3000', 90, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),

-- Italy
('Rome Emergency Shelter', 'Rifugio di emergenza per sfollati', 'Italy', 'Rome', 'Via Marsala, 29, 00185 Roma', 41.9028, 12.4964, 'emergency_shelter', 160, '+39-06-4959-1', 120, true, true, ARRAY['earthquake', 'fire', 'humanitarian_crisis']),

-- Greece
('Athens Refugee Center', 'Emergency housing for refugees and displaced persons', 'Greece', 'Athens', 'Acharnon 2, Athens 104 39', 37.9838, 23.7275, 'refugee_camp', 250, '+30-21-0520-1000', 200, true, false, ARRAY['war', 'humanitarian_crisis']),

-- Turkey
('Istanbul Crisis Center', 'Acil barınma merkezi', 'Turkey', 'Istanbul', 'Vatan Cd., 34134 Fatih/İstanbul', 41.0082, 28.9784, 'crisis_center', 200, '+90-212-455-5000', 150, true, true, ARRAY['earthquake', 'war', 'humanitarian_crisis']),

-- Japan
('Tokyo Emergency Shelter', '緊急避難所', 'Japan', 'Tokyo', '1-1 Yoyogi, Shibuya City, Tokyo 151-0053', 35.6762, 139.6503, 'emergency_shelter', 300, '+81-3-3344-1111', 250, true, true, ARRAY['earthquake', 'natural_disaster', 'fire']),

-- Australia
('Sydney Crisis Housing', 'Emergency accommodation for disaster victims', 'Australia', 'Sydney', '477 Pitt St, Sydney NSW 2000', -33.8688, 151.2093, 'temporary_housing', 140, '+61-2-9265-9333', 100, true, true, ARRAY['fire', 'flood', 'natural_disaster']),

-- Canada
('Toronto Emergency Center', 'Temporary shelter for crisis situations', 'Canada', 'Toronto', '129 Peter St, Toronto, ON M5V 2H2', 43.6532, -79.3832, 'emergency_shelter', 170, '+1-416-338-0338', 130, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),

-- Poland
('Warsaw Refugee Shelter', 'Schronisko dla uchodźców', 'Poland', 'Warsaw', 'Marszałkowska 77, 00-683 Warszawa', 52.2297, 21.0122, 'refugee_camp', 220, '+48-22-443-0000', 180, true, true, ARRAY['war', 'humanitarian_crisis']),

-- Ukraine
('Kyiv Emergency Housing', 'Екстрене житло для постраждалих', 'Ukraine', 'Kyiv', 'Khreshchatyk St, 36, Kyiv, 01001', 50.4501, 30.5234, 'crisis_center', 280, '+380-44-279-0000', 220, true, true, ARRAY['war', 'humanitarian_crisis']);

COMMENT ON TABLE emergency_shelters IS 'Emergency shelters and temporary housing for humanitarian crises - separate from property marketplace';