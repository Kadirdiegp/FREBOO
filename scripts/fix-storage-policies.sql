-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Download Access" ON storage.objects;

-- Create new policies with correct permissions
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Public Download Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Allow Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

-- Enable public access for the bucket
UPDATE storage.buckets
SET public = true
WHERE id = 'media';

-- Ensure anonymous access is enabled
ALTER ROLE anon SET statement_timeout = '60s';
GRANT USAGE ON SCHEMA storage TO anon;
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;

-- Fix RLS policies for photos table
DROP POLICY IF EXISTS "Public read access" ON photos;
DROP POLICY IF EXISTS "Authenticated users can insert/update/delete" ON photos;

CREATE POLICY "Allow all operations"
ON photos FOR ALL
USING (true)
WITH CHECK (true);

-- Temporarily disable RLS for photos table to allow uploads
ALTER TABLE photos DISABLE ROW LEVEL SECURITY; 