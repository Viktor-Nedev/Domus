# Domus

## Inspiration
Domus was inspired by two real problems happening at the same time: people searching for long-term homes and people needing urgent temporary shelter during crises. We wanted one platform that supports both everyday housing and emergency housing with AI-assisted discovery.

## What it does
Domus is a real-estate and emergency-housing platform with two main flows:
- Resident flow: browse properties, use Home Finder, save listings, and view dashboard insights.
- Housing Partner flow: add new properties and add emergency shelter markers for crisis support.

Main capabilities:
- Property listing and filtering by location and criteria.
- Emergency Housing map with AI-assisted country/city discovery.
- Dashboard market analytics with AI-generated price trends.
- Messaging and profile features.

## How we built it
- Main structure was build in M
- Frontend: React + TypeScript + Vite.
- UI: Tailwind CSS + Radix UI + custom components.
- Charts: Recharts.
- Database/Auth: Supabase.
- AI integrations: Gemini API for country/location parsing and market trend generation.
- Deployment target: Vercel with `dist` output.

## Challenges we ran into
- Gemini responses were sometimes malformed or truncated JSON.
- Model compatibility differences caused payload/field errors.
- Environment mismatches between local and Vercel (missing `VITE_*` variables).
- Role UX confusion (`buyer`/`broker`) and permission boundaries for creating resources.
- Keeping map AI results complete and reliable for country-level searches.

## Accomplishments that we're proud of
- Stabilized AI parsing with retries and safe JSON extraction.
- Improved map AI matching for country and city queries.
- Added role-based shelter creation flow for Housing Partners.
- Upgraded dashboard with richer market stats and improved visual hierarchy.
- Simplified naming/UX: Home Finder, Resident, Housing Partner.

## What we learned
- AI features need strict output constraints plus robust parsing fallbacks.
- Clear role naming significantly improves product usability.
- Deployment reliability depends on explicit environment and build configuration.
- Data accuracy for geospatial search requires both AI extraction and deterministic fallback matching.

## What's next for Domus
- Replace map placeholder with full interactive Mapbox clustering and marker layers.
- Add server-side AI endpoints to protect API keys and improve response validation.
- Add country synonym dictionaries and multilingual query support.
- Expand emergency shelter moderation and verification workflows.
- Add automated tests for AI parsing, role-based access, and deployment checks.
