import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import { useAnimal } from '../Api';
import { escapeHtml, sanitizeUrl } from '../utils/escape';
import DOMPurify from 'dompurify';

const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="h-[400px] bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AnimalDetail = () => {
  const { id } = useParams();
  const { data: animal, isLoading, isError, error } = useAnimal(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
          <p className="text-red-700">Error loading animal: {escapeHtml(error.message)}</p>
        </div>
      </div>
    );
  }

  if (!animal) return null;

  // Sanitize description HTML
  const sanitizedDescription = DOMPurify.sanitize(animal.description || "No description available");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to all pets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageGallery photos={animal.photos?.map(photo => ({
            ...photo,
            small: sanitizeUrl(photo.small),
            medium: sanitizeUrl(photo.medium),
            large: sanitizeUrl(photo.large),
            full: sanitizeUrl(photo.full)
          }))} />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{escapeHtml(animal.name)}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Age</span>
              <p className="font-medium">{escapeHtml(animal.age)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Gender</span>
              <p className="font-medium">{escapeHtml(animal.gender)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Size</span>
              <p className="font-medium">{escapeHtml(animal.size)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Breed</span>
              <p className="font-medium">
                {escapeHtml(animal.breeds?.primary)}
                {animal.breeds?.secondary && ` & ${escapeHtml(animal.breeds.secondary)}`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Characteristics</h2>
            <div className="flex flex-wrap gap-2">
              {animal.colors?.primary && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {escapeHtml(animal.colors.primary)}
                </span>
              )}
              {animal.attributes?.spayed_neutered && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Spayed/Neutered
                </span>
              )}
              {animal.attributes?.house_trained && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  House Trained
                </span>
              )}
            </div>
          </div>

          <div className="prose max-w-none whitespace-pre-wrap">
            <h2 className="text-2xl font-semibold">About {escapeHtml(animal.name)}</h2>
            <div 
              className="text-gray-700 break-words"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>

          <div className="border-t pt-6">
            <a
              href={sanitizeUrl(animal.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-pet-primary text-white text-center py-4 px-6 rounded-lg hover:bg-pet-primary-dark transition-colors"
            >
              Start Adoption Process
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;