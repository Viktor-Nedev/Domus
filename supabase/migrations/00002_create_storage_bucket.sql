-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-9y1d22zfrldt_property_images',
  'app-9y1d22zfrldt_property_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);

-- Storage policies for property images
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'app-9y1d22zfrldt_property_images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'app-9y1d22zfrldt_property_images');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'app-9y1d22zfrldt_property_images');

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'app-9y1d22zfrldt_property_images');