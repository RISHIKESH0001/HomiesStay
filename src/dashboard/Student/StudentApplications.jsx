import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiCompass, FiHome, FiMessageCircle, FiPlus } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getApplications } from '../../services/applicationStorage';
import { getPropertySlug } from '../../services/propertyStorage';
import { studentApplications as sampleApplications } from '../../services/reviewData';
import './studentApplications.css';

const studentNavigation = [
	{ label: 'Overview', icon: FiHome },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiCheckCircle },
	{ label: 'My enquiries', icon: FiMessageCircle },	
	{ label: 'Applications', icon: FiBookOpen },
];

const StudentApplications = () => {
	const user = useSelector((state) => state.auth.user);
	const [searchParams] = useSearchParams();
	const studentId = user?.id || user?.email || user?.username || user?.name;
	const applications = getApplications(sampleApplications).filter((application) => application.studentId === studentId);

	return (
		<DashboardLayout role="student" profile={{ initials: (user?.name || 'ST').slice(0, 2).toUpperCase(), name: user?.name || 'Student user', type: 'Student account' }} navigation={studentNavigation} pageTitle="My applications">
			<main className="dashboard-content owner-workspace-page">
				{searchParams.get('submitted') && <div className="owner-properties-success student-application-success" role="status"><FiCheckCircle /> Application sent. You can follow its status here.</div>}
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Your applications</p><h1>Keep your next stay <span>moving forward.</span></h1><p className="dashboard-subtitle">Track owner responses and revisit the details you shared for each stay.</p></div>
					<div className="owner-workspace-header-stat"><strong>{applications.length}</strong><span>applications sent</span></div>
				</section>
				{applications.length ? (
					<section className="owner-workspace-panel">
						<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Application history</p><h2>Submitted stays</h2></div><span>Most recent first</span></div>
						<div className="student-applications-list">
							{[...applications].sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt)).map((application) => (
								<article className="student-application-card" key={application.id}>
									<div className="student-application-card-icon"><FiHome /></div>
									<div className="student-application-card-main">
										<div className="student-application-card-heading"><div><strong>{application.property}</strong><span>{application.propertyLocation || application.city || 'Stay application'}</span></div><em className={`application-status ${application.status.toLowerCase()}`}>{application.status}</em></div>
										<div className="student-application-card-meta"><span><FiBookOpen /> {application.course}</span><span><FiCalendar /> Move-in {application.moveIn}</span><span><FiClock /> {application.duration}</span></div>
										<p>{application.roomPreference || application.room} · Budget Rs. {Number(application.monthlyBudget || 0).toLocaleString('en-IN')} / month</p>
										<Link to={`/hostels/${application.propertySlug || getPropertySlug(application.property)}`} className="student-application-open-link">View stay <FiArrowUpRight /></Link>
									</div>
								</article>
							))}
						</div>
					</section>
				) : (
					<section className="student-applications-empty">
						<span><FiMessageCircle /></span><p className="dashboard-eyebrow">No applications yet</p><h2>Your shortlist can become a place to live.</h2><p>Open a stay that feels right and send the owner your move-in date and preferences.</p><Link to="/hostels"><FiPlus /> Explore stays</Link>
					</section>
				)}
			</main>
		</DashboardLayout>
	);
};

export default StudentApplications;
