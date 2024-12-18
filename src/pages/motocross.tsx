import { useState, useEffect, memo } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { supabase, Event, Photo } from '../lib/supabase';
import Skeleton from '../components/Skeleton';

// Helper function to ensure correct Supabase URL format
const getStorageUrl = (url: string) => {
  if (!url) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/preview/motocross-preview.jpg`;
  }
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    return url;
  }
  
  // Convert relative path to full URL using the exact format
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${url}`;
};

// Memoized photo component to prevent unnecessary re-renders
const PhotoCard = memo(({ photo }: { photo: Photo }) => {
  const imageUrl = getStorageUrl(photo.url);
  
  return (
    <div className="relative aspect-square group">
      <Image
        src={imageUrl}
        alt={`Startnummer ${photo.start_number}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover rounded-lg transition-transform group-hover:scale-105"
        unoptimized
        priority={false}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
        <p className="text-center">Startnummer: {photo.start_number}</p>
      </div>
    </div>
  );
});

PhotoCard.displayName = 'PhotoCard';

const EventCard = memo(({ event, onClick }: { event: Event; onClick: () => void }) => (
  <div 
    className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden cursor-pointer group p-6 hover:bg-zinc-800 transition-colors"
    onClick={onClick}
  >
    <h3 className="text-xl font-bold mb-3 text-white">{event.name}</h3>
    <div className="space-y-2">
      <p className="text-zinc-300">{formatDate(event.date)}</p>
      <p className="text-zinc-300">{event.location}</p>
      {event.description && (
        <p className="text-zinc-300 mt-2">{event.description}</p>
      )}
    </div>
  </div>
));

EventCard.displayName = 'EventCard';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const MotocrossPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [startNumber, setStartNumber] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [selectedEvent, startNumber]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('photos')
        .select('*')
        .eq('category', 'motocross')
        .order('created_at', { ascending: false });

      if (selectedEvent) {
        query = query.eq('event_id', selectedEvent);
      }

      if (startNumber) {
        query = query.eq('start_number', startNumber);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Motocross Events</h1>

        {/* Filter Section */}
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Event auswählen
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
              >
                <option value="">Alle Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {formatDate(event.date)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Startnummer
              </label>
              <input
                type="text"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                placeholder="z.B. 114"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Event List */}
        {!selectedEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => setSelectedEvent(event.id)}
              />
            ))}
          </div>
        )}

        {/* Photos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group">
                <div className={`absolute inset-0 bg-zinc-800 rounded-lg transition-opacity duration-300 ${loadedImages[photo.id] ? 'opacity-0' : 'opacity-100'}`}>
                  <Skeleton />
                </div>
                <Image
                  src={getStorageUrl(photo.url)}
                  alt={`Startnummer ${photo.start_number}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className={`object-cover rounded-lg transition-opacity duration-300 ${loadedImages[photo.id] ? 'opacity-100' : 'opacity-0'}`}
                  onLoadingComplete={() => handleImageLoad(photo.id)}
                  unoptimized
                  priority={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
                  <p className="text-center">Startnummer: {photo.start_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-300">
              Keine Fotos gefunden. Bitte passen Sie Ihre Filterkriterien an.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MotocrossPage; 