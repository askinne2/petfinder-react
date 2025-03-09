import { Client } from "@petfinder/petfinder-js";
import { QueryClient } from '@tanstack/react-query';
import { isWordPress } from '../config/environment';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const petfinderClient = new Client({
  apiKey: isWordPress() ? window.petfinderReactVars.apiKey : import.meta.env.VITE_API_KEY,
  secret: isWordPress() ? window.petfinderReactVars.apiSecret : import.meta.env.VITE_API_SECRET,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for WordPress AJAX requests with nonce verification
export const wpAjaxRequest = async (actionType, data = {}) => {
  if (!isWordPress()) {
    throw new Error('WordPress AJAX is only available in WordPress environment');
  }

  const formData = new FormData();
  formData.append('action', 'petfinder_react_fetch_data');
  formData.append('nonce', window.petfinderReactVars.ajaxNonce);
  formData.append('action_type', actionType);
  
  // Add all data parameters to form data
  Object.keys(data).forEach(key => {
    formData.append(key, String(data[key]));
  });
  
  try {
    const response = await fetch(window.petfinderReactVars.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
    
    if (!response.ok) {
      console.error('AJAX request failed with status:', response.status);
      throw new Error(`AJAX request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    // Add more detailed logging for debugging
    console.log('AJAX response received:', result);
    
    if (!result || result.success === false) {
      console.error('AJAX response indicated failure:', result);
      throw new Error(result.data?.message || 'Invalid response from WordPress');
    }
    
    // WordPress wraps the actual data in a 'data' property when using wp_send_json_success
    return result.data;
  } catch (error) {
    console.error('AJAX request failed:', error);
    throw error;
  }
};

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