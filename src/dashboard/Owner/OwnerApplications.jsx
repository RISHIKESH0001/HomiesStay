import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiHome, FiMessageCircle, FiSearch, FiUserPlus, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApplications, updateApplicationStatus } from '../../services/applicationStorage';
import { studentApplications as sampleApplications } from '../../services/reviewData';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const OwnerApplications = () => {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('All applications');
	const [applications, setApplications] = useState(() => getApplications(sampleApplications));
	const visibleApplications = useMemo(() => applications.filter((application) => {
		const searchable = `${application.name} ${application.property} ${application.course}`.toLowerCase();
		return (!query || searchable.includes(query.toLowerCase())) && (filter === 'All applications' || application.status === filter);
	}), [applications, filter, query]);

	const decide = (applicationId, status) => setApplications(updateApplicationStatus(applicationId, status, sampleApplications));

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Applications">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Admissions desk</p><h1>Find the next <span>good match.</span></h1><p className="dashboard-subtitle">Review student applications across your properties, make decisions quickly, and keep room assignments moving.</p></div><div className="owner-workspace-header-stat"><strong>{applications.filter((application) => application.status === 'New').length}</strong><span>to review</span></div></section>
				<section className="owner-workspace-toolbar"><div className="owner-properties-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students, courses, or properties" aria-label="Search applications" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter applications"><option>All applications</option><option>New</option><option>Review</option><option>Shortlisted</option><option>Accepted</option><option>Declined</option></select><span>{visibleApplications.length} applications</span></section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Student applications</p><h2>Review and decide</h2></div><span>Move-in dates included</span></div><div className="owner-applications-list">{visibleApplications.map((application) => { const status = application.status; return <article className="owner-application-card" key={application.id}><span className="dashboard-top-avatar">{application.initials || application.name.slice(0, 2).toUpperCase()}</span><div className="owner-application-copy"><strong>{application.name}</strong><b>{application.property} · {application.roomPreference || application.room}</b><span>{application.course}</span><small>Move-in {application.moveIn}</small></div><div className="owner-application-status"><em className={status.toLowerCase()}>{status}</em><div><Link className="review-link" to={`/owner/students/${application.id}`}><FiUserPlus /> View student</Link><button type="button" onClick={() => decide(application.id, 'Accepted')} disabled={status === 'Accepted' || status === 'Declined'}><FiCheck /> Accept</button><button type="button" onClick={() => decide(application.id, 'Declined')} disabled={status === 'Declined' || status === 'Accepted'}><FiX /> Decline</button></div></div></article>; })}</div></section>
				<section className="owner-admission-summary"><div><span className="owner-workspace-summary-icon"><FiUserPlus /></span><div><strong>{applications.filter((application) => application.status === 'Accepted').length}</strong><span>accepted applications</span></div></div><p>Accepted students still need a room assignment and move-in checklist before their first day.</p><Link to="/owner/properties"><FiArrowUpRight /> View properties</Link></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerApplications;
