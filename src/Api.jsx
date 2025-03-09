import { Client } from "@petfinder/petfinder-js";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { isWordPress } from './config/environment';

// Constants from environment
const getConfig = () => {
  if (isWordPress()) {
    return {
      apiKey: window.petfinderReactVars.apiKey,
      apiSecret: window.petfinderReactVars.apiSecret,
      shelterId: window.petfinderReactVars.shelterId,
      itemsPerPage: window.petfinderReactVars.postsPerPage || 20
    };
  }
  return {
    apiKey: import.meta.env.VITE_API_KEY,
    apiSecret: import.meta.env.VITE_API_SECRET,
    shelterId: import.meta.env.VITE_API_ORGANIZATION,
    itemsPerPage: import.meta.env.ITEMS_PER_PAGE || 100
  };
};

const config = getConfig();

// Initialize PetFinder client
const client = new Client({
  apiKey: config.apiKey,
  secret: config.apiSecret,
  organization: config.shelterId,
  limit: config.itemsPerPage
});

// Helper function to get animals
const getAnimals = async (params = {}) => {
  try {
    const response = await client.animal.search({
      organization: config.shelterId,
      page: params.page || 1,
      limit: config.itemsPerPage,
      status: 'adoptable',
      ...(params.type && { type: params.type })
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }
};

// Helper function to get a single animal
const getAnimal = async (id) => {
  try {
    const response = await client.animal.show(id);
    return response.data.animal;
  } catch (error) {
    console.error('Error fetching animal:', error);
    throw error;
  }
};

// React Query hooks
export const useAnimals = (filterType) => {
  return useInfiniteQuery({
    queryKey: ['animals', filterType],
    queryFn: async ({ pageParam = 1 }) => {
      return await getAnimals({
        type: filterType,
        page: pageParam
      });
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
      const response = await getAnimals({});

      const typeCounts = response.animals.reduce((acc, animal) => {
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
      return await getAnimal(id);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default client;