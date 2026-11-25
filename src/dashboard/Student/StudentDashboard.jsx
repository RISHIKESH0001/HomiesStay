import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { getPublicProperties } from '../../services/propertyCatalog';
import { getTimeGreeting } from '../../utils/greeting';
import useStudentSavedHomes from '../../hooks/useStudentSavedHomes';

const StudentDashboard = () => {
	const user = useSelector((state) => state.auth.user);
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const { isSaved, isSaving, toggleSavedHome, actionMessage } = useStudentSavedHomes();
	const greetingName = user?.name?.trim().split(/\s+/)[0] || 'there';
	const greeting = getTimeGreeting(new Date(), user?.timeZone || user?.timezone);

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties({ size: 3 })
			.then((page) => { if (isCurrent) setProperties(page.content); })
			.catch(() => { if (isCurrent) setLoadError('Approved listings are temporarily unavailable.'); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	return (
		<DashboardLayout pageTitle="Overview">
			<main className="dashboard-content">
				<section className="dashboard-welcome">
					<div><p className="dashboard-eyebrow">Student workspace</p><h1>{greeting}, {greetingName}<span>.</span></h1><p className="dashboard-subtitle">Browse currently approved stays or search for a location.</p></div>
					<a className="dashboard-primary-action" href="/dashboard/explore-stays"><FiSearch /> Explore stays <FiArrowUpRight /></a>
				</section>
				<div className="dashboard-section-heading" id="explore"><div><p className="dashboard-eyebrow">From published listings</p><h2>Available stays</h2></div><a href="/hostels">View all <FiArrowUpRight /></a></div>
				{actionMessage && <p role="status" aria-live="polite">{actionMessage}</p>}
				{isLoading ? <p role="status">Loading approved listings…</p> : loadError ? <p role="alert">{loadError}</p> : properties.length ? <section className="property-grid">{properties.map((property) => <PropertyCard key={property.id} hostel={property} showSave saved={isSaved(property.id)} saving={isSaving(property.id)} onToggleSave={toggleSavedHome} />)}</section> : <section className="hostels-empty"><h3>No approved stays yet.</h3><p>Published listings will appear here when available.</p></section>}
			</main>
		</DashboardLayout>
	);
};

export default StudentDashboard;
