import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { supabase, Photo } from '../lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';

const getStorageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${url}`;
};

const Skeleton = () => (
  <div className="space-y-2 sm:space-y-4">
    <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
    <div className="aspect-[16/9] bg-zinc-800 rounded-lg relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
        style={{
          animation: 'shimmer 1.5s infinite',
          transform: 'translateX(-100%)'
        }}
      />
    </div>
  </div>
);

const Portfolio = () => {
  const [photos, setPhotos] = useState<{
    motocross: Photo[];
    portrait: Photo[];
    product: Photo[];
  }>({
    motocross: [],
    portrait: [],
    product: []
  });

  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const categories = ['motocross', 'portrait', 'product'] as const;
      const results = await Promise.all(
        categories.map(category =>
          supabase
            .from('photos')
            .select('*')
            .eq('category', category)
            .limit(6)
            .order('created_at', { ascending: false })
        )
      );

      const photosByCategory = {
        motocross: results[0].data || [],
        portrait: results[1].data || [],
        product: results[2].data || []
      };

      setPhotos(photosByCategory);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const renderCategory = (
    title: string,
    photos: Photo[],
    href: string,
    delay: number
  ) => {
    const isLoading = photos.length === 0;

    return (
      <div className="space-y-4">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Link href={href}>
              <h2 className="text-2xl md:text-3xl font-bold hover:text-zinc-300 inline-block">
                {title}
              </h2>
            </Link>
            
            <div className="hidden md:block">
              {photos.map((photo) => (
                <Link href={href} key={photo.id}>
                  <div className="relative aspect-[16/9] group mb-4">
                    <div className={`absolute inset-0 bg-zinc-800 rounded-lg transition-opacity duration-300 ${loadedImages[photo.id] ? 'opacity-0' : 'opacity-100'}`}>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
                        style={{
                          animation: 'shimmer 1.5s infinite',
                          transform: 'translateX(-100%)'
                        }}
                      />
                    </div>
                    <Image
                      src={getStorageUrl(photo.url)}
                      alt={title}
                      fill
                      className={`object-cover rounded-lg transition-all duration-300 ${loadedImages[photo.id] ? 'opacity-100' : 'opacity-0'}`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onLoadingComplete={() => handleImageLoad(photo.id)}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="block md:hidden">
              {photos[0] && (
                <Link href={href}>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                    <div className={`absolute inset-0 bg-zinc-800 rounded-lg transition-opacity duration-300 ${loadedImages[photos[0].id] ? 'opacity-0' : 'opacity-100'}`}>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
                        style={{
                          animation: 'shimmer 1.5s infinite',
                          transform: 'translateX(-100%)'
                        }}
                      />
                    </div>
                    <Image
                      src={getStorageUrl(photos[0].url)}
                      alt={`${title} Preview`}
                      fill
                      className={`object-cover transition-opacity duration-300 ${loadedImages[photos[0].id] ? 'opacity-100' : 'opacity-0'}`}
                      onLoadingComplete={() => handleImageLoad(photos[0].id)}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Zur Galerie</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Portfolio
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderCategory('Motocross', photos.motocross, '/motocross', 0.1)}
          {renderCategory('Portrait', photos.portrait, '/portrait', 0.2)}
          {renderCategory('Produktfotografie', photos.product, '/produktfotografie', 0.3)}
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;