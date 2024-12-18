import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typen für die Datenbank-Tabellen
export interface Event {
  id: string;
  created_at: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  cover_image?: string;
}

export interface Photo {
  id: string;
  created_at: string;
  url: string;
  start_number: string;
  event_id: string;
  thumbnail_url?: string;
  category: 'motocross' | 'portrait' | 'product';
}

// Hilfsfunktionen für die Datenbank-Operationen
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getPhotosByEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId);

  if (error) throw error;
  return data;
};

export const getPhotosByStartNumber = async (eventId: string, startNumber: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .eq('start_number', startNumber);

  if (error) throw error;
  return data;
};

export const getPhotosByCategory = async (category: Photo['category']) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('category', category)
    .limit(6);

  if (error) throw error;
  return data;
}; 