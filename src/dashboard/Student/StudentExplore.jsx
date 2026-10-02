import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiArrowUpRight, FiCompass, FiFilter, FiGrid, FiHeart, FiMapPin, FiMessageCircle, FiSearch, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getPropertySlug } from '../../services/propertyStorage';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const stayList = [
	{ name: 'The Olive House', area: 'Koramangala, Bengaluru', type: 'Co-living', price: '₹14,500', rating: '4.9', badge: 'Verified', color: 'olive', initials: 'OH' },
	{ name: 'Casa Nook', area: 'HSR Layout, Bengaluru', type: 'Private room', price: '₹12,800', rating: '4.8', badge: 'Top pick', color: 'sunset', initials: 'CN' },
	{ name: 'The Nest Collective', area: 'Indiranagar, Bengaluru', type: 'Shared apartment', price: '₹10,900', rating: '4.7', badge: 'New', color: 'blue', initials: 'NC' },
	{ name: 'Greenwood Living', area: 'Whitefield, Bengaluru', type: 'Student hostel', price: '₹9,600', rating: '4.6', badge: 'Budget friendly', color: 'forest', initials: 'GL' },
];

const StudentExplore = () => {
	const user = useSelector((state) => state.auth.user);
	const [query, setQuery] = useState('');
	const [type, setType] = useState('All stays');
	const [savedHomes, setSavedHomes] = useState(['The Olive House']);

	const visibleStays = useMemo(() => stayList.filter((stay) => {
		const matchesQuery = !query || `${stay.name} ${stay.area} ${stay.type}`.toLowerCase().includes(query.toLowerCase());
		const matchesType = type === 'All stays' || stay.type === type;
		return matchesQuery && matchesType;
	}), [query, type]);

	const toggleSaved = (name) => {
		setSavedHomes((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
	};

	return (
		<DashboardLayout role="student" profile={{ initials: (user?.name || 'ST').slice(0, 2).toUpperCase(), name: user?.name || 'Student user', type: 'Student account' }} navigation={studentNavigation} pageTitle="Explore stays">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Find your next base</p>
						<h1>Explore stays that suit <span>your rhythm.</span></h1>
						<p className="dashboard-subtitle">Filter by neighbourhood, room type, and budget to narrow the list without the guesswork.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{stayList.length}</strong>
						<span>handpicked homes</span>
					</div>
				</section>

				<section className="owner-workspace-toolbar">
					<div className="owner-properties-search">
						<FiSearch />
						<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by area, property, or landmark" aria-label="Search stays" />
					</div>
					<select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by stay type">
						<option>All stays</option>
						<option>Co-living</option>
						<option>Private room</option>
						<option>Shared apartment</option>
						<option>Student hostel</option>
					</select>
					<span>{visibleStays.length} homes</span>
				</section>

				<section className="dashboard-stay-grid">
					{visibleStays.map((stay) => (
						<article className="dashboard-stay-card" key={stay.name}>
							<div className={`dashboard-stay-image ${stay.color}`}>
								<span>{stay.initials}</span>
								<button className={savedHomes.includes(stay.name) ? 'stay-save saved' : 'stay-save'} type="button" onClick={() => toggleSaved(stay.name)} aria-label={`Save ${stay.name}`}>
									<FiHeart />
								</button>
								<span className="stay-verified">{stay.badge}</span>
							</div>
							<div className="dashboard-stay-body">
								<div className="dashboard-stay-type">
									{stay.type}
									<span><FiStar /> {stay.rating}</span>
								</div>
								<h3>{stay.name}</h3>
								<p><FiMapPin /> {stay.area}</p>
								<div className="dashboard-stay-footer">
									<strong>{stay.price}<small>/ month</small></strong>
									<a href={`/hostels/${getPropertySlug(stay.name)}`} aria-label={`View ${stay.name}`}><FiArrowUpRight /></a>
								</div>
							</div>
						</article>
					))}
				</section>

				<section className="owner-workspace-tip">
					<FiFilter />
					<div>
						<p className="dashboard-eyebrow">A quick filter</p>
						<h2>Shortlist the right vibe before you enquire.</h2>
						<p>Look for commute time, room type, and neighbourhood fit. The best stay is usually the one that matches both your schedule and your budget.</p>
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default StudentExplore;
