import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiClock, FiHome, FiMessageCircle, FiSearch, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const initialEnquiries = [
	{ name: 'Neha Sharma', property: 'The Olive House', detail: 'Private room · Move-in 1 October', time: '12 min ago', initials: 'NS', tone: 'green', status: 'New' },
	{ name: 'Vikram Mehta', property: 'Casa Nook', detail: 'Private room · Asked about deposit', time: '2 hrs ago', initials: 'VM', tone: 'warm', status: 'New' },
	{ name: 'Ananya Rao', property: 'Mango Tree Living', detail: 'Shared room · Move-in 15 October', time: 'Yesterday', initials: 'AR', tone: 'blue', status: 'Replied' },
	{ name: 'Kabir Shah', property: 'The Olive House', detail: 'Private room · Wants a virtual tour', time: 'Yesterday', initials: 'KS', tone: 'green', status: 'Waiting' },
];

const OwnerEnquiries = () => {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('All enquiries');
	const [enquiries, setEnquiries] = useState(initialEnquiries);
	const visibleEnquiries = enquiries.filter((enquiry) => {
		const searchable = `${enquiry.name} ${enquiry.property} ${enquiry.detail}`.toLowerCase();
		const status = enquiry.status;
		return (!query || searchable.includes(query.trim().toLowerCase())) && (filter === 'All enquiries' || status === filter);
	});
	const replyToEnquiry = (name) => setEnquiries((current) => current.map((enquiry) => (
		enquiry.name === name ? { ...enquiry, status: 'Replied', time: 'Just now' } : enquiry
	)));

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Enquiries">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Your inbox</p><h1>Turn interest into <span>the right fit.</span></h1><p className="dashboard-subtitle">Respond to students, answer the practical questions, and keep every conversation tied to the right property.</p></div><div className="owner-workspace-header-stat"><strong>{enquiries.filter((enquiry) => enquiry.status === 'New').length}</strong><span>new today</span></div></section>
				<section className="owner-workspace-toolbar"><div className="owner-properties-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students or properties" aria-label="Search enquiries" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter enquiries"><option>All enquiries</option><option>New</option><option>Replied</option><option>Waiting</option></select><span>{visibleEnquiries.length} conversations</span></section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Student conversations</p><h2>Latest enquiries</h2></div><span>Sorted by latest activity</span></div><div className="owner-enquiries-list">{visibleEnquiries.map((enquiry) => <article className="owner-enquiry-card" key={`${enquiry.name}-${enquiry.property}`}><span className={`dashboard-top-avatar ${enquiry.tone}`}>{enquiry.initials}</span><div className="owner-enquiry-card-copy"><strong>{enquiry.name}</strong><b>{enquiry.property}</b><span>{enquiry.detail}</span><small><FiClock /> {enquiry.time}</small></div><div className="owner-enquiry-card-actions"><em className={enquiry.status.toLowerCase()}>{enquiry.status}</em><button type="button" onClick={() => replyToEnquiry(enquiry.name)} disabled={enquiry.status === 'Replied'}>{enquiry.status === 'Replied' ? <><FiCheck /> Sent</> : <>Reply <FiArrowUpRight /></>}</button></div></article>)}</div><div className="enquiry-page-footer"><Link to="/owner/applications">Review applications <FiArrowUpRight /></Link><Link to="/owner/notifications">View notifications <FiArrowUpRight /></Link></div></section>
				<section className="owner-workspace-tip"><FiUsers /><div><p className="dashboard-eyebrow">A useful habit</p><h2>Reply while the question is still warm.</h2><p>Students are more likely to complete an enquiry when they receive clear answers about rent, deposits, availability, and move-in dates.</p></div></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerEnquiries;
