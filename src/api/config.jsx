import { Client } from "@petfinder/petfinder-js";

export const petfinderClient = new Client({
  apiKey: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET
});

export const SHELTER_ID = 'AL459';
export const ANIMALS_PER_PAGE = 100;