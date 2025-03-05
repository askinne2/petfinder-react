import { Client } from "@petfinder/petfinder-js";
import { QueryClient } from '@tanstack/react-query';
import { isWordPress } from '../config/environment';

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

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (isWordPress()) {
    headers['X-WP-Nonce'] = window.petfinderReactVars.nonce;
  }

  return headers;
};

export const petfinderClient = new Client({
  apiKey: isWordPress() ? window.petfinderReactVars.apiKey : import.meta.env.VITE_API_KEY,
  secret: isWordPress() ? window.petfinderReactVars.apiSecret : import.meta.env.VITE_API_SECRET,
  headers: getHeaders(),
  cors: true
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