import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiClipboard, FiHome, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminUsers as users } from '../../services/reviewData';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome, count: '24' },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard, count: '12' },
];

const AdminUsers = () => {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('All users');

	const visibleUsers = useMemo(() => users.filter((user) => {
		const matchesQuery = !query || `${user.name} ${user.role} ${user.school}`.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter === 'All users' || user.role === filter;
		return matchesQuery && matchesFilter;
	}), [filter, query]);

	return (
		<DashboardLayout role="admin" profile={{ initials: 'AD', name: 'Aarav Desai', type: 'Platform administrator' }} navigation={adminNavigation} pageTitle="Users">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Member directory</p>
						<h1>Stay close to the people <span>building the community.</span></h1>
						<p className="dashboard-subtitle">Review platform accounts, verify identities, and keep ownership and student access healthy.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{users.length}</strong>
						<span>accounts</span>
					</div>
				</section>

				<section className="owner-workspace-toolbar">
					<div className="owner-properties-search">
						<FiSearch />
						<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users, roles, or campuses" aria-label="Search users" />
					</div>
					<select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter users">
						<option>All users</option>
						<option>Student</option>
						<option>Owner</option>
					</select>
					<span>{visibleUsers.length} people</span>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Community</p>
							<h2>User activity</h2>
						</div>
						<span>Updated just now</span>
					</div>
					<div className="owner-enquiries-list">
						{visibleUsers.map((user) => (
							<article className="owner-enquiry-card" key={user.name}>
								<span className="dashboard-top-avatar">{user.initials}</span>
								<div className="owner-enquiry-card-copy">
									<strong>{user.name}</strong>
									<b>{user.role}</b>
									<span>{user.school}</span>
								</div>
								<div className="owner-enquiry-card-actions">
									<em className="new">{user.status}</em>
									<Link className="review-link" to={`/admin/users/${user.id}`}><FiShield /> Review</Link>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default AdminUsers;
