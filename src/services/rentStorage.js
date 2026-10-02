import { getOwnerProperties, getPropertySlug } from './propertyStorage';

const RENT_PAYMENTS_KEY = 'homies-stay-rent-payments';
const MONTHS_TO_SHOW = 6;
const FINE_GRACE_DAYS = 5;
const FINE_PER_DAY = 100;

const readPayments = () => {
	try {
		return JSON.parse(window.localStorage.getItem(RENT_PAYMENTS_KEY) || '{}');
	} catch {
		return {};
	}
};

const makeMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const getStartMonth = (moveIn) => {
	const date = new Date(`${moveIn}T00:00:00`);
	if (Number.isNaN(date.getTime())) return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getRentCharges = (application) => {
	const properties = getOwnerProperties();
	const property = properties.find((item) => item.slug === (application.propertySlug || getPropertySlug(application.property)));
	const monthlyRent = Number(property?.rent) || Number(application.monthlyBudget) || 0;
	const payments = readPayments();
	const start = getStartMonth(application.moveIn);
	const today = new Date();

	return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
		const dueMonth = new Date(start.getFullYear(), start.getMonth() + index, 1);
		const dueDate = new Date(dueMonth.getFullYear(), dueMonth.getMonth(), 5);
		const id = `${application.id}-${makeMonthKey(dueMonth)}`;
		const payment = payments[id];
		const overdueDays = payment?.status === 'paid' ? 0 : Math.max(0, Math.floor((today - new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() + FINE_GRACE_DAYS)) / 86400000));
		const accruedFine = Math.min(overdueDays * FINE_PER_DAY, Math.round(monthlyRent * 0.2));
		const fine = payment?.status === 'paid' ? Number(payment.fineAmount) || 0 : accruedFine;
		const dueDateLabel = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
		const todayLabel = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		return {
			id,
			applicationId: application.id,
			studentId: application.studentId,
			studentName: application.name,
			property: application.property,
			propertySlug: application.propertySlug || getPropertySlug(application.property),
			ownerId: application.propertyOwnerId || property?.ownerId,
			period: dueMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
			dueDate: dueDateLabel,
			monthlyRent,
			fine,
			totalDue: monthlyRent + fine,
			status: payment?.status || (fine > 0 ? 'overdue' : todayLabel > dueDateLabel ? 'due' : 'upcoming'),
			paidAmount: payment?.paidAmount || 0,
			paidAt: payment?.paidAt || null,
			fineGraceDays: FINE_GRACE_DAYS,
		};
	});
};

export const recordRentPayment = (charge) => {
	const payments = readPayments();
	const payment = {
		status: 'paid',
		paidAmount: charge.totalDue,
		fineAmount: charge.fine,
		paidAt: new Date().toISOString(),
	};
	payments[charge.id] = payment;
	window.localStorage.setItem(RENT_PAYMENTS_KEY, JSON.stringify(payments));
	return payment;
};

export const getRentPaymentSummary = (applications) => applications.reduce((summary, application) => {
	getRentCharges(application).forEach((charge) => {
		if (charge.status === 'paid') summary.paid += charge.paidAmount;
		else if (charge.dueDate <= new Date().toISOString().slice(0, 10)) summary.due += charge.totalDue;
	});
	return summary;
}, { due: 0, paid: 0 });
