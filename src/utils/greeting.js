const getBrowserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getTimeGreeting = (date = new Date(), timeZone = getBrowserTimeZone()) => {
	let hour;

	try {
		hour = Number(new Intl.DateTimeFormat('en-US', {
			timeZone,
			hour: 'numeric',
			hourCycle: 'h23',
		}).format(date));
	} catch {
		hour = date.getHours();
	}

	if (hour < 12) {
		return 'Good morning';
	}

	if (hour < 18) {
		return 'Good afternoon';
	}

	return 'Good evening';
};
