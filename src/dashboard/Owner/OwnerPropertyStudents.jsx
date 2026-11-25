import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiHome, FiMail, FiMapPin, FiPhone, FiUsers, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApiErrorMessage, getOwnerApplications, getOwnerProperties } from '../../services/api';
import { toOwnerProperty } from '../../services/propertyStorage';
import './ownerPropertyStudents.css';

const statusLabel = (status) => status.toLowerCase().replaceAll('_', ' ');

const OwnerPropertyStudents = () => {
	const { propertyId } = useParams();
	const [property, setProperty] = useState(null);
	const [applications, setApplications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let isCurrent = true;
		Promise.all([
			getOwnerProperties({ page: 0, size: 50 }),
			getOwnerApplications({ page: 0, size: 50 }),
		])
			.then(([propertyPage, applicationPage]) => {
				if (!isCurrent) return;
				const ownedProperty = propertyPage.content
					.map(toOwnerProperty)
					.find((item) => String(item.id) === String(propertyId));
				setProperty(ownedProperty || null);
				setApplications(applicationPage.content.filter((application) => String(application.propertyId) === String(propertyId)));
			})
			.catch((requestError) => {
				if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load students for this stay.'));
			})
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [propertyId]);

	const summary = useMemo(() => ({
		residents: applications.filter((application) => application.status === 'ACCEPTED').length,
		pending: applications.filter((application) => ['SUBMITTED', 'REVIEWING'].includes(application.status)).length,
		closed: applications.filter((application) => ['DECLINED', 'WITHDRAWN'].includes(application.status)).length,
	}), [applications]);

	return (
		<DashboardLayout role="owner" pageTitle="Students & rent">
			<main className="dashboard-content owner-workspace-page owner-property-students">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Stay residents</p><h1>{property?.name || 'Students for this stay'}.</h1><p className="dashboard-subtitle">Review application status and resident contact details for this property only.</p></div>
					<Link className="dashboard-primary-action" to="/owner/properties"><FiArrowLeft /> Back to properties</Link>
				</section>

				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading students…</p> : !property ? (
					<section className="student-applications-empty"><span><FiHome /></span><p className="dashboard-eyebrow">Property not found</p><h2>This stay is not in your account.</h2><Link to="/owner/properties">View my properties</Link></section>
				) : (
					<>
						<section className="owner-property-students-summary" aria-label="Resident summary">
							<div><span><FiCheck /> Accepted residents</span><strong>{summary.residents}</strong></div>
							<div><span><FiClock /> Pending applications</span><strong>{summary.pending}</strong></div>
							<div><span><FiX /> Closed applications</span><strong>{summary.closed}</strong></div>
							<div><span><FiUsers /> Total applications</span><strong>{applications.length}</strong></div>
						</section>

						{property && <section className="owner-property-students-location"><FiMapPin /><div><strong>{property.area}, {property.city}</strong><span>{property.capacity} beds · {property.availableBeds} available · ₹{property.rent.toLocaleString('en-IN')} monthly rent</span></div></section>}

						{applications.length ? <section className="owner-workspace-panel"><div className="owner-property-students-list">{applications.map((application) => (
							<article className="owner-property-student-card" key={application.id}>
								<span className="dashboard-top-avatar">{application.studentName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
								<div className="owner-property-student-copy"><div className="owner-property-student-heading"><strong>{application.studentName}</strong><em className={application.status.toLowerCase()}>{statusLabel(application.status)}</em></div><span><FiMapPin /> {application.roomPreference}</span><span><FiCalendar /> Move-in {application.moveInDate}</span><p>{application.message}</p><div className="owner-property-student-contact"><a href={`mailto:${application.studentEmail}`}><FiMail /> {application.studentEmail}</a>{application.studentPhone && <a href={`tel:${application.studentPhone}`}><FiPhone /> {application.studentPhone}</a>}</div></div>
								<Link className="review-link" to={`/owner/applications`}>Manage application</Link>
							</article>
						))}</div></section> : <section className="student-applications-empty"><span><FiUsers /></span><p className="dashboard-eyebrow">No applicants</p><h2>No students have applied to this stay.</h2><p>Accepted residents and pending applications will appear here as they are received.</p></section>}
					</>
				)}
			</main>
		</DashboardLayout>
	);
};

export default OwnerPropertyStudents;
