import { roomBengaluru1, roomModern2, roomModern3 } from '../assets/hostelImages';

const OWNER_PROPERTIES_KEY = 'homies-stay-owner-properties';

export const getPropertySlug = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const seededOwnerProperties = [
	{
		ownerId: 'owner-1', slug: 'the-olive-house', name: 'The Olive House', type: 'Premium co-living', gender: 'Unisex', area: 'Koramangala', city: 'Bengaluru', college: 'Christ University', distance: '12 min', commute: '12 min to Christ University', description: 'A polished co-living stay in Koramangala with a warm shared atmosphere and everything close at hand.', occupancy: 92, rooms: '46 / 50', capacity: 50, status: 'Live', tone: 'olive', image: roomBengaluru1, rent: 14500, rating: '4.9', reviews: '142', amenities: ['Wi-Fi', 'Daily meals', 'Gym access', 'Housekeeping', 'Study lounge', '24/7 security'],
	},
	{
		ownerId: 'owner-1', slug: 'casa-nook', name: 'Casa Nook', type: 'Private rooms', gender: 'Unisex', area: 'HSR Layout', city: 'Bengaluru', college: 'Christ University', distance: '18 min', commute: '18 min to Christ University', description: 'A comfortable private-room option in HSR Layout with the space and calm to settle into your next chapter.', occupancy: 84, rooms: '21 / 25', capacity: 25, status: 'Live', tone: 'sunset', image: roomModern2, rent: 12800, rating: '4.8', reviews: '103', amenities: ['Wi-Fi', 'Fully furnished', 'Laundry', 'Security', 'Study desks', 'Common area'],
	},
	{
		ownerId: 'owner-1', slug: 'mango-tree-living', name: 'Mango Tree Living', type: 'Shared apartments', gender: 'Unisex', area: 'Indiranagar', city: 'Bengaluru', college: 'Christ University', distance: '16 min', commute: '16 min to Christ University', description: 'A leafy shared stay in Indiranagar with generous common spaces and a relaxed community feel.', occupancy: 68, rooms: '17 / 25', capacity: 25, status: 'Review', tone: 'blue', image: roomModern3, rent: 11500, rating: '4.7', reviews: '67', amenities: ['Wi-Fi', 'Common kitchen', 'Laundry', 'Power backup', 'Security', 'Study lounge'],
	},
];

export const readStoredProperties = () => {
	try {
		const storedProperties = window.localStorage.getItem(OWNER_PROPERTIES_KEY);
		return storedProperties ? JSON.parse(storedProperties) : [];
	} catch {
		return [];
	}
};

export const getOwnerProperties = () => {
	const storedProperties = readStoredProperties();
	const storedBySlug = new Map(storedProperties.map((property) => [property.slug || getPropertySlug(property.name), property]));
	const seededSlugs = new Set(seededOwnerProperties.map((property) => property.slug));
	const seededAndEdited = seededOwnerProperties.map((property) => ({ ...property, ...storedBySlug.get(property.slug) }));
	const additionalProperties = storedProperties.filter((property) => !seededSlugs.has(property.slug || getPropertySlug(property.name)));
	return [...seededAndEdited, ...additionalProperties];
};

export const saveStoredProperty = (property) => {
	const nextProperties = [...readStoredProperties(), property];
	window.localStorage.setItem(OWNER_PROPERTIES_KEY, JSON.stringify(nextProperties));
	return nextProperties;
};

export const updateStoredProperty = (slug, updates) => {
	const ownerProperties = getOwnerProperties();
	const nextProperties = ownerProperties.map((property) => (property.slug === slug ? { ...property, ...updates } : property));
	window.localStorage.setItem(OWNER_PROPERTIES_KEY, JSON.stringify(nextProperties));
	return nextProperties;
};

export const getStoredProperty = (slug) => readStoredProperties().find((property) => (property.slug || getPropertySlug(property.name)) === slug)
	|| seededOwnerProperties.find((property) => property.slug === slug);

export const toPublicHostel = (property) => ({
	...property,
	location: `${property.area}, ${property.city}`,
	price: `Rs. ${Number(property.rent).toLocaleString('en-IN')}`,
	image: property.photos?.[0] || property.image || undefined,
	distance: property.distanceKm || 10,
	tag: property.status === 'Live' ? 'New on Homies' : 'Coming soon',
});