import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiCalendar, FiMail, FiMapPin, FiPhone, FiShield, FiUser } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotFound from '../../pages/NotFound/NotFound';
import { getAdminUser } from '../../services/reviewData';

const adminNavigation = [
	{ label: 'Overview', icon: FiUser },
	{ label: 'Properties', icon: FiMapPin, count: '24' },
	{ label: 'Users', icon: FiBookOpen },
	{ label: 'Approvals', icon: FiShield, count: '12' },
];

const AdminUserDetails = () => {
	const { userId } = useParams();
	const user = getAdminUser(userId);

	if (!user) return <NotFound />;

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="User details">
			<main className="dashboard-content owner-workspace-page">
				<Link className="owner-hostel-back" to="/admin/users"><FiArrowLeft /> Back to users</Link>
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Account review · {user.role}</p>
						<h1>{user.name}<span>.</span></h1>
						<p className="dashboard-subtitle">Basic account details and platform status for this community member.</p>
					</div>
					<div className="owner-workspace-header-stat"><strong>{user.status}</strong><span>account status</span></div>
				</section>
				<section className="owner-properties-summary" aria-label="Account summary">
					<div><span>Account type</span><strong>{user.role}</strong></div>
					<div><span>Joined</span><strong>{user.joined}</strong></div>
					<div><span>{user.role === 'Student' ? 'Institution' : 'Base location'}</span><strong>{user.school}</strong></div>
					<div><span>Verification</span><strong>{user.status}</strong></div>
				</section>
				<section className="owner-workspace-panel review-details-panel">
					<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">Profile</p><h2>Basic details</h2></div><span>Account ID: {user.id}</span></div>
					<div className="review-details-grid">
						<div><FiUser /><span>Full name</span><strong>{user.name}</strong></div>
						<div><FiShield /><span>Role</span><strong>{user.role}</strong></div>
						<div><FiMail /><span>Email address</span><strong>{user.email}</strong></div>
						<div><FiPhone /><span>Phone number</span><strong>{user.phone}</strong></div>
						<div><FiMapPin /><span>{user.role === 'Student' ? 'College' : 'Location'}</span><strong>{user.school}</strong></div>
						{user.course && <div><FiBookOpen /><span>Course</span><strong>{user.course}</strong></div>}
						<div><FiCalendar /><span>Member since</span><strong>{user.joined}</strong></div>
					</div>
					{user.properties?.length > 0 && <div className="review-related-list"><h3>Associated properties</h3>{user.properties.map((property) => <span key={property}>{property}</span>)}</div>}
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminUserDetails;