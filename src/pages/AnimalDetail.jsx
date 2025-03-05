import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import { usePetFinder } from '../Api';

const AnimalDetail = () => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const { getAnimal, loading, error } = usePetFinder();

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const data = await getAnimal(id);
                setAnimal(data);
            } catch (err) {
                console.error('Error fetching animal:', err);
            }
        };

        fetchAnimal();
    }, [id, getAnimal]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-80 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-red-500">Error loading animal: {error.message}</div>
            </div>
        );
    }

    if (!animal) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link
                to="/"
                className="inline-flex items-center text-pet-primary hover:text-pet-primary-dark mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all pets
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <ImageGallery photos={animal.photos} />
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-gray-900">{animal.name}</h1>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-sm text-gray-500">Age</span>
                            <p className="font-medium">{animal.age}</p>
                        </div>
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



                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-semibold">About {animal.name}</h2>
                            <p>{animal.description}</p>
                        </div>

                        <div className="border-t pt-6">
                            <a
                                href={animal.url}
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
        </div>
    );
};

export default AnimalDetail;