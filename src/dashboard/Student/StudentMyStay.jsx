import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCalendar, FiCheckCircle, FiClock, FiCreditCard, FiHome, FiMapPin, FiMessageCircle, FiShield } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApplications } from '../../services/applicationStorage';
import { studentApplications as sampleApplications } from '../../services/reviewData';
import { getRentCharges, recordRentPayment } from '../../services/rentStorage';
import './studentApplications.css';
import '../workspacePayments.css';

const StudentMyStay = () => {
	const user = useSelector((state) => state.auth.user);
	const studentId = user?.id || user?.email || user?.username || user?.name;
	const acceptedApplications = getApplications(sampleApplications).filter((application) => application.studentId === studentId && application.status === 'Accepted');
	const [, forceRefresh] = useState(0);
	const stayCards = acceptedApplications.map((application) => ({ application, charges: getRentCharges(application) }));
	const activeStayCount = stayCards.filter(({ application }) => new Date(`${application.moveIn}T00:00:00`) <= new Date()).length;

	const payRent = (charge) => {
		recordRentPayment(charge);
		forceRefresh((value) => value + 1);
	};

	return (
		<DashboardLayout role="student" profile={{ initials: (user?.name || 'ST').slice(0, 2).toUpperCase(), name: user?.name || 'Student user', type: 'Student account' }} pageTitle="My Stay">
			<main className="dashboard-content owner-workspace-page student-my-stay-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Resident workspace</p><h1>Your stay, <span>all in one place.</span></h1><p className="dashboard-subtitle">See your move-in details, monthly rent schedule, payment history, and any late fees.</p></div><div className="owner-workspace-header-stat"><strong>{activeStayCount}</strong><span>active stays</span></div></section>
				{stayCards.length ? stayCards.map(({ application, charges }) => {
					const totalPaid = charges.reduce((total, charge) => total + charge.paidAmount, 0);
					const totalDue = charges.filter((charge) => charge.status !== 'paid').reduce((total, charge) => total + charge.totalDue, 0);
					const current = new Date(`${application.moveIn}T00:00:00`) <= new Date();
					return <section className="owner-workspace-panel resident-stay-panel" key={application.id}>
						<div className="resident-stay-heading"><div className="student-application-stay-icon"><FiHome /></div><div><p className="dashboard-eyebrow">{current ? 'Current stay' : 'Confirmed upcoming stay'}</p><h2>{application.property}</h2><span><FiMapPin /> {application.propertyLocation || application.city || 'Location on file'}</span></div><Link to={`/hostels/${application.propertySlug}`} aria-label="View stay details"><FiArrowUpRight /></Link></div>
						<div className="owner-properties-summary resident-summary"><div><span>Move-in date</span><strong>{application.moveIn}</strong></div><div><span>Room</span><strong>{application.roomPreference || application.room}</strong></div><div><span>Monthly rent</span><strong>Rs. {Number(charges[0]?.monthlyRent || 0).toLocaleString('en-IN')}</strong></div><div><span>Remaining scheduled</span><strong>Rs. {totalDue.toLocaleString('en-IN')}</strong></div></div>
						<div className="resident-balance-strip"><span><FiCheckCircle /> Paid to date: <strong>Rs. {totalPaid.toLocaleString('en-IN')}</strong></span><span><FiShield /> Late fines are shown alongside each instalment for both you and the owner.</span></div>
						<div className="resident-rent-table-wrap"><table className="resident-rent-table"><thead><tr><th>Rent period</th><th>Due date</th><th>Rent</th><th>Fine</th><th>Total</th><th>Status / action</th></tr></thead><tbody>{charges.map((charge) => <tr key={charge.id}><td>{charge.period}</td><td>{charge.dueDate}</td><td>Rs. {charge.monthlyRent.toLocaleString('en-IN')}</td><td className={charge.fine ? 'rent-fine-amount' : ''}>Rs. {charge.fine.toLocaleString('en-IN')}</td><td>Rs. {charge.totalDue.toLocaleString('en-IN')}</td><td>{charge.status === 'paid' ? <span className="rent-status-paid"><FiCheckCircle /> Paid {charge.paidAt ? new Date(charge.paidAt).toLocaleDateString('en-IN') : ''}</span> : <div className="rent-due-action"><em className={charge.status}>{charge.status === 'upcoming' ? 'Upcoming' : charge.status === 'overdue' ? 'Overdue' : 'Due'}</em><button className="rent-pay-button" type="button" onClick={() => payRent(charge)}><FiCreditCard /> Pay now</button></div>}</td></tr>)}</tbody></table></div>
						<div className="resident-stay-footer"><span><FiCalendar /> Duration: {application.duration || 'Not specified'}</span><span><FiClock /> Fine rule: Rs. 100/day after 5-day grace period, capped at 20% of monthly rent.</span><Link to="/dashboard/applications"><FiMessageCircle /> Application record</Link></div>
					</section>;
				}) : <section className="student-applications-empty"><span><FiHome /></span><p className="dashboard-eyebrow">No confirmed stay yet</p><h2>Your stay details will appear here after an owner accepts.</h2><p>Apply to a property to get a move-in plan and rent schedule in one place.</p><Link to="/hostels"><FiArrowUpRight /> Explore stays</Link></section>}
			</main>
		</DashboardLayout>
	);
};

export default StudentMyStay;
