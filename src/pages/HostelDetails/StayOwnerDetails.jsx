import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiMail, FiMapPin, FiPhone, FiShield, FiUser } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import NotFound from '../NotFound/NotFound';
import { getStoredProperty, getPropertySlug } from '../../services/propertyStorage';

const StayOwnerDetails = () => {
	const { hostelId } = useParams();
	const property = getStoredProperty(hostelId);

	if (!property) return <NotFound />;

	const owner = property.owner || { name: 'Riya Shah', role: 'Property owner' };
	const ownerLocation = owner.location || `${property.city || 'Bengaluru'}`;

	return (
		<>
			<NavBar />
			<main className="hostel-detail-page">
				<div className="hostel-detail-inner">
					<Link className="hostel-back-link" to={`/hostels/${hostelId}`}><FiArrowLeft /> Back to {property.name}</Link>
					<section className="dashboard-welcome owner-workspace-welcome stay-owner-welcome">
						<div><p className="dashboard-eyebrow">Listing contact</p><h1>Meet the <span>property owner.</span></h1><p className="dashboard-subtitle">Basic host details for the stay you are viewing.</p></div>
						<div className="owner-workspace-header-stat"><strong>{property.status || 'Live'}</strong><span>listing status</span></div>
					</section>
					<section className="owner-properties-summary" aria-label="Property owner summary">
						<div><span>Owner</span><strong>{owner.name || 'Property owner'}</strong></div>
						<div><span>Role</span><strong>{owner.role || 'Property owner'}</strong></div>
						<div><span>Location</span><strong>{ownerLocation}</strong></div>
						<div><span>Listed property</span><strong>{property.name}</strong></div>
					</section>
					<section className="owner-workspace-panel review-details-panel">
						<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Owner profile</p><h2>Basic details</h2></div><span>Property-specific contact</span></div>
						<div className="review-details-grid">
							<div><FiUser /><span>Contact person</span><strong>{owner.name || 'Property owner'}</strong></div>
							<div><FiShield /><span>Account type</span><strong>{owner.role || 'Property owner'}</strong></div>
							<div><FiMapPin /><span>Property location</span><strong>{property.area}, {property.city}</strong></div>
							{owner.phone && <div><FiPhone /><span>Phone number</span><strong><a href={`tel:${owner.phone}`}>{owner.phone}</a></strong></div>}
							{owner.email && <div><FiMail /><span>Email address</span><strong><a href={`mailto:${owner.email}`}>{owner.email}</a></strong></div>}
							<div><FiHome /><span>Property</span><strong><Link to={`/hostels/${getPropertySlug(property.name)}`}>{property.name}</Link></strong></div>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default StayOwnerDetails;