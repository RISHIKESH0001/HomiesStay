import { FiArrowUpRight, FiBarChart2, FiBell, FiChevronRight, FiMessageCircle, FiTrendingUp, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiUsers },
	{ label: 'Enquiries', icon: FiMessageCircle },
	{ label: 'Applications', icon: FiChevronRight },
];

const OwnerInsights = () => {
	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Insights">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Performance snapshot</p>
						<h1>Turn interest into <span>stronger bookings.</span></h1>
						<p className="dashboard-subtitle">This page turns your property data into quick recommendations so you know what to improve next.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>12.4%</strong>
						<span>growth</span>
					</div>
				</section>

				<section className="owner-properties-summary" aria-label="Owner insights summary">
					<div><span>Occupancy</span><strong>84%</strong></div>
					<div><span>Enquiries</span><strong>8</strong></div>
					<div><span>Response time</span><strong>2h</strong></div>
					<div><span>Conversion</span><strong>24%</strong></div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Insights</p>
							<h2>What is moving performance</h2>
						</div>
						<span>Updated this week</span>
					</div>
					<div className="owner-enquiries-list">
						<article className="owner-enquiry-card">
							<span className="dashboard-top-avatar green"><FiTrendingUp /></span>
							<div className="owner-enquiry-card-copy">
								<strong>Tuesday is your strongest enquiry day.</strong>
								<span>Best-performing response window is between 7 PM and 9 PM.</span>
							</div>
							<div className="owner-enquiry-card-actions"><em className="new">High impact</em></div>
						</article>
						<article className="owner-enquiry-card">
							<span className="dashboard-top-avatar warm"><FiBell /></span>
							<div className="owner-enquiry-card-copy">
								<strong>Offer a flexible move-in plan.</strong>
								<span>Students are more likely to convert when move-in dates are flexible within 2 weeks.</span>
							</div>
							<div className="owner-enquiry-card-actions"><em className="waiting">Recommended</em></div>
						</article>
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default OwnerInsights;
