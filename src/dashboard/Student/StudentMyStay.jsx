import { Link } from 'react-router-dom';
import { FiCompass, FiHome } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const StudentMyStay = () => (
	<DashboardLayout role="student" pageTitle="My Stay">
		<main className="dashboard-content owner-workspace-page">
			<section className="student-applications-empty"><span><FiHome /></span><p className="dashboard-eyebrow">Resident workspace</p><h2>No stay records are connected yet.</h2><p>Resident stays and rent schedules will appear here after application and payment services are implemented. No payment or rent data is being simulated.</p><Link to="/hostels"><FiCompass /> Explore approved stays</Link></section>
		</main>
	</DashboardLayout>
);

export default StudentMyStay;
