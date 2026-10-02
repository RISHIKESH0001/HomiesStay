import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiBookmark, FiChevronRight, FiMapPin, FiMessageCircle, FiSearch, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getPropertySlug } from '../../services/propertyStorage';
import { getTimeGreeting } from '../../utils/greeting';

const stays = [
	{ name: 'The Olive House', area: 'Koramangala, Bengaluru', type: 'Co-living', price: '₹14,500', rating: '4.9', color: 'olive', initials: 'OH' },
	{ name: 'Casa Nook', area: 'HSR Layout, Bengaluru', type: 'Private room', price: '₹12,800', rating: '4.8', color: 'sunset', initials: 'CN' },
	{ name: 'The Nest Collective', area: 'Indiranagar, Bengaluru', type: 'Shared apartment', price: '₹10,900', rating: '4.7', color: 'blue', initials: 'NC' },
];

const StudentDashboard = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const username = user?.username || user?.name || 'there';
	const greeting = getTimeGreeting(new Date(), user?.timeZone || user?.timezone);
	const [query, setQuery] = useState('');
	const [savedHomes, setSavedHomes] = useState([]);
	const [searchError, setSearchError] = useState('');
	const visibleStays = useMemo(() => stays.filter((stay) => `${stay.name} ${stay.area}`.toLowerCase().includes(query.toLowerCase())), [query]);

	const toggleSaved = (name) => {
		setSavedHomes((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
	};

	const handleSearch = () => {
		const trimmedQuery = query.trim();
		if (!trimmedQuery) {
			setSearchError('Enter a neighbourhood, college, or landmark first.');
			return;
		}
		setSearchError('');
		navigate(trimmedQuery ? `/search-results?q=${encodeURIComponent(trimmedQuery)}` : '/search-results');
	};

	return (
		<DashboardLayout>
			<main className="dashboard-content">
				<section className="dashboard-welcome">
					<div>
						<p className="dashboard-eyebrow">Thursday, 18 September 2026</p>
						<h1>{greeting}, {username}<span>.</span></h1>
						<p className="dashboard-subtitle">A better stay is closer than you think.</p>
					</div>
					<a className="dashboard-primary-action" href="/dashboard/explore-stays"><FiSearch /> Explore homes <FiArrowUpRight /></a>
				</section>

				<section className="dashboard-search-panel" aria-label="Find a home">
					<div className="dashboard-search-copy"><span className="dashboard-search-icon"><FiMapPin /></span><div><strong>Where do you want to live?</strong><span>Search by neighbourhood, college, or landmark</span></div></div>
					<div className="dashboard-search-input"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Koramangala or Christ University" aria-label="Search homes" /></div>
					<button className="dashboard-search-button" type="button" onClick={handleSearch}>Search</button>
					{searchError && <p className="dashboard-search-error" role="alert">{searchError}</p>}
				</section>

				<section className="dashboard-stats" aria-label="Your activity">
					<div className="dashboard-stat-card"><span className="stat-icon green"><FiBookmark /></span><div><strong>4</strong><span>Saved homes</span></div><small>+2 this week</small></div>
					<div className="dashboard-stat-card"><span className="stat-icon yellow"><FiMessageCircle /></span><div><strong>2</strong><span>Active enquiries</span></div><small>1 reply waiting</small></div>
					<div className="dashboard-stat-card"><span className="stat-icon blue"><FiStar /></span><div><strong>92%</strong><span>Profile complete</span></div><small className="neutral">Almost there</small></div>
				</section>

				<div className="dashboard-section-heading" id="explore"><div><p className="dashboard-eyebrow">Handpicked for you</p><h2>Stays worth a closer look</h2></div><a href="/hostels">View all <FiChevronRight /></a></div>
				<section className="dashboard-stay-grid">
					{visibleStays.map((stay) => <article className="dashboard-stay-card" key={stay.name}>
						<div className={`dashboard-stay-image ${stay.color}`}><span>{stay.initials}</span><button className={savedHomes.includes(stay.name) ? 'stay-save saved' : 'stay-save'} type="button" onClick={() => toggleSaved(stay.name)} aria-label={`Save ${stay.name}`}><FiBookmark /></button><span className="stay-verified">Verified</span></div>
						<div className="dashboard-stay-body"><div className="dashboard-stay-type">{stay.type}<span><FiStar /> {stay.rating}</span></div><h3>{stay.name}</h3><p><FiMapPin /> {stay.area}</p><div className="dashboard-stay-footer"><strong>{stay.price}<small>/ month</small></strong><a href={`/hostels/${getPropertySlug(stay.name)}`} aria-label={`View ${stay.name}`}><FiArrowUpRight /></a></div></div>
					</article>)}
					{visibleStays.length === 0 && <p className="dashboard-empty-state">No stays match that search yet. Try another neighbourhood.</p>}
				</section>

				<section className="dashboard-bottom-grid">
					<div className="dashboard-activity-panel"><div className="dashboard-section-heading compact"><div><p className="dashboard-eyebrow">Keep moving</p><h2>Recent activity</h2></div><a href="/dashboard/activity">See all <FiChevronRight /></a></div><div className="activity-row"><span className="activity-mark green"><FiBookmark /></span><div><strong>You saved The Olive House</strong><span>Yesterday at 6:42 PM</span></div><FiChevronRight /></div><div className="activity-row"><span className="activity-mark yellow"><FiMessageCircle /></span><div><strong>Enquiry sent to Casa Nook</strong><span>Monday at 10:15 AM</span></div><FiChevronRight /></div></div>
					<div className="dashboard-tip"><span className="tip-spark">✦</span><p className="dashboard-eyebrow">A small tip</p><h2>Complete your profile to get better matches.</h2><p>Tell us what matters to you and we’ll tune your recommendations.</p><a href="/profile">Complete profile <FiArrowUpRight /></a></div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default StudentDashboard;
