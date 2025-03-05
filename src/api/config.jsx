import { Client } from "@petfinder/petfinder-js";
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const petfinderClient = new Client({
  apiKey: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET,
  organization: import.meta.env.VITE_API_ORGANIZATION,
  limit: import.meta.env.ANIMALS_PER_PAGE
});

// Prefetch and cache images
export const prefetchImages = async (animals) => {
  if ('caches' in window) {
    const cache = await caches.open('petfinder-images-v1');
    const imageUrls = animals.flatMap(animal => 
      animal.photos?.map(photo => photo.medium || photo.small) || []
    );
    
    await Promise.all(
      imageUrls.map(url => 
        cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
      )
    );
  }
};