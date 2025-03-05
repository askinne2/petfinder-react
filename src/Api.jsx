import { Client } from "@petfinder/petfinder-js";
import { useState, useCallback } from 'react';


const client = new Client({
  apiKey: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET,
  organization: import.meta.env.VITE_API_ORGANIZATION,
  limit: import.meta.env.ITEMS_PER_PAGE
});

// Custom hook for pet data fetching
export const usePetFinder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAnimals = useCallback(async ({ page = 1, type = null }) => {
    try {
      setLoading(true);
      const response = await client.animal.search({
        organization: SHELTER_ID,
        page,
        limit: ITEMS_PER_PAGE,
        status: 'adoptable',
        ...(type && { type })
      });
      
      return response.data;
    } catch (error) {
      setError(error);
      console.error('Error fetching animals:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnimalTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.animal.search({
        organization: SHELTER_ID,
        limit: ITEMS_PER_PAGE
      });

      // Count animals by type
      const typeCounts = response.data.animals.reduce((acc, animal) => {
        acc[animal.type] = (acc[animal.type] || 0) + 1;
        return acc;
      }, {});

      // Return only types with count > 0
      return Object.entries(typeCounts)
        .filter(([_, count]) => count > 0)
        .map(([type]) => type)
        .sort();
    } catch (error) {
      setError(error);
      console.error('Error fetching animal types:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnimal = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await client.animal.show(id);
      return response.data.animal;
    } catch (error) {
      setError(error);
      console.error('Error fetching animal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAnimals,
    getAnimalTypes,
    getAnimal,
    loading,
    error
  };
};

export default client;