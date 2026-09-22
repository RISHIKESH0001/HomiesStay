const OWNER_PROPERTIES_KEY = 'homies-stay-owner-properties';

export const getPropertySlug = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const readStoredProperties = () => {
	try {
		const storedProperties = window.localStorage.getItem(OWNER_PROPERTIES_KEY);
		return storedProperties ? JSON.parse(storedProperties) : [];
	} catch {
		return [];
	}
};

export const saveStoredProperty = (property) => {
	const nextProperties = [...readStoredProperties(), property];
	window.localStorage.setItem(OWNER_PROPERTIES_KEY, JSON.stringify(nextProperties));
	return nextProperties;
};

export const getStoredProperty = (slug) => readStoredProperties().find((property) => property.slug === slug);

export const toPublicHostel = (property) => ({
	...property,
	location: `${property.area}, ${property.city}`,
	price: `Rs. ${Number(property.rent).toLocaleString('en-IN')}`,
	image: property.photos?.[0] || property.image || undefined,
	distance: property.distanceKm || 10,
	tag: property.status === 'Live' ? 'New on Homies' : 'Coming soon',
});