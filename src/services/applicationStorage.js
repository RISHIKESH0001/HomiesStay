const APPLICATIONS_KEY = 'homies-stay-applications';

const readStoredApplications = () => {
	try {
		const storedApplications = window.localStorage.getItem(APPLICATIONS_KEY);
		return storedApplications ? JSON.parse(storedApplications) : [];
	} catch {
		return [];
	}
};

const writeApplications = (applications) => {
	window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
	return applications;
};

export const getApplications = (seedApplications = []) => {
	const applicationsById = new Map(seedApplications.map((application) => [application.id, application]));
	readStoredApplications().forEach((application) => applicationsById.set(application.id, application));
	return [...applicationsById.values()];
};

export const saveApplication = (application) => {
	const storedApplications = readStoredApplications();
	const nextApplications = [...storedApplications.filter((item) => item.id !== application.id), application];
	writeApplications(nextApplications);
	return application;
};

export const updateApplicationStatus = (applicationId, status, seedApplications = []) => {
	const updatedApplications = getApplications(seedApplications).map((application) => (
		application.id === applicationId ? { ...application, status, updatedAt: new Date().toISOString() } : application
	));
	writeApplications(updatedApplications);
	return updatedApplications;
};
