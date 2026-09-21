import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	FiBell,
	FiCompass,
	FiGrid,
	FiHeart,
	FiHelpCircle,
	FiLogOut,
	FiMenu,
	FiMessageCircle,
	FiSearch,
	FiSettings,
	FiUser,
	FiX,
} from 'react-icons/fi';
import { logout } from '../redux/authSlice';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const DashboardLayout = ({ children, role = 'student', profile, navigation = studentNavigation, pageTitle = 'Overview' }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const signedInUser = useSelector((state) => state.auth.user);
	const currentProfile = signedInUser
		? { ...profile, ...signedInUser, type: profile?.type || `${signedInUser.role || role} account` }
		: profile || { initials: 'HS', name: 'Signed-in user', type: 'Account' };
	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};
	const dashboardPath = role === 'owner' ? '/owner/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard';
	const getWorkspaceHref = (label) => label === 'Overview' ? dashboardPath : dashboardPath;

	return (
		<div className="dashboard-shell">
			{isSidebarOpen && <button className="dashboard-overlay" type="button" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />}
			<aside className={isSidebarOpen ? 'dashboard-sidebar is-open' : 'dashboard-sidebar'}>
				<div className="dashboard-brand-row">
					<a className="dashboard-brand" href="/">Homies <span>Stay</span></a>
					<button className="dashboard-close" type="button" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)}>
						<FiX />
					</button>
				</div>

				<div className="dashboard-profile">
					<a className="dashboard-avatar" href="/profile" aria-label="Open profile">{currentProfile.profileImage ? <img src={currentProfile.profileImage} alt="" /> : currentProfile.initials}</a>
					<div>
						<strong>{currentProfile.name}</strong>
						<span>{currentProfile.type}</span>
					</div>
				</div>

				<nav className="dashboard-nav" aria-label="Dashboard navigation">
					<p className="dashboard-nav-label">Workspace</p>
					{navigation.map(({ label, icon: Icon, count }, index) => (
						<a className={location.pathname === dashboardPath && ((index === 0 && !location.hash) || location.hash === `#${label.toLowerCase().replaceAll(' ', '-')}`) ? 'dashboard-nav-link active' : 'dashboard-nav-link'} href={getWorkspaceHref(label)} key={label} onClick={() => setIsSidebarOpen(false)}>
							<Icon />
							<span>{label}</span>
							{count && <em>{count}</em>}
						</a>
					))}
					<p className="dashboard-nav-label secondary">Account</p>
					<a className="dashboard-nav-link" href="/profile" onClick={() => setIsSidebarOpen(false)}><FiUser /><span>{role === 'admin' ? 'Admin profile' : role === 'owner' ? 'Business profile' : 'My profile'}</span></a>
					<a className="dashboard-nav-link" href="/settings" onClick={() => setIsSidebarOpen(false)}><FiSettings /><span>Settings</span></a>
				</nav>

				<div className="dashboard-sidebar-footer">
					<a className="dashboard-help" href="#help"><FiHelpCircle /><span>Need a little help?</span><small>Visit our help centre</small></a>
					<button className="dashboard-logout" type="button" onClick={handleLogout}><FiLogOut /><span>Log out</span></button>
				</div>
			</aside>

			<div className="dashboard-main">
				<header className="dashboard-topbar">
					<button className="dashboard-menu" type="button" aria-label="Open navigation" onClick={() => setIsSidebarOpen(true)}><FiMenu /></button>
					<div className="dashboard-breadcrumb"><span>Workspace</span><b>/</b><strong>{pageTitle}</strong></div>
					<div className="dashboard-top-actions">
						<button className="dashboard-icon-button" type="button" aria-label="Search"><FiSearch /></button>
						<button className="dashboard-icon-button notification-button" type="button" aria-label="Notifications"><FiBell /><i /></button>
						<a className="dashboard-top-avatar" href="/profile" aria-label="Open profile">{currentProfile.profileImage ? <img src={currentProfile.profileImage} alt="" /> : currentProfile.initials}</a>
					</div>
				</header>
				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
