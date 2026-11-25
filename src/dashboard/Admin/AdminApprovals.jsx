import { useCallback, useEffect, useState } from 'react';
import { FiBarChart2, FiCheck, FiClipboard, FiHome, FiMapPin, FiRefreshCw, FiSend, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAdminPropertyReviewQueue, getApiErrorMessage, reviewAdminProperty } from '../../services/api';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard },
];

const AdminApprovals = () => {
	const [properties, setProperties] = useState([]);
	const [totalElements, setTotalElements] = useState(0);
	const [notes, setNotes] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [busyId, setBusyId] = useState(null);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	const refreshQueue = useCallback(async () => {
		setIsLoading(true);
		setError('');
		try {
			const result = await getAdminPropertyReviewQueue({ page: 0, size: 50 });
			setProperties(result.content);
			setTotalElements(result.totalElements);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to load the review queue. Please try again.'));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		let isCurrent = true;
		getAdminPropertyReviewQueue({ page: 0, size: 50 })
			.then((result) => {
				if (!isCurrent) return;
				setProperties(result.content);
				setTotalElements(result.totalElements);
			})
			.catch((requestError) => {
				if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load the review queue. Please try again.'));
			})
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const handleReview = async (property, decision) => {
		const note = (notes[property.id] || '').trim();
		if (decision === 'REQUEST_CHANGES' && !note) {
			setError(`Add feedback for ${property.name} before requesting changes.`);
			return;
		}

		setBusyId(property.id);
		setError('');
		setMessage('');
		try {
			await reviewAdminProperty(property.id, decision, decision === 'REQUEST_CHANGES' ? note : null);
			setMessage(decision === 'APPROVE' ? `${property.name} is now live.` : `${property.name} was returned to its owner.`);
			setNotes((current) => {
				const next = { ...current };
				delete next[property.id];
				return next;
			});
			await refreshQueue();
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to save this review decision. Please try again.'));
		} finally {
			setBusyId(null);
		}
	};

	return (
		<DashboardLayout role="admin" navigation={adminNavigation} pageTitle="Approvals">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Moderation queue</p><h1>Review new <span>properties.</span></h1><p className="dashboard-subtitle">Approve complete listings for publication or send owners clear feedback to revise them.</p></div>
					<button className="dashboard-primary-action" type="button" onClick={refreshQueue} disabled={isLoading}><FiRefreshCw /> Refresh queue</button>
				</section>
				<div className="admin-review-summary"><span>Pending listings</span><strong>{isLoading ? '—' : totalElements}</strong></div>
				{message && <p className="admin-review-success" role="status"><FiCheck /> {message}</p>}
				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading pending listings…</p> : properties.length ? <section className="admin-review-list" aria-label="Pending property listings">
					{properties.map((property) => <article className="admin-review-card" key={property.id}>
						<div className="admin-review-card-heading"><div><p className="dashboard-eyebrow">{property.propertyType} · {property.genderPolicy}</p><h2>{property.name}</h2><p><FiMapPin /> {[property.area, property.city, property.state, property.postalCode].filter(Boolean).join(', ')}</p></div><span className="admin-review-pending">Pending review</span></div>
						<div className="admin-review-meta"><span>Listing #{property.id}</span><span>Slug: {property.slug}</span><span>Created: {property.createdAt ? new Date(property.createdAt).toLocaleString() : 'Date unavailable'}</span></div>
						{property.images?.length > 0 ? <section className="admin-review-images" aria-label={`Images for ${property.name}`}>
							{property.images.map((image, index) => <a href={image} target="_blank" rel="noreferrer" key={`${image}-${index}`} aria-label={`Open listing image ${index + 1}`}><img src={image} alt={`${property.name}, image ${index + 1}`} loading="lazy" referrerPolicy="no-referrer" /></a>)}
						</section> : <p className="admin-review-no-images">No listing images provided.</p>}
						{property.description && <section className="admin-review-section"><h3>Description</h3><p className="admin-review-description">{property.description}</p></section>}
						<section className="admin-review-section"><h3>Property details</h3><dl className="admin-review-detail-grid">
							<div><dt>Full address</dt><dd>{[property.addressLine, property.area, property.city, property.state, property.postalCode].filter(Boolean).join(', ') || 'Not provided'}</dd></div>
							<div><dt>Property type</dt><dd>{property.propertyType || 'Not provided'}</dd></div><div><dt>Gender policy</dt><dd>{property.genderPolicy || 'Not provided'}</dd></div>
							<div><dt>Monthly rent</dt><dd>{property.monthlyRent == null ? 'Not provided' : `₹${Number(property.monthlyRent).toLocaleString('en-IN')}`}</dd></div>
							<div><dt>Total capacity</dt><dd>{property.capacity ?? 'Not provided'}</dd></div><div><dt>Available beds</dt><dd>{property.availableBeds ?? 'Not provided'}</dd></div>
							<div><dt>Nearby institution</dt><dd>{property.nearbyInstitution || 'Not provided'}</dd></div><div><dt>Distance to institution</dt><dd>{property.distanceKm == null ? 'Not provided' : `${property.distanceKm} km`}</dd></div>
							<div><dt>Coordinates</dt><dd>{property.latitude == null || property.longitude == null ? 'Not provided' : `${property.latitude}, ${property.longitude}`}</dd></div>
						</dl></section>
						<section className="admin-review-section"><h3>Amenities</h3>{property.amenities?.length ? <ul className="admin-review-amenities">{property.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul> : <p className="admin-review-no-images">No amenities listed.</p>}</section>
						<section className="admin-review-section"><h3>Submitted by</h3><dl className="admin-review-detail-grid admin-review-owner"><div><dt>Owner name</dt><dd>{property.ownerName || 'Unavailable'}</dd></div><div><dt>Owner ID</dt><dd>{property.ownerId ?? 'Unavailable'}</dd></div><div><dt>Email</dt><dd>{property.ownerEmail ? <a href={`mailto:${property.ownerEmail}`}>{property.ownerEmail}</a> : 'Unavailable'}</dd></div><div><dt>Phone</dt><dd>{property.ownerPhone || 'Not provided'}</dd></div></dl></section>
						<label className="admin-review-note"><span>Feedback for owner (required to request changes)</span><textarea maxLength="1000" rows="3" value={notes[property.id] || ''} onChange={(event) => setNotes((current) => ({ ...current, [property.id]: event.target.value }))} /></label>
						<div className="admin-review-actions"><button type="button" className="admin-review-request" onClick={() => handleReview(property, 'REQUEST_CHANGES')} disabled={busyId === property.id}>{busyId === property.id ? 'Saving…' : 'Request changes'}</button><button type="button" className="admin-review-approve" onClick={() => handleReview(property, 'APPROVE')} disabled={busyId === property.id}><FiSend /> {busyId === property.id ? 'Saving…' : 'Approve & publish'}</button></div>
					</article>)}
				</section> : <section className="admin-review-empty"><FiClipboard /><h2>No pending properties.</h2><p>New owner submissions will appear here for review.</p></section>}
			</main>
		</DashboardLayout>
	);
};

export default AdminApprovals;
