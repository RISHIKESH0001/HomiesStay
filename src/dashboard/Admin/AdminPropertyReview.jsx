import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiHome, FiMapPin, FiShield, FiUsers, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotFound from '../../pages/NotFound/NotFound';
import { getOwnerProperties, getPropertySlug } from '../../services/propertyStorage';
import { calculateListingFee, reviewListing } from '../../services/listingWorkflow';
import '../workspacePayments.css';

const adminNavigation = [
	{ label: 'Overview', icon: FiHome },
	{ label: 'Properties', icon: FiMapPin, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiShield, count: '12' },
];

const AdminPropertyReview = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const property = getOwnerProperties().find((item) => (item.slug || getPropertySlug(item.name)) === slug);
	const [note, setNote] = useState(property?.adminNote || '');
	const [message, setMessage] = useState('');

	if (!property) return <NotFound />;

	const decide = (decision) => {
		reviewListing(slug, decision, 'Platform admin', note.trim());
		setMessage(decision === 'approved' ? 'Approved. The owner must pay the listing fee before this property is published.' : 'Changes requested. The owner can update and resubmit the property.');
		if (decision === 'approved') navigate('/admin/properties');
	};

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Review property">
			<main className="dashboard-content owner-workspace-page">
				<Link className="owner-hostel-back" to="/admin/properties"><FiArrowLeft /> Back to properties</Link>
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Property moderation</p><h1>Review <span>{property.name}.</span></h1><p className="dashboard-subtitle">Check listing completeness and suitability before the owner can pay and publish it.</p></div><div className="owner-workspace-header-stat"><strong>{property.status}</strong><span>listing status</span></div></section>
				{message && <div className="owner-properties-success" role="status">{message}</div>}
				<section className="owner-properties-summary" aria-label="Listing review summary"><div><span>Owner</span><strong>{property.owner?.name || property.ownerName || 'Property owner'}</strong></div><div><span>Rooms</span><strong>{property.capacity || (property.rooms?.split('/')[1] || '—')}</strong></div><div><span>Area</span><strong>{property.area}, {property.city}</strong></div><div><span>Estimated fee</span><strong>Rs. {calculateListingFee(property).toLocaleString('en-IN')}</strong></div></section>
				<div className="admin-property-review-layout">
					<section className="owner-workspace-panel">
						<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Submitted listing</p><h2>Property details</h2></div><span>{property.adminReviewedAt ? 'Previously reviewed' : 'Awaiting review'}</span></div>
						<div className="review-details-grid">
							<div><FiHome /><span>Property name</span><strong>{property.name}</strong></div><div><FiMapPin /><span>Location</span><strong>{property.area}, {property.city}</strong></div>
							<div><FiUsers /><span>Capacity</span><strong>{property.capacity || 'Not provided'} rooms</strong></div><div><FiShield /><span>Stay type / preference</span><strong>{property.type} · {property.gender}</strong></div>
							<div><FiMapPin /><span>Nearby campus</span><strong>{property.college}</strong></div><div><FiHome /><span>Starting rent</span><strong>Rs. {Number(property.rent).toLocaleString('en-IN')} / month</strong></div>
						</div>
						<div className="review-about"><h3>Property description</h3><p>{property.description}</p></div>
						<div className="review-related-list"><h3>Amenities</h3>{(property.amenities || []).map((amenity) => <span key={amenity}>{amenity}</span>)}</div>
						{property.photos?.length > 0 && <div className="admin-review-photos">{property.photos.slice(0, 6).map((photo) => <img src={photo} alt={`${property.name} listing`} key={photo} />)}</div>}
						<div className="review-about"><h3>Owner contact</h3><p>{property.owner?.name || 'Property owner'} · {property.owner?.phone || 'No phone provided'} · {property.owner?.email || 'No email provided'}</p></div>
					</section>
					<aside className="owner-workspace-panel admin-review-decision"><p className="dashboard-eyebrow">Decision</p><h2>Leave a note for the owner</h2><textarea value={note} onChange={(event) => setNote(event.target.value)} rows="5" maxLength="500" placeholder="Explain any changes needed or approval context." aria-label="Review note" /><p>Approval unlocks a listing fee payment. The property remains hidden until that payment succeeds.</p><button type="button" onClick={() => decide('approved')}><FiCheck /> Approve listing</button><button type="button" className="request-changes-button" onClick={() => decide('changes-requested')}><FiX /> Request changes</button>{property.status === 'Live' && <Link to={`/hostels/${slug}`} target="_blank" rel="noreferrer">View public listing</Link>}</aside>
				</div>
			</main>
		</DashboardLayout>
	);
};

export default AdminPropertyReview;
