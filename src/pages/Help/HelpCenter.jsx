import { FiArrowUpRight, FiBookOpen, FiCompass, FiGrid, FiHeadphones, FiHome, FiMessageCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHome },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const ownerNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'My properties', icon: FiHome },
	{ label: 'Enquiries', icon: FiMessageCircle },
	{ label: 'Applications', icon: FiBookOpen },
];

const adminNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiCompass },
	{ label: 'Approvals', icon: FiBookOpen },
];

const HelpCenter = () => {
	const user = useSelector((state) => state.auth.user);
	const role = user?.role || 'student';
	const navigation = role === 'owner' ? ownerNavigation : role === 'admin' ? adminNavigation : studentNavigation;

	const helpCards = [
		{ title: 'Account access', text: 'Register with email verification and sign in using your email or username.', icon: FiBookOpen },
		{ title: 'Published listings', text: 'Browse and compare real property records currently published in the marketplace.', icon: FiCompass },
		{ title: 'Owner property records', text: 'Owners can create, update, and manage their own property records.', icon: FiMessageCircle },
		{ title: 'Unavailable workflows', text: 'Payments, support messages, and notifications are not connected yet. Applications and property enquiries are available in your workspace.', icon: FiHeadphones },
	];

	return (
		<DashboardLayout role={role} navigation={navigation} pageTitle="Help center">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Support</p>
						<h1>Need a hand? <span>We are here.</span></h1>
						<p className="dashboard-subtitle">Find current information about available pages and workflows.</p>
					</div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Workspace information</p>
							<h2>Available topics</h2>
						</div>
						<span>Feature availability may change</span>
					</div>
					<div className="owner-enquiries-list">
						{helpCards.map(({ title, text, icon: Icon }) => (
							<article className="owner-enquiry-card" key={title}>
								<span className="dashboard-top-avatar blue"><Icon /></span>
								<div className="owner-enquiry-card-copy">
									<strong>{title}</strong>
									<span>{text}</span>
								</div>
								<div className="owner-enquiry-card-actions">
									<a href="/contact">View <FiArrowUpRight /></a>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default HelpCenter;
