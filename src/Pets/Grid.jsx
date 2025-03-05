import React, { useState, useEffect, useRef } from "react";
import GridItem from "./GridItem";
import Loader from "../Loader/Loader.jsx";
import { petfinderClient, SHELTER_ID, ANIMALS_PER_PAGE } from '../api/config';

const Grid = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [pets, updatePets] = useState([]);
  const [filterType, setFilterType] = useState('');
  // refs
  const pageRef = useRef(totalPage);
  const loadingRef = useRef(loading);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    getPets();
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, filterType]); // Added filterType dependency

  const updateTotalPage = data => {
    pageRef.current = data;
    setTotalPage(data);
  };

  const updateLoading = data => {
    loadingRef.current = data;
    setLoading(data);
  };

  const updateCurrentPage = data => {
    currentPageRef.current = data;
    setCurrentPage(data);
  };

  const getPets = async () => {
    try {
      updateLoading(true);
      
      // Building the search parameters
      const searchParams = {
        organization: SHELTER_ID,
        page: currentPageRef.current,
        limit: ANIMALS_PER_PAGE,
        status: 'adoptable',
      };
      
      // Add type filter if selected
      if (filterType) {
        searchParams.type = filterType;
      }
      
      const response = await petfinderClient.animal.search(searchParams);
      const petsData = response.data;
      
      // Use Map to ensure unique animals by ID
      const uniquePets = [...new Map([
        ...(currentPageRef.current === 1 ? [] : pets), // Clear pets if it's first page
        ...petsData.animals
      ].map(animal => [animal.id, animal]))
      .values()];
      
      updatePets(uniquePets);
      updateTotalPage(petsData.pagination.total_pages);
      updateLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError(error);
      updateLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
      !loadingRef.current &&
      !(currentPageRef.current >= pageRef.current)
    ) {
      let nextPage = currentPageRef.current + 1;
      updateCurrentPage(nextPage);
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    // Reset to first page when filter changes
    updateCurrentPage(1);
  };

  // Add filter UI component
  const FiltersBar = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-xl font-medium text-pet-primary mb-3">Filter Pets</h2>
      <div className="flex flex-wrap gap-2">
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-base min-w-[200px] text-gray-700"
          value={filterType} 
          onChange={handleFilterChange}
        >
          <option value="">All Animals</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="rabbit">Rabbits</option>
          <option value="small-furry">Small & Furry</option>
          <option value="bird">Birds</option>
          <option value="horse">Horses</option>
          <option value="barnyard">Barnyard</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 rounded-lg">
      {error && (
        <div className="alert alert-danger" role="alert">
          <p>{error.message}</p>
        </div>
      )}
      
      <FiltersBar />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.length > 0 ? (
          pets.map((animal, i) => (
            <GridItem 
              key={animal.id}
              animal={animal}
              index={i}
            />
          ))
        ) : !loading && (
          <div className="col-span-3 text-center py-10 text-gray-500">
            No pets found matching your criteria.
          </div>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pet-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Grid;
