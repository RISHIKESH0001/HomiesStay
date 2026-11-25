import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiCheck, FiHome, FiMapPin } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { createStudentApplication, getApiErrorMessage } from '../../services/api';
import { getPublicProperty } from '../../services/propertyCatalog';
import './studentApplications.css';

const StudentApply = () => {
	const { hostelId } = useParams();
	const navigate = useNavigate();
	const [property, setProperty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const today = new Date();
	const minMoveInDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

	useEffect(() => {
		let isCurrent = true;
		getPublicProperty(hostelId)
			.then((result) => { if (isCurrent) setProperty(result); })
			.catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError, 'This listing is not available.')); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [hostelId]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setError('');
		setIsSubmitting(true);
		try {
			await createStudentApplication(property.id, {
				moveInDate: formData.get('moveInDate'),
				roomPreference: formData.get('roomPreference'),
				message: formData.get('message'),
			});
			navigate('/dashboard/applications', { replace: true, state: { submitted: true } });
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to submit your application. Please try again.'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<DashboardLayout role="student" pageTitle="Apply for a stay">
			<main className="dashboard-content owner-workspace-page">
				{property && <Link className="owner-hostel-back" to={`/hostels/${hostelId}`}><FiArrowLeft /> Back to stay</Link>}
				{isLoading ? <p role="status">Loading listing…</p> : property ? <div className="student-application-layout">
					<section className="owner-workspace-panel student-application-form">
						<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Application</p><h1>Apply to {property.name}</h1><p>Your registered name and contact details will be shared with this property owner.</p></div></div>
						<form onSubmit={handleSubmit}>
							<div className="student-form-section">
								<div className="student-form-heading"><span>01</span><div><h2>Your move-in details</h2><p>Choose the date you hope to move in and the room type you need.</p></div></div>
								<div className="student-form-grid"><label><span>Preferred move-in date *</span><input type="date" name="moveInDate" min={minMoveInDate} required /></label><label><span>Room preference *</span><input name="roomPreference" maxLength="80" placeholder="e.g. Single room or shared room" required /></label></div>
							</div>
							<div className="student-form-section"><label className="student-message-field"><span>Message to the property owner *</span><textarea name="message" maxLength="2000" rows="5" placeholder="Introduce yourself and share anything the owner should know about your stay request." required /></label></div>
							{error && <p className="field-error" role="alert">{error}</p>}
							<div className="student-application-submit"><p><FiCheck /> Submission saves an application record to your account and shares your registered contact details with this owner.</p><button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit application'}</button></div>
						</form>
					</section>
					<aside className="student-application-summary"><p className="dashboard-eyebrow">Selected listing</p><span className="student-application-stay-icon"><FiHome /></span><h2>{property.name}</h2><p><FiMapPin /> {[property.area, property.city].filter(Boolean).join(', ')}</p><div className="student-application-summary-line"><span>Monthly rent</span><strong>{property.price}</strong></div><div className="student-application-summary-line"><span>Available beds</span><strong>{property.availableBeds} of {property.capacity}</strong></div><div className="student-application-summary-note"><FiCalendar /> An application is not a booking and does not reserve a bed.</div></aside>
				</div> : <section className="student-applications-empty"><span><FiHome /></span><p className="dashboard-eyebrow">Applications</p><h2>Unable to open this listing.</h2><p>{error || 'This listing is no longer publicly available.'}</p><Link to="/hostels"><FiHome /> Browse approved stays</Link></section>}
			</main>
		</DashboardLayout>
	);
};

export default StudentApply;
