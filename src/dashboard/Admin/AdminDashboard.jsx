import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiActivity, FiAlertCircle, FiArrowUpRight, FiBarChart2, FiCheck, FiChevronRight, FiClipboard, FiFlag, FiHome, FiMessageCircle, FiShield, FiUsers, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getTimeGreeting } from '../../utils/greeting';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const initialApprovals = [
	{ name: 'Mango Tree Living', owner: 'Riya Shah', submitted: '18 min ago', type: 'New property', initials: 'MT' },
	{ name: 'Urban Nest Residency', owner: 'Karan Malhotra', submitted: '42 min ago', type: 'Updated listing', initials: 'UN' },
	{ name: 'The Courtyard', owner: 'Ananya Rao', submitted: '1 hr ago', type: 'New property', initials: 'TC' },
];

const AdminDashboard = () => {
	const username = useSelector((state) => state.auth.user?.username || state.auth.user?.name || 'Admin');
	const greeting = getTimeGreeting();
	const [approvals, setApprovals] = useState(initialApprovals);
	const [activeTab, setActiveTab] = useState('Pending approvals');
	const removeApproval = (name) => setApprovals((current) => current.filter((approval) => approval.name !== name));

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Admin overview">
			<main className="dashboard-content role-dashboard admin-dashboard">
				<section className="dashboard-welcome"><div><p className="dashboard-eyebrow">Platform control centre</p><h1>{greeting}, {username}<span>.</span></h1><p className="dashboard-subtitle">A quick read on the Homies Stay community today.</p></div><a className="dashboard-primary-action" href="#reports"><FiActivity /> View platform report <FiArrowUpRight /></a></section>

				<section className="admin-stat-grid"><div className="admin-stat-card featured"><span className="admin-stat-icon"><FiUsers /></span><p>Active students</p><strong>12,840</strong><small><FiArrowUpRight /> 8.6% this month</small><div className="admin-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-stat-card"><span className="admin-stat-icon green"><FiHome /></span><p>Live properties</p><strong>1,286</strong><small><FiArrowUpRight /> 42 this week</small></div><div className="admin-stat-card"><span className="admin-stat-icon yellow"><FiClipboard /></span><p>Pending approvals</p><strong>{approvals.length + 9}</strong><small className="attention"><FiAlertCircle /> Needs review</small></div><div className="admin-stat-card"><span className="admin-stat-icon blue"><FiShield /></span><p>Trust score</p><strong>98.4%</strong><small>All systems healthy</small></div></section>

				<section className="admin-main-grid"><div className="admin-approval-panel"><div className="admin-panel-heading"><div><p className="dashboard-eyebrow">Moderation queue</p><h2>Keep the marketplace trusted.</h2></div><span className="admin-live-status"><i /> Live</span></div><div className="admin-tabs">{['Pending approvals', 'Reported listings'].map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}{tab === 'Pending approvals' && <em>{approvals.length + 9}</em>}</button>)}</div>{activeTab === 'Pending approvals' ? approvals.map((approval) => <div className="approval-row" key={approval.name}><span className="approval-avatar">{approval.initials}</span><div><strong>{approval.name}</strong><span>{approval.type} · {approval.owner}</span></div><time>{approval.submitted}</time><button className="approval-check" type="button" aria-label={`Approve ${approval.name}`} onClick={() => removeApproval(approval.name)}><FiCheck /></button><button className="approval-dismiss" type="button" aria-label={`Dismiss ${approval.name}`} onClick={() => removeApproval(approval.name)}><FiX /></button></div>) : <div className="admin-empty-tab"><FiFlag /><strong>No reported listings</strong><span>Your community is looking good.</span></div>}<a className="admin-view-queue" href="#approvals">Open full moderation queue <FiChevronRight /></a></div><div className="admin-health-panel"><div className="admin-panel-heading"><div><p className="dashboard-eyebrow">Platform health</p><h2>Everything is steady.</h2></div><FiActivity /></div><div className="health-score"><div className="health-ring"><strong>99</strong><span>/100</span></div><div><strong>Excellent</strong><span>Last checked just now</span></div></div><div className="health-line"><span><i className="healthy-dot" /> Search & discovery</span><strong>Operational</strong></div><div className="health-line"><span><i className="healthy-dot" /> Enquiries & chat</span><strong>Operational</strong></div><a href="#status">View system status <FiArrowUpRight /></a></div></section>

				<section className="admin-bottom-grid"><div className="admin-mini-card"><span className="stat-icon blue"><FiMessageCircle /></span><div><p className="dashboard-eyebrow">Community pulse</p><h2>1,904 conversations</h2><span>Students and owners connected this month</span></div><FiArrowUpRight /></div><div className="admin-mini-card"><span className="stat-icon green"><FiBarChart2 /></span><div><p className="dashboard-eyebrow">Conversion rate</p><h2>24.8%</h2><span>Enquiry to booking, up 3.1%</span></div><FiArrowUpRight /></div></section>
			</main>
		</DashboardLayout>
	);
};

export default AdminDashboard;
