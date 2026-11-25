import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	FiBell,
	FiBarChart2,
	FiBookOpen,
	FiClipboard,
	FiCompass,
	FiCreditCard,
	FiClock,
	FiGrid,
	FiHeart,
	FiHelpCircle,
	FiHome,
	FiLogOut,
	FiMenu,
	FiMessageCircle,
	FiSearch,
	FiSettings,
	FiUser,
	FiUsers,
	FiX,
} from 'react-icons/fi';
import { logoutUser } from '../redux/authSlice';
import { getNotificationUnreadCount } from '../services/api';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
	{ label: 'My Stay', icon: FiHome },
	{ label: 'Applications', icon: FiClipboard },
	{ label: 'Activity', icon: FiClock },
	{ label: 'Notifications', icon: FiBell },
];

const ownerNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'My properties', icon: FiHome },
	{ label: 'Enquiries', icon: FiMessageCircle },
	{ label: 'Applications', icon: FiBookOpen },
	{ label: 'Rent & payments', icon: FiCreditCard },
	{ label: 'Insights', icon: FiBarChart2 },
	{ label: 'Notifications', icon: FiBell },
];

const adminNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Properties', icon: FiHome },
	{ label: 'Users', icon: FiUsers },
	{ label: 'Approvals', icon: FiClipboard },
	{ label: 'Enquiries', icon: FiMessageCircle },
	{ label: 'Reports', icon: FiBarChart2 },
	{ label: 'Notifications', icon: FiBell },
];

const DashboardLayout = ({ children, role = 'student', profile, navigation = studentNavigation, pageTitle = 'Overview' }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const searchInputRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const signedInUser = useSelector((state) => state.auth.user);
	const [unreadCount, setUnreadCount] = useState(0);
	useEffect(() => {
		let isCurrent = true;
		const refreshCount = () => getNotificationUnreadCount().then((count) => { if (isCurrent) setUnreadCount(count); }).catch(() => {});
		refreshCount();
		const interval = window.setInterval(refreshCount, 60000);
		window.addEventListener('focus', refreshCount);
		window.addEventListener('homies:notifications-updated', refreshCount);
		return () => {
			isCurrent = false;
			window.clearInterval(interval);
			window.removeEventListener('focus', refreshCount);
			window.removeEventListener('homies:notifications-updated', refreshCount);
		};
	}, []);
	const currentProfile = signedInUser
		? { ...profile, ...signedInUser, type: profile?.type || `${signedInUser.role || role} account` }
		: profile || { initials: 'HS', name: 'Signed-in user', type: 'Account' };
	useEffect(() => {
		if (isSearchOpen) searchInputRef.current?.focus();
	}, [isSearchOpen]);
	const handleDashboardSearch = (event) => {
		event.preventDefault();
		const query = searchQuery.trim();
		if (!query) return;
		setIsSearchOpen(false);
		navigate(`/search-results?q=${encodeURIComponent(query)}`);
	};
	const handleLogout = async () => {
		try {
			await dispatch(logoutUser()).unwrap();
			navigate('/', { replace: true });
		} catch {
			window.alert('Unable to sign out. Check your connection and try again.');
		}
	};
	const dashboardPath = role === 'owner' ? '/owner/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard';
	const workspaceNavigation = role === 'student'
		? studentNavigation
		: role === 'owner'
			? ownerNavigation
			: role === 'admin'
				? adminNavigation
				: navigation;
	const getWorkspaceHref = (label) => {
		if (role === 'student' && label === 'Overview') return '/dashboard';
		if (role === 'owner' && label === 'My properties') return '/owner/properties';
		if (role === 'owner' && label === 'Enquiries') return '/owner/enquiries';
		if (role === 'owner' && label === 'Applications') return '/owner/applications';
		if (role === 'owner' && label === 'Rent & payments') return '/owner/rent';
		if (role === 'owner' && label === 'Insights') return '/owner/insights';
		if (role === 'owner' && label === 'Notifications') return '/owner/notifications';
		if (role === 'student' && label === 'Explore stays') return '/dashboard/explore-stays';
		if (role === 'student' && label === 'Saved homes') return '/dashboard/saved-homes';
		if (role === 'student' && label === 'My enquiries') return '/dashboard/enquiries';
		if (role === 'student' && label === 'Applications') return '/dashboard/applications';
		if (role === 'student' && label === 'My Stay') return '/dashboard/my-stay';
		if (role === 'student' && label === 'Activity') return '/dashboard/activity';
		if (role === 'student' && label === 'Notifications') return '/dashboard/notifications';
		if (role === 'admin' && label === 'Properties') return '/admin/properties';
		if (role === 'admin' && label === 'Users') return '/admin/users';
		if (role === 'admin' && label === 'Approvals') return '/admin/approvals';
		if (role === 'admin' && label === 'Enquiries') return '/admin/enquiries';
		if (role === 'admin' && label === 'Reports') return '/admin/reports';
		if (role === 'admin' && label === 'Notifications') return '/admin/notifications';
		return dashboardPath;
	};

	return (
		<div className="dashboard-shell">
			{isSidebarOpen && <button className="dashboard-overlay" type="button" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />}
			<aside className={isSidebarOpen ? 'dashboard-sidebar is-open' : 'dashboard-sidebar'}>
				<div className="dashboard-brand-row">
					<Link className="dashboard-brand" to="/">Homies <span>Stay</span></Link>
					<button className="dashboard-close" type="button" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)}>
						<FiX />
					</button>
				</div>

				<div className="dashboard-profile">
					<Link className="dashboard-avatar" to="/profile" aria-label="Open profile">{currentProfile.profileImage ? <img src={currentProfile.profileImage} alt="" /> : currentProfile.initials}</Link>
					<div>
						<strong>{currentProfile.name}</strong>
						<span>{currentProfile.type}</span>
					</div>
				</div>

				<nav className="dashboard-nav" aria-label="Dashboard navigation">
					<p className="dashboard-nav-label">Workspace</p>
					{workspaceNavigation.map(({ label, icon: Icon, count }) => (
						<Link className={`dashboard-nav-link${location.pathname === getWorkspaceHref(label) || (getWorkspaceHref(label) !== dashboardPath && location.pathname.startsWith(`${getWorkspaceHref(label)}/`)) ? ' active' : ''}${label === 'Notifications' ? ' notification-sidebar-link' : ''}`} to={getWorkspaceHref(label)} key={label} onClick={() => setIsSidebarOpen(false)}>
							<Icon />
							<span>{label}</span>
							{label === 'Notifications' && unreadCount > 0 ? <em>{unreadCount > 99 ? '99+' : unreadCount}</em> : count && <em>{count}</em>}
						</Link>
					))}
					<p className="dashboard-nav-label secondary">Account</p>
					<Link className="dashboard-nav-link" to="/profile" onClick={() => setIsSidebarOpen(false)}><FiUser /><span>{role === 'admin' ? 'Admin profile' : role === 'owner' ? 'Business profile' : 'My profile'}</span></Link>
					<Link className="dashboard-nav-link" to="/settings" onClick={() => setIsSidebarOpen(false)}><FiSettings /><span>Settings</span></Link>
				</nav>

				<div className="dashboard-sidebar-footer">
					<Link className="dashboard-help" to="/help"><FiHelpCircle /><span>Need a little help?</span><small>Visit our help centre</small></Link>
					<button className="dashboard-logout" type="button" onClick={handleLogout}><FiLogOut /><span>Log out</span></button>
				</div>
			</aside>

			<div className="dashboard-main">
				<header className="dashboard-topbar">
					<button className="dashboard-menu" type="button" aria-label="Open navigation" onClick={() => setIsSidebarOpen(true)}><FiMenu /></button>
					<div className="dashboard-breadcrumb"><span>Workspace</span><b>/</b><strong>{pageTitle}</strong></div>
					<div className="dashboard-top-actions">
						<button className="dashboard-icon-button" type="button" aria-label="Search listings" aria-expanded={isSearchOpen} aria-controls="dashboard-global-search" onClick={() => setIsSearchOpen((open) => !open)}><FiSearch /></button>
						<Link className="dashboard-icon-button notification-button" to={role === 'owner' ? '/owner/notifications' : role === 'admin' ? '/admin/notifications' : '/dashboard/notifications'} aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'} title="Notifications"><FiBell />{unreadCount > 0 && <em>{unreadCount > 99 ? '99+' : unreadCount}</em>}</Link>
						<Link className="dashboard-top-avatar" to="/profile" aria-label="Open profile">{currentProfile.profileImage ? <img src={currentProfile.profileImage} alt="" /> : currentProfile.initials}</Link>
					</div>
					{isSearchOpen && <form id="dashboard-global-search" className="dashboard-global-search" role="search" onSubmit={handleDashboardSearch}>
						<FiSearch aria-hidden="true" />
						<input ref={searchInputRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search published stays" aria-label="Search published stays" maxLength={120} />
						<button type="submit" disabled={!searchQuery.trim()}>Search</button>
						<button className="dashboard-global-search-close" type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search"><FiX /></button>
					</form>}
				</header>
				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
