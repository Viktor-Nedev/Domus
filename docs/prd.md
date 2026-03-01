# DOMUS - AI-Powered Humanitarian Housing Platform Requirements Document (v4 - Emergency Housing Page Complete Restructure)

## 1. Application Overview

### 1.1 Application Name
DOMUS

### 1.2 Application Description
DOMUS (Latin for \"home\") is an AI-powered humanitarian housing platform with a dual mission:

**Primary Mission (Core Focus)**: Help people who have lost or damaged their homes due to war, natural disasters, or displacement find safe, dignified housing and rebuild their lives.

**Secondary Mission**: Provide traditional real estate services connecting property buyers with brokers through intelligent property matching, market analytics, and integrated messaging.

Target users include displaced persons seeking emergency shelter, humanitarian organizations, property seekers, real estate brokers, and property owners who want to help.

### 1.3 Brand Identity
- **Name**: DOMUS
- **Pronunciation**: DOH-moos
- **Meaning**: Latin for house, home
- **Primary Tagline**: Find Safety. Find Home. Find Hope.
- **Secondary Tagline**: Your place in the world
- **Symbol**: 🏛️🤝 (helping hands)
- **Color Scheme**:
  - Primary: Warm beige #F5E6D3 (neutral base)
  - Secondary: Soft white #FFFFFF
  - Accent: Vibrant yellow #FFD700 (for CTAs, highlights, alerts, AI suggestions, emotional moments)
  - Supporting: Calm taupe #D4C4B0
  - Text: Charcoal #333333
  - Trust blue: #4A90A4 (for informational features)
  - Emergency red: #D32F2F (for urgent alerts only)
- **Typography**: Playfair Display (headings), Montserrat (body)
- **Tone**: Warm, supportive, hopeful, modern, human, mission-driven, not corporate, not generic

## 2. Website Structure & Access Control

### 2.1 Public vs Authenticated Access

**PUBLIC ACCESS (Non-Logged-In Users)**:
- **ONLY** the Homepage is visible
- No navigation menu
- No access to any other pages
- Only visible elements:
  - Homepage content
  - Login button
  - Register button

**AUTHENTICATED ACCESS (Logged-In Users)**:
- Full navigation menu appears (role-based)
- Access to all internal pages:
  - Dashboard
  - Properties
  - Emergency Housing (with integrated map)
  - Chat
  - Profile
  - Role-specific pages

**CRITICAL IMPLEMENTATION**:
- Routing-level authentication enforcement
- Not just visual hiding
- Redirect to login if unauthenticated user tries to access protected routes
- Session-based or token-based authentication

### 2.2 Page Architecture (12 Pages)

#### Page 1: Homepage (Public Access ONLY) - COMPLETE CREATIVE REDESIGN
**URL**: /

**Access**: Public (non-authenticated users)

**Navigation**: NO navigation menu visible. Only Login and Register buttons.

**Design Philosophy**:
- Visually powerful and emotionally engaging
- Humanitarian-tech platform aesthetic
- Premium, intentional, memorable
- NOT template-based or generic
- Warm, human, safe, trustworthy, modern

**Hero Section - Animated & Emotional**:

*Visual Treatment*:
- Large DOMUS logo with 🏛️🤝 symbol (fade-in animation)
- Background: Soft gradient animation or floating abstract shapes (subtle motion)
- Light parallax effect on scroll

*Animated Headline* (word-by-word reveal with typing effect or fade-in):
- Lost your home?
- (short pause - 1 second)
- Let's help you rebuild.

Alternative headline options:
- From Crisis to Safety.
- (pause)
- We're here to help.

OR:
- Everyone deserves
- (pause)
- a place to call home.

*Subheadline* (slide-up animation after headline completes):
- DOMUS connects people who have lost their homes to safe housing, emergency shelters, and compassionate support — powered by AI.

*Primary CTA Buttons* (animated with subtle glow or hover expansion, yellow accent):
- Find Safe Housing (pulse animation)
- Get Emergency Shelter
- Start Your New Beginning

*Secondary text* (fade-in):
- For traditional property search, explore our marketplace after registration

**Mission Section** (scroll-triggered fade-in):
- Headline: Our Mission: Where Humanity Meets Technology
- Description: We believe everyone deserves a safe place to call home. DOMUS combines AI intelligence with human compassion to help people rebuild their lives.
- Animated statistics counter:
  - Families helped: [number] (count-up animation)
  - Emergency shelters available: [number]
  - Partner organizations: [number]
  - Countries served: [number]

**How DOMUS Helps Section** (3 Steps with Icons - scroll-triggered reveal):

*Step 1: Tell Us Your Situation*
- Icon animation (slide-in from left)
- Share your needs privately and securely
- We understand you're going through a difficult time

*Step 2: AI Finds Safe Options*
- Icon animation (slide-in from center)
- Our AI matches you with available housing and shelters
- Intelligent matching prioritizes your safety and needs

*Step 3: Connect and Rebuild*
- Icon animation (slide-in from right)
- Direct contact with helpers and support organizations
- Start your journey to a new beginning

**Who We Help** (scroll-triggered fade-in with staggered timing):
- 🏠 People displaced by war or conflict
- 🌊 Families affected by natural disasters
- 🔥 Those who lost homes to fires or floods
- 🌍 Climate refugees seeking safety
- 💔 Anyone in urgent need of shelter

**AI-Powered Assistance Highlight** (yellow accent section):
- Headline: Intelligent Matching, Human Compassion
- Description: Our AI doesn't just find properties — it understands your situation, prioritizes your safety, and connects you with the right support.
- Visual: Animated AI assistant graphic or abstract tech illustration
- Features:
  - Smart emergency housing matching
  - Real-time shelter availability
  - Personalized safety recommendations
  - Multi-language support

**Emergency Support Highlight** (scroll-triggered reveal):
- Headline: Immediate Help When You Need It Most
- Description: 24/7 emergency hotline, partner organizations, and support resources
- Emergency contact button (yellow, prominent)

**Success Stories Preview** (scroll-triggered fade-in):
- Headline: From Crisis to Safety: Real Stories of Hope
- 2-3 anonymized stories with photos (card animations on scroll)
- Read More Stories link (yellow button with hover effect)

**Traditional Real Estate Section** (subtle, secondary positioning):
- Headline: Looking for Property Investment or Home Purchase?
- Description: DOMUS also offers traditional real estate services with AI-powered property matching and market analytics.
- Features (icon grid with hover effects):
  - 🌍 Global property coverage
  - 🤖 AI property matching
  - 📊 Market analytics
  - 💰 Multi-currency support
- CTA: Explore Properties (yellow button) | For Brokers

**Final CTA Section** (strong emotional call-to-action with parallax background):
- Headline: Your Journey to Safety Starts Here
- Subheadline: Join thousands of families who found hope through DOMUS
- Large CTA button: Get Started (yellow, animated glow)
- Secondary CTA: Learn More About DOMUS

**Footer**:
- DOMUS © 2026
- About DOMUS
- Contact
- Terms & Privacy
- Partner Organizations
- Social links
- Emergency Hotline (prominent)

**Animation & Interaction Requirements**:
- Smooth scrolling transitions
- Text reveal animations (fade-in, slide-up, word-by-word)
- Scroll-triggered content reveal
- Subtle parallax effects
- Soft background motion (gradient animation or floating shapes)
- Animated CTA buttons (glow, hover expansion)
- Statistics counter animation
- Icon animations (slide-in, fade-in)
- Card hover effects
- Section transitions feel modern and intentional
- No abrupt changes
- Performance-optimized animations (60fps)
- Mobile-responsive animations
- Reduced motion support for accessibility

**Technical Implementation**:
- Use Framer Motion or similar animation library
- Intersection Observer for scroll-triggered animations
- CSS animations for subtle background motion
- Optimized for performance (60fps)
- Mobile-responsive animations
- Reduced motion support for accessibility

#### Page 2: Login/Register Page
**URL**: /auth

**Access**: Public

**Login Form**:
- Email
- Password
- Remember me checkbox
- Forgot password? link
- Login with Google button (using OSS Google login)
- Not a member? Join DOMUS link (yellow)

**Register Form (toggle)**:
- **Account Type** (radio buttons with clear descriptions):
  - **Person in Need of Emergency Housing** 🏠 - I lost my home and need safe housing
  - **Property Seeker** 🔍 - I'm looking to buy or rent property
  - **Broker** 💼 - I'm a real estate professional
- Full Name
- Email
- Password
- Confirm Password
- Phone (optional)
- Preferred Currency: dropdown (EUR/USD/GBP/BGN/TRY/RON/CHF)
- I agree to the DOMUS Terms checkbox
- Create DOMUS Account button (yellow)

**Additional Fields for Person in Need of Emergency Housing**:
- Situation type: War/Conflict / Natural Disaster / Fire / Flood / Climate Refugee / Other
- Country of origin
- Current location (if displaced)
- Family size: Adults / Children / Elderly
- Special needs (medical, accessibility, schools) - optional
- Current housing situation: Shelter / With relatives / Temporary camp / Homeless / Other
- Support organizations assisting (optional)
- Documentation status: Refugee status / Temporary protection / Other
- Budget source: Humanitarian aid / Personal savings / Government support / NGO assistance / None
- Preferred countries for relocation
- Privacy note: All information is optional and protected. You control what you share.

**After Registration**:
- Welcome email based on account type
- Redirect to appropriate Dashboard

#### Page 3: Dashboard (Authenticated Users Only)
**URL**: /dashboard

**Access**: Authenticated users only (redirect to /auth if not logged in)

**Sidebar Navigation** (Role-Based):

**For Person in Need of Emergency Housing**:
- 🏠 Dashboard Home
- 🗺️ Emergency Housing (with integrated map)
- 📋 Properties (all listings)
- 💬 Chat
- 📄 My Profile
- ⚙️ Settings

**For Property Seeker**:
- 🏠 Dashboard Home
- 📋 Properties (all listings)
- 🤖 AI Home Finder
- ❤️ Saved Properties
- 💬 Chat
- 📊 Market Analytics
- 👤 My Profile
- ⚙️ Settings

**For Broker**:
- 🏠 Dashboard Home
- 📋 Properties (all listings)
- ➕ Add New Property
- 📝 My Listings
- 💬 Chat
- 📊 Market Analytics
- 👤 My Profile
- ⚙️ Settings

**Dashboard Home Content** (Role-Specific):

**For Person in Need of Emergency Housing**:
- Welcome, [Name]. We're here to help you find safety.
- **Urgent Actions** (yellow buttons):
  - Find Nearest Shelter button
  - Search Emergency Housing button
  - Contact Support Organization button
- **Your Status**:
  - Current location
  - Family size
  - Special needs
  - Applications sent
  - Messages received
- **Recommended Shelters** (AI-matched, top 3)
- **Available Emergency Housing** (top 5 matches)
- **Support Resources**:
  - Partner organizations in your area
  - Emergency contacts
  - Legal assistance
  - Medical facilities
- **Recent Activity**:
  - Properties viewed
  - Messages
  - Applications

**For Property Seeker**:
- Welcome back, [Name]!
- **Personalized Statistics**:
  - New properties this week
  - Saved properties count
  - Active alerts count
  - Total properties viewed
- **AI Recommendations Section** (yellow highlights):
  - Top 3 Matches for You - AI-recommended properties with match scores
- **Recent Activity**:
  - Recently viewed properties (last 5)
  - Recent searches
  - Recent messages preview
- **Market Snapshot Widget**:
  - Quick chart showing trends in preferred locations
- **Quick Actions** (yellow buttons):
  - Find My Perfect Home (AI Home Finder)
  - Browse All Listings (Properties Page)

**For Broker**:
- Welcome, [Broker Name]!
- **Statistics**:
  - Total listings
  - Views this month
  - Inquiries received
  - Active conversations
- **Performance Chart** (views/inquiries over time)
- **Recent Messages** from buyers
- **Top Performing Properties**
- **Quick Actions** (yellow buttons):
  - Add New Property button
  - View All Listings button
  - Check Messages button

**Market Analytics Section** (For Property Seekers and Brokers):
- **Property Price Statistics by Location**:
  - Interactive charts showing average prices by city/neighborhood
  - Price trends over time (1y/3y/5y)
  - Comparison between different locations
  - Currency selector affects all displayed prices
- **Market Insights**:
  - Prices in [City] up 5% this month
  - Best investment areas: ...
  - Market status: Seller's market / Buyer's market / Balanced
- **Average Price Trends**:
  - Line charts showing price movements
  - Bar charts comparing property types
  - Heat maps showing price hotspots
- **Clean Data Visualization**:
  - Modern, professional charts
  - Interactive tooltips
  - Smooth animations
  - Color-coded data
  - Export options (CSV/PDF)

#### Page 4: Emergency Housing (Authenticated Users Only) - COMPLETE RESTRUCTURE
**URL**: /emergency-housing

**Access**: Authenticated users only (redirect to /auth if not logged in)

**CRITICAL CHANGES**:
1. **NO PROPERTY LISTINGS FOR SALE** - This page displays ONLY emergency accommodation and temporary shelters
2. **COUNTRY TEXT INPUT** - Users can type ANY country manually, not just dropdown selection
3. **DYNAMIC EMERGENCY NUMBER** - Display country-specific emergency phone number
4. **IMPROVED MAP MARKERS** - Custom styled markers with yellow accent, NOT simple dots
5. **FULL ENGLISH TRANSLATION** - 100% English throughout
6. **LOGICAL CONNECTION TO PROPERTIES** - Show available properties from selected country at bottom

**Purpose**: Unified emergency housing search with AI assistance and interactive map, focused exclusively on humanitarian crisis accommodation

**Page Layout** (Tabbed Interface):

**Tab 1: AI Housing Finder**

*Hero Section*:
- Headline: Let AI Help You Find Safe Housing
- Subheadline: Answer a few questions and our AI will find the safest, most suitable housing options for you and your family.
- Illustration: Hopeful, safe imagery

*AI Questionnaire* (Step-by-Step, Trauma-Informed):

*Step 1: Your Current Situation*
- Where are you right now? (location input with map)
- How urgent is your need? (Immediate / Within 24 hours / Within a week / Flexible)
- Next button (yellow)

*Step 2: Your Family*
- How many people need housing? (Adults / Children / Elderly)
- Any special needs? (Medical / Accessibility / Schools / Other)
- Next button (yellow)

*Step 3: Your Preferences*
- Where would you like to relocate? (Country/city selector, multi-select)
- I'm flexible with location checkbox
- Next button (yellow)

*Step 4: Your Budget*
- What is your budget source? (Humanitarian aid / Personal savings / Government support / NGO assistance / None)
- Monthly budget (if any): (optional)
- Next button (yellow)

*Step 5: Additional Information*
- Languages you speak: (multi-select)
- Do you have pets? (Yes/No)
- Any other important information? (optional text field)
- Find Safe Housing button (yellow)

*AI Results Page*:
- Loading animation: AI is finding the safest options for you... (yellow accent)
- Results:
  - We found 5 safe housing options for you!
  - Top recommendation highlighted (yellow border):
    - Large card with photo
    - **Visual Badge**: 🏠 Emergency Shelter / 🏡 Temporary Housing / 🏘️ Crisis Housing
    - Why this is safe and suitable for you - AI explanation (yellow highlight)
    - Match score: 95%
    - Availability: Immediate/24h/Week
    - All details (location, capacity, features)
    - Nearby support services
    - View on Map button
    - Contact Now button (yellow)
    - Get Directions button (yellow)
  - Other recommendations (4 options):
    - Smaller cards
    - Visual badges
    - Match scores
    - Brief AI explanations
    - Availability status
- Refine Search button (yellow)
- View All on Map button (yellow) - switches to Map tab

**Tab 2: Interactive Shelter Map** (COMPLETE RESTRUCTURE)

**CRITICAL REQUIREMENTS**:
- **ONLY emergency shelters, temporary housing, and crisis accommodation displayed**
- **NO properties for sale shown on this map**
- **Separate logic from Properties marketplace**

*Country Search Section* (Top of Page):
- **Text Input Field**: Search for any country...
  - User can type ANY country name manually
  - Intelligent autocomplete (optional)
  - NOT limited to dropdown values
  - Supports all countries worldwide
- Search button (yellow)

*Emergency Number Display* (Prominent, Below Search):
- **Dynamic Emergency Number Panel**:
  - When country is entered, display:
    - Emergency Number: [country-specific number]
    - Examples:
      - USA → 911
      - EU countries → 112
      - UK → 999
      - Japan → 110 / 119
      - Australia → 000
      - etc.
  - Large, clear typography
  - Yellow accent background
  - Call Now button (yellow)

*Full-Screen Mapbox Integration*:
- Interactive map covering entire viewport
- **Mapbox Configuration**:
  - API key properly configured in environment variables
  - Map container has explicit height: 100vh and width: 100%
  - Mapbox style properly initialized (mapbox://styles/mapbox/streets-v11)
  - No placeholder message displayed
  - Map loads automatically on page load
  - Dynamic coordinate-based rendering
- **Map Behavior**:
  - When country is typed:
    - Center map on that country
    - Show ONLY shelter markers in that country
    - Remove unrelated markers
    - Zoom to appropriate level

**IMPROVED MARKER DESIGN** (CRITICAL CHANGE):
- **NOT simple dots**
- **Custom styled markers**:
  - Modern emergency-style icons
  - House icon with alert accent
  - Yellow accent color (#FFD700)
  - Larger, more visible size
  - Professional appearance
  - Clearly clickable
- **Color-coded by type**:
  - Red: Urgent/immediate availability
  - Blue: Available within 24-48 hours
  - Green: Long-term emergency housing
  - Orange: Temporary shelters
  - Yellow: Crisis housing
- **Marker Popup** (On Click):
  - **Visual Badge**: 🏠 Emergency Shelter / 🏡 Temporary Housing / 🏘️ Crisis Housing
  - Shelter/housing name
  - Photo (if available)
  - Address
  - Availability status
  - Capacity
  - Family size accepted
  - Special features
  - Languages spoken
  - Partner organization
  - Contact information
  - Get Directions button (yellow)
  - Contact Shelter button (yellow)
  - View Details button

*Smart AI-Powered Search Bar* (Top Overlay):
- Input field: Where are you now? (Type your location)
- **Behavior**: When user types a city (e.g., Tokyo):
  - System searches online for:
    - Emergency shelters
    - Temporary housing
    - Safe accommodation
    - Short-term housing
    - Crisis housing
    - Support housing
  - **NOT limited to internal property listings for sale**
  - Integration options:
    - External housing/shelter APIs
    - Preloaded shelter datasets per city
    - Live internet search for emergency housing resources
- AI processes user's location
- AI finds nearest shelters AND temporary housing options
- AI suggests safest and most suitable options
- AI explains reasoning:
  - This shelter is 2.3 km from your location
  - It accepts families with children
  - Medical facilities nearby
  - Partner organization: Red Cross
- Show Route button (displays route on map)
- Distance and travel time displayed

*Filter Panel* (Left Side Overlay):
- **Listing Type**:
  - ☐ Emergency Shelters
  - ☐ Temporary Housing
  - ☐ Crisis Housing
  - ☐ Short-term Accommodation
- Family size accepted
- Special needs (medical, accessibility)
- Languages spoken
- Pet friendly
- Immediate availability
- Partner organization
- Apply Filters button (yellow)

*Legend* (Bottom Right):
- Marker color meanings
- Badge type explanations
- Icons explanation

*Emergency Contact Panel* (Bottom Left):
- Need Immediate Help?
- Emergency hotline numbers
- Partner organization contacts
- Call Now buttons (yellow)

**Available Properties Section** (Bottom of Page):
- **Logical Connection to Properties Marketplace**:
  - Headline: Available Properties in [Selected Country]
  - Subheadline: Looking for long-term housing? Explore properties for sale or rent in this country.
  - **Display Logic**:
    - IF properties exist in selected country:
      - Show property cards (max 6)
      - ONLY from selected country
      - Visual badges: 🏢 For Sale / 🏘️ For Rent
      - View All Properties button (yellow)
    - IF no properties exist in selected country:
      - Do NOT display unrelated properties
      - Show message: No properties currently listed in [Country]. Check back soon or explore other countries.
  - **Purpose**: Create logical connection between:
    - Emergency Housing (temporary help)
    - Properties (long-term solution)

**Emergency Support Panel** (Available on both tabs):
- Need Immediate Help?
- Emergency contacts
- Partner organizations
- Legal assistance
- Medical facilities

**FULL ENGLISH TRANSLATION**:
- All headings in English
- All buttons in English
- All descriptions in English
- All map labels in English
- All status messages in English
- All placeholder text in English
- All error messages in English
- NO Bulgarian text anywhere

**Design Improvements**:
- **Humanitarian Feel**:
  - Calm color palette
  - Structured layout
  - Clear visual hierarchy
  - Trustworthy design
  - Easy navigation
  - Emotionally supportive
  - NOT marketplace-like
- **Spacing & Hierarchy**:
  - Generous whitespace
  - Clear section separation
  - Logical information flow
  - Prominent CTAs
  - Accessible typography

#### Page 5: Properties (Authenticated Users Only)
**URL**: /properties

**Access**: Authenticated users only (redirect to /auth if not logged in)

**Purpose**: Display all available listings with advanced search and filtering

**CRITICAL DISTINCTION**: This page displays properties for sale/rent from the marketplace, NOT emergency shelters

**Page Layout**:

**Search & Filter Section** (Top):
- Search bar: Search by location, property type, or keywords
- **Filters**:
  - Location: Country / City / Neighborhood (multi-select)
  - **Listing Type**:
    - ☐ Properties for Sale
    - ☐ Properties for Rent
  - Property Type: Apartment / House / Land / Commercial
  - Price Range: Min - Max (with currency selector)
  - Bedrooms: Any / 1 / 2 / 3 / 4+
  - Size Range: Min - Max sqm
  - Sort by: Newest / Price (Low to High) / Price (High to Low) / Nearest to Me
- Apply Filters button (yellow)
- Clear All button

**Results Section**:
- Total results count: Showing 47 properties
- View toggle: Grid View / List View / Map View
- Property cards showing:
  - Main photo
  - **Visual Badge**:
    - 🏢 For Sale (beige badge)
    - 🏘️ For Rent (beige badge)
  - Price (in user's selected currency)
  - Location (city, country)
  - Size (sqm)
  - View Details button
  - Save button
  - Message Broker button
  - View on Map button (Mapbox)
- Pagination

#### Page 6: AI Home Finder (For Property Seekers Only)
**URL**: /ai-home-finder

**Access**: Authenticated Property Seekers only

**Purpose**: AI-powered conversational property matching for traditional property seekers

**Page Layout**:

**Hero Section**:
- Headline: Let AI Find Your Perfect Home
- Subheadline: Answer a few questions and our AI will recommend the best properties for you
- Illustration: Modern AI assistant graphic

**AI Questionnaire** (Step-by-Step):

*Step 1: Budget*
- What's your budget?
- Currency selector
- Min - Max range sliders
- Next button (yellow)

*Step 2: Location*
- Where do you want to live?
- Country selector
- City selector (multi-select)
- I'm flexible with location checkbox
- Next button (yellow)

*Step 3: Property Type*
- What type of property are you looking for?
- Visual cards: Apartment / House / Land / Commercial
- Next button (yellow)

*Step 4: Size & Rooms*
- How much space do you need?
- Bedrooms: 1 / 2 / 3 / 4+
- Size range: Min - Max sqm
- Next button (yellow)

*Step 5: Purpose*
- What's your purpose?
- Investment / Primary Residence / Vacation Home
- Next button (yellow)

*Step 6: Lifestyle*
- What matters most to you? (Select top 3)
- Visual icons with labels:
  - Near public transport
  - Good schools nearby
  - Nightlife & restaurants
  - Quiet neighborhood
  - Green spaces
  - Shopping centers
  - Medical facilities
- Next button (yellow)

*Step 7: Special Requirements*
- Any special requirements? (optional)
- Parking required
- Furnished
- Elevator
- Balcony
- Pet-friendly
- Find My Home button (yellow)

**AI Results Page**:
- Loading animation: AI is analyzing thousands of properties... (yellow accent)
- Results:
  - We found 5 perfect matches for you!
  - Top recommendation highlighted (yellow border):
    - Large property card
    - Why this is perfect for you - AI explanation (yellow highlight)
    - Match score: 95%
    - All property details
    - View Full Details button
    - Save button
    - Message Broker button (yellow)
  - Other recommendations (4 properties):
    - Smaller cards
    - Match scores
    - Brief AI explanations
- Refine Search button (yellow)
- View All Properties button (yellow)

#### Page 7: Add New Property (For Brokers Only)
**URL**: /add-property

**Access**: Authenticated Brokers only

**Purpose**: Comprehensive property creation form with automatic coordinate generation

**Page Layout**:

**Form Sections**:

*Basic Information*:
- Property Title (required)
- Description (required)
- **Listing Type** (required):
  - Property for Sale
  - Property for Rent
  - Emergency Shelter
  - Temporary Housing
  - Crisis Housing
- Property Type (dropdown): Apartment / House / Land / Commercial
- Price (required, with currency selector)
- Year built
- Bedrooms/Bathrooms
- Square meters (required)
- Floor (if apartment)
- Total floors

**Emergency Housing Option**:
- ☐ I want to list this as emergency housing for people in need

*Additional Emergency Housing Fields (if checked)*:
- Availability: Immediate / Within 24 hours / Within a week
- Special terms: Free / Reduced rent / Temporary / Long-term
- Willing to accept: Humanitarian vouchers / NGO guarantees / Government subsidies
- Support offered: Furnished / Utilities included / Transportation help
- Languages spoken by owner/agent
- Maximum family size accepted
- Pet friendly? (Yes/No)
- Accessibility features (for elderly or disabled)
- Proximity to support services

*Location (MANDATORY - Mapbox Integration)*:
- Country (dropdown with ALL countries)
- City
- Address (required)
- **AUTOMATIC COORDINATE GENERATION**:
  - When user types address, system automatically generates coordinates
  - Latitude (auto-filled, required)
  - Longitude (auto-filled, required)
  - Click on Map to Adjust Location button (yellow)
  - **Embedded Mapbox**:
    - API key properly configured
    - Map container has proper height and width
    - Mapbox style properly initialized
    - No placeholder message displayed
    - Map loads automatically
    - User can click to fine-tune exact coordinates
  - Address auto-complete search
  - *DOMUS Validation: Every property needs its coordinates - Cannot submit without them*

*Property Details*:
- Construction type: Brick/Panel/EPK/Concrete
- Heating type
- Parking: Yes/No/Garage
- Furnished: Yes/No/Partially
- Elevator: Yes/No
- Balcony: Yes/No

*Media*:
- **Improved Image Upload UI**:
  - Drag-and-drop interface
  - Preview thumbnails
  - Reorder functionality (drag to reorder)
  - Delete individual images
  - Upload up to 10 photos
  - Progress bar for uploads
  - Image compression automatic
- Virtual tour link (optional)

*Smart Suggestions* (AI-Powered) (yellow highlights):
- AI suggests improvements to listing title
- AI suggests tags based on description
- AI estimates property score before submission
- Apply AI Suggestions button (yellow)

*Additional*:
- Energy certificate
- Ownership type
- Availability date

*Submit Button: Add to DOMUS (yellow)*

**After submission**:
- Property appears in My Listings
- AI automatically analyzes it
- If emergency housing, notify matching users in need
- Notify matching property seekers
- Send confirmation to broker

#### Page 8: Property Detail Page (Authenticated Users Only)
**URL**: /property/:id

**Access**: Authenticated users only

**Layout**:

*Top Section*:
- Photo gallery (carousel)
- **Visual Badge**: 🏠 Emergency Shelter / 🏡 Temporary Housing / 🏢 For Sale / 🏘️ For Rent
- Price (with currency selector to view in different currencies)
- Save to Favorites button
- Share button
- **MESSAGE BROKER BUTTON (prominent, yellow)**

*Key Info*:
- Location (city, country, address)
- Size (sqm)
- Rooms
- Property type
- Listing type
- Listed date
- Views count

*Emergency Housing - Special Support Box* (if applicable):
🏠 THIS PROPERTY IS AVAILABLE FOR EMERGENCY HOUSING

The owner has offered special terms for people in need:

✓ Availability: Immediate
✓ Special terms: Reduced rent / Free temporary stay
✓ Accepts humanitarian vouchers
✓ Owner speaks: English, Ukrainian, Arabic
✓ Near support center (2km)
✓ Family size accepted: up to 5 people
✓ Pet friendly

[APPLY FOR EMERGENCY HOUSING] button (yellow)

*MAPBOX INTEGRATION (MANDATORY)*:
- **Interactive map showing exact property location** (pin from coordinates)
- **Mapbox Configuration**:
  - API key properly configured in environment variables
  - Map container has proper height and width
  - Mapbox style properly initialized
  - No placeholder message displayed
  - Map loads automatically on page load
  - Dynamic coordinate-based rendering
- Nearby: schools, metro, supermarkets, parks, support services (display icons)
- For emergency housing: refugee support centers, medical clinics, community centers
- Get Directions button (yellow)
- Street View link (if available)
- Caption: Exact property location

*Description*:
Full property description

*Broker Information*:
- Broker name/agency
- Contact button (opens chat, yellow)
- Other listings from same broker

*Similar Properties*:
Other properties you might like - AI-recommended similar properties

#### Page 9: Chat (Authenticated Users Only)
**URL**: /chat

**Access**: Authenticated users only

**Purpose**: Direct messaging between users and brokers/helpers

**For Property Seekers / Emergency Housing Users View**:
- Conversation list showing:
  - Broker/Helper name
  - Property title
  - **Visual Badge**: 🏠 Emergency / 🏡 Temporary / 🏢 Sale / 🏘️ Rent
  - Last message preview
  - Timestamp
  - Unread indicator (🔴 new / 🟢 recent / ⚪ read)
- New Message button (yellow)

**For Brokers View**:
- Conversation list showing:
  - User name
  - Property reference
  - **Visual Badge**: 🏠 Emergency / 🏡 Temporary / 🏢 Sale / 🏘️ Rent
  - Last message preview
  - Timestamp
  - Unread indicator
- Statistics panel:
  - Clients waiting for response
  - Average response time
  - Active conversations

**Conversation View (when opened)**:
- Back button
- Broker/User name
- Property card with photo, title, price, badge, View Listing link
- Message thread with timestamps
- Message input field
- Send button (yellow)
- View Property quick action button (yellow)

**Quick Response Templates (for brokers only)**:
- 📅 The property is available for viewing. When would you like to see it?
- 💰 The price is fixed/negotiable
- 📋 I'm sending you additional photos and information...
- ✅ The property is still available.
- 🏠 Welcome! I'm here to help you find safe housing. Let's discuss your needs.

**New Message Composer**:
- Step 1: Select Property (from saved properties or search)
- Step 2: Write Message
- Step 3: Send Message to Broker (yellow button)

#### Page 10: My Profile / Settings (Authenticated Users Only)
**URL**: /profile

**Access**: Authenticated users only

**Profile Information**:
- Name
- Email
- Phone
- Account type (Person in Need / Property Seeker / Broker)
- Member since: [date]
- Profile photo upload

**Preferences**:
- Default currency (affects ALL prices across site)
- Notification settings:
  - Email alerts
  - SMS alerts
  - Push notifications
  - Message notifications
- Language preference: English
- Saved searches
- Saved properties

**For Person in Need of Emergency Housing Only**:
- Situation details (editable)
- Family composition
- Special needs
- Documentation status
- Budget information
- Preferred locations
- Support organizations
- Privacy settings: Control what you share

**For Property Seekers Only**:
- Viewing history
- Favorite brokers

**For Brokers Only**:
- Agency name
- License number
- Commission rates
- Payment details
- Auto-response message (optional)
- Quick message templates
- Business hours
- Service areas

**Delete Account**:
- Leave DOMUS button

#### Page 11: About DOMUS (Authenticated Users Only)
**URL**: /about

**Access**: Authenticated users only

**Hero Section**:
- Headline: DOMUS: Where Humanity Meets Technology
- Subheadline: We believe everyone deserves a safe place to call home.

**Our Mission**:
- Primary mission: Helping people who lost their homes
- Secondary mission: Traditional real estate services
- How we combine AI with compassion

**How It Works**:
- For people in need
- For property seekers
- For brokers
- For helpers

**Our Impact**:
- Statistics
- Success stories
- Partner organizations

**Our Values**:
- Dignity first
- Privacy protected
- Trauma-informed
- Technology for good

**Team** (optional):
- Founders
- Key team members

#### Page 12: Partner Organizations (Authenticated Users Only)
**URL**: /partners

**Access**: Authenticated users only

**Hero Section**:
- Headline: Our Partners in Helping People Find Home
- Subheadline: We work with humanitarian organizations worldwide to provide safe housing.

**Partner List**:
- Organization logos
- Organization names
- Type (International / Regional / Local)
- Services offered
- Countries active
- Contact information
- Learn More links (yellow)

**Become a Partner**:
- Join Our Network section
- Application form
- Benefits of partnership
- Apply Now button (yellow)

## 3. Core Features

### 3.1 Multi-Currency System
**Supported Currencies**:
- EUR (€)
- USD ($)
- GBP (£)
- BGN (лв)
- RON (lei)
- TRY (₺)
- CHF (Fr)
- SEK (kr)
- NOK (kr)
- DKK (kr)
- CZK (Kč)
- PLN (zł)
- HUF (Ft)

**Functionality**:
- Daily updated exchange rates via API
- All prices stored in EUR for consistency
- Convert to user's preferred currency on display
- Currency selector in top navigation affects all displayed prices

### 3.2 Mapbox Integration (MANDATORY)
**Critical Requirements**:
- **API key properly configured in environment variables**
- **Map container has explicit height and width**
- **Mapbox style properly initialized (mapbox://styles/mapbox/streets-v11)**
- **No placeholder messages displayed**
- **Map loads automatically on page load**
- **Dynamic coordinate-based rendering**

**Required Features**:
- **Automatic coordinate generation from address input**
- Click-to-adjust coordinates on Add Property form
- Display property location on detail page with interactive map
- Show nearby points of interest
- For emergency housing: show support centers, medical facilities, community centers
- Integrated shelter map within Emergency Housing page
- Address autocomplete search
- What's nearby? layer (schools, transport, shops, support services)
- Mandatory coordinates validation for property submission
- Full-screen interactive map on Emergency Housing page
- Property/shelter markers with clustering
- **Custom styled markers** (NOT simple dots):
  - Modern emergency-style icons
  - House icon with alert accent
  - Yellow accent color
  - Professional appearance
- Color-coded markers by type and urgency
- Route display from user location to shelter/property

### 3.3 Emergency Number System (NEW)
**Purpose**: Display country-specific emergency phone numbers dynamically

**Functionality**:
- When user types/selects a country on Emergency Housing page:
  - System displays emergency number for that country
  - Large, prominent display with yellow accent
  - Call Now button for mobile users
- **Emergency Number Database**:
  - USA: 911
  - EU countries: 112
  - UK: 999
  - Japan: 110 / 119
  - Australia: 000
  - China: 110 / 119 / 120
  - India: 112
  - Russia: 112
  - Brazil: 190 / 192 / 193
  - Canada: 911
  - Mexico: 911
  - South Korea: 112 / 119
  - Turkey: 112
  - And all other countries worldwide
- **Display Format**:
  - Emergency Number: [number]
  - Call Now button (yellow)
  - Additional emergency services (police, fire, ambulance) if different

### 3.4 AI Agents

**Agent 1: Emergency Housing Matcher**
- Input: User's situation (location, family size, urgency, special needs) + Available emergency housing + Shelters + Temporary housing + Crisis housing
- Output:
  - Match score (0-100) prioritizing safety and urgency
  - Why this is safe and suitable for you explanation
  - Availability status (immediate/24h/week)
  - Nearby support services: Medical clinics, support centers, schools
  - Transportation options from current location
  - Distance and travel time
  - Visual badge (Emergency Shelter / Temporary Housing / Crisis Housing)
- AI Sensitivity: Trauma-informed, empathetic, prioritizes safety and immediate needs

**Agent 2: Shelter Navigator**
- Input: User's current location + Urgency level + Family composition + Special needs
- **Behavior**: Searches online for:
  - Emergency shelters
  - Temporary housing
  - Safe accommodation
  - Short-term housing
  - Crisis housing
  - Support housing
- **NOT limited to internal property listings**
- Integration options:
  - External housing/shelter APIs
  - Preloaded shelter datasets per city
  - Live internet search for emergency housing resources
- Output:
  - Nearest shelters AND temporary housing ranked by distance and suitability
  - Route and travel time
  - Explanation of why each option is suitable
  - This shelter accepts families with children
  - Medical facilities nearby
  - Partner organization: Red Cross
  - Emergency contact information
  - Visual badges for each listing type

**Agent 3: Property Matcher (Traditional)**
- Input: User preferences + Property database
- Output: Match scores and personalized explanations

**Agent 4: Market Analyst**
- Input: Location + Date range
- Output: Trends, predictions, insights, price statistics

**Agent 5: Currency Converter**
- Input: Amount, from_currency, to_currency
- Output: Converted amount with live rates

**Agent 6: Property Copywriter**
- Input: Property data
- Output: AI-generated compelling property descriptions and title suggestions

**Agent 7: Location Assistant**
- Input: User's current location + Search criteria
- **Behavior**: Searches online for:
  - Emergency shelters
  - Temporary housing
  - Safe accommodation
  - Short-term housing
  - Crisis housing
  - Properties for sale/rent
- **NOT limited to internal property listings**
- Integration options:
  - External housing/shelter APIs
  - Preloaded shelter datasets per city
  - Live internet search for housing resources
- Output:
  - Nearby properties AND shelters ranked by distance and match score
  - Transportation options and travel time
  - Nearby amenities and services
  - Neighborhood insights
  - Visual badges for each listing type

### 3.5 Messaging System
- Direct communication between users and brokers/helpers
- Unread message badges in navigation
- Email and SMS notifications
- Quick response templates for brokers
- Special templates for emergency housing conversations
- Message history and conversation threading
- Property context in conversations
- Auto-responder option for brokers (outside business hours)
- Visual badges for listing types in conversations
- Trauma-informed language support

### 3.6 Notification System
- Email alerts for new matches and messages
- SMS alerts for urgent emergency housing matches
- Push notifications
- Unread message reminders
- Emergency housing availability alerts
- Property match alerts

### 3.7 Emergency Support System
- 24/7 emergency hotline integration
- Partner organization contact directory
- Legal assistance resources
- Medical facility locator
- Support service directory

### 3.8 Impact Tracking
- Track families helped
- Track emergency housing provided
- Track shelters utilized
- Generate impact reports
- Success story collection
- Shareable statistics

### 3.9 Listing Type System
**Clear Distinction Between**:
- **Properties for Sale/Rent**: Traditional real estate listings (🏢 For Sale / 🏘️ For Rent badges)
- **Emergency Shelters**: Immediate crisis housing (🏠 Emergency Shelter badge, yellow)
- **Temporary Accommodation**: Short-term housing solutions (🏡 Temporary Housing badge, yellow)
- **Crisis Housing**: Urgent housing needs (🏘️ Crisis Housing badge, yellow)

**Visual Badges**:
- Displayed on all property cards
- Shown in search results
- Visible in chat conversations
- Present on property detail pages
- Color-coded for quick recognition

**Filtering Categories**:
- Separate filter options for each listing type
- Multi-select capability
- Available on Properties page and Emergency Housing page

**CRITICAL SEPARATION**:
- Emergency Housing page displays ONLY emergency shelters, temporary housing, and crisis accommodation
- Properties page displays ONLY properties for sale/rent
- NO mixing of these two categories on their respective pages

### 3.10 External Housing Search Integration
**Purpose**: Expand search beyond internal listings to include online emergency housing resources

**Integration Options**:
1. **External Housing/Shelter APIs**:
   - Partner with humanitarian organizations
   - Integrate shelter databases
   - Real-time availability updates

2. **Preloaded Shelter Datasets**:
   - City-specific shelter information
   - Regular database updates
   - Offline access capability

3. **Live Internet Search**:
   - Search engine integration for emergency housing
   - Web scraping for shelter information
   - Real-time resource discovery

**Search Scope**:
- Emergency shelters
- Temporary housing
- Safe accommodation
- Short-term housing
- Crisis housing
- Support housing
- Community centers offering shelter
- Humanitarian organization facilities

**Implementation**:
- Triggered when user searches for location on Emergency Housing page
- Results combined with internal listings
- Clear source attribution for each result
- Priority given to verified sources

### 3.11 Authentication & Access Control
**Implementation Requirements**:
- Routing-level authentication enforcement
- Session-based or JWT token-based authentication
- Protected route middleware
- Automatic redirect to /auth for unauthenticated access attempts
- Role-based access control (RBAC)
- Secure session management
- Remember me functionality
- Password reset flow
- Email verification (optional)

**Protected Routes**:
- /dashboard
- /properties
- /emergency-housing
- /ai-home-finder
- /add-property
- /property/:id
- /chat
- /profile
- /about
- /partners

**Public Routes**:
- / (Homepage)
- /auth (Login/Register)

### 3.12 Country Search System (NEW)
**Purpose**: Allow users to search for any country manually on Emergency Housing page

**Functionality**:
- **Text Input Field**: Users can type ANY country name
- **NOT limited to dropdown values**
- **Intelligent Search**:
  - Autocomplete suggestions (optional)
  - Fuzzy matching for typos
  - Support for country names in multiple languages
  - Support for country codes (ISO)
- **Search Behavior**:
  - When country is entered:
    - Display emergency number for that country
    - Center map on that country
    - Show shelter markers in that country
    - Filter results to that country
    - Show available properties in that country (at bottom)
- **All Countries Supported**: Worldwide coverage

## 4. Database Structure

### 4.1 Users Table
- id, email, password_hash, name, account_type (emergency_housing/property_seeker/broker), currency_pref, phone, profile_photo, created_at, last_login, notification_settings

### 4.2 Properties Table
- id, broker_id, title, description, **listing_type (sale/rent/emergency_shelter/temporary_housing/crisis_housing)**, type, price, currency, price_eur (converted), size_sqm, bedrooms, bathrooms, floor, total_floors, construction_type, year_built, parking, furnished, elevator, balcony, country, city, address, latitude (REQUIRED), longitude (REQUIRED), photos, created_at, status (active/sold/pending), views_count, is_emergency_housing (boolean)

### 4.3 EmergencyHousingDetails Table
- property_id, availability (immediate/24h/week), special_terms, accepts_vouchers, support_offered, languages_spoken, max_family_size, pet_friendly, accessibility_features, proximity_to_support

### 4.4 Shelters Table
- id, name, address, latitude (REQUIRED), longitude (REQUIRED), **listing_type (emergency_shelter/temporary_housing/crisis_housing)**, capacity, current_occupancy, availability_status, family_size_accepted, special_features, languages_spoken, partner_org_id, contact_info, emergency_contact, **source (internal/external_api/preloaded/web_search)**

### 4.5 EmergencyHousingUsers Table
- user_id, situation_type, origin_country, current_location, current_lat, current_lng, family_size_adults, family_size_children, family_size_elderly, special_needs, current_housing, support_org, documentation_status, budget_source, budget_amount, preferred_countries, urgency_level, created_at, status

### 4.6 EmergencyHousingMatches Table
- id, user_id, property_id (or shelter_id), match_score, ai_explanation, availability_status, distance_km, travel_time, created_at, viewed_by_user, contacted

### 4.7 Market Data Table
- location_id, country, city, neighborhood, date, avg_price_sqm, property_type, source, transaction_count

### 4.8 Saved Properties Table
- user_id, property_id, saved_date, notes

### 4.9 Messages Table
- id, conversation_id, sender_id, receiver_id, property_id, **listing_type**, message_text, read_status, created_at, attachments

### 4.10 Conversations Table
- id, participant_1_id, participant_2_id, property_id, **listing_type**, last_message_at, last_message_preview, unread_count_1, unread_count_2, status, is_emergency_housing (boolean)

### 4.11 Currency Rates Table
- currency_code, rate_to_eur, last_updated

### 4.12 PartnerOrganizations Table
- id, name, type, website, contact, countries_active, services_offered, logo, verified, created_at

### 4.13 SuccessStories Table
- id, title, story, user_anonymous_id, helper_name, property_location, date, approved, featured_image, impact_stats

### 4.14 ImpactTracking Table
- id, helper_id, user_id, property_id, action_type (housed/shelter/application), date, nights_provided, family_size, notes

### 4.15 ExternalHousingSources Table
- id, source_name, source_type (api/preloaded/web_search), api_endpoint, api_key, last_sync, status, countries_covered, listing_types_supported

### 4.16 EmergencyNumbers Table (NEW)
- id, country_code (ISO), country_name, emergency_number, police_number, fire_number, ambulance_number, additional_info, last_updated

## 5. Workflows

### 5.1 Emergency Housing Search
1. User in need accesses Emergency Housing page (authenticated)
2. User provides current location and needs via AI questionnaire
3. AI processes urgency level and requirements
4. **AI searches emergency housing database, shelters, AND external sources**:
   - Internal listings
   - External housing/shelter APIs
   - Preloaded shelter datasets
   - Live internet search (if enabled)
5. AI calculates match scores prioritizing safety and availability
6. AI generates explanations for each match
7. Display results with visual badges, routes, and contact information
8. User can contact shelter/property owner directly
9. Track interaction for impact reporting

### 5.2 Integrated Map Navigation (Within Emergency Housing Page)
1. User accesses Emergency Housing page → Map tab
2. User types country name in text input field
3. System displays emergency number for that country
4. Map centers on that country
5. **AI searches online for**:
   - Emergency shelters
   - Temporary housing
   - Safe accommodation
   - Short-term housing
   - Crisis housing
6. Display shelter markers with custom styled icons (yellow accent)
7. User can click marker for details
8. User can apply filters
9. User can contact shelter directly
10. Emergency contacts displayed prominently
11. At bottom: Show available properties from that country (if any)

### 5.3 New Property Submission with Auto-Coordinates
1. Broker accesses Add New Property form (authenticated)
2. Broker fills basic information
3. **Broker selects listing type**: Sale / Rent / Emergency Shelter / Temporary Housing / Crisis Housing
4. Broker types address
5. System automatically generates coordinates from address
6. Coordinates auto-filled in latitude/longitude fields
7. **Embedded Mapbox displays property location** (no placeholder message)
8. Broker can click map to fine-tune exact location
9. Broker uploads images (drag-and-drop, preview, reorder)
10. AI suggests title improvements and tags (yellow highlights)
11. Broker submits form
12. Validate coordinates exist
13. Store in database with listing_type
14. If emergency housing, trigger Emergency Housing Matcher
15. Notify matching users in need
16. Send confirmation to broker

### 5.4 Property Detail Page with Map
1. User clicks property from listings (authenticated)
2. Load property details with visual badge
3. Display photo gallery
4. **Load Mapbox with exact coordinates** (no placeholder message)
5. Display property marker on map
6. Show nearby points of interest (schools, transport, etc.)
7. For emergency housing: show support services
8. Display Get Directions button (yellow)
9. User can interact with map (zoom, pan)
10. User can click Message Broker (yellow) to start conversation

### 5.5 AI Emergency Housing Match
1. User completes Emergency Housing AI questionnaire (authenticated)
2. AI processes urgency level and requirements
3. **AI searches emergency housing, shelters, AND external sources**
4. AI calculates match scores (0-100)
5. AI prioritizes immediate availability and safety
6. AI generates personalized explanations (yellow highlights)
7. AI includes nearby support services
8. Display top 5 matches with visual badges and detailed reasoning
9. User can view on map, contact, or get directions (yellow buttons)
10. Track interaction for impact reporting

### 5.6 Daily Market Data Update
1. Fetch exchange rates
2. Update currency conversions
3. Update market charts
4. Refresh AI market insights
5. Calculate average prices by location
6. Generate price trend charts
7. **Sync external housing sources**
8. Update shelter availability
9. Update emergency numbers database

### 5.7 Send Message
1. User sends message (authenticated)
2. Store in database with listing_type
3. Update unread counts
4. Send email notification to receiver
5. Send push notification if online
6. If emergency housing conversation, use trauma-informed language
7. Display visual badge in conversation

### 5.8 Impact Report Generation
1. System tracks all emergency housing interactions
2. Count families helped
3. Count nights of shelter provided
4. Count shelters utilized (internal + external)
5. Collect success stories
6. Generate visual report
7. Make shareable
8. Display on About page and Partner pages

### 5.9 External Housing Source Sync
1. Daily sync with external housing/shelter APIs
2. Update preloaded shelter datasets
3. Validate data quality
4. Remove outdated listings
5. Add new shelters/housing options
6. Update availability status
7. Log sync status and errors

### 5.10 Authentication Flow
1. User visits homepage (public)
2. User clicks Login or Register
3. User completes authentication
4. System validates credentials
5. System creates session/token
6. System redirects to Dashboard based on role
7. Navigation menu appears with role-based options
8. User can access all protected pages

### 5.11 Unauthenticated Access Attempt
1. User tries to access protected route (e.g., /properties)
2. System checks authentication status
3. If not authenticated, redirect to /auth
4. After successful login, redirect back to originally requested page
5. If authentication fails, show error and remain on /auth

### 5.12 Country Search & Emergency Number Display (NEW)
1. User accesses Emergency Housing page → Map tab
2. User types country name in text input field
3. System searches country database
4. System retrieves emergency number for that country
5. Display emergency number prominently with yellow accent
6. Display Call Now button (yellow)
7. Center map on that country
8. Show shelter markers in that country
9. Filter results to that country
10. At bottom: Show available properties from that country (if any)

## 6. Email Templates

### 6.1 Welcome Email - Person in Need
**Subject**: Welcome to DOMUS - We're Here to Help You Find Safety

Dear [Name],

Welcome to DOMUS. We understand you're going through a difficult time, and we're here to help you find a safe, dignified home.

You're not alone. Our platform connects you with emergency housing, shelters, and compassionate support.

Next steps:
1. Complete your profile so we can find the best matches
2. Use our AI to find safe housing options
3. Explore the Emergency Housing page to find nearest shelters
4. Connect with support organizations

[Find Safe Housing] (yellow button)

We're with you on this journey.

With hope,
The DOMUS Team

### 6.2 Welcome Email - Property Seeker
**Subject**: Welcome to DOMUS

Welcome [Name],

Welcome to DOMUS - your intelligent partner in finding the perfect property.

Your journey starts now. Set your preferences and let our AI find your ideal home.

[Set Preferences Button] (yellow)

Take care,
The DOMUS Team

### 6.3 Welcome Email - Broker
**Subject**: Welcome to DOMUS - Start Listing Properties

Hello [Broker Name],

Welcome to DOMUS! You can now start listing properties and connecting with clients.

You can also help people in need by listing emergency housing with special terms.

[Add Your First Property] (yellow button)

Best regards,
The DOMUS Team

### 6.4 Emergency Housing Match Alert
**Subject**: 🏠 Urgent: Safe Housing Found for Your Family

Dear [Name],

We found safe housing options that match your needs:

[Property/Shelter Title]
[Visual Badge: 🏠 Emergency Shelter / 🏡 Temporary Housing]
[Availability: Immediate]
Match Score: [Score]/100

Why this is safe and suitable for you:
[AI Reason 1]
[AI Reason 2]
[AI Reason 3]

Nearby support:
- Support center: [distance]
- Medical facility: [distance]
- Community center: [distance]

The owner speaks: [Languages]

[View Details] [Contact Now] (yellow) [Get Directions] (yellow)

We're here to help.

With hope,
The DOMUS Team

### 6.5 New Message Email
**Subject**: ✉️ New Message About Your Housing Search

Hello [Name],

You have a new message from [Broker/Helper Name] regarding:
[Property/Shelter Title]
[Visual Badge]

[Message Preview...]

[Reply in DOMUS] (yellow button)

The DOMUS Team

### 6.6 Emergency Housing Application Received
**Subject**: 🏠 New Emergency Housing Application

Dear [Helper Name],

A family in need has applied to your emergency housing:

[Property Title]
[Visual Badge]

Applicant: [Name]
Family: [Adults/Children/Elderly]
Situation: [Brief description]
Urgency: [Immediate/24h/Week]

Message:
[Application Message]

[View Application] (yellow) [Contact Family] (yellow) [View on Map] (yellow)

Your response can change a family's life.

Thank you for helping,
The DOMUS Team

## 7. SMS Templates

### 7.1 Emergency Housing Match SMS
DOMUS: 🏠 URGENT - Safe housing found for your family. Immediate availability. View: [shortlink]

### 7.2 Shelter Alert SMS
DOMUS: Nearest shelter: [Name], [Distance] km. Contact: [Phone]. Directions: [shortlink]

### 7.3 New Message SMS (urgent)
DOMUS: New message from [Name] about [Property/Shelter]. Reply in app: [shortlink]

## 8. Test Data

### 8.1 Test Accounts

**Person in Need Test**:
- Email: need@domus.com
- Password: Domus123!
- Name: Anna Kowalski
- Situation: War displacement
- Origin: Ukraine
- Current location: Poland (Warsaw)
- Family: 2 adults, 2 children
- Urgency: Immediate
- Budget: Humanitarian aid
- Preferred countries: Poland, Germany, Czech Republic

**Property Seeker Test**:
- Email: seeker@domus.com
- Password: Domus123!
- Name: Marcus Aurelius
- Currency: EUR
- Preferences: Budget €50k-€200k, interested in Sofia, Rome, Barcelona

**Broker Test**:
- Email: broker@domus.com
- Password: Domus123!
- Name: Julia Caesaris
- Agency: DOMUS Realty
- Listings: At least 10 test properties with coordinates
- Emergency housing participation: Yes

### 8.2 Sample Properties (Minimum 10)

1. **Rome, Italy**
   - Title: Modern apartment near Vatican
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €195,000
   - Coordinates: 41.9028° N, 12.4964° E
   - Description: Bright apartment with views, close to transport
   - Bedrooms: 2
   - Size: 75 sqm

2. **Sofia, Bulgaria**
   - Title: 2-bedroom in Lozenets district
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €145,000
   - Coordinates: 42.6977° N, 23.3219° E
   - Description: Central location, great for families
   - Bedrooms: 2
   - Size: 85 sqm

3. **Barcelona, Spain**
   - Title: Beachfront studio in Barceloneta
   - Listing Type: For Rent
   - Badge: 🏘️ For Rent
   - Price: €1,200/month
   - Coordinates: 41.3751° N, 2.1865° E
   - Description: 2 minutes from beach, high rental yield
   - Bedrooms: 1
   - Size: 45 sqm

4. **Bucharest, Romania**
   - Title: 3-room apartment in Primaverii
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €180,000
   - Coordinates: 44.4673° N, 26.0784° E
   - Description: Luxury district, embassy area
   - Bedrooms: 3
   - Size: 95 sqm

5. **Athens, Greece**
   - Title: Renovated apartment near Acropolis
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €165,000
   - Coordinates: 37.9838° N, 23.7275° E
   - Description: Historical center, tourist rental potential
   - Bedrooms: 2
   - Size: 70 sqm

6. **Varna, Bulgaria**
   - Title: Sea view apartment in Briz district
   - Listing Type: For Rent
   - Badge: 🏘️ For Rent
   - Price: €650/month
   - Coordinates: 43.2141° N, 27.9147° E
   - Description: Panoramic sea views, walking distance to beach
   - Bedrooms: 2
   - Size: 80 sqm

7. **Istanbul, Turkey**
   - Title: Modern loft in Kadıköy
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €175,000
   - Coordinates: 40.9929° N, 29.0264° E
   - Description: Trendy neighborhood, high rental demand
   - Bedrooms: 1
   - Size: 65 sqm

8. **Lisbon, Portugal**
   - Title: Traditional apartment in Alfama
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €285,000
   - Coordinates: 38.7139° N, -9.1394° E
   - Description: Historic district, recently renovated
   - Bedrooms: 2
   - Size: 68 sqm

9. **Prague, Czech Republic**
   - Title: Modern apartment in Vinohrady
   - Listing Type: For Rent
   - Badge: 🏘️ For Rent
   - Price: €900/month
   - Coordinates: 50.0755° N, 14.4378° E
   - Description: Trendy neighborhood, near parks
   - Bedrooms: 2
   - Size: 72 sqm

10. **Berlin, Germany**
   - Title: Spacious loft in Kreuzberg
   - Listing Type: For Sale
   - Badge: 🏢 For Sale
   - Price: €320,000
   - Coordinates: 52.5200° N, 13.4050° E
   - Description: Creative district, high ceilings
   - Bedrooms: 2
   - Size: 90 sqm

### 8.3 Sample Emergency Housing Properties

1. **Warsaw, Poland - Emergency Housing**
   - Title: Family apartment in Mokotów - Emergency Housing 🏠
   - Listing Type: Emergency Shelter
   - Badge: 🏠 Emergency Shelter (yellow)
   - Price: €650/month (normally €900)
   - Coordinates: 52.2297° N, 21.0122° E
   - Description: Welcoming families in need. Near support center.
   - Bedrooms: 2
   - Size: 70 sqm
   - Availability: Immediate
   - Special terms: Reduced rent, accepts humanitarian vouchers, first month free
   - Languages: Polish, Ukrainian, English
   - Near: Support center (1km), Ukrainian school (2km), medical clinic (500m)
   - Max family size: 5
   - Pet friendly: Yes

2. **Berlin, Germany - Emergency Housing**
   - Title: Furnished apartment in Neukölln - Emergency Housing 🏠
   - Listing Type: Temporary Housing
   - Badge: 🏡 Temporary Housing (yellow)
   - Price: €800/month (normally €1200)
   - Coordinates: 52.5200° N, 13.4050° E
   - Description: Fully furnished, utilities included. Helping displaced families.
   - Bedrooms: 3
   - Size: 85 sqm
   - Availability: Within 24 hours
   - Special terms: Reduced rent, furnished, utilities included, flexible lease
   - Languages: German, Arabic, English
   - Near: Language school (800m), medical clinic (1km), community center (1.5km)
   - Max family size: 6
   - Pet friendly: No

3. **Prague, Czech Republic - Emergency Housing**
   - Title: Cozy flat in Vinohrady - Emergency Housing 🏠
   - Listing Type: Crisis Housing
   - Badge: 🏘️ Crisis Housing (yellow)
   - Price: €700/month (normally €950)
   - Coordinates: 50.0755° N, 14.4378° E
   - Description: Near international school. Owner speaks Ukrainian.
   - Bedrooms: 2
   - Size: 65 sqm
   - Availability: Immediate
   - Special terms: Reduced rent, accepts NGO guarantees, near schools
   - Languages: Czech, Ukrainian, Russian
   - Near: International school (500m), support office (2km), park (300m)
   - Max family size: 4
   - Pet friendly: Yes

### 8.4 Sample Shelters

1. **Warsaw Emergency Shelter**
   - Name: Warsaw Refugee Support Center
   - Listing Type: Emergency Shelter
   - Badge: 🏠 Emergency Shelter (yellow)
   - Address: ul. Marszałkowska 123, Warsaw
   - Coordinates: 52.2297° N, 21.0122° E
   - Capacity: 50 people
   - Current occupancy: 35
   - Availability: Immediate
   - Family size accepted: Any
   - Special features: Medical care, language classes, children's area
   - Languages: Polish, Ukrainian, English, Russian
   - Partner: Red Cross Poland
   - Contact: +48 22 123 4567
   - Emergency contact: +48 22 999 8888
   - Source: Internal

2. **Berlin Temporary Housing**
   - Name: Berlin Refugee Welcome Center
   - Listing Type: Temporary Housing
   - Badge: 🏡 Temporary Housing (yellow)
   - Address: Hauptstraße 45, Berlin
   - Coordinates: 52.5200° N, 13.4050° E
   - Capacity: 80 people
   - Current occupancy: 60
   - Availability: Within 24 hours
   - Family size accepted: Any
   - Special features: Furnished rooms, meals provided, job assistance
   - Languages: German, Arabic, English, Turkish
   - Partner: Caritas Germany
   - Contact: +49 30 123 4567
   - Emergency contact: +49 30 999 8888
   - Source: Internal

3. **Prague Support Center**
   - Name: Prague Refugee Aid Center
   - Listing Type: Crisis Housing
   - Badge: 🏘️ Crisis Housing (yellow)
   - Address: Vinohradská 789, Prague
   - Coordinates: 50.0755° N, 14.4378° E
   - Capacity: 40 people
   - Current occupancy: 25
   - Availability: Immediate
   - Family size accepted: Up to 6
   - Special features: Legal aid, medical care, school enrollment help
   - Languages: Czech, Ukrainian, Russian, English
   - Partner: Czech Refugee Aid
   - Contact: +420 222 123 456
   - Emergency contact: +420 222 999 888
   - Source: Internal

### 8.5 Sample Partner Organizations

1. **UNHCR - UN Refugee Agency**
   - Type: International humanitarian organization
   - Services: Refugee protection, legal assistance, housing support
   - Countries: Worldwide
   - Verified: Yes

2. **Red Cross Poland**
   - Type: Humanitarian organization
   - Services: Emergency shelter, family reunification, integration support
   - Countries: Poland
   - Verified: Yes

3. **Caritas Germany**
   - Type: Catholic charity organization
   - Services: Housing assistance, language courses, job placement
   - Countries: Germany
   - Verified: Yes

4. **Czech Refugee Aid**
   - Type: NGO
   - Services: Legal aid, housing search, integration programs
   - Countries: Czech Republic
   - Verified: Yes

### 8.6 Sample Success Stories (For Homepage)

**Story 1: From Kyiv to Warsaw**
- User: Anna K. (anonymized)
- Origin: Kyiv, Ukraine
- Situation: War displacement
- Family: 2 adults, 2 children (ages 7 and 10)
- Property: 2-bedroom apartment in Warsaw (🏠 Emergency Shelter)
- Helper: Maria Schmidt
- Outcome: Housed within 2 weeks, children enrolled in school
- Quote: DOMUS gave us hope when we had none. We found not just a home, but a community that welcomed us.
- Impact: 180 nights of shelter provided, 2 children in school

**Story 2: After the Earthquake**
- User: Mehmet Y. (anonymized)
- Origin: Antakya, Turkey
- Situation: Earthquake survivor
- Family: 3 adults, 1 elderly parent
- Property: Ground floor accessible apartment in Istanbul (🏡 Temporary Housing)
- Helper: Ayşe Demir
- Outcome: Found accessible housing for elderly parent
- Quote: The earthquake took our home, but DOMUS helped us rebuild our lives.
- Impact: 120 nights of shelter provided, accessible housing for elderly

### 8.7 Sample Emergency Numbers Database

1. **USA**: 911
2. **EU Countries**: 112
3. **UK**: 999
4. **Japan**: 110 (Police) / 119 (Fire/Ambulance)
5. **Australia**: 000
6. **China**: 110 (Police) / 119 (Fire) / 120 (Ambulance)
7. **India**: 112
8. **Russia**: 112
9. **Brazil**: 190 (Police) / 192 (Ambulance) / 193 (Fire)
10. **Canada**: 911
11. **Mexico**: 911
12. **South Korea**: 112 (Police) / 119 (Fire/Ambulance)
13. **Turkey**: 112
14. **Poland**: 112
15. **Germany**: 112
16. **Czech Republic**: 112
17. **Ukraine**: 112
18. **And all other countries worldwide**

## 9. Navigation Components

### 9.1 Top Navigation (Role-Based)

**For Non-Authenticated Users (Homepage Only)**:
- DOMUS logo (with 🏛️🤝 symbol)
- NO navigation menu
- Login button (yellow)
- Register button (yellow)

**For Person in Need of Emergency Housing (Authenticated)**:
- DOMUS logo (with 🏛️🤝 symbol)
- Main menu:
  - 🏠 Dashboard
  - 🗺️ Emergency Housing
  - 📋 Properties
  - 💬 Chat (with unread badge)
  - 👤 Profile
- Search bar with Search for safe housing placeholder
- Emergency hotline button (prominent, yellow)
- User menu with profile and logout

**For Property Seeker (Authenticated)**:
- DOMUS logo
- Main menu:
  - 🏠 Dashboard
  - 📋 Properties
  - 🤖 AI Home Finder
  - 💬 Chat (with unread badge)
  - 👤 Profile
- Currency selector (affects all displayed prices)
- Search bar with Search properties placeholder
- User menu with profile and logout

**For Broker (Authenticated)**:
- DOMUS logo
- Main menu:
  - 🏠 Dashboard
  - 📋 Properties
  - ➕ Add New Property
  - 📝 My Listings
  - 💬 Chat (with unread badge)
  - 👤 Profile
- Currency selector
- Search bar
- User menu with profile and logout

### 9.2 Footer Navigation

**For Non-Authenticated Users (Homepage)**:
- DOMUS © 2026
- About DOMUS (link to /about after login)
- Contact
- Terms & Privacy
- Partner Organizations (link to /partners after login)
- Social links
- Emergency Hotline (prominent)

**For Authenticated Users**:
- DOMUS © 2026
- Emergency Housing
- About DOMUS
- Contact
- Terms & Privacy
- Partner Organizations
- Impact Report
- Social links

## 10. Design Requirements

### 10.1 Visual Style
- **Color Scheme**:
  - Primary: Warm beige #F5E6D3 (neutral base)
  - Secondary: Soft white #FFFFFF
  - **Accent: Vibrant yellow #FFD700** (for CTAs, highlights, alerts, AI suggestions, emotional moments)
  - Supporting: Calm taupe #D4C4B0
  - Text: Charcoal #333333
  - Trust blue: #4A90A4 (for informational features)
  - Emergency red: #D32F2F (for urgent alerts only)
- **Tone**: Warm, supportive, hopeful, modern, human, mission-driven, not corporate, not generic
- **Typography**: Playfair Display (headings), Montserrat (body)
- 🏠 Symbol for emergency housing features
- Rounded corners with soft shadows
- Responsive (mobile, tablet, desktop)
- Fast loading (optimized images)
- Trauma-informed design for emergency sections (calming colors, clear language, no distressing imagery)

**Yellow Accent Usage**:
- Call-to-action buttons (Find Safe Housing, Contact Now, Apply Now, etc.)
- Important highlights and alerts
- AI suggestions and recommendations
- Emergency housing badges
- Quick action buttons
- Submit buttons
- Primary interactive elements
- Emotional moments on homepage
- Emergency number display
- Custom map markers

**Design Balance**:
- Not too colorful, but not flat beige
- Yellow provides warmth and hope
- Beige provides calm and safety
- White provides clarity and space
- Overall feel: Warm, supportive, modern, human, premium, intentional

### 10.2 Homepage Design (Creative & Emotional)
- **NOT template-based or generic**
- Visually powerful and emotionally engaging
- Humanitarian-tech platform aesthetic
- Premium, intentional, memorable
- Large animated headlines with word-by-word reveal
- Smooth scrolling transitions
- Subtle parallax effects
- Soft background motion (gradient animation or floating shapes)
- Scroll-triggered content reveal
- Animated CTA buttons (glow, hover expansion)
- Statistics counter animation
- Icon animations (slide-in, fade-in)
- Card hover effects
- Section transitions feel modern and intentional
- No abrupt changes
- Performance-optimized animations (60fps)
- Mobile-responsive animations
- Reduced motion support for accessibility

### 10.3 Header Design
- **Modern, minimal, well-aligned header**
- Clean button structure with yellow accents for primary actions
- Proper spacing and alignment
- Role-based navigation (only show relevant sections)
- Emergency hotline button prominent (yellow) for users in need
- Currency selector integrated seamlessly (for authenticated users)
- Search bar with clear placeholder (for authenticated users)
- User menu with profile photo (for authenticated users)
- Unread message badge clearly visible (for authenticated users)
- Responsive design for mobile
- **NO navigation menu for non-authenticated users on homepage**

### 10.4 Unified Design System
- **Consistency**: All pages follow the same design language
- **Professional UI**: Modern, clean, minimal aesthetic throughout
- **Smooth Transitions**: Animations and page transitions feel cohesive
- **Typography**: Consistent font usage
- **Color Palette**: Strict adherence to beige/white/yellow/taupe scheme
- **Component Library**: Reusable UI components across all pages
- **Spacing**: Consistent padding, margins, and whitespace
- **Icons**: Unified icon set throughout platform
- **Yellow Accents**: Consistent use of yellow for CTAs and highlights

### 10.5 Role-Based Experience
- **Person in Need**: See emergency housing, integrated map, AI assistance, support resources
- **Property Seekers**: See property search, AI tools, saved properties, market analytics
- **Brokers**: See listing management, client inquiries, performance analytics
- **Clean Navigation**: Users only see relevant sections for their role
- **No Clutter**: Remove irrelevant features from user's view

### 10.6 Humanitarian Design Principles
- **Dignity First**: All design respects the dignity of people in need
- **Warm and Hopeful**: Yellow accents convey hope and support
- **Calm and Safe**: Beige base conveys safety and stability
- **Clear and Simple**: No complex jargon or confusing navigation
- **Accessible**: WCAG 2.1 AA compliance
- **Trauma-Informed**: Avoid distressing imagery or language
- **Multilingual Ready**: Design accommodates multiple languages

### 10.7 Map Design
- **Full-Screen Maps**: Immersive map experience within Emergency Housing page
- **CRITICAL**: Mapbox must load properly without placeholder messages
- **Custom Styled Markers**: NOT simple dots
  - Modern emergency-style icons
  - House icon with alert accent
  - Yellow accent color (#FFD700)
  - Larger, more visible size
  - Professional appearance
  - Clearly clickable
- **Color-Coded Markers**: Visual hierarchy by urgency and type
- **Visual Badges**: Clear distinction between listing types
- **Overlay Panels**: Non-intrusive filter and AI assistant panels
- **Smooth Interactions**: Zoom, pan, click feel natural
- **Route Display**: Clear route visualization from user location
- **Yellow Accents**: Action buttons use yellow color

### 10.8 AI Interface Design
- **Step-by-Step Flow**: Clear progress through questionnaires
- **Visual Cards**: Engaging visual elements for selections
- **Loading Animation**: Professional AI processing animation with yellow accents
- **Results Presentation**: Clear hierarchy of recommendations
- **Yellow Highlights**: AI explanations and suggestions highlighted in yellow
- **Visual Badges**: Clear listing type indicators
- **Explanations**: AI reasoning presented clearly and empathetically

### 10.9 Badge System
- **Visual Badges** for all listing types:
  - 🏠 Emergency Shelter (yellow background)
  - 🏡 Temporary Housing (yellow background)
  - 🏘️ Crisis Housing (yellow background)
  - 🏢 For Sale (beige background)
  - 🏘️ For Rent (beige background)
- Displayed consistently across:
  - Property cards
  - Search results
  - Map markers
  - Property detail pages
  - Chat conversations
  - Email notifications

### 10.10 Emergency Housing Page Design (COMPLETE RESTRUCTURE)
- **Humanitarian Feel**:
  - Calm color palette
  - Structured layout
  - Clear visual hierarchy
  - Trustworthy design
  - Easy navigation
  - Emotionally supportive
  - NOT marketplace-like
- **Spacing & Hierarchy**:
  - Generous whitespace
  - Clear section separation
  - Logical information flow
  - Prominent CTAs
  - Accessible typography
- **Country Search**:
  - Large, clear text input field
  - Prominent search button (yellow)
  - Autocomplete suggestions (optional)
- **Emergency Number Display**:
  - Large, clear typography
  - Yellow accent background
  - Prominent Call Now button (yellow)
  - Easy to read and access
- **Map Markers**:
  - Custom styled icons (NOT simple dots)
  - Yellow accent color
  - Professional appearance
  - Clearly clickable
- **Available Properties Section**:
  - Clear separation from emergency housing
  - Logical connection to marketplace
  - Only show properties from selected country
  - Clean card design

### 10.11 Authentication
- Google login using OSS Google login method
- Session-based or JWT token-based authentication
- Secure password hashing
- Remember me functionality
- Password reset flow
- Email verification (optional)

### 10.12 Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Reduced motion support
- Multi-language support (English primary, with more languages for emergency housing as needed)

## 11. Global Coverage

### 11.1 Supported Countries
All countries worldwide (expandable database)

### 11.2 Language
All text in English. Emergency housing sections will gradually add more languages based on user needs (Ukrainian, Arabic, etc.)

## 12. Ethical Guidelines

### 12.1 Core Principles
1. **Dignity First** - All communication and design respects the dignity of people in need
2. **Privacy Protected** - Users control what they share and with whom
3. **Trauma-Informed** - Language and processes consider trauma
4. **No Exploitation** - Properties must offer genuine help, not profit from desperation
5. **Verified Helpers** - Organizations can be verified; individual helpers are encouraged to provide references
6. **Free for People in Need** - No fees for people seeking emergency housing, ever
7. **Multi-Lingual Support** - Gradual addition of languages as needed
8. **Transparency** - Clear communication about terms, processes, and expectations
9. **Community Building** - Connect people with support networks, not just housing
10. **Long-term Support** - Help doesn't end when housing is found

### 12.2 Content Guidelines
- Use person-first language (people who are displaced not displaced people)
- Avoid sensationalism or exploitation of trauma
- Respect anonymity and privacy
- Use hopeful, empowering language
- Provide clear, actionable information
- Avoid jargon and complex terminology
- Include trigger warnings where appropriate
- Celebrate successes without diminishing ongoing challenges

### 12.3 Verification Process
- Property owners offering emergency housing are encouraged to provide references
- Partner organizations undergo verification process
- Users are never required to share more than they're comfortable with
- All parties can report concerns or inappropriate behavior
- Platform monitors for exploitation or fraud

## 13. Summary of Major Changes (v4 Update)

### 13.1 Emergency Housing Page Complete Restructure
- **REMOVED**: Property listings for sale from Emergency Housing page
- **FOCUS**: ONLY emergency accommodation and temporary shelters
- **SEPARATION**: Complete logic separation from Properties marketplace
- Emergency Housing displays:
  - Emergency shelters
  - Temporary housing
  - Crisis accommodation
  - Short-term housing
  - Safe housing centers
- Properties page displays:
  - Properties for sale
  - Properties for rent

### 13.2 Country Search System
- **NEW**: Text input field for typing ANY country manually
- **REMOVED**: Dropdown-only limitation
- **FEATURES**:
  - Intelligent autocomplete (optional)
  - Fuzzy matching for typos
  - Support for country names in multiple languages
  - Support for country codes (ISO)
  - Worldwide coverage

### 13.3 Emergency Number System
- **NEW**: Dynamic emergency number display per country
- **FUNCTIONALITY**:
  - When country is entered, display emergency number
  - Large, prominent display with yellow accent
  - Call Now button for mobile users
  - Support for all countries worldwide
- **DATABASE**: Emergency numbers for all countries

### 13.4 Improved Map Markers
- **REMOVED**: Simple dot markers
- **NEW**: Custom styled markers
  - Modern emergency-style icons
  - House icon with alert accent
  - Yellow accent color (#FFD700)
  - Larger, more visible size
  - Professional appearance
  - Clearly clickable
- **COLOR-CODED**: By type and urgency
- **POPUP**: Detailed information on click

### 13.5 Full English Translation
- **100% English** throughout Emergency Housing page
- All headings, buttons, descriptions, labels, messages in English
- NO Bulgarian text anywhere
- Consistent language across entire platform

### 13.6 Logical Connection to Properties
- **NEW**: Available Properties section at bottom of Emergency Housing page
- **LOGIC**:
  - Show properties from selected country only
  - If no properties exist, show appropriate message
  - Do NOT display unrelated properties
- **PURPOSE**: Connect emergency housing (temporary) with properties (long-term)

### 13.7 Design Improvements
- **Humanitarian Feel**: Calm, structured, trustworthy, emotionally supportive
- **NOT Marketplace-Like**: Clear distinction from property marketplace
- **Spacing & Hierarchy**: Generous whitespace, clear sections, logical flow
- **Yellow Accents**: Strategic use for CTAs, emergency numbers, markers

### 13.8 Preserved Functionality
- All core features maintained
- Multi-currency system
- Mapbox integration (enhanced with custom markers)
- AI agents
- Messaging system
- Notification system
- Emergency support system
- Impact tracking
- Listing type system
- External housing search integration
- Visual badges
- All workflows preserved
- Authentication & access control

## 14. Implementation Priority

### Phase 1: Emergency Housing Page Restructure (HIGHEST PRIORITY)
1. **Remove property listings for sale from Emergency Housing page**
   - Update page logic to display ONLY emergency shelters, temporary housing, crisis accommodation
   - Separate database queries from Properties marketplace
   - Update filters to remove sale/rent options
2. **Implement country text input field**
   - Replace dropdown with text input
   - Add intelligent autocomplete (optional)
   - Support fuzzy matching
   - Support all countries worldwide
3. **Implement emergency number system**
   - Create EmergencyNumbers database table
   - Populate with emergency numbers for all countries
   - Display emergency number dynamically when country is entered
   - Add Call Now button (yellow)
4. **Improve map markers**
   - Replace simple dots with custom styled markers
   - Implement house icon with alert accent
   - Use yellow accent color (#FFD700)
   - Make markers larger and more visible
   - Ensure professional appearance
5. **Full English translation**
   - Translate all text on Emergency Housing page to English
   - Remove all Bulgarian text
   - Ensure consistency across entire page
6. **Add Available Properties section**
   - Create section at bottom of Emergency Housing page
   - Display properties from selected country only
   - Show appropriate message if no properties exist
   - Link to Properties page
7. **Design improvements**
   - Implement humanitarian feel
   - Improve spacing and hierarchy
   - Ensure NOT marketplace-like
   - Add yellow accents strategically

### Phase 2: Testing & Validation
1. Test Emergency Housing page functionality
2. Test country search system
3. Test emergency number display
4. Test map markers
5. Test Available Properties section
6. Verify English translation
7. Test design improvements
8. Mobile responsiveness
9. Cross-browser testing

### Phase 3: Other Pages & Features
1. Update other pages as needed
2. Ensure consistency across platform
3. Test authentication flow
4. Test role-based access
5. Performance optimization
6. Accessibility improvements

### Phase 4: Documentation & Training
1. Update user documentation
2. Create broker training materials
3. Partner organization onboarding
4. API documentation for external sources

---

**DOMUS v4 is now:**
1. **Emergency Housing Page Completely Restructured**: ONLY emergency accommodation, NO property listings for sale
2. **Country Text Input**: Users can type ANY country manually, not limited to dropdown
3. **Dynamic Emergency Numbers**: Display country-specific emergency phone numbers
4. **Improved Map Markers**: Custom styled markers with yellow accent, NOT simple dots
5. **Full English Translation**: 100% English throughout Emergency Housing page
6. **Logical Connection**: Available Properties section shows properties from selected country
7. **Humanitarian Design**: Calm, structured, trustworthy, emotionally supportive, NOT marketplace-like
8. **Preserved Functionality**: All core features maintained and enhanced
9. **Secure Access Control**: Homepage is the only public page, all others require authentication
10. **Premium Design**: Warm, supportive, hopeful, modern, human, mission-driven

**All functionality preserved and enhanced with complete Emergency Housing page restructure, country search system, emergency number display, improved map markers, full English translation, and logical connection to Properties marketplace.**