export const defaultSettings = {
	theme: 'auto',
	accent: '#78994e',
	page: '#fbfaf5',
	surface: '#ffffff',
	text: '#214f55',
	font: 'Manrope',
	headingFont: 'DM Serif Display',
	hoverAccent: '#5f7f3c',
	hoverSurface: '#edf4d8',
	density: 'comfortable',
	animations: true,
	emailNotifications: true,
	listingAlerts: true,
};

export const getSettingsKey = (user) => {
	const identity = user?.id || user?.email || user?.username || user?.name || 'guest';
	const role = user?.role || 'student';
	return `homies-stay-settings:${role}:${String(identity).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
};

export const readSettings = (user) => {
	try {
		const stored = window.localStorage.getItem(getSettingsKey(user));
		return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
	} catch {
		return defaultSettings;
	}
};
