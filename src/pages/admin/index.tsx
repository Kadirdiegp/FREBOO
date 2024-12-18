import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminAuth from '../../components/AdminAuth';
import { supabase, Event, Photo } from '../../lib/supabase';
import Image from 'next/image';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'events' | 'photos'>('events');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'motocross' | 'portrait' | 'product'>('all');
  const [showPortfolioOnly, setShowPortfolioOnly] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedTab === 'photos') {
      loadPhotos();
    }
  }, [selectedCategory, showPortfolioOnly]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      loadData();
    } else {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [eventsData, photosData] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('photos').select('*').order('created_at', { ascending: false }),
      ]);

      if (eventsData.error) throw eventsData.error;
      if (photosData.error) throw photosData.error;

      setEvents(eventsData.data);
      setPhotos(photosData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoading(true);
      let query = supabase.from('photos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (showPortfolioOnly) {
        query = query.limit(6);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('events').insert([newEvent]);
      if (error) throw error;
      
      setNewEvent({ name: '', date: '', location: '', description: '' });
      loadData();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) return;
    
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      for (const file of files) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${selectedCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('photos').insert([
          {
            url: filePath,
            category: selectedCategory,
            start_number: '',
          },
        ]);

        if (dbError) throw dbError;
      }
      loadPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoto = async (photo: Photo) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({
          start_number: photo.start_number,
          event_id: photo.event_id,
        })
        .eq('id', photo.id);

      if (error) throw error;
      setEditingPhoto(null);
      loadPhotos();
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Foto löschen möchten?')) return;
    
    try {
      // Lösche zuerst die Datei aus dem Storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([photo.url]);

      if (storageError) throw storageError;

      // Dann lösche den Datenbank-Eintrag
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;
      loadPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // Helper function to ensure correct Supabase URL format
  const getStorageUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http')) {
      return url;
    }
    
    // Convert relative path to full URL
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${url}`;
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 bg-zinc-900 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Abmelden
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-zinc-900 rounded-lg shadow-lg p-1">
          <button
            className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
              selectedTab === 'events' 
                ? 'bg-zinc-800 text-white' 
                : 'text-white hover:bg-zinc-800'
            }`}
            onClick={() => setSelectedTab('events')}
          >
            Events
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
              selectedTab === 'photos' 
                ? 'bg-zinc-800 text-white' 
                : 'text-white hover:bg-zinc-800'
            }`}
            onClick={() => setSelectedTab('photos')}
          >
            Fotos
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {selectedTab === 'events' ? (
              <div className="space-y-8">
                {/* Event Creation Form */}
                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6 text-white">Neues Event erstellen</h2>
                  <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Datum
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Ort
                      </label>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Beschreibung
                      </label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        Event erstellen
                      </button>
                    </div>
                  </form>
                </div>

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-white">{event.name}</h3>
                        <p className="text-zinc-300">{formatDate(event.date)}</p>
                        <p className="text-zinc-300">{event.location}</p>
                        {event.description && (
                          <p className="text-zinc-300 mt-2">{event.description}</p>
                        )}
                        <div className="mt-4 flex justify-end space-x-4">
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Category Filter and Upload */}
                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Kategorie
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value as any)}
                          className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        >
                          <option value="all">Alle Kategorien</option>
                          <option value="motocross">Motocross</option>
                          <option value="portrait">Portrait</option>
                          <option value="product">Produkt</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="portfolioOnly"
                          checked={showPortfolioOnly}
                          onChange={(e) => setShowPortfolioOnly(e.target.checked)}
                          className="w-4 h-4 bg-zinc-800 border-zinc-700 text-white rounded focus:ring-zinc-600"
                        />
                        <label htmlFor="portfolioOnly" className="text-sm font-medium text-zinc-300">
                          Nur Portfolio-Bilder anzeigen (6 neueste)
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Fotos hochladen
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="w-full p-2 text-sm text-zinc-300
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-zinc-800 file:text-white
                          hover:file:bg-zinc-700
                          cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative">
                        <div className="relative aspect-square">
                          <Image
                            src={getStorageUrl(photo.url)}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                            priority={false}
                          />
                        </div>
                        {showPortfolioOnly && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-zinc-800 text-white px-2 py-1 rounded-lg text-sm">
                              Portfolio #{index + 1}
                            </span>
                          </div>
                        )}
                        {!showPortfolioOnly && index < 6 && selectedCategory !== 'all' && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-zinc-800 text-white px-2 py-1 rounded-lg text-sm">
                              Im Portfolio
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {editingPhoto?.id === photo.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Startnummer"
                              value={editingPhoto.start_number || ''}
                              onChange={(e) => setEditingPhoto({...editingPhoto, start_number: e.target.value})}
                              className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                            />
                            <select
                              value={editingPhoto.event_id || ''}
                              onChange={(e) => setEditingPhoto({...editingPhoto, event_id: e.target.value})}
                              className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                            >
                              <option value="">Kein Event</option>
                              {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                  {event.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex justify-between pt-2">
                              <button
                                onClick={() => handleUpdatePhoto(editingPhoto)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Speichern
                              </button>
                              <button
                                onClick={() => setEditingPhoto(null)}
                                className="px-3 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="space-y-1 mb-3">
                              <p className="text-sm font-medium text-zinc-300">
                                Kategorie: {photo.category}
                              </p>
                              {photo.start_number && (
                                <p className="text-sm font-medium text-zinc-300">
                                  Startnummer: {photo.start_number}
                                </p>
                              )}
                              {photo.event_id && (
                                <p className="text-sm font-medium text-zinc-300">
                                  Event: {events.find(e => e.id === photo.event_id)?.name}
                                </p>
                              )}
                              <p className="text-sm font-medium text-zinc-300">
                                Hochgeladen: {new Date(photo.created_at).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => setEditingPhoto(photo)}
                                className="px-3 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                              >
                                Bearbeiten
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(photo)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Löschen
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard; 