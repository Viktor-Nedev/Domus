-- Insert sample partner organizations
INSERT INTO partner_organizations (name, type, website, contact_email, countries_active, services_offered, verified, description)
VALUES
  ('UNHCR', 'UN Agency', 'https://www.unhcr.org', 'contact@unhcr.org', 
   ARRAY['Global'], 
   ARRAY['Refugee Status', 'Legal Aid', 'Housing Assistance', 'Relocation Support'],
   true,
   'The UN Refugee Agency provides international protection and seeks permanent solutions for refugees worldwide.'),
  ('International Red Cross', 'Humanitarian Organization', 'https://www.icrc.org', 'info@icrc.org',
   ARRAY['Global'],
   ARRAY['Emergency Shelter', 'Family Reunification', 'Medical Care', 'Food Assistance'],
   true,
   'The International Red Cross provides humanitarian aid to people affected by conflict and armed violence.'),
  ('Refugees Welcome', 'NGO', 'https://www.refugees-welcome.net', 'info@refugees-welcome.net',
   ARRAY['Germany', 'Austria', 'Greece', 'Spain'],
   ARRAY['Housing Matching', 'Integration Support', 'Language Classes'],
   true,
   'Refugees Welcome connects refugees with people who have a spare room and want to help.')
ON CONFLICT DO NOTHING;

-- Insert sample RECLAIM success stories
INSERT INTO reclaim_stories (title, story, seeker_anonymous_id, helper_name, property_location, origin_country, situation_type, approved, featured, featured_image)
VALUES
  ('From Kyiv to Krakow: Finding Safety and Community',
   'After fleeing the war in Ukraine, Maria and her two children found themselves in a temporary shelter in Poland. Through DOMUS RECLAIM, they connected with Anna, a property owner in Krakow who offered a furnished apartment at reduced rent. "It''s not just a home," Maria says, "it''s a new beginning. The apartment is near a Ukrainian community center where my children can continue their education in their language while learning Polish."',
   'SEEKER_001',
   'Anna K.',
   'Krakow, Poland',
   'Ukraine',
   'war',
   true,
   true,
   'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_eaa0b9ce-e4b8-4162-bdc2-067d20b70dbc.jpg'),
  ('After the Earthquake: Rebuilding in Antakya',
   'When the devastating earthquake destroyed their home in Turkey, Ahmed''s family lost everything. A local property owner, working with DOMUS RECLAIM, offered them a ground-floor apartment with accessibility features for Ahmed''s elderly mother. "The owner didn''t just give us a place to live," Ahmed explains, "he gave us hope. He even helped us navigate the government assistance programs."',
   'SEEKER_002',
   'Mehmet Y.',
   'Antakya, Turkey',
   'Turkey',
   'natural_disaster',
   true,
   true,
   'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_b1c2cbd7-f41c-4c3a-af8e-676f718cb8f3.jpg'),
  ('A New Home in Athens: From Syria to Greece',
   'After years in refugee camps, Fatima and her family were granted asylum in Greece. Through DOMUS RECLAIM, they found an apartment owner who accepted humanitarian vouchers and offered flexible terms. "The owner speaks Arabic, which made everything easier," Fatima shares. "Our children are now in school, and we''re rebuilding our lives. This platform gave us dignity when we needed it most."',
   'SEEKER_003',
   'Dimitris P.',
   'Athens, Greece',
   'Syria',
   'war',
   true,
   false,
   'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_2831fe69-3627-4903-bee5-bdebf581d182.jpg')
ON CONFLICT DO NOTHING;