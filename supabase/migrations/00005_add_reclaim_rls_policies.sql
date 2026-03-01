-- RLS Policies for reclaim_seekers
ALTER TABLE reclaim_seekers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seekers can view own profile" ON reclaim_seekers;
CREATE POLICY "Seekers can view own profile" ON reclaim_seekers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Seekers can update own profile" ON reclaim_seekers;
CREATE POLICY "Seekers can update own profile" ON reclaim_seekers
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Seekers can insert own profile" ON reclaim_seekers;
CREATE POLICY "Seekers can insert own profile" ON reclaim_seekers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Helpers can view seeker profiles" ON reclaim_seekers;
CREATE POLICY "Helpers can view seeker profiles" ON reclaim_seekers
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.account_type = 'broker'
    )
  );

-- RLS Policies for reclaim_listings
ALTER TABLE reclaim_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reclaim listings" ON reclaim_listings;
CREATE POLICY "Anyone can view reclaim listings" ON reclaim_listings
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Property owners can manage reclaim listings" ON reclaim_listings;
CREATE POLICY "Property owners can manage reclaim listings" ON reclaim_listings
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = reclaim_listings.property_id
      AND properties.broker_id = auth.uid()
    )
  );

-- RLS Policies for reclaim_applications
ALTER TABLE reclaim_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seekers can view own applications" ON reclaim_applications;
CREATE POLICY "Seekers can view own applications" ON reclaim_applications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM reclaim_seekers
      WHERE reclaim_seekers.id = reclaim_applications.seeker_id
      AND reclaim_seekers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Seekers can create applications" ON reclaim_applications;
CREATE POLICY "Seekers can create applications" ON reclaim_applications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM reclaim_seekers
      WHERE reclaim_seekers.id = reclaim_applications.seeker_id
      AND reclaim_seekers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Property owners can view applications" ON reclaim_applications;
CREATE POLICY "Property owners can view applications" ON reclaim_applications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = reclaim_applications.property_id
      AND properties.broker_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Property owners can update applications" ON reclaim_applications;
CREATE POLICY "Property owners can update applications" ON reclaim_applications
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = reclaim_applications.property_id
      AND properties.broker_id = auth.uid()
    )
  );

-- RLS Policies for reclaim_matches
ALTER TABLE reclaim_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seekers can view own matches" ON reclaim_matches;
CREATE POLICY "Seekers can view own matches" ON reclaim_matches
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM reclaim_seekers
      WHERE reclaim_seekers.id = reclaim_matches.seeker_id
      AND reclaim_seekers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Property owners can view matches" ON reclaim_matches;
CREATE POLICY "Property owners can view matches" ON reclaim_matches
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = reclaim_matches.property_id
      AND properties.broker_id = auth.uid()
    )
  );

-- RLS Policies for partner_organizations
ALTER TABLE partner_organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view partner organizations" ON partner_organizations;
CREATE POLICY "Anyone can view partner organizations" ON partner_organizations
  FOR SELECT USING (true);

-- RLS Policies for reclaim_stories
ALTER TABLE reclaim_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved stories" ON reclaim_stories;
CREATE POLICY "Anyone can view approved stories" ON reclaim_stories
  FOR SELECT USING (approved = true);