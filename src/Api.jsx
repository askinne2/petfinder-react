import { Client } from "@petfinder/petfinder-js";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// Constants
export const SHELTER_ID = 'AL459';
export const ITEMS_PER_PAGE = 100;

// Initialize PetFinder client
const client = new Client({
  apiKey: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET,
  organization: import.meta.env.VITE_API_ORGANIZATION,
  limit: import.meta.env.ITEMS_PER_PAGE
});

// React Query hooks
export const useAnimals = (filterType) => {
  return useInfiniteQuery({
    queryKey: ['animals', filterType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.animal.search({
        organization: SHELTER_ID,
        page: pageParam,
        limit: ITEMS_PER_PAGE,
        status: 'adoptable',
        ...(filterType && { type: filterType })
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAnimalTypes = () => {
  return useQuery({
    queryKey: ['animalTypes'],
    queryFn: async () => {
      const response = await client.animal.search({
        organization: SHELTER_ID,
        limit: ITEMS_PER_PAGE
      });

      const typeCounts = response.data.animals.reduce((acc, animal) => {
        acc[animal.type] = (acc[animal.type] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(typeCounts)
        .filter(([_, count]) => count > 0)
        .map(([type]) => type)
        .sort();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useAnimal = (id) => {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      const response = await client.animal.show(id);
      console.log('Full animal data:', response.data.animal); // Debug log
      return response.data.animal;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default client;