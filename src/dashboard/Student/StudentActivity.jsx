import { Link } from 'react-router-dom';
import { FiCompass, FiGrid, FiMessageCircle } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const StudentActivity = () => (
	<DashboardLayout role="student" pageTitle="Activity">
		<main className="dashboard-content owner-workspace-page">
			<section className="student-applications-empty"><span><FiMessageCircle /></span><p className="dashboard-eyebrow">Your activity</p><h2>No activity feed is connected yet.</h2><p>Saved, application, and enquiry events will be shown here when those backend features are implemented.</p><Link to="/dashboard/explore-stays"><FiCompass /> Explore stays</Link><Link to="/dashboard"><FiGrid /> Dashboard</Link></section>
		</main>
	</DashboardLayout>
);

export default StudentActivity;
