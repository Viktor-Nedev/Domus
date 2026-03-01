-- Create reviews table
CREATE TABLE IF NOT EXISTS property_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating_overall INTEGER NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_property INTEGER CHECK (rating_property >= 1 AND rating_property <= 5),
  rating_location INTEGER CHECK (rating_location >= 1 AND rating_location <= 5),
  rating_communication INTEGER CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  review_text TEXT,
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- Create review tags table
CREATE TABLE IF NOT EXISTS review_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES property_reviews(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES property_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Add average rating to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create function to update property ratings
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating_overall), 0)
      FROM property_reviews
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM property_reviews
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
    )
  WHERE id = COALESCE(NEW.property_id, OLD.property_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
DROP TRIGGER IF EXISTS update_property_rating_trigger ON property_reviews;
CREATE TRIGGER update_property_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON property_reviews
FOR EACH ROW
EXECUTE FUNCTION update_property_rating();

-- RLS Policies for property_reviews
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON property_reviews
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create their own reviews" ON property_reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON property_reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON property_reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for review_tags
ALTER TABLE review_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view review tags" ON review_tags
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Review owners can manage tags" ON review_tags
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM property_reviews
      WHERE property_reviews.id = review_tags.review_id
      AND property_reviews.user_id = auth.uid()
    )
  );

-- RLS Policies for review_helpful_votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view helpful votes" ON review_helpful_votes
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can vote helpful" ON review_helpful_votes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes" ON review_helpful_votes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_user_id ON property_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_rating ON property_reviews(rating_overall DESC);
CREATE INDEX IF NOT EXISTS idx_property_reviews_created_at ON property_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_tags_review_id ON review_tags(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

COMMENT ON TABLE property_reviews IS 'User reviews and ratings for properties';
COMMENT ON TABLE review_tags IS 'Tags associated with reviews (e.g., "Great Location", "Good Value")';
COMMENT ON TABLE review_helpful_votes IS 'Tracks which users found reviews helpful';