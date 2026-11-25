import { useEffect, useMemo, useState } from 'react';
import { FiCompass, FiGrid, FiHeart, FiMapPin, FiMessageCircle, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { getPublicProperties } from '../../services/propertyCatalog';
import useStudentSavedHomes from '../../hooks/useStudentSavedHomes';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const StudentExplore = () => {
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [query, setQuery] = useState('');
	const [type, setType] = useState('All stays');
	const { isSaved, isSaving, toggleSavedHome, actionMessage } = useStudentSavedHomes();

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties()
			.then((page) => { if (isCurrent) setProperties(page.content); })
			.catch(() => { if (isCurrent) setLoadError('Approved listings are temporarily unavailable.'); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const propertyTypes = useMemo(() => [...new Set(properties.map((property) => property.propertyType).filter(Boolean))], [properties]);
	const visibleProperties = useMemo(() => properties.filter((property) => {
		const searchText = `${property.name} ${property.location} ${property.college} ${property.propertyType}`.toLowerCase();
		return (!query || searchText.includes(query.toLowerCase())) && (type === 'All stays' || property.propertyType === type);
	}), [properties, query, type]);

	return (
		<DashboardLayout role="student" navigation={studentNavigation} pageTitle="Explore stays">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Find your next base</p><h1>Explore currently <span>published stays.</span></h1><p className="dashboard-subtitle">Listings and details below come directly from the Homies Stay database.</p></div><div className="owner-workspace-header-stat"><strong>{isLoading ? '—' : properties.length}</strong><span>approved listings</span></div></section>
				<section className="owner-workspace-toolbar"><div className="owner-properties-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by area, property, or institution" aria-label="Search stays" /></div><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by stay type"><option>All stays</option>{propertyTypes.map((propertyType) => <option key={propertyType}>{propertyType}</option>)}</select><span>{visibleProperties.length} stays</span></section>
				{actionMessage && <p role="status" aria-live="polite">{actionMessage}</p>}
				{isLoading ? <p role="status">Loading approved listings…</p> : loadError ? <p role="alert">{loadError}</p> : visibleProperties.length ? <section className="property-grid">{visibleProperties.map((property) => <PropertyCard key={property.id} hostel={property} showSave saved={isSaved(property.id)} saving={isSaving(property.id)} onToggleSave={toggleSavedHome} />)}</section> : <section className="hostels-empty"><FiMapPin /><h3>{properties.length ? 'No matching stays.' : 'No approved stays yet.'}</h3><p>{properties.length ? 'Try changing the search or stay type.' : 'Approved database listings will appear here when available.'}</p></section>}
			</main>
		</DashboardLayout>
	);
};

export default StudentExplore;
