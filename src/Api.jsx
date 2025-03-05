import { Client } from "@petfinder/petfinder-js";

const client = new Client({
  apiKey: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET
});

// Function to get animals from specific shelter
export const getAnimals = async (page = 1) => {
  try {
    const response = await client.animal.search({
      organization: 'AL459', // Lake Martin Animal Rescue shelter ID
      page: page,
      limit: 100, // Adjust limit as needed
      status: 'adoptable'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }
};

console.log('PetFinder API Client initialized');

export default client;
