import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiChevronRight, FiHome, FiMapPin, FiPlus, FiSearch, FiSend, FiUsers, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { createOwnerProperty, getApiErrorMessage, getOwnerProperties, submitOwnerPropertyForReview, updateOwnerProperty } from '../../services/api';
import { toOwnerProperty } from '../../services/propertyStorage';
import '../workspacePayments.css';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome },
];

const emptyForm = {
	name: '',
	propertyType: '',
	genderPolicy: 'UNISEX',
	description: '',
	addressLine: '',
	area: '',
	city: '',
	state: '',
	postalCode: '',
	nearbyInstitution: '',
	distanceKm: '',
	monthlyRent: '',
	capacity: '',
	availableBeds: '',
	images: '',
	amenities: '',
};

const getFormFromProperty = (property) => Object.fromEntries(
	Object.keys(emptyForm).map((key) => [key, key === 'images' ? (property.images || []).join('\n') : key === 'amenities' ? (property.amenities || []).join('\n') : property[key] == null ? '' : String(property[key])]),
);

const MyProperties = () => {
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('All statuses');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [formError, setFormError] = useState('');
	const [formMessage, setFormMessage] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [submittingId, setSubmittingId] = useState(null);

	const refreshProperties = useCallback(async () => {
		setLoadError('');
		try {
			const page = await getOwnerProperties({ page: 0, size: 50 });
			const ownProperties = page.content.map(toOwnerProperty);
			setProperties(ownProperties);
			return ownProperties;
		} catch (error) {
			setLoadError(getApiErrorMessage(error, 'Unable to load your properties. Please try again.'));
			return [];
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		let isCurrent = true;
		getOwnerProperties({ page: 0, size: 50 })
			.then((page) => { if (isCurrent) setProperties(page.content.map(toOwnerProperty)); })
			.catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error, 'Unable to load your properties. Please try again.')); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const visibleProperties = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return properties.filter((property) => {
			const matchesQuery = !normalizedQuery || `${property.name} ${property.area} ${property.city}`.toLowerCase().includes(normalizedQuery);
			return matchesQuery && (statusFilter === 'All statuses' || property.status === statusFilter);
		});
	}, [properties, query, statusFilter]);

	const handleFormChange = (event) => {
		setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
		setFormError('');
	};

	const closeForm = () => {
		setIsFormOpen(false);
		setEditingId(null);
		setForm(emptyForm);
		setFormError('');
	};

	const openEditForm = (property) => {
		setEditingId(property.id);
		setForm(getFormFromProperty(property));
		setFormError('');
		setIsFormOpen(true);
	};

	const handleSaveProperty = async (event) => {
		event.preventDefault();
		const capacity = Number(form.capacity);
		const availableBeds = Number(form.availableBeds);
		const monthlyRent = Number(form.monthlyRent);
		if (!Number.isInteger(capacity) || capacity < 1 || !Number.isInteger(availableBeds) || availableBeds < 0 || availableBeds > capacity || !Number.isFinite(monthlyRent) || monthlyRent <= 0) {
			setFormError('Enter a positive capacity and rent, and available beds between zero and capacity.');
			return;
		}

		const propertyRequest = {
			name: form.name.trim(),
			propertyType: form.propertyType.trim(),
			genderPolicy: form.genderPolicy,
			description: form.description.trim() || null,
			addressLine: form.addressLine.trim() || null,
			area: form.area.trim(),
			city: form.city.trim(),
			state: form.state.trim() || null,
			postalCode: form.postalCode.trim() || null,
			latitude: null,
			longitude: null,
			nearbyInstitution: form.nearbyInstitution.trim() || null,
			distanceKm: form.distanceKm === '' ? null : Number(form.distanceKm),
			monthlyRent,
			capacity,
			availableBeds,
			images: form.images.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
			amenities: form.amenities.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
		};

		setIsSaving(true);
		setFormError('');
		try {
			if (editingId) await updateOwnerProperty(editingId, propertyRequest);
			else await createOwnerProperty(propertyRequest);
			await refreshProperties();
			setFormMessage(editingId ? 'Property draft updated.' : 'Property draft saved to the database.');
			closeForm();
		} catch (error) {
			setFormError(getApiErrorMessage(error, 'Unable to save this property. Please review the details and try again.'));
		} finally {
			setIsSaving(false);
		}
	};

	const handleSubmitForReview = async (property) => {
		setSubmittingId(property.id);
		setLoadError('');
		try {
			await submitOwnerPropertyForReview(property.id);
			await refreshProperties();
			setFormMessage(`${property.name} was submitted for review.`);
		} catch (error) {
			setLoadError(getApiErrorMessage(error, 'Unable to submit this property for review. Please try again.'));
		} finally {
			setSubmittingId(null);
		}
	};

	const statuses = [...new Set(properties.map((property) => property.status))];
	const occupancy = properties.reduce((summary, property) => ({
		capacity: summary.capacity + Number(property.capacity || 0),
		occupied: summary.occupied + Number(property.capacity || 0) - Number(property.availableBeds || 0),
	}), { capacity: 0, occupied: 0 });

	return (
		<DashboardLayout role="owner" navigation={ownerNavigation} pageTitle="My properties">
			<main className="dashboard-content owner-properties-page">
				<section className="dashboard-welcome owner-properties-welcome"><div><p className="dashboard-eyebrow">Your database listings</p><h1>Manage your <span>properties.</span></h1><p className="dashboard-subtitle">Listings shown here are loaded from your signed-in owner account.</p></div><button className="dashboard-primary-action" type="button" onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(true); }}><FiPlus /> Add a property <FiArrowUpRight /></button></section>
				<section className="owner-properties-toolbar" aria-label="Find a property"><div className="owner-properties-search"><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property, area, or city" aria-label="Search properties by area" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter properties by status"><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><span className="owner-properties-result-count">{visibleProperties.length} of {properties.length} properties</span></section>
				{formMessage && <div className="owner-properties-success" role="status"><FiCheck /> {formMessage}<button type="button" onClick={() => setFormMessage('')} aria-label="Dismiss message"><FiX /></button></div>}
				{loadError && <p className="field-error" role="alert">{loadError}</p>}
				<section className="owner-properties-summary" aria-label="Portfolio summary"><div><span>Listings</span><strong>{properties.length}</strong></div><div><span>Live listings</span><strong>{properties.filter((property) => property.listingStatus === 'LIVE').length}</strong></div><div><span>Room capacity</span><strong>{occupancy.capacity}</strong></div><div><span>Occupied beds</span><strong>{occupancy.occupied}</strong></div></section>
				<div className="dashboard-section-heading owner-properties-heading"><div><p className="dashboard-eyebrow">Your records</p><h2>Properties</h2></div></div>
				{isLoading ? <p role="status">Loading your properties…</p> : visibleProperties.length ? <section className="owner-properties-grid">{visibleProperties.map((property) => <article className="owner-property-card" key={property.id}>
					<div className="owner-property-card-image">{property.images?.[0] && <img src={property.images[0]} alt={property.name} referrerPolicy="no-referrer" />}<span className={`status-pill ${property.listingStatus === 'LIVE' ? 'live' : 'review'}`}>{property.status}</span></div>
					<div className="owner-property-card-body">
						<div className="owner-property-card-title"><div><h3>{property.name}</h3><p><FiMapPin /> {property.area}, {property.city}</p></div><button type="button" className="owner-property-card-menu" onClick={() => openEditForm(property)} aria-label={`Edit ${property.name}`} title="Edit listing"><FiChevronRight /></button></div>
						<div className="owner-property-card-metrics"><span><strong>{property.capacity}</strong><small>total beds</small></span><span><strong>{property.availableBeds}</strong><small>available beds</small></span><span><strong>₹{property.rent.toLocaleString('en-IN')}</strong><small>monthly rent</small></span></div>
						{property.reviewNote && <p className="owner-property-review-note"><strong>Admin feedback:</strong> {property.reviewNote}</p>}
						<div className="owner-property-card-actions"><button type="button" className="owner-property-card-link owner-property-card-edit" onClick={() => openEditForm(property)}>Edit listing <FiChevronRight /></button>{property.listingStatus === 'DRAFT' && <button type="button" className="owner-property-card-link owner-property-submit" disabled={submittingId === property.id} onClick={() => handleSubmitForReview(property)}><FiSend /> {submittingId === property.id ? 'Submitting…' : property.reviewStatus === 'CHANGES_REQUESTED' ? 'Resubmit for review' : 'Submit for review'}</button>}<Link className="owner-property-card-link" to={`/owner/property-students/${property.id}`}><FiUsers /> Students & rent</Link>{property.listingStatus === 'LIVE' && <a className="owner-property-card-link" href={`/hostels/${property.slug}`}>View listing <FiArrowUpRight /></a>}</div>
					</div>
				</article>)}</section> : <div className="owner-properties-empty"><FiSearch /><h3>{properties.length ? 'No properties match these filters.' : 'No properties yet.'}</h3><p>{properties.length ? 'Change your search or status filter.' : 'Add your first property to save it to your account in the database.'}</p>{properties.length > 0 && <button type="button" onClick={() => { setQuery(''); setStatusFilter('All statuses'); }}>Clear filters</button>}</div>}
			</main>
			{isFormOpen && <div className="owner-property-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><section className="owner-property-modal owner-property-form-modal" role="dialog" aria-modal="true" aria-labelledby="add-property-title"><div className="owner-property-modal-heading"><div><p className="dashboard-eyebrow">Database listing</p><h2 id="add-property-title">{editingId ? 'Update property' : 'Add property'}</h2><p>Photos and amenities are saved with this listing. Payments are not connected.</p></div><button type="button" onClick={closeForm} aria-label="Close property form"><FiX /></button></div><form onSubmit={handleSaveProperty}>
				<div className="owner-form-section"><p className="owner-form-section-title">Property details</p><div className="owner-property-form-grid"><label className="owner-form-field-wide"><span>Property name *</span><input name="name" value={form.name} onChange={handleFormChange} maxLength="160" required /></label><label><span>Property type *</span><input name="propertyType" value={form.propertyType} onChange={handleFormChange} maxLength="60" required /></label><label><span>Gender policy *</span><select name="genderPolicy" value={form.genderPolicy} onChange={handleFormChange}><option value="UNISEX">Unisex</option><option value="WOMEN">Women</option><option value="MEN">Men</option></select></label><label className="owner-form-field-wide"><span>Description</span><textarea name="description" value={form.description} onChange={handleFormChange} rows="3" maxLength="10000" /></label></div></div>
				<div className="owner-form-section"><p className="owner-form-section-title">Location</p><div className="owner-property-form-grid"><label><span>Address</span><input name="addressLine" value={form.addressLine} onChange={handleFormChange} maxLength="255" /></label><label><span>Area *</span><input name="area" value={form.area} onChange={handleFormChange} maxLength="120" required /></label><label><span>City *</span><input name="city" value={form.city} onChange={handleFormChange} maxLength="120" required /></label><label><span>State</span><input name="state" value={form.state} onChange={handleFormChange} maxLength="120" /></label><label><span>Postal code</span><input name="postalCode" value={form.postalCode} onChange={handleFormChange} maxLength="20" /></label><label><span>Nearby institution</span><input name="nearbyInstitution" value={form.nearbyInstitution} onChange={handleFormChange} maxLength="180" /></label><label><span>Distance to institution (km)</span><input name="distanceKm" type="number" min="0" max="99999" step="0.01" value={form.distanceKm} onChange={handleFormChange} /></label></div></div>
				<div className="owner-form-section"><p className="owner-form-section-title">Capacity and rent</p><div className="owner-property-form-grid"><label><span>Total beds *</span><input name="capacity" type="number" min="1" step="1" value={form.capacity} onChange={handleFormChange} required /></label><label><span>Available beds *</span><input name="availableBeds" type="number" min="0" step="1" value={form.availableBeds} onChange={handleFormChange} required /></label><label><span>Monthly rent (INR) *</span><input name="monthlyRent" type="number" min="0.01" step="0.01" value={form.monthlyRent} onChange={handleFormChange} required /></label></div></div>
				<div className="owner-form-section"><p className="owner-form-section-title">Photos and amenities</p><div className="owner-property-form-grid"><label className="owner-form-field-wide"><span>Photo URLs (one HTTPS URL per line, up to 10)</span><textarea name="images" value={form.images} onChange={handleFormChange} rows="4" maxLength="20480" placeholder="https://your-image-host.example/property-1.jpg" /></label><label className="owner-form-field-wide"><span>Amenities (one per line, up to 30)</span><textarea name="amenities" value={form.amenities} onChange={handleFormChange} rows="4" maxLength="2500" placeholder={'Wi-Fi\nLaundry\nStudy area'} /></label></div></div>
				{formError && <p className="owner-property-form-error" role="alert">{formError}</p>}<div className="owner-property-form-actions"><button type="button" onClick={closeForm}>Cancel</button><button type="submit" disabled={isSaving}><FiPlus /> {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Save draft'}</button></div></form></section></div>}
		</DashboardLayout>
	);
};

export default MyProperties;
