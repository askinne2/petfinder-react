import React from 'react';
import PropTypes from 'prop-types';

const ImageCarousel = ({ images, alt }) => {
  const firstImage = images?.[0]?.medium || "https://via.placeholder.com/300x200?text=No+Image";
  const secondImage = images?.[1]?.medium || firstImage;

  return (
    <div className="relative overflow-hidden h-72 group">
      <img
        src={firstImage}
        alt={`${alt} - Photo 1`}
        className="absolute w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
        loading="lazy"
      />
      <img
        src={secondImage}
        alt={`${alt} - Photo 2`}
        className="absolute w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        loading="lazy"
      />
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    medium: PropTypes.string
  })),
  alt: PropTypes.string.isRequired
};

export default ImageCarousel;