import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiCheck, FiClipboard, FiClock, FiHome, FiShield, FiUsers, FiX } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getListingReviewQueue } from '../../services/listingWorkflow';
import '../workspacePayments.css';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const initialApprovals = [
	{ name: 'Mango Tree Living', owner: 'Riya Shah', ownerId: 'riya-shah', reason: 'New property submitted', time: '18 min ago', initials: 'MT' },
	{ name: 'Urban Nest Residency', owner: 'Karan Malhotra', ownerId: 'karan-malhotra', reason: 'Updated listing details', time: '42 min ago', initials: 'UN' },
	{ name: 'The Courtyard', owner: 'Ananya Rao', ownerId: 'ananya-rao', reason: 'New listing submitted', time: '1 hr ago', initials: 'TC' },
];

const AdminApprovals = () => {
	const [approvals, setApprovals] = useState(initialApprovals);
	const approve = (name) => setApprovals((current) => current.filter((item) => item.name !== name));

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Approvals">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Moderation queue</p>
						<h1>Review the next list of <span>submission approvals.</span></h1>
						<p className="dashboard-subtitle">Check submissions, approve the right listings, and keep platform trust strong.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{approvals.length}</strong>
						<span>pending</span>
					</div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Queue</p>
							<h2>Pending approvals</h2>
						</div>
						<span>Review before publish</span>
					</div>
					<div className="owner-enquiries-list">
						{approvals.map((approval) => (
							<article className="owner-enquiry-card" key={approval.name}>
								<span className="dashboard-top-avatar">{approval.initials}</span>
								<div className="owner-enquiry-card-copy">
									<strong>{approval.name}</strong>
									<b>{approval.owner}</b>
									<span>{approval.reason}</span>
									<small><FiClock /> {approval.time}</small>
								</div>
								<div className="owner-enquiry-card-actions">
									<em className="new">Pending</em>
									<Link className="review-link" to={`/admin/users/${approval.ownerId}`}><FiShield /> Review owner</Link>
									<button type="button" onClick={() => approve(approval.name)}><FiCheck /> Approve</button>
									<button type="button" onClick={() => approve(approval.name)}><FiX /> Dismiss</button>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading"><div><p className="dashboard-eyebrow">New listing review</p><h2>Owner submissions</h2></div><span>{getListingReviewQueue().length} awaiting decision</span></div>
					<div className="owner-enquiries-list">
						{getListingReviewQueue().length ? getListingReviewQueue().map((property) => <article className="owner-enquiry-card" key={property.slug}><span className="dashboard-top-avatar"><FiHome /></span><div className="owner-enquiry-card-copy"><strong>{property.name}</strong><b>{property.owner?.name || 'Property owner'}</b><span>{property.area}, {property.city} · {property.capacity} rooms · Rs. {Number(property.rent).toLocaleString('en-IN')} / month</span><small><FiClock /> Submitted for review</small></div><div className="owner-enquiry-card-actions"><em className="new">{property.status}</em><Link className="review-link" to={`/admin/properties/${property.slug}/review`}><FiShield /> Review listing</Link></div></article>) : <p className="admin-review-empty">No new owner listings are waiting for review.</p>}
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminApprovals;
