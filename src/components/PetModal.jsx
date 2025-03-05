import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImageGallery from './ImageGallery';

const PetModal = ({ animal, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-[90vw] max-h-[95vh] overflow-hidden relative">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            {/* Content */}
            <div className="flex flex-col md:flex-row h-full">
                {/* Image Gallery */}
                <div className="md:w-1/2 p-4 overflow-y-auto">
                    <ImageGallery photos={animal.photos || []} />
                </div>
                
                {/* Pet Details */}
                <div className="md:w-1/2 p-6 overflow-y-auto">
                    <h2 className="text-3xl font-bold mb-4">{animal.name}</h2>
                    <div className="space-y-4">
                        <p className="text-lg">{`${animal.age} • ${animal.gender} • ${animal.breeds.primary}`}</p>
                        <p className="text-gray-600">{animal.description}</p>
                        
                        {/* Additional Details */}
                        <div className="space-y-2">
                            <p><strong>Size:</strong> {animal.size}</p>
                            {animal.colors?.primary && (
                                <p><strong>Color:</strong> {animal.colors.primary}</p>
                            )}
                            {animal.attributes?.spayed_neutered && (
                                <p>✓ Spayed/Neutered</p>
                            )}
                            {animal.attributes?.house_trained && (
                                <p>✓ House Trained</p>
                            )}
                        </div>
                        
                        {/* Adoption Button */}
                        <a
                            href={animal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-pet-primary text-white text-center py-3 px-6 rounded-lg hover:bg-pet-primary-dark transition-colors mt-6"
                        >
                            Start Adoption Process
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

PetModal.propTypes = {
  animal: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PetModal;