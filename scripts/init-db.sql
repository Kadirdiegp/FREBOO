-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name) 
VALUES ('media', 'media')
ON CONFLICT DO NOTHING;

-- Create policies for media bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  cover_image TEXT
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  url TEXT NOT NULL,
  start_number TEXT,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('motocross', 'portrait', 'product'))
);

-- Create RLS policies for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert/update/delete" ON events
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert/update/delete" ON photos
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated'); 