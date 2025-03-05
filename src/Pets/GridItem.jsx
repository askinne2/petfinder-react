import React from "react";
import PropTypes from "prop-types";

const GridItem = ({ animal, index }) => {
  // Get the image URL or use placeholder if none available
  const getImageUrl = () => {
    if (animal.photos && animal.photos.length > 0) {
      return animal.photos[0].medium;
    }
    return "https://via.placeholder.com/300x200?text=No+Image+Available";
  };

  // Format animal age and gender
  const getAgeGender = () => {
    return `${animal.age || ''} ${animal.gender || ''} ${animal.type || ''}`;
  };

  // Format breeds
  const getBreeds = () => {
    if (!animal.breeds) return '';
    
    if (animal.breeds.mixed) {
      return `${animal.breeds.primary} mix`;
    } else if (animal.breeds.primary && animal.breeds.secondary) {
      return `${animal.breeds.primary} & ${animal.breeds.secondary}`;
    }
    return animal.breeds.primary || '';
  };

  // Get shortened description
  const getShortDescription = () => {
    if (!animal.description) return "No description available";
    
    return animal.description.length > 100 
      ? animal.description.substring(0, 100) + "..."
      : animal.description;
  };

  return (
    <div className={`pet-card animated fadeInUp delay-${index % 10}s`}>
      <div className="pet-image">
        <img src={getImageUrl()} alt={animal.name} loading="lazy" />
        {animal.status === 'adoptable' && (
          <span className="status-badge">Adoptable</span>
        )}
      </div>
      <div className="pet-details">
        <h3 className="pet-name">{animal.name}</h3>
        <div className="pet-info">
          <span>{getAgeGender()}</span>
          {animal.distance && (
            <span className="distance"> • {Math.round(animal.distance)} miles</span>
          )}
        </div>
        <div className="pet-breeds">{getBreeds()}</div>
        <p className="pet-description">{getShortDescription()}</p>
        <div className="pet-footer">
          <a 
            href={animal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="adopt-link"
          >
            Meet {animal.name}
          </a>
        </div>
      </div>
    </div>
  );
};

GridItem.propTypes = {
  index: PropTypes.number,
  animal: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    breeds: PropTypes.object,
    photos: PropTypes.array,
    status: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.string,
    distance: PropTypes.number,
    description: PropTypes.string,
    url: PropTypes.string
  }).isRequired
};

export default GridItem;
