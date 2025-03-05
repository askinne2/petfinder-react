import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import ImageCarousel from "../components/ImageCarousel";

const GridItem = ({ animal, index }) => {
  const getAgeGender = () => {
    return `${animal.age || ''} ${animal.gender || ''} ${animal.type || ''}`;
  };

  const getBreeds = () => {
    if (!animal.breeds) return '';
    
    if (animal.breeds.mixed) {
      return `${animal.breeds.primary} mix`;
    } else if (animal.breeds.primary && animal.breeds.secondary) {
      return `${animal.breeds.primary} & ${animal.breeds.secondary}`;
    }
    return animal.breeds.primary || '';
  };

  const getShortDescription = () => {
    if (!animal.description) return "Check back later for my bio!";
    
    return animal.description.length > 100 
      ? animal.description.substring(0, 300) + "..."
      : animal.description;
  };

  return (
    <Link 
      to={`/animal/${animal.id}`}
      className="pet-card animate-fade-in-up hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="size-300 relative overflow-hidden">
        <ImageCarousel images={animal.photos} alt={animal.name} />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold mb-2">{animal.name}</h2>
        <p className="text-gray-600">{getAgeGender()}</p>
        <p className="text-sm text-gray-500">{getBreeds()}</p>
        <p className="mt-2 text-gray-700 flex-1">{getShortDescription()}</p>
      </div>
    </Link>
  );
};

GridItem.propTypes = {
  index: PropTypes.number,
  animal: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    breeds: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string,
      mixed: PropTypes.bool
    }),
    photos: PropTypes.arrayOf(PropTypes.shape({
      small: PropTypes.string,
      medium: PropTypes.string,
      large: PropTypes.string,
      full: PropTypes.string
    })),
    status: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string
  }).isRequired
};

export default GridItem;
