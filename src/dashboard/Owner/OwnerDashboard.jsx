import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiBarChart2, FiHome, FiPlus } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApiErrorMessage, getOwnerProperties } from '../../services/api';
import { toOwnerProperty } from '../../services/propertyStorage';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome },
];

const OwnerDashboard = () => {
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let isCurrent = true;
		getOwnerProperties({ page: 0, size: 50 })
			.then((page) => { if (isCurrent) setProperties(page.content.map(toOwnerProperty)); })
			.catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load your properties.')); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	return (
		<DashboardLayout role="owner" navigation={ownerNavigation} pageTitle="Owner overview">
			<main className="dashboard-content role-dashboard owner-dashboard">
				<section className="dashboard-welcome"><div><p className="dashboard-eyebrow">Owner workspace</p><h1>Your properties.</h1><p className="dashboard-subtitle">Manage property information saved to your Homies Stay account.</p></div><a className="dashboard-primary-action" href="/owner/properties"><FiPlus /> Manage properties <FiArrowUpRight /></a></section>
				<section className="owner-properties-summary" aria-label="Property summary"><div><span>Your listings</span><strong>{isLoading ? '—' : properties.length}</strong></div><div><span>Live listings</span><strong>{isLoading ? '—' : properties.filter((property) => property.listingStatus === 'LIVE').length}</strong></div><div><span>Draft listings</span><strong>{isLoading ? '—' : properties.filter((property) => property.listingStatus === 'DRAFT').length}</strong></div><div><span>Pending review</span><strong>{isLoading ? '—' : properties.filter((property) => property.listingStatus === 'PENDING_REVIEW').length}</strong></div></section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Database records</p><h2>Your listings</h2></div><a href="/owner/properties">Manage all <FiArrowUpRight /></a></div>{error ? <p role="alert">{error}</p> : isLoading ? <p role="status">Loading your properties…</p> : properties.length ? <div className="owner-enquiries-list">{properties.slice(0, 5).map((property) => <article className="owner-enquiry-card" key={property.id}><span className="dashboard-top-avatar"><FiHome /></span><div className="owner-enquiry-card-copy"><strong>{property.name}</strong><span>{property.area}, {property.city}</span><small>{property.status} · {property.availableBeds} of {property.capacity} beds available</small></div></article>)}</div> : <div className="owner-properties-empty"><FiHome /><h3>No property records yet.</h3><p>Add a property to create the first real listing record.</p><a href="/owner/properties">Add a property <FiArrowUpRight /></a></div>}</section>
				<section className="owner-workspace-panel"><div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Other workspace data</p><h2>Payments and analytics</h2></div></div><p>Payments and analytics are not connected to backend services yet, so no sample records or simulated metrics are displayed.</p><a href="/owner/enquiries">Open your enquiry inbox <FiArrowUpRight /></a></section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerDashboard;
