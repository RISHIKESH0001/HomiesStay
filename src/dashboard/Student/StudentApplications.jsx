import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiCompass, FiHome, FiMapPin, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApiErrorMessage, getStudentApplications, withdrawStudentApplication } from '../../services/api';
import './studentApplications.css';

const statusLabel = (status) => status.toLowerCase().replaceAll('_', ' ');

const StudentApplications = () => {
	const location = useLocation();
	const [applications, setApplications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [busyId, setBusyId] = useState(null);

	useEffect(() => {
		getStudentApplications({ page: 0, size: 50 })
			.then((page) => setApplications(page.content))
			.catch((requestError) => setError(getApiErrorMessage(requestError, 'Unable to load your applications.')))
			.finally(() => setIsLoading(false));
	}, []);

	const handleWithdraw = async (applicationId) => {
		setBusyId(applicationId);
		setError('');
		try {
			const updated = await withdrawStudentApplication(applicationId);
			setApplications((current) => current.map((application) => application.id === updated.id ? updated : application));
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to withdraw this application.'));
		} finally {
			setBusyId(null);
		}
	};

	return (
		<DashboardLayout role="student" pageTitle="My applications">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Application history</p><h1>Your stay requests.</h1><p className="dashboard-subtitle">Applications and status updates saved to your account.</p></div><Link className="dashboard-primary-action" to="/hostels"><FiCompass /> Explore stays</Link></section>
				{location.state?.submitted && <p className="student-application-success" role="status"><FiBookOpen /> Your application was submitted successfully.</p>}
				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading applications…</p> : applications.length ? <section className="owner-workspace-panel"><div className="student-applications-list">{applications.map((application) => <article className="student-application-card" key={application.id}>
						<span className="student-application-card-icon"><FiBookOpen /></span><div className="student-application-card-main"><div className="student-application-card-heading"><div><strong>{application.propertyName}</strong><span>{application.area}, {application.city}</span></div><em className={`application-status ${application.status.toLowerCase()}`}>{statusLabel(application.status)}</em></div><div className="student-application-card-meta"><span><FiCalendar /> Move-in {application.moveInDate}</span><span><FiMapPin /> {application.roomPreference}</span><span>Submitted {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ''}</span></div><p>{application.message}</p><Link className="student-application-open-link" to={`/hostels/${application.propertySlug}`}><FiHome /> View listing</Link></div>{['SUBMITTED', 'REVIEWING'].includes(application.status) && <button className="review-link" type="button" disabled={busyId === application.id} onClick={() => handleWithdraw(application.id)}><FiX /> {busyId === application.id ? 'Withdrawing…' : 'Withdraw'}</button>}</article>)}</div></section> : <section className="student-applications-empty"><span><FiBookOpen /></span><p className="dashboard-eyebrow">Application history</p><h2>No applications yet.</h2><p>Applications you submit for published stays will appear here.</p><Link to="/hostels"><FiCompass /> Explore approved stays</Link></section>}
			</main>
		</DashboardLayout>
	);
};

export default StudentApplications;
