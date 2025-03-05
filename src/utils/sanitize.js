export const sanitizeAnimal = (animal) => {
    if (!animal) return null;

    return {
        id: parseInt(animal.id, 10) || 0,
        name: sanitizeString(animal.name),
        description: sanitizeString(animal.description),
        photos: Array.isArray(animal.photos) ? animal.photos.map(sanitizePhoto) : [],
        breeds: sanitizeBreeds(animal.breeds),
        attributes: sanitizeAttributes(animal.attributes),
        url: sanitizeUrl(animal.url)
    };
};

const sanitizeString = (str) => {
    if (!str) return '';
    // Remove any HTML tags and encode special characters
    return str
        .replace(/<[^>]*>/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const sanitizeUrl = (url) => {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        return parsed.href;
    } catch (e) {
        return '';
    }
};

const sanitizePhoto = (photo) => {
    if (!photo) return null;
    return {
        small: sanitizeUrl(photo.small),
        medium: sanitizeUrl(photo.medium),
        large: sanitizeUrl(photo.large),
        full: sanitizeUrl(photo.full)
    };
};

const sanitizeBreeds = (breeds) => {
    if (!breeds) return {};
    return {
        primary: sanitizeString(breeds.primary),
        secondary: sanitizeString(breeds.secondary),
        mixed: Boolean(breeds.mixed),
        unknown: Boolean(breeds.unknown)
    };
};

const sanitizeAttributes = (attributes) => {
    if (!attributes) return {};
    return {
        spayed_neutered: Boolean(attributes.spayed_neutered),
        house_trained: Boolean(attributes.house_trained),
        declawed: Boolean(attributes.declawed),
        special_needs: Boolean(attributes.special_needs),
        shots_current: Boolean(attributes.shots_current)
    };
};