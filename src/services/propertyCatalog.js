import { api } from './api';

const genderLabels = {
	MEN: 'Male',
	WOMEN: 'Female',
	UNISEX: 'Unisex',
};

export const toPublicHostel = (property) => ({
	...property,
	location: [property.area, property.city, property.state].filter(Boolean).join(', '),
	college: property.nearbyInstitution || '',
	gender: genderLabels[property.genderPolicy] || '',
	price: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(property.monthlyRent)),
	monthlyRent: Number(property.monthlyRent),
	distance: property.distanceKm == null ? null : Number(property.distanceKm),
	image: property.images?.[0] || null,
	rating: null,
	tag: 'Approved listing',
});

export const getPublicProperties = async (params = {}) => {
	const response = await api.get('/properties', { params: { page: 0, size: 50, ...params } });
	return { ...response.data, content: response.data.content.map(toPublicHostel) };
};

export const getPublicProperty = async (slug) => toPublicHostel((await api.get(`/properties/${encodeURIComponent(slug)}`)).data);
