import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ImageGallery = ({ photos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  
  // Default placeholder if no photos
  const placeholderImage = "https://via.placeholder.com/600x400?text=No+Image+Available";
  
  // Handling empty photo arrays
  const hasPhotos = photos && photos.length > 0;
  
  // Get current image URL
  const getCurrentImageUrl = () => {
    if (!hasPhotos) return placeholderImage;
    return photos[currentIndex].full || photos[currentIndex].large || photos[currentIndex].medium;
  };
  
  // Navigation functions
  const goToPrevious = () => {
    if (isAnimating || !hasPhotos) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    if (isAnimating || !hasPhotos) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };
  
  const goToImage = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
  };
  
  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]);
  
  // Scroll selected thumbnail into view
  useEffect(() => {
    if (carouselRef.current && hasPhotos) {
      const thumbnails = carouselRef.current.querySelectorAll('.thumbnail');
      if (thumbnails[currentIndex]) {
        thumbnails[currentIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    
    // Reset animation state after transition
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="image-gallery flex flex-col justify-center space-y-3">
      {/* Main featured image */}
      <div className="relative rounded-lg overflow-hidden h-80 flex items-center justify-center">
        <img 
          key={currentIndex} // Add key to force remount and trigger transition
          src={getCurrentImageUrl()} 
          alt={hasPhotos && photos[currentIndex].name ? photos[currentIndex].name : 'Pet photo'} 
          className="w-full h-full object-contain transform transition-transform duration-300 ease-in-out"
        />
        
        {/* Navigation buttons */}
        {hasPhotos && photos.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
              disabled={isAnimating}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
              disabled={isAnimating}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnail carousel */}
      {hasPhotos && photos.length > 1 && (
        <div 
          className="thumbnail-carousel flex space-x-2 overflow-x-auto pb-2 scrollbar-thumb-gray-400 scrollbar-track-gray-100 justify-center scrollbar-thin" 
          ref={carouselRef}
        >
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`thumbnail flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all ${
                index === currentIndex ? 'ring-2 ring-pet-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={photo.medium || photo.small} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image counter */}
      {hasPhotos && photos.length > 1 && (
        <div className="text-center text-sm text-gray-600">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
};

ImageGallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      small: PropTypes.string,
      medium: PropTypes.string,
      large: PropTypes.string,
      full: PropTypes.string
    })
  )
};

export default ImageGallery;
