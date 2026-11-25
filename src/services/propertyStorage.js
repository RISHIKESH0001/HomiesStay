export const getPropertySlug = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const toOwnerProperty = (property) => ({
	...property,
	type: property.propertyType,
	gender: property.genderPolicy === 'MEN' ? 'Male' : property.genderPolicy === 'WOMEN' ? 'Female' : 'Unisex',
	college: property.nearbyInstitution || '',
	distance: property.distanceKm == null ? '' : Number(property.distanceKm),
	rent: Number(property.monthlyRent),
	rooms: `${Number(property.capacity) - Number(property.availableBeds)} / ${property.capacity}`,
	status: property.listingStatus === 'PENDING_REVIEW' ? 'Pending review' : property.listingStatus[0] + property.listingStatus.slice(1).toLowerCase(),
});
