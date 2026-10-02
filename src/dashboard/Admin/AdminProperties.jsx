import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiHome, FiMapPin, FiSearch, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getOwnerProperties, getPropertySlug } from '../../services/propertyStorage';
import '../workspacePayments.css';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const AdminProperties = () => {
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('All statuses');
	const propertyList = useMemo(() => getOwnerProperties(), []);

	const visibleProperties = useMemo(() => propertyList.filter((property) => {
		const matchesQuery = !query || `${property.name} ${property.area} ${property.owner?.name || property.ownerName || property.owner || ''}`.toLowerCase().includes(query.toLowerCase());
		const matchesStatus = statusFilter === 'All statuses' || property.status === statusFilter;
		return matchesQuery && matchesStatus;
	}), [propertyList, query, statusFilter]);

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Properties">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Marketplace inventory</p>
						<h1>Monitor every listing <span>across the platform.</span></h1>
						<p className="dashboard-subtitle">Check which properties are healthy, which are under review, and which still need attention.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{propertyList.filter((item) => item.status === 'Live').length}</strong>
						<span>live properties</span>
					</div>
				</section>

				<section className="owner-workspace-toolbar">
					<div className="owner-properties-search">
						<FiSearch />
						<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by owner, area, or property name" aria-label="Search properties" />
					</div>
					<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by property status">
						<option>All statuses</option>
						<option>Live</option>
						<option>Pending review</option>
						<option>Approved - payment due</option>
						<option>Changes requested</option>
						<option>Review</option>
						<option>Draft</option>
					</select>
					<span>{visibleProperties.length} properties</span>
				</section>

				<section className="owner-properties-summary" aria-label="Portfolio summary">
					<div><span>Live</span><strong>{propertyList.filter((item) => item.status === 'Live').length}</strong></div>
					<div><span>Pending review</span><strong>{propertyList.filter((item) => item.status === 'Pending review').length}</strong></div>
					<div><span>Payment due</span><strong>{propertyList.filter((item) => item.status === 'Approved - payment due').length}</strong></div>
					<div><span>Changes requested</span><strong>{propertyList.filter((item) => item.status === 'Changes requested').length}</strong></div>
				</section>

				<section className="owner-properties-grid">
					{visibleProperties.map((property) => (
						<article className="owner-property-card" key={property.name}>
							<div className={`owner-property-card-image ${property.tone}`}>
								<span className={`status-pill ${property.status === 'Live' ? 'live' : 'review'}`}>{property.status}</span>
								<button type="button" aria-label={`Open ${property.name}`}><FiArrowUpRight /></button>
							</div>
							<div className="owner-property-card-body">
								<div className="owner-property-card-title">
									<div>
										<h3>{property.name}</h3>
										<p><FiMapPin /> {property.area}, {property.city}</p>
									</div>
									<span className="owner-property-card-menu"><FiCheck /></span>
								</div>
								<div className="owner-property-card-metrics">
									<span><strong>{property.occupancy}%</strong><small>occupied</small></span>
									<span><strong>{property.rooms}</strong><small>rooms</small></span>
									<span><strong>{property.owner?.name || property.ownerName || property.owner}</strong><small>owner</small></span>
								</div>
								<div className="owner-property-card-actions">
									{property.status === 'Pending review' ? <Link className="owner-property-card-link" to={`/admin/properties/${property.slug || getPropertySlug(property.name)}/review`}>Review listing <FiArrowUpRight /></Link> : <span className="owner-property-review-note">{property.adminDecision === 'approved' ? property.listingFeeStatus === 'paid' ? 'Approved and published' : 'Approved · fee unpaid' : property.status}</span>}
								</div>
							</div>
						</article>
					))}
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminProperties;
