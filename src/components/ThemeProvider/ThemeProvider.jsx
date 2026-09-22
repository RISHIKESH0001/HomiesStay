import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { defaultSettings, getSettingsKey, readSettings } from './settingsDefaults';

const getAutomaticTheme = () => {
	const hour = Number(new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(new Date()));
	return hour >= 7 && hour < 19 ? 'day' : 'night';
};

const ThemeSession = ({ children, user, userKey }) => {
	const [settings, setSettings] = useState(() => readSettings(user));

	useEffect(() => {
		const applySettings = (nextSettings) => {
			const activeTheme = nextSettings.theme === 'auto' ? getAutomaticTheme() : nextSettings.theme;
			const isNight = activeTheme === 'night';
			document.documentElement.dataset.theme = activeTheme;
			document.documentElement.dataset.density = nextSettings.density;
			document.documentElement.dataset.motion = nextSettings.animations ? 'full' : 'reduced';
			document.documentElement.style.setProperty('--user-accent', nextSettings.theme === 'custom' ? nextSettings.accent : isNight ? '#b8d77b' : nextSettings.accent);
			document.documentElement.style.setProperty('--user-page', nextSettings.theme === 'custom' ? nextSettings.page : isNight ? '#0e1c1f' : '#fbfaf5');
			document.documentElement.style.setProperty('--user-surface', nextSettings.theme === 'custom' ? nextSettings.surface : isNight ? '#172b30' : '#ffffff');
			document.documentElement.style.setProperty('--user-text', nextSettings.theme === 'custom' ? nextSettings.text : isNight ? '#edf6f0' : '#214f55');
			document.documentElement.style.setProperty('--user-font', nextSettings.font);
			document.documentElement.style.setProperty('--user-heading-font', nextSettings.headingFont);
			document.documentElement.style.setProperty('--user-hover-accent', nextSettings.theme === 'custom' ? nextSettings.hoverAccent : isNight ? '#d5ee9b' : nextSettings.hoverAccent);
			document.documentElement.style.setProperty('--user-hover-surface', nextSettings.theme === 'custom' ? nextSettings.hoverSurface : isNight ? '#234047' : nextSettings.hoverSurface);
			const dashboardPage = nextSettings.theme === 'custom' ? nextSettings.page : isNight ? '#101f23' : '#f7f8f3';
			const dashboardSurface = nextSettings.theme === 'custom' ? nextSettings.surface : isNight ? '#1a3136' : '#ffffff';
			document.documentElement.style.setProperty('--dashboard-page', dashboardPage);
			document.documentElement.style.setProperty('--dashboard-surface', dashboardSurface);
			document.documentElement.style.setProperty('--dashboard-ink-user', nextSettings.theme === 'custom' ? nextSettings.text : isNight ? '#e8f0e6' : '#183d3e');
			document.documentElement.style.setProperty('--dashboard-muted-user', isNight ? '#b7cbc3' : '#718180');
			document.documentElement.style.setProperty('--dashboard-line-user', isNight ? '#315052' : '#e4e9e1');
			document.documentElement.style.setProperty('--dashboard-sidebar-user', isNight ? '#153033' : '#173b3d');
			document.documentElement.style.setProperty('--dashboard-sidebar-text-user', isNight ? '#d5e6dc' : '#dce8df');
		};

		applySettings(settings);
		const handleSettingsChange = (event) => {
			if (event.detail?.userKey !== userKey) return;
			const nextSettings = { ...defaultSettings, ...event.detail.settings };
			setSettings(nextSettings);
			applySettings(nextSettings);
		};
		window.addEventListener('homies-settings-preview', handleSettingsChange);
		window.addEventListener('homies-settings-changed', handleSettingsChange);
		const timer = window.setInterval(() => {
			if (settings.theme === 'auto') applySettings(settings);
		}, 60000);
		return () => {
			window.removeEventListener('homies-settings-preview', handleSettingsChange);
			window.removeEventListener('homies-settings-changed', handleSettingsChange);
			window.clearInterval(timer);
		};
	}, [settings, userKey]);

	return children;
};

const ThemeProvider = ({ children }) => {
	const user = useSelector((state) => state.auth.user);
	const userKey = getSettingsKey(user);

	return <ThemeSession key={userKey} user={user} userKey={userKey}>{children}</ThemeSession>;
};

export default ThemeProvider;
