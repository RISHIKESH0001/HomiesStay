import { getApplications } from './applicationStorage';
import { studentApplications as sampleApplications } from './reviewData';
import { getOwnerProperties } from './propertyStorage';
import { getRentCharges } from './rentStorage';

const READ_KEY = 'homies-stay-notification-read';

const readState = () => {
	try {
		return JSON.parse(window.localStorage.getItem(READ_KEY) || '{}');
	} catch {
		return {};
	}
};

const writeState = (state) => window.localStorage.setItem(READ_KEY, JSON.stringify(state));

const getUserKey = (user) => user?.id || user?.email || user?.username || user?.name || 'guest';

export const getNotifications = (role, user) => {
	const userKey = getUserKey(user);
	const readStateByUser = readState();
	const readIds = new Set(readStateByUser[userKey] || []);
	const applications = getApplications(sampleApplications);
	const properties = getOwnerProperties();
	let notifications = [];

	if (role === 'student') {
		const studentId = getUserKey(user);
		const ownApplications = applications.filter((application) => application.studentId === studentId);
		notifications = ownApplications.map((application) => ({
			id: `application-${application.id}-${application.status}`,
			title: application.status === 'Accepted' ? `${application.property} accepted your application` : application.status === 'Declined' ? `${application.property} declined your application` : `Application sent to ${application.property}`,
			detail: `${application.roomPreference || application.room} · Move-in ${application.moveIn}`,
			time: application.updatedAt || application.submittedAt,
			kind: application.status === 'Accepted' ? 'success' : application.status === 'Declined' ? 'warning' : 'info',
			href: application.status === 'Accepted' ? '/dashboard/my-stay' : '/dashboard/applications',
		}));
		ownApplications.filter((application) => application.status === 'Accepted').forEach((application) => {
			const nextCharge = getRentCharges(application).find((charge) => charge.status !== 'paid');
			if (nextCharge) notifications.push({
				id: `rent-${nextCharge.id}-${nextCharge.status}`,
				title: nextCharge.fine ? 'Rent payment is overdue' : nextCharge.status === 'upcoming' ? 'Upcoming rent payment' : 'Rent payment due',
				detail: `${application.property} · Rs. ${nextCharge.totalDue.toLocaleString('en-IN')} including Rs. ${nextCharge.fine.toLocaleString('en-IN')} fine`,
				time: nextCharge.dueDate,
				kind: nextCharge.fine ? 'warning' : 'info',
				href: '/dashboard/my-stay',
			});
		});
	} else if (role === 'owner') {
		const ownerId = getUserKey(user);
		const ownedProperties = properties.filter((property) => property.ownerId === ownerId || property.ownerId === 'owner-1' && (user?.name === 'Riya Shah' || user?.username?.toLowerCase() === 'riya'));
		ownedProperties.filter((property) => property.status === 'Approved - payment due').forEach((property) => notifications.push({
			id: `listing-payment-${property.slug}`,
			title: `${property.name} was approved`,
			detail: 'Pay the listing fee to publish this property.',
			time: property.adminReviewedAt,
			kind: 'success',
			href: `/owner/properties/${property.slug}/payment`,
		}));
		ownedProperties.filter((property) => property.status === 'Changes requested').forEach((property) => notifications.push({
			id: `listing-changes-${property.slug}`,
			title: `Changes requested for ${property.name}`,
			detail: property.adminNote || 'Update the listing and resubmit it for review.',
			time: property.adminReviewedAt,
			kind: 'warning',
			href: '/owner/properties',
		}));
		applications.filter((application) => application.propertyOwnerId === ownerId || !application.propertyOwnerId && ownedProperties.some((property) => property.name === application.property)).forEach((application) => notifications.push({
			id: `owner-application-${application.id}-${application.status}`,
			title: application.status === 'New' ? `New application from ${application.name}` : `${application.name}'s application is ${application.status.toLowerCase()}`,
			detail: `${application.property} · Move-in ${application.moveIn}`,
			time: application.updatedAt || application.submittedAt,
			kind: application.status === 'New' ? 'info' : 'neutral',
			href: '/owner/applications',
		}));
	} else if (role === 'admin') {
		properties.filter((property) => property.adminDecision === 'pending' || property.status === 'Pending review').forEach((property) => notifications.push({
			id: `admin-listing-${property.slug}`,
			title: `Listing review: ${property.name}`,
			detail: `${property.area}, ${property.city} · ${property.capacity} rooms · ${property.owner?.name || 'Owner submission'}`,
			time: property.submittedAt,
			kind: 'warning',
			href: `/admin/properties/${property.slug}/review`,
		}));
		applications.filter((application) => application.status === 'New').forEach((application) => notifications.push({
			id: `admin-enquiry-${application.id}`,
			title: `Student application: ${application.name}`,
			detail: `${application.property} · ${application.course}`,
			time: application.submittedAt,
			kind: 'info',
			href: '/admin/enquiries',
		}));
	}

	return notifications
		.sort((first, second) => new Date(second.time || 0) - new Date(first.time || 0))
		.map((notification) => ({ ...notification, read: readIds.has(notification.id) }));
};

export const markNotificationRead = (user, notificationId) => {
	const state = readState();
	const userKey = getUserKey(user);
	state[userKey] = [...new Set([...(state[userKey] || []), notificationId])];
	writeState(state);
};

export const markAllNotificationsRead = (user, notifications) => {
	const state = readState();
	state[getUserKey(user)] = [...new Set([...(state[getUserKey(user)] || []), ...notifications.map((notification) => notification.id)])];
	writeState(state);
};
