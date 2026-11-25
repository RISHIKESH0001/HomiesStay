import { useEffect, useState } from 'react';
import { FiBarChart2, FiClipboard, FiHome, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAdminUsers, getApiErrorMessage, liftAdminUserSuspension, suspendAdminUser, terminateAdminUser } from '../../services/api';

const adminNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard },
];

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [pageData, setPageData] = useState({ page: 0, size: 20, totalElements: 0, totalPages: 0 });
	const [searchInput, setSearchInput] = useState('');
	const [filters, setFilters] = useState({ search: '', role: '', status: '' });
	const [selectedRole, setSelectedRole] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [refreshVersion, setRefreshVersion] = useState(0);
	const [busyUserId, setBusyUserId] = useState(null);
	const [suspendingUserId, setSuspendingUserId] = useState(null);

	useEffect(() => {
		let isCurrent = true;
		getAdminUsers({ page: pageData.page, size: pageData.size, ...filters })
			.then((result) => {
				if (!isCurrent) return;
				setUsers(result.content);
				setPageData((current) => ({ ...current, totalElements: result.totalElements, totalPages: result.totalPages }));
			})
			.catch((requestError) => {
				if (isCurrent) {
					setUsers([]);
					setError(getApiErrorMessage(requestError, 'Unable to load the member directory. Please try again.'));
				}
			})
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [filters, pageData.page, pageData.size, refreshVersion]);

	const applyFilters = (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');
		setPageData((current) => ({ ...current, page: 0 }));
		setFilters({ search: searchInput.trim(), role: selectedRole, status: selectedStatus });
	};

	const changePage = (page) => {
		setIsLoading(true);
		setError('');
		setPageData((current) => ({ ...current, page }));
	};

	const handleSuspend = async (event, user) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const until = new Date(formData.get('suspendedUntil'));
		const reason = String(formData.get('reason') || '').trim();
		if (Number.isNaN(until.getTime()) || until <= new Date()) {
			setError('Choose a suspension end time in the future.');
			return;
		}
		setBusyUserId(user.id);
		setError('');
		setMessage('');
		try {
			await suspendAdminUser(user.id, { suspendedUntil: until.toISOString(), reason });
			setMessage(`${user.displayName}'s account is suspended until ${until.toLocaleString()}.`);
			setSuspendingUserId(null);
			setRefreshVersion((current) => current + 1);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to suspend this account. Please try again.'));
		} finally {
			setBusyUserId(null);
		}
	};

	const handleLiftSuspension = async (user) => {
		const reason = window.prompt(`Why are you lifting ${user.displayName}'s suspension?`);
		if (reason === null || !reason.trim()) return;
		setBusyUserId(user.id);
		setError('');
		setMessage('');
		try {
			await liftAdminUserSuspension(user.id, reason.trim());
			setMessage(`${user.displayName}'s suspension has been lifted.`);
			setRefreshVersion((current) => current + 1);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to lift this suspension. Please try again.'));
		} finally {
			setBusyUserId(null);
		}
	};

	const handleTerminate = async (user) => {
		const confirmation = window.prompt(`This permanently deletes ${user.displayName}'s account and linked listings, applications, messages, and saved homes. Type the username “${user.username}” to continue.`);
		if (confirmation === null) return;
		const reason = window.prompt('Enter the reason for permanent account deletion.');
		if (reason === null || !reason.trim()) return;
		setBusyUserId(user.id);
		setError('');
		setMessage('');
		try {
			await terminateAdminUser(user.id, confirmation, reason.trim());
			setMessage(`${user.displayName}'s account and linked data were permanently deleted.`);
			setRefreshVersion((current) => current + 1);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to delete this account. Please try again.'));
		} finally {
			setBusyUserId(null);
		}
	};

	return (
		<DashboardLayout role="admin" navigation={adminNavigation} pageTitle="Users">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Member directory</p><h1>Real account <span>records.</span></h1><p className="dashboard-subtitle">Search verified and pending accounts. Sensitive credentials are never returned.</p></div>
					<button className="dashboard-primary-action" type="button" onClick={() => { setIsLoading(true); setError(''); setFilters((current) => ({ ...current })); }} disabled={isLoading}><FiRefreshCw /> Refresh users</button>
				</section>
				<div className="admin-review-summary"><span>Accounts matching filters</span><strong>{isLoading ? '—' : pageData.totalElements}</strong></div>
				{message && <p className="admin-review-success" role="status">{message}</p>}
				<form className="admin-user-filters" onSubmit={applyFilters}>
					<label><span>Search name, username, or email</span><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} maxLength={100} placeholder="Search accounts" /></label>
					<label><span>Role</span><select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}><option value="">All roles</option><option value="STUDENT">Student</option><option value="OWNER">Owner</option><option value="ADMIN">Admin</option></select></label>
					<label><span>Status</span><select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}><option value="">All statuses</option><option value="PENDING">Pending</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option></select></label>
					<button type="submit" className="dashboard-primary-action"><FiSearch /> Apply filters</button>
				</form>
				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading accounts…</p> : users.length ? <>
					<div className="admin-user-list" aria-label="Account directory">
						{users.map((user) => <article className="admin-user-card" key={user.id}>
							<div className="admin-user-heading"><div><h2>{user.displayName}</h2><p>@{user.username}</p></div><span className={`admin-user-status admin-user-status-${user.accountStatus.toLowerCase()}`}>{user.accountStatus.replaceAll('_', ' ')}</span></div>
							<dl className="admin-review-detail-grid"><div><dt>Email</dt><dd><a href={`mailto:${user.email}`}>{user.email}</a></dd></div><div><dt>Phone</dt><dd>{user.phone || 'Not provided'}</dd></div><div><dt>Role</dt><dd>{user.role}</dd></div><div><dt>Account ID</dt><dd>{user.id}</dd></div><div><dt>Created</dt><dd>{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unavailable'}</dd></div><div><dt>Updated</dt><dd>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unavailable'}</dd></div>{user.suspendedUntil && <div><dt>Suspended until</dt><dd>{new Date(user.suspendedUntil).toLocaleString()}</dd></div>}</dl>
							{user.role !== 'ADMIN' && <div className="admin-user-actions">
								{user.accountStatus === 'ACTIVE' && <><button className="admin-user-suspend-trigger" type="button" aria-expanded={suspendingUserId === user.id} aria-controls={`suspend-user-${user.id}`} onClick={() => { setError(''); setSuspendingUserId((current) => current === user.id ? null : user.id); }}>{suspendingUserId === user.id ? 'Cancel suspension' : 'Suspend account'}</button>{suspendingUserId === user.id && <form id={`suspend-user-${user.id}`} className="admin-user-suspend" onSubmit={(event) => handleSuspend(event, user)}><label><span>Suspension ends</span><input type="datetime-local" name="suspendedUntil" required /></label><label><span>Reason</span><textarea name="reason" maxLength={500} rows={2} required placeholder="Explain the account suspension" /></label><button type="submit" disabled={busyUserId === user.id}>{busyUserId === user.id ? 'Saving…' : 'Confirm suspension'}</button></form>}</>}
								{user.accountStatus === 'SUSPENDED' && <button className="admin-user-lift" type="button" onClick={() => handleLiftSuspension(user)} disabled={busyUserId === user.id}>{busyUserId === user.id ? 'Saving…' : 'Lift suspension'}</button>}
								<button className="admin-user-terminate" type="button" onClick={() => handleTerminate(user)} disabled={busyUserId === user.id}>{busyUserId === user.id ? 'Saving…' : 'Permanently delete account'}</button>
							</div>}
						</article>)}
					</div>
					<nav className="admin-user-pagination" aria-label="Account pages"><button type="button" onClick={() => changePage(pageData.page - 1)} disabled={pageData.page === 0}>Previous</button><span>Page {pageData.page + 1} of {Math.max(1, pageData.totalPages)}</span><button type="button" onClick={() => changePage(pageData.page + 1)} disabled={pageData.page + 1 >= pageData.totalPages}>Next</button></nav>
				</> : <section className="admin-review-empty"><FiUsers /><h2>No matching accounts.</h2><p>Try changing or clearing your filters.</p></section>}
			</main>
		</DashboardLayout>
	);
};

export default AdminUsers;
