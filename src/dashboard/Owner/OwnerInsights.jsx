import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBarChart2, FiHome } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const OwnerInsights = () => (
	<DashboardLayout role="owner" pageTitle="Insights">
		<main className="dashboard-content owner-workspace-page">
			<section className="student-applications-empty"><span><FiBarChart2 /></span><p className="dashboard-eyebrow">Property analytics</p><h2>Insights are not available yet.</h2><p>Occupancy, revenue, conversion, and recommendation data will appear when their backend metrics are implemented.</p><Link to="/owner/properties"><FiHome /> Manage properties</Link><Link to="/owner/dashboard"><FiArrowUpRight /> Owner dashboard</Link></section>
		</main>
	</DashboardLayout>
);

export default OwnerInsights;
