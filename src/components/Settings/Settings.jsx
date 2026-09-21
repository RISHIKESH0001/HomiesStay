import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiBell, FiCheck, FiClock, FiEye, FiLock, FiMoon, FiSave, FiSettings, FiSun, FiZap } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getSettingsKey, readSettings } from '../ThemeProvider/settingsDefaults';

const roleDetails = {
	student: { label: 'Student workspace', title: 'Make your stay search feel like yours.', description: 'Tune how Homies Stay looks, notifies you, and keeps your account comfortable to use.', sections: ['Search preferences', 'Saved homes and enquiry updates'] },
	owner: { label: 'Owner workspace', title: 'Run your property workspace your way.', description: 'Choose how listing activity, enquiries, and account updates reach you.', sections: ['Listing preferences', 'Enquiry and property alerts'] },
	admin: { label: 'Admin workspace', title: 'Keep your platform view focused.', description: 'Control moderation alerts, privacy defaults, and the way the operations workspace feels.', sections: ['Platform preferences', 'Trust and moderation alerts'] },
};

const Settings = () => {
	const user = useSelector((state) => state.auth.user);
	const role = user?.role || 'student';
	const roleCopy = roleDetails[role] || roleDetails.student;
	const userKey = getSettingsKey(user);
	const [settings, setSettings] = useState(() => readSettings(user));
	const [saved, setSaved] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Your local timezone', []);

	const updateSetting = (key, value) => {
		setSaved(false);
		setIsPreviewing(true);
		setSettings((current) => {
			const nextSettings = { ...current, [key]: value };
			window.dispatchEvent(new CustomEvent('homies-settings-preview', { detail: { userKey, settings: nextSettings } }));
			return nextSettings;
		});
	};

	const saveSettings = () => {
		window.localStorage.setItem(userKey, JSON.stringify(settings));
		window.dispatchEvent(new CustomEvent('homies-settings-changed', { detail: { userKey, settings } }));
		setIsPreviewing(false);
		setSaved(true);
	};

	const discardPreview = () => {
		const committedSettings = readSettings(user);
		setSettings(committedSettings);
		window.dispatchEvent(new CustomEvent('homies-settings-preview', { detail: { userKey, settings: committedSettings } }));
		setIsPreviewing(false);
		setSaved(false);
	};

	return (
		<DashboardLayout role={role} pageTitle="Settings">
			<main className="settings-page">
				<header className="settings-header"><div><p className="dashboard-eyebrow">{roleCopy.label}</p><h1>{roleCopy.title}</h1><p>{roleCopy.description}</p></div><div className="settings-header-actions">{isPreviewing && <span className="settings-preview-badge"><FiEye /> Previewing changes</span>}{isPreviewing && <button className="settings-discard-button" type="button" onClick={discardPreview}>Discard</button>}<button className="settings-save-button" type="button" onClick={saveSettings}><FiSave aria-hidden="true" /> {saved ? 'Applied' : 'Apply theme'}</button></div></header>
				<div className="settings-layout">
					<section className="settings-panel settings-theme-panel" aria-labelledby="appearance-title"><div className="settings-panel-heading"><span className="settings-panel-icon"><FiSun /></span><div><p className="dashboard-eyebrow">Appearance</p><h2 id="appearance-title">Set the mood for your workspace.</h2></div></div><div className="settings-theme-options"><button className={settings.theme === 'day' ? 'settings-theme-option active' : 'settings-theme-option'} type="button" onClick={() => updateSetting('theme', 'day')}><FiSun /><strong>Day</strong><span>Light and clear</span></button><button className={settings.theme === 'night' ? 'settings-theme-option active' : 'settings-theme-option'} type="button" onClick={() => updateSetting('theme', 'night')}><FiMoon /><strong>Night</strong><span>Low-light comfort</span></button><button className={settings.theme === 'auto' ? 'settings-theme-option active' : 'settings-theme-option'} type="button" onClick={() => updateSetting('theme', 'auto')}><FiClock /><strong>Automatic</strong><span>Based on {timezone}</span></button><button className={settings.theme === 'custom' ? 'settings-theme-option active' : 'settings-theme-option'} type="button" onClick={() => updateSetting('theme', 'custom')}><FiZap /><strong>Custom</strong><span>Choose your palette</span></button></div>{settings.theme === 'auto' && <p className="settings-inline-note"><FiClock /> Automatic mode uses your local time: day from 7:00 AM to 7:00 PM, night outside those hours.</p>}{settings.theme === 'custom' && <div className="settings-color-grid"><label><span>Accent</span><input type="color" value={settings.accent} onChange={(event) => updateSetting('accent', event.target.value)} /></label><label><span>Page background</span><input type="color" value={settings.page} onChange={(event) => updateSetting('page', event.target.value)} /></label><label><span>Panel background</span><input type="color" value={settings.surface} onChange={(event) => updateSetting('surface', event.target.value)} /></label><label><span>Text color</span><input type="color" value={settings.text} onChange={(event) => updateSetting('text', event.target.value)} /></label></div>}</section>

					<section className="settings-panel" aria-labelledby="workspace-title"><div className="settings-panel-heading"><span className="settings-panel-icon"><FiSettings /></span><div><p className="dashboard-eyebrow">Workspace</p><h2 id="workspace-title">Shape the way information appears.</h2></div></div><label className="settings-select-row"><span><strong>Body font</strong><small>Choose the most comfortable reading voice.</small></span><select value={settings.font} onChange={(event) => updateSetting('font', event.target.value)}><option value="Manrope">Manrope</option><option value="DM Sans">DM Sans</option><option value="Source Sans 3">Source Sans 3</option><option value="Georgia">Georgia</option></select></label><label className="settings-select-row"><span><strong>Heading font</strong><small>Give page titles a different personality.</small></span><select value={settings.headingFont} onChange={(event) => updateSetting('headingFont', event.target.value)}><option value="DM Serif Display">DM Serif Display</option><option value="Space Grotesk">Space Grotesk</option><option value="Manrope">Manrope</option><option value="Georgia">Georgia</option></select></label><div className="settings-color-grid settings-hover-colors"><label><span>Hover accent</span><input type="color" value={settings.hoverAccent} onChange={(event) => updateSetting('hoverAccent', event.target.value)} /></label><label><span>Hover surface</span><input type="color" value={settings.hoverSurface} onChange={(event) => updateSetting('hoverSurface', event.target.value)} /></label></div><label className="settings-select-row"><span><strong>Layout density</strong><small>Choose how much content fits on screen.</small></span><select value={settings.density} onChange={(event) => updateSetting('density', event.target.value)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label><label className="settings-toggle-row"><span><strong>Motion and transitions</strong><small>Keep subtle movement throughout the workspace.</small></span><input type="checkbox" checked={settings.animations} onChange={(event) => updateSetting('animations', event.target.checked)} /></label></section>

					<section className="settings-panel" aria-labelledby="notifications-title"><div className="settings-panel-heading"><span className="settings-panel-icon"><FiBell /></span><div><p className="dashboard-eyebrow">Notifications</p><h2 id="notifications-title">Stay informed at the right moments.</h2></div></div><label className="settings-toggle-row"><span><strong>Email updates</strong><small>Account, enquiry, and important workspace updates.</small></span><input type="checkbox" checked={settings.emailNotifications} onChange={(event) => updateSetting('emailNotifications', event.target.checked)} /></label><label className="settings-toggle-row"><span><strong>{role === 'student' ? 'Saved home alerts' : role === 'owner' ? 'Listing and enquiry alerts' : 'Moderation alerts'}</strong><small>{role === 'student' ? 'Hear when a saved stay changes or receives an update.' : role === 'owner' ? 'Know when a resident asks a question or a listing needs attention.' : 'Receive signals when trust and platform activity needs review.'}</small></span><input type="checkbox" checked={settings.listingAlerts} onChange={(event) => updateSetting('listingAlerts', event.target.checked)} /></label></section>

					<section className="settings-panel settings-security-panel" aria-labelledby="privacy-title"><div className="settings-panel-heading"><span className="settings-panel-icon"><FiLock /></span><div><p className="dashboard-eyebrow">Privacy and account</p><h2 id="privacy-title">Your preferences stay on this device.</h2></div></div><div className="settings-info-row"><FiEye /><span><strong>Private by default</strong><small>Your appearance and notification choices are stored locally and are not shared with other users.</small></span></div><div className="settings-info-row"><FiCheck /><span><strong>Role-aware controls</strong><small>These settings are shared across your {roleCopy.label.toLowerCase()} and keep your permissions unchanged.</small></span></div></section>
				</div>
				{saved && <p className="settings-status" role="status"><FiCheck /> Your settings are saved on this device.</p>}
			</main>
		</DashboardLayout>
	);
};

export default Settings;
