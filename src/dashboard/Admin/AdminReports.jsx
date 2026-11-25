import { FiBarChart2 } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataWorkspaceEmpty from '../../components/common/DataWorkspaceEmpty';

const AdminReports = () => (
	<DashboardLayout role="admin" pageTitle="Reports">
		<main className="dashboard-content owner-workspace-page">
			<DataWorkspaceEmpty icon={FiBarChart2} eyebrow="Platform reports" title="Reporting data is not connected yet." description="Marketplace totals, trust metrics, and service health will appear after real reporting endpoints are implemented." />
		</main>
	</DashboardLayout>
);

export default AdminReports;
