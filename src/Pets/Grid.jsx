import React, { useState } from "react";
import GridItem from "./GridItem";
import FilterBar from "./FilterBar";
import { useAnimals, useAnimalTypes } from "../Api";

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
  const [filterType, setFilterType] = useState('');
  const { data: types = [], isLoading: isTypesLoading } = useAnimalTypes();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error
  } = useAnimals(filterType);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Show skeleton while initial data or types are loading
  if (isLoading || isTypesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 rounded-lg">
        <div className="animate-pulse mb-6">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GridItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 rounded-lg">
      {status === 'error' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4" role="alert">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}
      
      <FilterBar 
        filterType={filterType} 
        onFilterChange={handleFilterChange} 
        availableTypes={types}
      />
      
      {data?.pages?.[0]?.animals?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.pages.map((page) =>
            page.animals.map((animal, i) => (
              <GridItem 
                key={animal.id}
                animal={animal}
                index={i}
              />
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No pets found matching your criteria.
        </div>
      )}
      
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <GridItemSkeleton key={`next-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
