import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiHome, FiMapPin, FiShield } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import { getApiErrorMessage, startStudentEnquiry } from '../../services/api';
import { getPublicProperty } from '../../services/propertyCatalog';
import NotFound from '../NotFound/NotFound';

const HostelDetails = () => {
	const { hostelId } = useParams();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const [property, setProperty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [enquiryMessage, setEnquiryMessage] = useState('');
	const [enquiryError, setEnquiryError] = useState('');
	const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);

	useEffect(() => {
		let isCurrent = true;
		getPublicProperty(hostelId)
			.then((result) => { if (isCurrent) setProperty(result); })
			.catch((error) => {
				if (!isCurrent) return;
				setLoadError(error?.response?.status === 404 ? 'This listing is not publicly available.' : getApiErrorMessage(error, 'Unable to load this listing right now.'));
			})
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [hostelId]);

	const submitEnquiry = async (event) => {
		event.preventDefault();
		if (!property || !enquiryMessage.trim() || isSendingEnquiry) return;
		setIsSendingEnquiry(true);
		setEnquiryError('');
		try {
			await startStudentEnquiry(property.id, enquiryMessage.trim());
			navigate('/dashboard/enquiries');
		} catch (error) {
			setEnquiryError(getApiErrorMessage(error, 'Your enquiry could not be sent. Please try again.'));
		} finally {
			setIsSendingEnquiry(false);
		}
	};

	if (!isLoading && (loadError || !property)) return <NotFound />;

	return (
		<>
			<NavBar />
			<main className="hostel-detail-page">
				<div className="hostel-detail-inner"><Link className="hostel-back-link" to="/hostels"><FiArrowLeft aria-hidden="true" /> Back to available stays</Link>
					{isLoading ? <p role="status">Loading listing…</p> : <>
						<section className="hostel-detail-hero"><div className="hostel-detail-image">{property.image ? <img src={property.image} alt={property.name} referrerPolicy="no-referrer" /> : <div className="property-card-image-placeholder" aria-hidden="true" />}<span><FiShield aria-hidden="true" /> Approved listing</span></div><div className="hostel-detail-summary"><p className="hostel-detail-kicker">{property.propertyType}</p><h1>{property.name}</h1><p className="hostel-detail-location"><FiMapPin aria-hidden="true" /> {property.location}</p><p className="hostel-detail-description">{property.description || 'The owner has not added a description for this listing yet.'}</p><div className="hostel-detail-price"><strong>{property.price}</strong><span>/ month</span></div><p>{property.availableBeds} of {property.capacity} beds currently available.</p></div></section>
						<section className="hostel-detail-content"><div className="hostel-detail-main"><div className="hostel-detail-section"><p className="hostel-detail-kicker">Listing details</p><h2>Information provided by the property owner</h2><div className="hostel-detail-highlights"><span><FiHome aria-hidden="true" /><strong>Property type</strong>{property.propertyType}</span><span><FiMapPin aria-hidden="true" /><strong>Nearby institution</strong>{property.college || 'Not provided'}</span><span><FiShield aria-hidden="true" /><strong>Gender policy</strong>{property.gender || 'Not specified'}</span></div></div>{property.amenities?.length > 0 && <div className="hostel-detail-section"><p className="hostel-detail-kicker">Amenities</p><h2>Available at this stay</h2><ul>{property.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul></div>}{property.images?.length > 1 && <div className="hostel-detail-section"><p className="hostel-detail-kicker">More photos</p><div className="hostel-detail-photo-grid">{property.images.slice(1).map((image) => <img key={image} src={image} alt={`${property.name} photo`} referrerPolicy="no-referrer" />)}</div></div>}{property.addressLine && <div className="hostel-detail-section"><p className="hostel-detail-kicker">Address</p><h2>{property.addressLine}</h2><p>{[property.area, property.city, property.state, property.postalCode].filter(Boolean).join(', ')}</p></div>}</div><aside className="hostel-detail-aside"><p className="hostel-detail-kicker">Contact the owner</p><h3>Have a question?</h3><p>Send a private enquiry about this listing. The conversation will be saved to your account.</p>{user?.role === 'student' ? <form className="hostel-enquiry-form" onSubmit={submitEnquiry}><label className="sr-only" htmlFor="property-enquiry">Your question</label><textarea id="property-enquiry" value={enquiryMessage} onChange={(event) => setEnquiryMessage(event.target.value)} maxLength={2000} required placeholder="Ask about availability, facilities, or a visit…" />{enquiryError && <p role="alert">{enquiryError}</p>}<button type="submit" disabled={!enquiryMessage.trim() || isSendingEnquiry}>{isSendingEnquiry ? 'Sending…' : 'Send enquiry'}</button></form> : user ? <p>Student accounts can send listing enquiries.</p> : <Link className="owner-details-link" to="/login">Sign in as a student to enquire</Link>}<Link className="owner-details-link" to={`/hostels/${hostelId}/apply`}>Apply for this stay <FiArrowLeft aria-hidden="true" /></Link></aside></section>
					</>}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default HostelDetails;
