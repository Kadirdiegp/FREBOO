import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import Skeleton from '../components/Skeleton';

interface Photo {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

const ProduktfotografiePage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('category', 'product')
        .order('created_at', { ascending: false });
      
      setPhotos(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading photos:', error);
      setIsLoading(false);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Produktfotografie</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} />
            ))
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="relative aspect-[16/9] group">
                <div className={`absolute inset-0 bg-zinc-800 rounded-lg transition-opacity duration-300 ${loadedImages[photo.id] ? 'opacity-0' : 'opacity-100'}`}>
                  <Skeleton />
                </div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${photo.url}`}
                  alt={photo.title || 'Produkt Photo'}
                  fill
                  className={`object-cover rounded-lg transition-opacity duration-300 ${loadedImages[photo.id] ? 'opacity-100' : 'opacity-0'}`}
                  onLoadingComplete={() => handleImageLoad(photo.id)}
                />
                <div className="absolute inset-0 bg-black rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProduktfotografiePage;