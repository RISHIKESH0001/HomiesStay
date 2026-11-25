import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCalendar, FiCheck, FiClipboard, FiHome, FiMail, FiPhone, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApiErrorMessage, getOwnerApplications, updateOwnerApplicationStatus } from '../../services/api';

const statusLabel = (status) => status.toLowerCase().replaceAll('_', ' ');

const OwnerApplications = () => {
	const [applications, setApplications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [busyId, setBusyId] = useState(null);

	useEffect(() => {
		getOwnerApplications({ page: 0, size: 50 })
			.then((page) => setApplications(page.content))
			.catch((requestError) => setError(getApiErrorMessage(requestError, 'Unable to load student applications.')))
			.finally(() => setIsLoading(false));
	}, []);

	const changeStatus = async (applicationId, status) => {
		setBusyId(applicationId);
		setError('');
		try {
			const updated = await updateOwnerApplicationStatus(applicationId, status);
			setApplications((current) => current.map((application) => application.id === updated.id ? updated : application));
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to update this application.'));
		} finally {
			setBusyId(null);
		}
	};

	return (
		<DashboardLayout role="owner" pageTitle="Applications">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Student applications</p><h1>Stay requests for your properties.</h1><p className="dashboard-subtitle">Applications are visible only to the owner of the selected property.</p></div><Link className="dashboard-primary-action" to="/owner/properties"><FiHome /> Manage properties <FiArrowUpRight /></Link></section>
				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading applications…</p> : applications.length ? <section className="owner-workspace-panel"><div className="owner-applications-list">{applications.map((application) => <article className="owner-application-card" key={application.id}>
						<span className="dashboard-top-avatar">{application.studentName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
						<div className="owner-application-copy"><strong>{application.studentName}</strong><b>{application.propertyName}</b><span>{application.roomPreference}</span><small><FiCalendar /> Move-in {application.moveInDate}</small><p>{application.message}</p><span><a href={`mailto:${application.studentEmail}`}><FiMail /> {application.studentEmail}</a>{application.studentPhone && <> · <a href={`tel:${application.studentPhone}`}><FiPhone /> {application.studentPhone}</a></>}</span><Link className="review-link" to={`/hostels/${application.propertySlug}`}><FiHome /> View property</Link></div>
						<div className="owner-application-status"><em className={application.status.toLowerCase()}>{statusLabel(application.status)}</em>{application.status === 'SUBMITTED' && <div><button type="button" disabled={busyId === application.id} onClick={() => changeStatus(application.id, 'REVIEWING')}>Mark reviewing</button><button type="button" disabled={busyId === application.id} onClick={() => changeStatus(application.id, 'ACCEPTED')}><FiCheck /> Accept</button><button type="button" disabled={busyId === application.id} onClick={() => changeStatus(application.id, 'DECLINED')}><FiX /> Decline</button></div>}{application.status === 'REVIEWING' && <div><button type="button" disabled={busyId === application.id} onClick={() => changeStatus(application.id, 'ACCEPTED')}><FiCheck /> Accept</button><button type="button" disabled={busyId === application.id} onClick={() => changeStatus(application.id, 'DECLINED')}><FiX /> Decline</button></div>}</div>
					</article>)}</div></section> : <section className="student-applications-empty"><span><FiClipboard /></span><p className="dashboard-eyebrow">Student applications</p><h2>No applications yet.</h2><p>Applications submitted for your properties will appear here.</p><Link to="/owner/properties"><FiHome /> Manage properties</Link></section>}
			</main>
		</DashboardLayout>
	);
};

export default OwnerApplications;
