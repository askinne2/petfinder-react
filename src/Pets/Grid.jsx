import React, { useState, useEffect, useRef } from "react";
import GridItem from "./GridItem";
import { petfinderClient, SHELTER_ID, ANIMALS_PER_PAGE } from '../api/config';

// Skeleton loading component for grid items
const GridItemSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[450px] animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-8"></div>
      <div className="h-8 bg-gray-200 rounded w-2/5 mt-auto"></div>
    </div>
  </div>
);

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
      
      {!loading && pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((animal, i) => (
            <GridItem 
              key={animal.id}
              animal={animal}
              index={i}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-10 text-gray-500">
          No pets found matching your criteria.
        </div>
      )}
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
        </div>
      )}
    </div>
  );
};

export default Grid;
