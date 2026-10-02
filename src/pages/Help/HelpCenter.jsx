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
		{ title: 'Account setup', text: 'Fix profile details, role information, and saved preferences.', icon: FiBookOpen },
		{ title: 'Searching and filtering', text: 'Refine listings, compare options, and narrow the right stays faster.', icon: FiCompass },
		{ title: 'Managing enquiries', text: 'Respond, track, and keep important conversations moving.', icon: FiMessageCircle },
		{ title: 'Support channels', text: 'Reach out for technical help or marketplace guidance.', icon: FiHeadphones },
	];

	return (
		<DashboardLayout role={role} profile={{ initials: user?.initials || 'HS', name: user?.name || 'Student user', type: `${role} account` }} navigation={navigation} pageTitle="Help center">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Support</p>
						<h1>Need a hand? <span>We are here.</span></h1>
						<p className="dashboard-subtitle">Browse the most useful help guides for your role and get back to managing your listings or searching confidently.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>24/7</strong>
						<span>support</span>
					</div>
				</section>

				<section className="owner-properties-summary" aria-label="Help summary">
					<div><span>Guides</span><strong>4</strong></div>
					<div><span>Support</span><strong>Live</strong></div>
					<div><span>Response</span><strong>2h</strong></div>
					<div><span>Priority</span><strong>High</strong></div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Help guides</p>
							<h2>Popular support topics</h2>
						</div>
						<span>Curated for your account</span>
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
