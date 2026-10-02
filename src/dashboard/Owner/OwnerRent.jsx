import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBarChart2, FiCalendar, FiCheckCircle, FiClipboard, FiCreditCard, FiHome, FiMessageCircle, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApplications } from '../../services/applicationStorage';
import { studentApplications as sampleApplications } from '../../services/reviewData';
import { getOwnerProperties } from '../../services/propertyStorage';
import { getRentCharges } from '../../services/rentStorage';
import '../workspacePayments.css';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const OwnerRent = () => {
	const user = useSelector((state) => state.auth.user);
	const ownerId = user?.id || user?.email || user?.username || 'owner-1';
	const records = useMemo(() => getApplications(sampleApplications)
		.filter((application) => application.status === 'Accepted')
		.map((application) => {
			const properties = getOwnerProperties();
			const property = properties.find((item) => item.slug === application.propertySlug || item.name === application.property);
			return { application, property, charges: getRentCharges(application) };
		})
		.filter(({ application, property }) => application.propertyOwnerId === ownerId
			|| property?.ownerId === ownerId
			|| (application.propertyOwnerId == null && (property?.owner?.name === user?.name || user?.name === 'Riya Shah' || ownerId === 'owner-1'))), [ownerId, user?.name]);
	const charges = records.flatMap(({ application, property, charges: rentCharges }) => rentCharges.map((charge) => ({ ...charge, student: application.name, propertyName: property?.name || application.property })));
	const totalPaid = charges.reduce((total, charge) => total + charge.paidAmount, 0);
	const totalDue = charges.filter((charge) => charge.status !== 'paid').reduce((total, charge) => total + charge.totalDue, 0);
	const totalFines = charges.filter((charge) => charge.status !== 'paid').reduce((total, charge) => total + charge.fine, 0);

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: user?.name || 'Property owner', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Rent & payments">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Rent ledger</p><h1>Every rent payment, <span>clearly tracked.</span></h1><p className="dashboard-subtitle">Review resident balances, payment history, and late fines. Students see the same ledger in My Stay.</p></div><div className="owner-workspace-header-stat"><strong>{records.length}</strong><span>accepted residents</span></div></section>
				<section className="owner-properties-summary" aria-label="Rent totals"><div><span>Paid</span><strong>Rs. {totalPaid.toLocaleString('en-IN')}</strong></div><div><span>Outstanding</span><strong>Rs. {totalDue.toLocaleString('en-IN')}</strong></div><div><span>Open fines</span><strong>Rs. {totalFines.toLocaleString('en-IN')}</strong></div><div><span>Installments</span><strong>{charges.length}</strong></div></section>
				<section className="owner-properties-summary" aria-label="Rent totals"><div><span>Paid</span><strong>Rs. {totalPaid.toLocaleString('en-IN')}</strong></div><div><span>Remaining scheduled</span><strong>Rs. {totalDue.toLocaleString('en-IN')}</strong></div><div><span>Open fines</span><strong>Rs. {totalFines.toLocaleString('en-IN')}</strong></div><div><span>Installments</span><strong>{charges.length}</strong></div></section>
				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Shared payment ledger</p><h2>Resident rent schedules</h2></div><span>Late fee: Rs. 100/day after 5-day grace period</span></div>
					{records.length ? <div className="owner-enquiries-list">{records.map(({ application, property, charges: rentCharges }) => <article className="owner-enquiry-card owner-rent-card" key={application.id}>
						<span className="dashboard-top-avatar"><FiUsers /></span><div className="owner-enquiry-card-copy"><strong>{application.name}</strong><b>{property?.name || application.property} · {application.roomPreference || application.room}</b><span>{application.course}</span><small><FiCalendar /> Move-in {application.moveIn}</small>
							<div className="owner-rent-charge-list">{rentCharges.map((charge) => <div key={charge.id}><span>{charge.period} · due {charge.dueDate}</span><strong>Rent Rs. {charge.monthlyRent.toLocaleString('en-IN')} · Fine Rs. {charge.fine.toLocaleString('en-IN')} · Total Rs. {charge.totalDue.toLocaleString('en-IN')}</strong><em className={charge.status === 'paid' ? 'paid' : charge.fine ? 'overdue' : 'due'}>{charge.status === 'paid' ? `Paid Rs. ${charge.paidAmount.toLocaleString('en-IN')}` : charge.fine ? 'Fine accruing' : 'Due'}</em></div>)}</div>
							<div className="owner-rent-charge-list">{rentCharges.map((charge) => <div key={charge.id}><span>{charge.period} · due {charge.dueDate}</span><strong>Rent Rs. {charge.monthlyRent.toLocaleString('en-IN')} · Fine Rs. {charge.fine.toLocaleString('en-IN')} · Total Rs. {charge.totalDue.toLocaleString('en-IN')}</strong><em className={charge.status === 'paid' ? 'paid' : charge.status === 'overdue' ? 'overdue' : 'due'}>{charge.status === 'paid' ? `Paid Rs. ${charge.paidAmount.toLocaleString('en-IN')}` : charge.status === 'upcoming' ? 'Upcoming' : charge.status === 'overdue' ? 'Overdue' : 'Due'}</em></div>)}</div>
						</div><div className="owner-enquiry-card-actions"><Link className="review-link" to={`/owner/students/${application.id}`}><FiUsers /> Student profile</Link><Link className="review-link" to={`/hostels/${property?.slug || application.propertySlug}`}><FiHome /> Property</Link></div>
					</article>)}</div> : <div className="student-applications-empty"><span><FiCreditCard /></span><h2>No accepted residents have a rent schedule yet.</h2><p>Rent ledgers appear after a student application is accepted.</p><Link to="/owner/applications"><FiArrowUpRight /> Review applications</Link></div>}
				</section>
				<section className="owner-workspace-tip"><FiCheckCircle /><div><p className="dashboard-eyebrow">Payment integration placeholder</p><h2>Frontend tracking is ready for your backend.</h2><p>Payment actions currently record a mock paid state in local storage. Connect the checkout action and verified webhook to your payment provider before collecting real money.</p></div></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerRent;
