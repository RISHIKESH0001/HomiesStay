import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiHome, FiMessageCircle, FiSearch, FiUserPlus, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const applications = [
	{ name: 'Aarav Mehta', property: 'The Olive House', course: 'Christ University · BBA, 2nd year', moveIn: '1 October 2026', room: 'Private room', initials: 'AM', status: 'New' },
	{ name: 'Nisha Kapoor', property: 'Casa Nook', course: 'Christ University · Psychology, 1st year', moveIn: '15 October 2026', room: 'Shared room', initials: 'NK', status: 'New' },
	{ name: 'Kabir Rao', property: 'Mango Tree Living', course: 'Christ University · B.Com, 3rd year', moveIn: '1 November 2026', room: 'Private room', initials: 'KR', status: 'Shortlisted' },
	{ name: 'Meera Das', property: 'The Olive House', course: 'Christ University · Law, 2nd year', moveIn: '20 October 2026', room: 'Shared room', initials: 'MD', status: 'Review' },
];

const OwnerApplications = () => {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('All applications');
	const [decisions, setDecisions] = useState({});
	const visibleApplications = useMemo(() => applications.filter((application) => {
		const searchable = `${application.name} ${application.property} ${application.course}`.toLowerCase();
		const status = decisions[application.name] || application.status;
		return (!query || searchable.includes(query.toLowerCase())) && (filter === 'All applications' || status === filter);
	}), [decisions, filter, query]);

	const decide = (name, status) => setDecisions((current) => ({ ...current, [name]: status }));

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Applications">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Admissions desk</p><h1>Find the next <span>good match.</span></h1><p className="dashboard-subtitle">Review student applications across your properties, make decisions quickly, and keep room assignments moving.</p></div><div className="owner-workspace-header-stat"><strong>{applications.filter((application) => application.status === 'New').length}</strong><span>to review</span></div></section>
				<section className="owner-workspace-toolbar"><div className="owner-properties-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students, courses, or properties" aria-label="Search applications" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter applications"><option>All applications</option><option>New</option><option>Review</option><option>Shortlisted</option><option>Accepted</option><option>Declined</option></select><span>{visibleApplications.length} applications</span></section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Student applications</p><h2>Review and decide</h2></div><span>Move-in dates included</span></div><div className="owner-applications-list">{visibleApplications.map((application) => { const status = decisions[application.name] || application.status; return <article className="owner-application-card" key={application.name}><span className="dashboard-top-avatar">{application.initials}</span><div className="owner-application-copy"><strong>{application.name}</strong><b>{application.property} · {application.room}</b><span>{application.course}</span><small>Move-in {application.moveIn}</small></div><div className="owner-application-status"><em className={status.toLowerCase()}>{status}</em><div><button type="button" onClick={() => decide(application.name, 'Accepted')} disabled={status === 'Accepted'}><FiCheck /> Accept</button><button type="button" onClick={() => decide(application.name, 'Declined')} disabled={status === 'Declined'}><FiX /> Decline</button></div></div></article>; })}</div></section>
				<section className="owner-admission-summary"><div><span className="owner-workspace-summary-icon"><FiUserPlus /></span><div><strong>{Object.values(decisions).filter((status) => status === 'Accepted').length + 3}</strong><span>admissions this month</span></div></div><p>Accepted students still need a room assignment and move-in checklist before their first day.</p><button type="button">Open admissions <FiArrowUpRight /></button></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerApplications;
