import { FiArrowUpRight, FiBookmark, FiCalendar, FiCompass, FiGrid, FiHeart, FiMessageCircle } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const timeline = [
	{ title: 'You saved The Olive House', detail: 'Yesterday at 6:42 PM', tone: 'green', icon: FiBookmark },
	{ title: 'Enquiry sent to Casa Nook', detail: 'Monday at 10:15 AM', tone: 'yellow', icon: FiMessageCircle },
	{ title: 'Profile checklist is 92% complete', detail: 'Updated this week', tone: 'blue', icon: FiCalendar },
];

const StudentActivity = () => {
	return (
		<DashboardLayout role="student" profile={{ initials: 'ST', name: 'Student user', type: 'Student account' }} navigation={studentNavigation} pageTitle="Activity">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Your recent actions</p>
						<h1>Stay on top of your <span>next move.</span></h1>
						<p className="dashboard-subtitle">Everything you have saved, asked, and discovered is tracked here so your search remains clear and calm.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{timeline.length}</strong>
						<span>updates</span>
					</div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Timeline</p>
							<h2>Recent activity</h2>
						</div>
						<span>Latest first</span>
					</div>
					<div className="owner-enquiries-list">
						{timeline.map(({ title, detail, tone, icon: Icon }) => (
							<article className="owner-enquiry-card" key={title}>
								<span className={`dashboard-top-avatar ${tone}`}><Icon /></span>
								<div className="owner-enquiry-card-copy">
									<strong>{title}</strong>
									<span>{detail}</span>
								</div>
								<div className="owner-enquiry-card-actions">
									<a href="/dashboard/explore-stays">Open <FiArrowUpRight /></a>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default StudentActivity;
