import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCompass, FiGrid, FiHeart, FiHome, FiMessageCircle, FiSearch, FiClock } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getPropertySlug } from '../../services/propertyStorage';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const initialEnquiries = [
	{ name: 'The Olive House', status: 'New', detail: 'Private room available for October move-in', time: '12 min ago', tone: 'green' },
	{ name: 'Casa Nook', status: 'Replied', detail: 'Owner shared room details and payment plans', time: '2 hrs ago', tone: 'warm' },
	{ name: 'The Nest Collective', status: 'Waiting', detail: 'Waiting for a tour slot and room availability', time: 'Yesterday', tone: 'blue' },
];

const StudentEnquiries = () => {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('All');

	const visibleEnquiries = useMemo(() => initialEnquiries.filter((enquiry) => {
		const matchesQuery = !query || `${enquiry.name} ${enquiry.detail}`.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter === 'All' || enquiry.status === filter;
		return matchesQuery && matchesFilter;
	}), [filter, query]);

	return (
		<DashboardLayout role="student" profile={{ initials: 'ST', name: 'Student user', type: 'Student account' }} navigation={studentNavigation} pageTitle="My enquiries">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Your conversations</p>
						<h1>Keep every enquiry <span>moving forward.</span></h1>
						<p className="dashboard-subtitle">Track which homes have replied, which ones are waiting, and which ones still deserve a follow-up.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{initialEnquiries.filter((item) => item.status === 'New').length}</strong>
						<span>new replies</span>
					</div>
				</section>

				<section className="owner-workspace-toolbar">
					<div className="owner-properties-search">
						<FiSearch />
						<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your enquiry history" aria-label="Search enquiries" />
					</div>
					<select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter enquiries">
						<option>All</option>
						<option>New</option>
						<option>Replied</option>
						<option>Waiting</option>
					</select>
					<span>{visibleEnquiries.length} conversations</span>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Recent activity</p>
							<h2>Enquiries</h2>
						</div>
						<span>Sorted by latest interaction</span>
					</div>

					<div className="owner-enquiries-list">
						{visibleEnquiries.map((enquiry) => (
							<article className="owner-enquiry-card" key={enquiry.name}>
								<span className={`dashboard-top-avatar ${enquiry.tone}`}>{enquiry.name.slice(0, 2).toUpperCase()}</span>
								<div className="owner-enquiry-card-copy">
									<strong>{enquiry.name}</strong>
									<b>Property enquiry</b>
									<span>{enquiry.detail}</span>
									<small><FiClock /> {enquiry.time}</small>
								</div>
								<div className="owner-enquiry-card-actions">
									<em className={enquiry.status.toLowerCase()}>{enquiry.status}</em>
									<Link className="review-link" to={`/hostels/${getPropertySlug(enquiry.name)}`}><FiHome /> View stay</Link>
								</div>
							</article>
						))}
					</div>
					<div className="enquiry-page-footer"><Link to="/dashboard/explore-stays">Find another stay <FiArrowUpRight /></Link><Link to="/dashboard/notifications">View notifications <FiArrowUpRight /></Link></div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default StudentEnquiries;
