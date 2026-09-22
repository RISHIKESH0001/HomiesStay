import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiArrowUpRight, FiBarChart2, FiCheck, FiChevronRight, FiClipboard, FiHome, FiMapPin, FiMessageCircle, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { roomBengaluru1, roomModern2, roomPune1 } from '../../assets/hostelImages';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getPropertySlug, readStoredProperties, saveStoredProperty } from '../../services/propertyStorage';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const initialProperties = [
	{ name: 'The Olive House', area: 'Koramangala', city: 'Bengaluru', occupancy: 92, rooms: '46 / 50', status: 'Live', tone: 'olive', image: roomBengaluru1, rent: '₹12,500' },
	{ name: 'Casa Nook', area: 'HSR Layout', city: 'Bengaluru', occupancy: 84, rooms: '21 / 25', status: 'Live', tone: 'sunset', image: roomModern2, rent: '₹10,800' },
	{ name: 'Mango Tree Living', area: 'Indiranagar', city: 'Bengaluru', occupancy: 68, rooms: '17 / 25', status: 'Review', tone: 'blue', image: roomPune1, rent: '₹9,600' },
];

const emptyForm = {
	name: '',
	type: 'Private rooms and co-living',
	gender: 'Unisex',
	area: '',
	city: 'Bengaluru',
	college: '',
	distance: '',
	description: '',
	rooms: '',
	rent: '',
	amenities: 'Wi-Fi, Housekeeping, Power backup',
	ownerName: 'Riya Shah',
	ownerPhone: '',
	ownerEmail: '',
	photos: [],
};

const MyProperties = () => {
	const signedInUser = useSelector((state) => state.auth.user);
	const ownerId = signedInUser?.id || signedInUser?.email || signedInUser?.username || 'owner-1';
	const [properties, setProperties] = useState(() => [...initialProperties, ...readStoredProperties()]);
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('All statuses');
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [formError, setFormError] = useState('');
	const [savedMessage, setSavedMessage] = useState('');

	const visibleProperties = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return properties.filter((property) => {
			const matchesQuery = !normalizedQuery || [property.name, property.area, property.city].some((value) => value.toLowerCase().includes(normalizedQuery));
			const matchesStatus = statusFilter === 'All statuses' || property.status === statusFilter;
			return matchesQuery && matchesStatus;
		});
	}, [properties, query, statusFilter]);

	const handleFormChange = (event) => {
		setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
		setFormError('');
	};

	const handlePhotoChange = (event) => {
		const files = Array.from(event.target.files || []).slice(0, 6);
		Promise.all(files.map((file) => new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		}))).then((photos) => setForm((currentForm) => ({ ...currentForm, photos }))).catch(() => setFormError('We could not read one of those photos. Please try again.'));
		setFormError('');
	};

	const handleAddProperty = (event) => {
		event.preventDefault();
		if (!form.name.trim() || !form.area.trim() || !form.city.trim() || !form.college.trim() || !form.distance.trim() || !form.description.trim() || !form.rooms.trim() || !form.rent.trim() || !form.ownerName.trim() || !form.ownerPhone.trim() || !form.ownerEmail.trim() || !form.photos.length || !form.amenities.trim()) {
			setFormError('Complete the required listing, location, contact, amenity, and photo details before publishing.');
			return;
		}
		if (!Number.isInteger(Number(form.rooms)) || Number(form.rooms) <= 0 || !Number.isFinite(Number(form.rent)) || Number(form.rent) <= 0) {
			setFormError('Enter a valid positive room count and monthly rent.');
			return;
		}

		const nextProperty = {
			ownerId,
			slug: getPropertySlug(form.name),
			name: form.name.trim(),
			type: form.type,
			gender: form.gender,
			area: form.area.trim(),
			city: form.city,
			college: form.college.trim(),
			distance: form.distance.trim(),
			commute: `${form.distance.trim()} to ${form.college.trim()}`,
			description: form.description.trim(),
			occupancy: 0,
			rooms: `0 / ${form.rooms.trim()}`,
			capacity: Number(form.rooms),
			status: 'Live',
			tone: 'new',
			image: form.photos[0],
			photos: form.photos,
			rent: Number(form.rent),
			rating: 'New',
			reviews: '0',
			amenities: form.amenities.split(',').map((amenity) => amenity.trim()).filter(Boolean),
			owner: { name: form.ownerName.trim(), phone: form.ownerPhone.trim(), email: form.ownerEmail.trim() },
		};
		saveStoredProperty(nextProperty);
		setProperties((currentProperties) => [...currentProperties, nextProperty]);
		setForm(emptyForm);
		setFormError('');
		setSavedMessage('Property saved as a draft.');
		setIsAddOpen(false);
	};

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="My properties">
			<main className="dashboard-content owner-properties-page">
				<section className="dashboard-welcome owner-properties-welcome">
					<div><p className="dashboard-eyebrow">Your portfolio</p><h1>Properties that <span>feel like home.</span></h1><p className="dashboard-subtitle">Keep every listing, room count, and area detail in one calm workspace.</p></div>
					<button className="dashboard-primary-action" type="button" onClick={() => setIsAddOpen(true)}><FiPlus /> Add a property <FiArrowUpRight /></button>
				</section>

				<section className="owner-properties-toolbar" aria-label="Find a property">
					<div className="owner-properties-search"><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property, area, or city" aria-label="Search properties by area" /></div>
					<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter properties by status"><option>All statuses</option><option>Live</option><option>Review</option><option>Draft</option></select>
					<span className="owner-properties-result-count">{visibleProperties.length} of {properties.length} properties</span>
				</section>

				{savedMessage && <div className="owner-properties-success" role="status"><FiCheck /> {savedMessage}<button type="button" onClick={() => setSavedMessage('')} aria-label="Dismiss message"><FiX /></button></div>}

				<section className="owner-properties-summary" aria-label="Portfolio summary">
					<div><span>Live properties</span><strong>{properties.filter((property) => property.status === 'Live').length}</strong></div>
					<div><span>Total rooms</span><strong>{properties.reduce((total, property) => total + Number(property.rooms.split('/')[1]), 0)}</strong></div>
					<div><span>Average occupancy</span><strong>{Math.round(properties.reduce((total, property) => total + property.occupancy, 0) / properties.length)}%</strong></div>
					<div><span>Areas covered</span><strong>{new Set(properties.map((property) => property.area)).size}</strong></div>
				</section>

				<div className="dashboard-section-heading owner-properties-heading"><div><p className="dashboard-eyebrow">All your spaces</p><h2>Manage properties</h2></div><span>{query ? `Showing results for “${query}”` : 'Updated a few minutes ago'}</span></div>
				{visibleProperties.length ? <section className="owner-properties-grid">{visibleProperties.map((property) => <article className="owner-property-card" key={`${property.name}-${property.area}`}>
					<div className={`owner-property-card-image ${property.tone}`} style={{ backgroundImage: `url(${property.image})` }}><span className={`status-pill ${property.status === 'Live' ? 'live' : 'review'}`}>{property.status}</span><button type="button" aria-label={`Open ${property.name}`}><FiArrowUpRight /></button></div>
					<div className="owner-property-card-body"><div className="owner-property-card-title"><div><h3>{property.name}</h3><p><FiMapPin /> {property.area}, {property.city}</p></div><span className="owner-property-card-menu"><FiChevronRight /></span></div><div className="owner-property-card-metrics"><span><strong>{property.occupancy}%</strong><small>occupied</small></span><span><strong>{property.rooms}</strong><small>rooms filled</small></span><span><strong>{typeof property.rent === 'number' ? `₹${property.rent.toLocaleString('en-IN')}` : property.rent}</strong><small>from / month</small></span></div><a className="owner-property-card-link" href={`/hostels/${property.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}>View property <FiArrowUpRight /></a></div>
				</article>)}</section> : <div className="owner-properties-empty"><FiSearch /><h3>No properties found</h3><p>Try another property name, area, or city.</p><button type="button" onClick={() => { setQuery(''); setStatusFilter('All statuses'); }}>Clear filters</button></div>}

				<section className="owner-add-property-prompt"><div><p className="dashboard-eyebrow">Growing your portfolio?</p><h2>Bring your next space to life.</h2><p>Add a property as a draft, then complete the details when you are ready to publish it.</p></div><button type="button" onClick={() => setIsAddOpen(true)}><FiPlus /> Add property</button></section>
			</main>

			{isAddOpen && <div className="owner-property-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddOpen(false); }}><section className="owner-property-modal owner-property-form-modal" role="dialog" aria-modal="true" aria-labelledby="add-property-title"><div className="owner-property-modal-heading"><div><p className="dashboard-eyebrow">New listing</p><h2 id="add-property-title">Publish a property</h2><p>Give students enough detail to choose your space with confidence.</p></div><button type="button" onClick={() => setIsAddOpen(false)} aria-label="Close add property form"><FiX /></button></div><form onSubmit={handleAddProperty}><div className="owner-form-section"><p className="owner-form-section-title">Property basics</p><div className="owner-property-form-grid"><label className="owner-form-field-wide"><span>Property name *</span><input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. The Green Courtyard" /></label><label><span>Stay type *</span><select name="type" value={form.type} onChange={handleFormChange}><option>Private rooms and co-living</option><option>Shared rooms and co-living</option><option>Student hostel</option><option>Premium co-living</option><option>Shared apartments</option></select></label><label><span>Gender preference *</span><select name="gender" value={form.gender} onChange={handleFormChange}><option>Unisex</option><option>Female</option><option>Male</option></select></label></div></div><div className="owner-form-section"><p className="owner-form-section-title">Location and commute</p><div className="owner-property-form-grid"><label><span>Area / neighbourhood *</span><input name="area" value={form.area} onChange={handleFormChange} placeholder="e.g. Bellandur" /></label><label><span>City *</span><select name="city" value={form.city} onChange={handleFormChange}><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option><option>Kolkata</option></select></label><label><span>Nearby college *</span><input name="college" value={form.college} onChange={handleFormChange} placeholder="e.g. Christ University" /></label><label><span>Distance / commute *</span><input name="distance" value={form.distance} onChange={handleFormChange} placeholder="e.g. 12 min by bus" /></label></div></div><div className="owner-form-section"><p className="owner-form-section-title">Pricing and stay details</p><div className="owner-property-form-grid"><label><span>Total rooms *</span><input name="rooms" value={form.rooms} onChange={handleFormChange} inputMode="numeric" placeholder="30" /></label><label><span>Starting rent / month *</span><input name="rent" value={form.rent} onChange={handleFormChange} inputMode="numeric" placeholder="9500" /></label><label className="owner-form-field-wide"><span>What students should know *</span><textarea name="description" value={form.description} onChange={handleFormChange} rows="3" placeholder="Describe the atmosphere, room setup, and what makes this stay a good fit." /></label><label className="owner-form-field-wide"><span>Amenities *</span><input name="amenities" value={form.amenities} onChange={handleFormChange} placeholder="Wi-Fi, Laundry, Study lounge, Power backup" /><small>Separate amenities with commas.</small></label></div></div><div className="owner-form-section"><p className="owner-form-section-title">Photos and owner contact</p><div className="owner-property-form-grid"><label className="owner-form-field-wide"><span>Property photos * (up to 6)</span><input name="photos" type="file" accept="image/*" multiple onChange={handlePhotoChange} /><small>{form.photos.length ? `${form.photos.length} photo${form.photos.length > 1 ? 's' : ''} selected` : 'Add clear room, common area, and exterior photos.'}</small></label><label><span>Contact person *</span><input name="ownerName" value={form.ownerName} onChange={handleFormChange} placeholder="Owner or manager name" /></label><label><span>Phone number *</span><input name="ownerPhone" value={form.ownerPhone} onChange={handleFormChange} inputMode="tel" placeholder="+91 98765 43210" /></label><label className="owner-form-field-wide"><span>Email address *</span><input name="ownerEmail" value={form.ownerEmail} onChange={handleFormChange} type="email" placeholder="owner@example.com" /></label></div></div>{formError && <p className="owner-property-form-error" role="alert">{formError}</p>}<div className="owner-property-form-actions"><button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button type="submit"><FiPlus /> Publish listing</button></div></form></section></div>}
		</DashboardLayout>
	);
};

export default MyProperties;
