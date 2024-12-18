-- Drop all existing policies
DROP POLICY IF EXISTS "Admin full access" ON photos;
DROP POLICY IF EXISTS "Admin full access" ON events;
DROP POLICY IF EXISTS "Public read access" ON photos;
DROP POLICY IF EXISTS "Public read access" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert/update/delete" ON photos;
DROP POLICY IF EXISTS "Authenticated users can insert/update/delete" ON events;

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins)
CREATE POLICY "Admin full access"
ON photos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policies for public read access
CREATE POLICY "Public read access"
ON photos FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public read access"
ON events FOR SELECT
TO anon
USING (true);

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Download Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete" ON storage.objects;

-- Create storage policies for admin
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Create storage policies for public access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'media'); 