import { useState } from 'react';
import { FiArrowUpRight, FiBarChart2, FiBell, FiChevronRight, FiClipboard, FiHome, FiMessageCircle, FiPlus, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const properties = [
	{ name: 'The Olive House', area: 'Koramangala, Bengaluru', occupancy: '92%', rooms: '46 / 50', status: 'Live', tone: 'olive' },
	{ name: 'Casa Nook', area: 'HSR Layout, Bengaluru', occupancy: '84%', rooms: '21 / 25', status: 'Live', tone: 'sunset' },
	{ name: 'Mango Tree Living', area: 'Indiranagar, Bengaluru', occupancy: '68%', rooms: '17 / 25', status: 'Review', tone: 'blue' },
];

const OwnerDashboard = () => {
	const [activeProperty, setActiveProperty] = useState('All properties');
	const visibleProperties = activeProperty === 'All properties' ? properties : properties.filter((property) => property.name === activeProperty);

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Owner overview">
			<main className="dashboard-content role-dashboard owner-dashboard">
				<section className="dashboard-welcome">
					<div><p className="dashboard-eyebrow">Thursday, 18 September 2026</p><h1>Your spaces, <span>growing.</span></h1><p className="dashboard-subtitle">Here is how your properties are performing this week.</p></div>
					<a className="dashboard-primary-action" href="/owner/properties"><FiPlus /> Add a property <FiArrowUpRight /></a>
				</section>

				<section className="owner-hero-metrics">
					<div className="owner-revenue-card"><div><p className="dashboard-eyebrow">Monthly revenue</p><strong>₹8,42,500</strong><span><FiArrowUpRight /> 12.4% <small>vs last month</small></span></div><div className="revenue-chart" aria-label="Revenue trending upward"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
					<div className="owner-quick-stat"><span className="stat-icon green"><FiUsers /></span><div><strong>84%</strong><span>Average occupancy</span></div><small>+6.2%</small></div>
					<div className="owner-quick-stat"><span className="stat-icon yellow"><FiMessageCircle /></span><div><strong>8</strong><span>New enquiries</span></div><small className="neutral">This week</small></div>
				</section>

				<div className="dashboard-section-heading owner-heading"><div><p className="dashboard-eyebrow">Your portfolio</p><h2>Properties at a glance</h2></div><div className="owner-filter"><select value={activeProperty} onChange={(event) => setActiveProperty(event.target.value)} aria-label="Filter properties"><option>All properties</option>{properties.map((property) => <option key={property.name}>{property.name}</option>)}</select></div></div>
				<section className="owner-property-table"><div className="owner-table-header"><span>Property</span><span>Occupancy</span><span>Rooms filled</span><span>Status</span><span /></div>{visibleProperties.map((property) => <div className="owner-property-row" key={property.name}><div className="owner-property-name"><span className={`owner-property-thumb ${property.tone}`}>{property.name.slice(0, 2)}</span><div><strong>{property.name}</strong><span>{property.area}</span></div></div><div className="occupancy-cell"><div className="occupancy-bar"><i style={{ width: property.occupancy }} /></div><strong>{property.occupancy}</strong></div><span className="owner-room-count">{property.rooms}</span><span className={property.status === 'Live' ? 'status-pill live' : 'status-pill review'}>{property.status}</span><a href={`/hostels/${property.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} aria-label={`View ${property.name}`}><FiChevronRight /></a></div>)}<button className="owner-add-property" type="button"><FiPlus /> Add another property</button></section>

				<section className="dashboard-bottom-grid owner-bottom-grid"><div className="dashboard-activity-panel"><div className="dashboard-section-heading compact"><div><p className="dashboard-eyebrow">Needs your attention</p><h2>Latest enquiries</h2></div><a href="/owner/enquiries">View inbox <FiChevronRight /></a></div><div className="owner-enquiry-row"><span className="dashboard-top-avatar">NS</span><div><strong>Neha Sharma is interested in The Olive House</strong><span>Looking to move in from 1 October · 12 min ago</span></div><button type="button">Reply <FiArrowUpRight /></button></div><div className="owner-enquiry-row"><span className="dashboard-top-avatar warm">VM</span><div><strong>Vikram Mehta sent an enquiry</strong><span>Asked about a private room at Casa Nook · 2 hrs ago</span></div><button type="button">Reply <FiArrowUpRight /></button></div></div><div className="dashboard-tip owner-tip"><FiBell /><p className="dashboard-eyebrow">Owner insight</p><h2>Tuesday is your strongest enquiry day.</h2><p>Consider adding a limited-time offer to convert more visits this week.</p><a href="#insights">See insights <FiArrowUpRight /></a></div></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerDashboard;
