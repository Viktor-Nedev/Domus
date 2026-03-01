-- Add more emergency shelters to ensure comprehensive coverage (2-3 per major country)

INSERT INTO emergency_shelters (name, description, country, city, address, latitude, longitude, shelter_type, capacity, contact_phone, available_beds, accepts_families, wheelchair_accessible, crisis_types) VALUES

-- USA (additional shelters)
('Chicago Emergency Relief Center', 'Emergency housing for disaster victims and displaced families', 'USA', 'Chicago', '121 N LaSalle St, Chicago, IL 60602', 41.8781, -87.6298, 'crisis_center', 160, '+1-312-744-5000', 110, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),
('Houston Crisis Housing', 'Temporary shelter for emergency situations', 'USA', 'Houston', '901 Bagby St, Houston, TX 77002', 29.7604, -95.3698, 'temporary_housing', 140, '+1-713-247-2000', 95, true, true, ARRAY['flood', 'fire', 'humanitarian_crisis']),
('Seattle Emergency Shelter', 'Safe housing for crisis victims', 'USA', 'Seattle', '600 4th Ave, Seattle, WA 98104', 47.6062, -122.3321, 'emergency_shelter', 130, '+1-206-684-4000', 90, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- UK (additional shelters)
('Birmingham Emergency Housing', 'Crisis accommodation for displaced persons', 'UK', 'Birmingham', 'Victoria Square, Birmingham B1 1BB', 52.4814, -1.8998, 'emergency_shelter', 100, '+44-121-303-1111', 70, true, true, ARRAY['fire', 'humanitarian_crisis']),
('Glasgow Crisis Center', 'Temporary housing for emergency situations', 'UK', 'Glasgow', 'George Square, Glasgow G2 1DU', 55.8642, -4.2518, 'crisis_center', 90, '+44-141-287-2000', 60, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- Germany (additional shelters)
('Hamburg Emergency Shelter', 'Notunterkunft für Krisensituationen', 'Germany', 'Hamburg', 'Rathausmarkt 1, 20095 Hamburg', 53.5511, 10.0006, 'emergency_shelter', 140, '+49-40-428-0', 100, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),
('Frankfurt Crisis Housing', 'Krisenunterkunft für Notfälle', 'Germany', 'Frankfurt', 'Römerberg 27, 60311 Frankfurt', 50.1109, 8.6821, 'crisis_center', 120, '+49-69-212-0', 85, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- France (additional shelters)
('Lyon Emergency Center', 'Centre d''hébergement d''urgence', 'France', 'Lyon', 'Place des Terreaux, 69001 Lyon', 45.7640, 4.8357, 'emergency_shelter', 110, '+33-4-72-10-30-30', 75, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),
('Marseille Crisis Shelter', 'Refuge de crise pour situations d''urgence', 'France', 'Marseille', 'Quai du Port, 13002 Marseille', 43.2965, 5.3698, 'crisis_center', 100, '+33-4-91-55-11-11', 70, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- Spain (additional shelters)
('Madrid Emergency Housing', 'Alojamiento de emergencia para crisis', 'Spain', 'Madrid', 'Puerta del Sol, 28013 Madrid', 40.4168, -3.7038, 'emergency_shelter', 150, '+34-91-480-0000', 110, true, true, ARRAY['fire', 'humanitarian_crisis']),
('Valencia Crisis Center', 'Centro de crisis para emergencias', 'Spain', 'Valencia', 'Plaza del Ayuntamiento, 46002 Valencia', 39.4699, -0.3763, 'crisis_center', 115, '+34-96-352-5478', 80, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),

-- Italy (additional shelters)
('Milan Emergency Shelter', 'Rifugio di emergenza per crisi', 'Italy', 'Milan', 'Piazza del Duomo, 20122 Milano', 45.4642, 9.1900, 'emergency_shelter', 140, '+39-02-8845-1', 100, true, true, ARRAY['fire', 'humanitarian_crisis']),
('Naples Crisis Housing', 'Alloggio di crisi per situazioni di emergenza', 'Italy', 'Naples', 'Piazza del Plebiscito, 80132 Napoli', 40.8359, 14.2489, 'crisis_center', 125, '+39-081-795-1111', 90, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- Japan (additional shelters)
('Osaka Emergency Center', '大阪緊急避難所', 'Japan', 'Osaka', '1-3-20 Nakanoshima, Kita-ku, Osaka', 34.6937, 135.5023, 'emergency_shelter', 220, '+81-6-6208-8181', 180, true, true, ARRAY['earthquake', 'fire', 'natural_disaster']),
('Yokohama Crisis Shelter', '横浜危機シェルター', 'Japan', 'Yokohama', '1-1 Minato-cho, Naka-ku, Yokohama', 35.4437, 139.6380, 'crisis_center', 190, '+81-45-671-2121', 150, true, true, ARRAY['earthquake', 'natural_disaster']),

-- Canada (additional shelters)
('Vancouver Emergency Housing', 'Emergency shelter for crisis situations', 'Canada', 'Vancouver', '453 W 12th Ave, Vancouver, BC V5Y 1V4', 49.2827, -123.1207, 'emergency_shelter', 145, '+1-604-873-7000', 105, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),
('Montreal Crisis Center', 'Centre de crise pour situations d''urgence', 'Canada', 'Montreal', '275 Rue Notre-Dame Est, Montréal, QC H2Y 1C6', 45.5088, -73.5543, 'crisis_center', 135, '+1-514-872-0311', 95, true, true, ARRAY['fire', 'humanitarian_crisis']),

-- Australia (additional shelters)
('Melbourne Emergency Shelter', 'Emergency accommodation for crisis victims', 'Australia', 'Melbourne', '200 Little Collins St, Melbourne VIC 3000', -37.8136, 144.9631, 'emergency_shelter', 155, '+61-3-9658-9658', 115, true, true, ARRAY['fire', 'flood', 'natural_disaster']),
('Brisbane Crisis Housing', 'Temporary housing for emergency situations', 'Australia', 'Brisbane', '64 Adelaide St, Brisbane City QLD 4000', -27.4698, 153.0251, 'crisis_center', 125, '+61-7-3403-8888', 90, true, true, ARRAY['fire', 'flood', 'humanitarian_crisis']),

-- Additional countries
('Moscow Emergency Center', 'Центр экстренного жилья Москва', 'Russia', 'Moscow', 'Red Square, Moscow 109012', 55.7539, 37.6208, 'emergency_shelter', 200, '+7-495-777-7777', 160, true, true, ARRAY['fire', 'humanitarian_crisis']),
('Delhi Crisis Housing', 'दिल्ली संकट आवास', 'India', 'New Delhi', 'Connaught Place, New Delhi 110001', 28.6315, 77.2167, 'crisis_center', 250, '+91-11-2334-4444', 200, true, false, ARRAY['flood', 'humanitarian_crisis']),
('Mumbai Emergency Shelter', 'मुंबई आपातकालीन आश्रय', 'India', 'Mumbai', 'Chhatrapati Shivaji Terminus, Mumbai 400001', 18.9398, 72.8355, 'emergency_shelter', 230, '+91-22-2262-1111', 180, true, false, ARRAY['flood', 'humanitarian_crisis']),
('Hong Kong Crisis Center', '香港危機中心', 'Hong Kong', 'Hong Kong', 'Central Government Offices, Hong Kong', 22.2783, 114.1747, 'crisis_center', 120, '+852-2835-1111', 85, true, true, ARRAY['humanitarian_crisis']),
('Singapore Emergency Housing', 'Emergency shelter for crisis situations', 'Singapore', 'Singapore', '1 Empress Place, Singapore 179555', 1.2868, 103.8503, 'emergency_shelter', 100, '+65-6332-3333', 70, true, true, ARRAY['humanitarian_crisis']),
('Tel Aviv Crisis Shelter', 'מקלט משבר תל אביב', 'Israel', 'Tel Aviv', 'Rabin Square, Tel Aviv 6473402', 32.0853, 34.7818, 'crisis_center', 110, '+972-3-521-5555', 80, true, true, ARRAY['war', 'humanitarian_crisis']),
('Seoul Gangnam Emergency Center', '서울 강남 응급센터', 'South Korea', 'Seoul', 'Gangnam-gu Office, Seoul', 37.5172, 127.0473, 'emergency_shelter', 160, '+82-2-3423-5000', 120, true, true, ARRAY['fire', 'humanitarian_crisis']),
('Taipei Crisis Housing', '台北危機住房', 'Taiwan', 'Taipei', 'Taipei City Hall, Taipei 110', 25.0330, 121.5654, 'crisis_center', 130, '+886-2-2720-8889', 95, true, true, ARRAY['earthquake', 'humanitarian_crisis']),
('Manila Emergency Shelter', 'Emergency housing for displaced persons', 'Philippines', 'Manila', 'Manila City Hall, Manila 1000', 14.5995, 120.9842, 'emergency_shelter', 180, '+63-2-527-3000', 140, true, false, ARRAY['flood', 'humanitarian_crisis']),
('Jakarta Crisis Center', 'Pusat krisis untuk situasi darurat', 'Indonesia', 'Jakarta', 'Merdeka Square, Jakarta 10110', -6.1751, 106.8272, 'crisis_center', 200, '+62-21-382-2255', 160, true, false, ARRAY['flood', 'earthquake', 'humanitarian_crisis']),
('Kuala Lumpur Emergency Housing', 'Tempat perlindungan kecemasan', 'Malaysia', 'Kuala Lumpur', 'Merdeka Square, Kuala Lumpur 50050', 3.1478, 101.6953, 'emergency_shelter', 140, '+60-3-2693-4000', 100, true, true, ARRAY['flood', 'humanitarian_crisis'])

ON CONFLICT DO NOTHING;
