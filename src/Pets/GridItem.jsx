import React, { useState } from "react";
import PropTypes from "prop-types";
import ImageCarousel from "../components/ImageCarousel";
import PetModal from "../components/PetModal";
import { Link } from 'react-router-dom';

const GridItem = ({ animal, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (!animal.description) return "Check back later for my bio!";
    
    return animal.description.length > 100 
      ? animal.description.substring(0, 175) + "..."
      : animal.description;
  };

  return (
    <>
      <Link 
        to={`/animal/${animal.id}`}
        className="pet-card animate-fade-in-up hover:shadow-lg transition-all duration-300"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="h-90 relative overflow-hidden">
          <ImageCarousel images={animal.photos} alt={animal.name} />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{animal.name}</h2>
          <p className="text-gray-600">{getAgeGender()}</p>
          <p className="text-sm text-gray-500">{getBreeds()}</p>
          <p className="mt-2 text-gray-700">{getShortDescription()}</p>
        </div>
      </Link>

      {isModalOpen && (
        <PetModal 
          animal={animal} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
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
