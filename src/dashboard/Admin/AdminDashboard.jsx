import { FiBarChart2, FiClipboard, FiHome, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataWorkspaceEmpty from '../../components/common/DataWorkspaceEmpty';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard },
];

const AdminDashboard = () => (
	<DashboardLayout role="admin" navigation={adminNavigation} pageTitle="Admin overview">
		<main className="dashboard-content role-dashboard admin-dashboard">
			<section className="dashboard-welcome"><div><p className="dashboard-eyebrow">Platform administration</p><h1>Admin workspace.</h1><p className="dashboard-subtitle">Platform totals and activity are not shown until backed by administrator APIs.</p></div></section>
			<DataWorkspaceEmpty icon={FiBarChart2} eyebrow="Platform data" title="Admin reporting APIs are not connected yet." description="User totals, listing queues, trust metrics, and activity reports will appear after admin-scoped backend endpoints are added." linkTo="/admin/properties" linkText="View property workspace" />
		</main>
	</DashboardLayout>
);

export default AdminDashboard;
