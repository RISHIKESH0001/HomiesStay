import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiBell, FiBookOpen, FiCheck, FiCheckCircle, FiClock, FiCompass, FiCreditCard, FiGrid, FiHeart, FiHome, FiInfo, FiMessageCircle, FiShield, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/workspaceActivity';
import './workspaceActivity.css';

const roleDetails = {
	student: { pageTitle: 'Notifications', eyebrow: 'Student updates', title: 'Stay in the loop.', description: 'Application updates, rent reminders, and replies about the stays you are considering.' },
	owner: { pageTitle: 'Notifications', eyebrow: 'Owner updates', title: 'Your properties, at a glance.', description: 'Listing review decisions, student applications, and payment reminders for your workspace.' },
	admin: { pageTitle: 'Notifications', eyebrow: 'Platform activity', title: 'Signals that need attention.', description: 'New property submissions and student activity that may need platform review.' },
};

const iconForKind = (kind) => kind === 'success' ? FiCheckCircle : kind === 'warning' ? FiShield : kind === 'neutral' ? FiClock : FiInfo;

const WorkspaceNotifications = ({ role }) => {
	const user = useSelector((state) => state.auth.user);
	const config = roleDetails[role];
	const [filter, setFilter] = useState('All');
	const [, setRefresh] = useState(0);
	const notifications = getNotifications(role, user);
	const visibleNotifications = notifications.filter((notification) => filter === 'All' || (filter === 'Unread' ? !notification.read : notification.read));
	const unreadCount = notifications.filter((notification) => !notification.read).length;
	const dashboardNavigation = role === 'student'
		? [{ label: 'Overview', icon: FiGrid }, { label: 'Explore stays', icon: FiCompass }, { label: 'Saved homes', icon: FiHeart }, { label: 'My enquiries', icon: FiMessageCircle }, { label: 'My Stay', icon: FiHome }, { label: 'Applications', icon: FiBookOpen }, { label: 'Notifications', icon: FiBell }]
		: role === 'owner'
			? [{ label: 'Overview', icon: FiGrid }, { label: 'My properties', icon: FiHome }, { label: 'Enquiries', icon: FiMessageCircle }, { label: 'Applications', icon: FiBookOpen }, { label: 'Rent & payments', icon: FiCreditCard }, { label: 'Notifications', icon: FiBell }]
			: [{ label: 'Overview', icon: FiGrid }, { label: 'Properties', icon: FiHome }, { label: 'Users', icon: FiUsers }, { label: 'Approvals', icon: FiShield }, { label: 'Enquiries', icon: FiMessageCircle }, { label: 'Notifications', icon: FiBell }];

	const markAllRead = () => {
		markAllNotificationsRead(user, notifications);
		setRefresh((value) => value + 1);
	};

	const openNotification = (notification) => markNotificationRead(user, notification.id);

	return (
		<DashboardLayout role={role} navigation={dashboardNavigation} pageTitle={config.pageTitle}>
			<main className="dashboard-content owner-workspace-page notification-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p className="dashboard-subtitle">{config.description}</p></div>
					<div className="owner-workspace-header-stat"><strong>{unreadCount}</strong><span>unread</span></div>
				</section>
				<section className="notification-toolbar">
					<div className="notification-filters" role="group" aria-label="Filter notifications">{['All', 'Unread', 'Read'].map((option) => <button type="button" className={filter === option ? 'active' : ''} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div>
					<button className="notification-mark-all" type="button" onClick={markAllRead} disabled={unreadCount === 0}><FiCheck /> Mark all read</button>
				</section>
				<section className="notification-list" aria-label="Notifications">
					{visibleNotifications.length ? visibleNotifications.map((notification) => {
						const Icon = iconForKind(notification.kind);
						return <Link className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.kind}`} key={notification.id} to={notification.href} onClick={() => openNotification(notification)}>
							<span className="notification-item-icon"><Icon /></span>
							<span className="notification-item-copy"><strong>{notification.title}</strong><span>{notification.detail}</span><small>{notification.time ? new Date(notification.time).toLocaleString() : 'Just now'}</small></span>
							{!notification.read && <i aria-label="Unread" />}
						</Link>;
					}) : <div className="notification-empty"><span><FiBell /></span><p className="dashboard-eyebrow">All caught up</p><h2>No {filter.toLowerCase()} notifications.</h2><p>Important activity for your workspace will show up here.</p></div>}
				</section>
			</main>
		</DashboardLayout>
	);
};

export default WorkspaceNotifications;
