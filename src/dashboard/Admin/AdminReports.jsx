import { FiActivity, FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiHome, FiMessageCircle, FiShield, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const AdminReports = () => {
	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Reports">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Platform report</p>
						<h1>See the health of the <span>entire marketplace.</span></h1>
						<p className="dashboard-subtitle">Track student activity, trust signals, and listing quality from one clear performance summary.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>99</strong>
						<span>/100 score</span>
					</div>
				</section>

				<section className="owner-properties-summary" aria-label="Marketplace report summary">
					<div><span>Students</span><strong>12,840</strong></div>
					<div><span>Listings</span><strong>1,286</strong></div>
					<div><span>Approvals</span><strong>19</strong></div>
					<div><span>Trust</span><strong>98.4%</strong></div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Operational view</p>
							<h2>Marketplace health</h2>
						</div>
						<span>Updated just now</span>
					</div>
					<div className="owner-enquiries-list">
						<article className="owner-enquiry-card">
							<span className="dashboard-top-avatar green"><FiActivity /></span>
							<div className="owner-enquiry-card-copy">
								<strong>Search and discovery are operating normally.</strong>
								<span>Listings are loading correctly and user search behavior remains stable.</span>
							</div>
							<div className="owner-enquiry-card-actions"><em className="new">Healthy</em></div>
						</article>
						<article className="owner-enquiry-card">
							<span className="dashboard-top-avatar blue"><FiShield /></span>
							<div className="owner-enquiry-card-copy">
								<strong>Trust signals remain strong.</strong>
								<span>Moderation queue is below target and verification coverage is steady.</span>
							</div>
							<div className="owner-enquiry-card-actions"><em className="waiting">Stable</em></div>
						</article>
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminReports;
