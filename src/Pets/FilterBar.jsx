import React from 'react';
import PropTypes from 'prop-types';

const FilterBar = ({ filterType, onFilterChange, availableTypes }) => {
  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' & ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-xl font-medium text-pet-primary mb-3">Filter Pets</h2>
      <div className="block gap-2">
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-base 
                     min-w-[200px] text-gray-700 hover:border-pet-primary focus:border-pet-primary 
                     focus:ring-1 focus:ring-pet-primary focus:outline-none transition-colors"
          value={filterType} 
          onChange={onFilterChange}
          disabled={availableTypes.length === 0}
        >
          <option value="">All Animals ({availableTypes.length} types)</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>
              {formatType(type)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filterType: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  availableTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FilterBar;
