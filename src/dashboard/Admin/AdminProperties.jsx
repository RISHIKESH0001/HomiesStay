import { FiBarChart2, FiClipboard, FiHome, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataWorkspaceEmpty from '../../components/common/DataWorkspaceEmpty';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard },
];

const AdminProperties = () => (
	<DashboardLayout role="admin" navigation={adminNavigation} pageTitle="Properties">
		<main className="dashboard-content owner-workspace-page">
			<DataWorkspaceEmpty icon={FiHome} eyebrow="Marketplace inventory" title="Admin property inventory is not connected yet." description="The existing property API is owner-scoped. An administrator API is required before this page can display or moderate all database listings." linkTo="/admin/approvals" linkText="Open approvals" />
		</main>
	</DashboardLayout>
);

export default AdminProperties;
