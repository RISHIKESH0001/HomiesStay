import { Link } from 'react-router-dom';
import { FiCompass, FiGrid, FiHeart, FiMessageCircle } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import useStudentSavedHomes from '../../hooks/useStudentSavedHomes';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const StudentSavedHomes = () => {
	const { savedHomes, isLoading, loadError, actionMessage, isSaving, toggleSavedHome } = useStudentSavedHomes();
	return (
	<DashboardLayout role="student" navigation={studentNavigation} pageTitle="Saved homes">
		<main className="dashboard-content owner-workspace-page">
			<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Your shortlist</p><h1>Your saved <span>homes.</span></h1><p className="dashboard-subtitle">Keep approved stays here while comparing your options.</p></div><div className="owner-workspace-header-stat"><strong>{isLoading ? '—' : savedHomes.length}</strong><span>saved homes</span></div></section>
			{actionMessage && <p role="status" aria-live="polite">{actionMessage}</p>}
			{isLoading ? <p role="status">Loading your saved homes…</p> : loadError ? <p role="alert">{loadError}</p> : savedHomes.length ? <section className="property-grid">{savedHomes.map((property) => <PropertyCard key={property.id} hostel={property} showSave saved saving={isSaving(property.id)} onToggleSave={toggleSavedHome} />)}</section> : <section className="student-applications-empty"><span><FiHeart /></span><p className="dashboard-eyebrow">Saved homes</p><h2>Your shortlist is empty.</h2><p>Save any approved stay you want to compare later.</p><Link to="/dashboard/explore-stays"><FiCompass /> Explore stays</Link></section>}
		</main>
	</DashboardLayout>
)};

export default StudentSavedHomes;
