import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiCalendar, FiHome, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotFound from '../../pages/NotFound/NotFound';
import { getPropertySlug } from '../../services/propertyStorage';
import { getStudentApplication } from '../../services/reviewData';

const ownerNavigation = [
	{ label: 'Overview', icon: FiHome },
	{ label: 'My properties', icon: FiMapPin, count: '3' },
	{ label: 'Enquiries', icon: FiMail, count: '8' },
	{ label: 'Applications', icon: FiBookOpen, count: '5' },
];

const OwnerStudentDetails = () => {
	const { studentId } = useParams();
	const application = getStudentApplication(studentId);

	if (!application) return <NotFound />;

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Student details">
			<main className="dashboard-content owner-workspace-page">
				<Link className="owner-hostel-back" to="/owner/applications"><FiArrowLeft /> Back to applications</Link>
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Applicant profile · {application.status}</p>
						<h1>{application.name}<span>.</span></h1>
						<p className="dashboard-subtitle">Review the student’s basic details and accommodation request before making a decision.</p>
					</div>
					<div className="owner-workspace-header-stat"><strong>{application.moveIn}</strong><span>requested move-in</span></div>
				</section>
				<section className="owner-properties-summary" aria-label="Student application summary">
					<div><span>Requested property</span><strong>{application.property}</strong></div>
					<div><span>Room preference</span><strong>{application.room}</strong></div>
					<div><span>Student status</span><strong>{application.status}</strong></div>
					<div><span>Expected duration</span><strong>{application.duration || 'Not specified'}</strong></div>
				</section>
				<section className="owner-workspace-panel review-details-panel">
					<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Student profile</p><h2>Basic details</h2></div><span>Application ID: {application.id}</span></div>
					<div className="review-details-grid">
						<div><FiUser /><span>Full name</span><strong>{application.name}</strong></div>
						<div><FiMail /><span>Email address</span><strong>{application.email}</strong></div>
						<div><FiPhone /><span>Phone number</span><strong>{application.phone}</strong></div>
						<div><FiMapPin /><span>College and course</span><strong>{application.course}</strong></div>
						<div><FiBookOpen /><span>Room preference</span><strong>{application.room}</strong></div>
						<div><FiCalendar /><span>Move-in date</span><strong>{application.moveIn}</strong></div>
						<div><FiHome /><span>Monthly budget</span><strong>{application.monthlyBudget ? `Rs. ${Number(application.monthlyBudget).toLocaleString('en-IN')}` : 'Not specified'}</strong></div>
						<div><FiMapPin /><span>Gender preference</span><strong>{application.genderPreference || 'No preference'}</strong></div>
						<div><FiBookOpen /><span>Food preference</span><strong>{application.foodPreference || 'No preference'}</strong></div>
					</div>
					{application.needs?.length > 0 && <div className="review-related-list"><h3>Stay preferences</h3>{application.needs.map((need) => <span key={need}>{need}</span>)}</div>}
					<div className="review-about"><h3>About the stay request</h3><p>{application.about}</p></div>
					<Link className="dashboard-primary-action review-related-link" to={`/hostels/${getPropertySlug(application.property)}`}>View requested property</Link>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerStudentDetails;