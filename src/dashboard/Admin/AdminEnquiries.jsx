import { FiBarChart2 } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataWorkspaceEmpty from '../../components/common/DataWorkspaceEmpty';

const AdminEnquiries = () => (
	<DashboardLayout role="admin" pageTitle="Enquiries">
		<main className="dashboard-content owner-workspace-page">
			<DataWorkspaceEmpty icon={FiBarChart2} eyebrow="Marketplace activity" title="Admin-wide enquiry reporting is not connected." description="Student and owner conversations are private to their participants. This page does not expose cross-account message content or fabricated activity." />
		</main>
	</DashboardLayout>
);

export default AdminEnquiries;
