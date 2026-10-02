import { getOwnerProperties, getPropertySlug, updateStoredProperty } from './propertyStorage';

const AREA_MULTIPLIERS = [
	{ pattern: /koramangala|indiranagar|hsr|whitefield/i, multiplier: 1.25 },
	{ pattern: /hinjewadi|viman nagar|salt lake|new town/i, multiplier: 1.1 },
];

export const calculateListingFee = ({ capacity = 0, area = '', city = '' }) => {
	const rooms = Math.max(0, Number(capacity) || 0);
	const areaMultiplier = AREA_MULTIPLIERS.find((item) => item.pattern.test(`${area} ${city}`))?.multiplier || 1;
	const baseFee = 1500 + (rooms * 125);
	return Math.round(baseFee * areaMultiplier / 50) * 50;
};

export const getListingReviewQueue = () => getOwnerProperties().filter((property) => property.adminDecision === 'pending' || property.status === 'Pending review');

export const reviewListing = (slug, decision, reviewer = 'Platform admin', note = '') => {
	const approved = decision === 'approved';
	return updateStoredProperty(slug, {
		adminDecision: decision,
		adminReviewedAt: new Date().toISOString(),
		adminReviewer: reviewer,
		adminNote: note,
		status: approved ? 'Approved - payment due' : 'Changes requested',
		listingFeeStatus: approved ? 'unpaid' : 'unpaid',
	});
};

export const payListingFee = (slug) => {
	const property = getOwnerProperties().find((item) => item.slug === slug);
	if (!property || property.adminDecision !== 'approved') return null;
	const fee = calculateListingFee(property);
	return updateStoredProperty(slug, {
		listingFeeStatus: 'paid',
		listingFeeAmount: fee,
		listingFeePaidAt: new Date().toISOString(),
		status: 'Live',
	});
};

export const getListingPaymentPath = (property) => `/owner/properties/${property.slug || getPropertySlug(property.name)}/payment`;
