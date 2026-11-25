import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiBookOpen, FiCheck, FiCheckCircle, FiClock, FiCreditCard, FiGrid, FiHeart, FiHome, FiMessageCircle, FiRefreshCw, FiShield, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { getApiErrorMessage, getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import './workspaceActivity.css';

const workspaceNavigation = {
	student: [{ label: 'Overview', icon: FiGrid }, { label: 'Explore stays', icon: FiHome }, { label: 'Saved homes', icon: FiHeart }, { label: 'My enquiries', icon: FiMessageCircle }, { label: 'My Stay', icon: FiHome }, { label: 'Applications', icon: FiBookOpen }, { label: 'Notifications', icon: FiBell }],
	owner: [{ label: 'Overview', icon: FiGrid }, { label: 'My properties', icon: FiHome }, { label: 'Enquiries', icon: FiMessageCircle }, { label: 'Applications', icon: FiBookOpen }, { label: 'Rent & payments', icon: FiCreditCard }, { label: 'Notifications', icon: FiBell }],
	admin: [{ label: 'Overview', icon: FiGrid }, { label: 'Properties', icon: FiHome }, { label: 'Users', icon: FiUsers }, { label: 'Approvals', icon: FiShield }, { label: 'Enquiries', icon: FiMessageCircle }, { label: 'Notifications', icon: FiBell }],
};

const getNotificationIcon = (eventType) => {
	if (eventType.includes('APPLICATION')) return FiBookOpen;
	if (eventType.includes('ENQUIRY')) return FiMessageCircle;
	if (eventType.includes('LISTING_APPROVED')) return FiCheckCircle;
	if (eventType.includes('REVIEW') || eventType.includes('CHANGES')) return FiClock;
	return FiBell;
};

const WorkspaceNotifications = ({ role }) => {
	const [pageData, setPageData] = useState(null);
	const [page, setPage] = useState(0);
	const [filter, setFilter] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [busyId, setBusyId] = useState(null);

	const loadNotifications = useCallback(async (targetPage = page) => {
		setIsLoading(true);
		setError('');
		try {
			setPageData(await getNotifications({ page: targetPage, size: 30 }));
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to load notifications. Please try again.'));
		} finally {
			setIsLoading(false);
		}
	}, [page]);

	useEffect(() => {
		let isCurrent = true;
		getNotifications({ page, size: 30 })
			.then((result) => { if (isCurrent) setPageData(result); })
			.catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load notifications. Please try again.')); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [page]);

	const visibleNotifications = useMemo(() => (pageData?.content || []).filter((item) => filter === 'all' || !item.read), [filter, pageData]);

	const handleMarkRead = async (item) => {
		if (item.read) return;
		setBusyId(item.id);
		try {
			await markNotificationRead(item.id);
			setPageData((current) => ({ ...current, unreadCount: Math.max(0, current.unreadCount - 1), content: current.content.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry) }));
			window.dispatchEvent(new Event('homies:notifications-updated'));
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to update this notification.'));
		} finally {
			setBusyId(null);
		}
	};

	const handleMarkAllRead = async () => {
		setBusyId('all');
		setError('');
		try {
			await markAllNotificationsRead();
			setPageData((current) => ({ ...current, unreadCount: 0, content: current.content.map((item) => ({ ...item, read: true })) }));
			window.dispatchEvent(new Event('homies:notifications-updated'));
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to mark notifications as read.'));
		} finally {
			setBusyId(null);
		}
	};

	return (
		<DashboardLayout role={role} navigation={workspaceNavigation[role]} pageTitle="Notifications">
			<main className="dashboard-content owner-workspace-page notification-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Your activity</p><h1>Notifications<span>.</span></h1><p className="dashboard-subtitle">Important updates from your Homies Stay activity and listings.</p></div>
					<button className="dashboard-primary-action" type="button" onClick={() => loadNotifications(page)} disabled={isLoading}><FiRefreshCw /> Refresh</button>
				</section>
				{pageData && <div className="notification-toolbar">
					<div className="notification-filters" aria-label="Notification filters"><button type="button" className={`notification-filter-button${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All ({pageData.totalElements})</button><button type="button" className={`notification-filter-button${filter === 'unread' ? ' active' : ''}`} onClick={() => setFilter('unread')}>Unread ({pageData.unreadCount})</button></div>
					<button className="notification-mark-all" type="button" onClick={handleMarkAllRead} disabled={!pageData.unreadCount || busyId === 'all'}><FiCheck /> Mark all as read</button>
				</div>}
				{error && <p className="field-error" role="alert">{error}</p>}
				{isLoading ? <p role="status">Loading notifications…</p> : visibleNotifications.length ? <>
					<div className="notification-list" aria-label="Notifications">
						{visibleNotifications.map((item) => {
							const Icon = getNotificationIcon(item.eventType);
							return <Link className={`notification-item${item.read ? ' read' : ''}${item.eventType.includes('APPROVED') ? ' success' : item.eventType.includes('CHANGES') ? ' warning' : ''}`} to={item.targetUrl} key={item.id} onClick={() => handleMarkRead(item)} aria-label={`${item.read ? '' : 'Unread: '}${item.title}`}>
								<span className="notification-item-icon"><Icon /></span><span className="notification-item-copy"><strong>{item.title}</strong><span>{item.message}</span><small>{new Date(item.createdAt).toLocaleString()}</small></span>{busyId === item.id ? <FiRefreshCw aria-label="Updating" /> : item.read ? <FiCheck aria-label="Read" /> : <i aria-label="Unread" />}
							</Link>;
						})}
					</div>
					<nav className="admin-user-pagination" aria-label="Notification pages"><button type="button" onClick={() => { setIsLoading(true); setPage((current) => current - 1); }} disabled={page === 0}>Previous</button><span>Page {page + 1} of {Math.max(1, pageData.totalPages)}</span><button type="button" onClick={() => { setIsLoading(true); setPage((current) => current + 1); }} disabled={page + 1 >= pageData.totalPages}>Next</button></nav>
				</> : <section className="notification-empty"><span><FiBell /></span><p className="dashboard-eyebrow">Inbox clear</p><h2>{filter === 'unread' ? 'You’re all caught up.' : 'No notifications yet.'}</h2><p>New listing, enquiry, application, and review updates will show here.</p>{filter === 'unread' && <button type="button" className="notification-mark-all" onClick={() => setFilter('all')}>Show all notifications</button>}</section>}
			</main>
		</DashboardLayout>
	);
};

export default WorkspaceNotifications;
