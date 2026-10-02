import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiClipboard, FiClock, FiHome, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApplications } from '../../services/applicationStorage';
import { studentApplications as sampleApplications } from '../../services/reviewData';
import { getPropertySlug } from '../../services/propertyStorage';
import '../workspaceActivity.css';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const AdminEnquiries = () => {
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('All statuses');
	const applications = getApplications(sampleApplications);
	const enquiries = applications.map((application) => ({
		...application,
		kind: 'Application',
		status: application.status,
		id: application.id,
	})).filter((application) => {
		const searchText = `${application.name} ${application.property} ${application.course} ${application.email}`.toLowerCase();
		return (!query || searchText.includes(query.toLowerCase())) && (statusFilter === 'All statuses' || application.status === statusFilter);
	});

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Enquiries">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Marketplace conversations</p><h1>Keep every connection <span>visible and safe.</span></h1><p className="dashboard-subtitle">Monitor student applications and enquiry activity across stays; open a profile or property to follow up.</p></div><div className="owner-workspace-header-stat"><strong>{applications.length}</strong><span>records</span></div></section>
				<section className="owner-workspace-toolbar"><div className="owner-properties-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student, property, or campus" aria-label="Search marketplace enquiries" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter enquiry status"><option>All statuses</option><option>New</option><option>Review</option><option>Shortlisted</option><option>Accepted</option><option>Declined</option></select><span>{enquiries.length} records</span></section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Cross-platform inbox</p><h2>Student activity</h2></div><span>Student contact details remain role-protected</span></div>
					<div className="owner-enquiries-list">{enquiries.length ? enquiries.map((enquiry) => <article className="owner-enquiry-card" key={enquiry.id}><span className="dashboard-top-avatar">{enquiry.initials || enquiry.name.slice(0, 2).toUpperCase()}</span><div className="owner-enquiry-card-copy"><strong>{enquiry.name}</strong><b>{enquiry.property} · {enquiry.roomPreference || enquiry.room}</b><span>{enquiry.course}</span><small><FiClock /> Move-in {enquiry.moveIn} · {enquiry.email}</small></div><div className="owner-enquiry-card-actions"><em className={enquiry.status.toLowerCase()}>{enquiry.status}</em><Link className="review-link" to="/admin/users"><FiUsers /> User directory</Link><Link className="review-link" to={`/hostels/${enquiry.propertySlug || getPropertySlug(enquiry.property)}`}><FiHome /> Property</Link><Link className="review-link" to="/admin/approvals"><FiShield /> Moderation</Link></div></article>) : <div className="admin-review-empty">No enquiry records match the current filters.</div>}</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminEnquiries;
