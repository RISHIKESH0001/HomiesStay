import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
	withCredentials: true,
	withXSRFToken: true,
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
});

const initializeCsrf = async () => api.get('/auth/csrf');

export const getCurrentAccount = async () => (await api.get('/auth/me')).data;

export const updateAccountProfile = async (profile) => {
	await initializeCsrf();
	return (await api.patch('/auth/profile', profile)).data;
};

export const uploadAccountProfilePicture = async (file) => {
	await initializeCsrf();
	const formData = new FormData();
	formData.append('file', file);
	return (await api.post('/auth/profile-picture', formData)).data;
};

export const getProfilePictureUrl = (imagePath) => imagePath ? api.getUri({ url: imagePath }) : null;

export const getOwnerProperties = async (params = {}) => (await api.get('/owner/properties', { params })).data;

export const getStudentApplications = async (params = {}) => (await api.get('/student/applications', { params })).data;

export const getStudentEnquiries = async (params = {}) => (await api.get('/student/enquiries', { params })).data;

export const startStudentEnquiry = async (propertyId, message) => {
	await initializeCsrf();
	return (await api.post(`/student/enquiries/properties/${propertyId}`, { message })).data;
};

export const getStudentEnquiryMessages = async (enquiryId) => (await api.get(`/student/enquiries/${enquiryId}/messages`)).data;

export const replyToStudentEnquiry = async (enquiryId, message) => {
	await initializeCsrf();
	return (await api.post(`/student/enquiries/${enquiryId}/messages`, { message })).data;
};

export const getOwnerEnquiries = async (params = {}) => (await api.get('/owner/enquiries', { params })).data;

export const getOwnerEnquiryMessages = async (enquiryId) => (await api.get(`/owner/enquiries/${enquiryId}/messages`)).data;

export const replyToOwnerEnquiry = async (enquiryId, message) => {
	await initializeCsrf();
	return (await api.post(`/owner/enquiries/${enquiryId}/messages`, { message })).data;
};

export const getStudentSavedHomes = async (params = {}) => (await api.get('/student/saved-properties', { params })).data;

export const saveStudentHome = async (propertyId) => {
	await initializeCsrf();
	return api.post(`/student/saved-properties/${propertyId}`);
};

export const removeStudentSavedHome = async (propertyId) => {
	await initializeCsrf();
	return api.delete(`/student/saved-properties/${propertyId}`);
};

export const createStudentApplication = async (propertyId, application) => {
	await initializeCsrf();
	return (await api.post(`/student/applications/properties/${propertyId}`, application)).data;
};

export const withdrawStudentApplication = async (applicationId) => {
	await initializeCsrf();
	return (await api.post(`/student/applications/${applicationId}/withdraw`)).data;
};

export const getOwnerApplications = async (params = {}) => (await api.get('/owner/applications', { params })).data;

export const updateOwnerApplicationStatus = async (applicationId, status) => {
	await initializeCsrf();
	return (await api.patch(`/owner/applications/${applicationId}/status`, { status })).data;
};

export const createOwnerProperty = async (property) => {
	await initializeCsrf();
	return (await api.post('/owner/properties', property)).data;
};

export const updateOwnerProperty = async (id, property) => {
	await initializeCsrf();
	return (await api.put(`/owner/properties/${id}`, property)).data;
};

export const submitOwnerPropertyForReview = async (id) => {
	await initializeCsrf();
	return (await api.post(`/owner/properties/${id}/submit`)).data;
};

export const getAdminPropertyReviewQueue = async (params = {}) => (
	await api.get('/admin/properties/review-queue', { params })
).data;

export const reviewAdminProperty = async (id, decision, note = null) => {
	await initializeCsrf();
	return (await api.patch(`/admin/properties/${id}/review`, { decision, note })).data;
};

export const getAdminUsers = async (params = {}) => (await api.get('/admin/users', { params })).data;

export const suspendAdminUser = async (id, suspension) => {
	await initializeCsrf();
	return (await api.patch(`/admin/users/${id}/suspension`, suspension)).data;
};

export const liftAdminUserSuspension = async (id, reason) => {
	await initializeCsrf();
	return (await api.patch(`/admin/users/${id}/suspension/lift`, { reason })).data;
};

export const terminateAdminUser = async (id, confirmation, reason) => {
	await initializeCsrf();
	return api.delete(`/admin/users/${id}`, { data: { confirmation, reason } });
};

export const deleteOwnerDraft = async (id) => {
	await initializeCsrf();
	return api.delete(`/owner/properties/${id}`);
};

export const loginAccount = async (credentials) => {
	await initializeCsrf();
	return (await api.post('/auth/login', credentials)).data;
};

export const registerAccount = async (account) => {
	await initializeCsrf();
	return (await api.post('/auth/register', account)).data;
};

export const verifyEmailOtp = async (verification) => {
	await initializeCsrf();
	return (await api.post('/auth/verify-email', verification)).data;
};

export const resendEmailVerificationOtp = async (email) => {
	await initializeCsrf();
	return (await api.post('/auth/resend-verification-otp', { email })).data;
};

export const requestPasswordReset = async (email) => {
	await initializeCsrf();
	return (await api.post('/auth/forgot-password', { email })).data;
};

export const resetAccountPassword = async (request) => {
	await initializeCsrf();
	return (await api.post('/auth/reset-password', request)).data;
};

export const logoutAccount = async () => {
	await initializeCsrf();
	return api.post('/auth/logout');
};

export const getApiErrorMessage = (error, fallback) => (
	error?.response?.data?.message
	|| error?.response?.data?.detail
	|| fallback
);

export const getNotifications = async (params = {}) => (await api.get('/notifications', { params })).data;
export const getNotificationUnreadCount = async () => (await api.get('/notifications/unread-count')).data;
export const markNotificationRead = async (id) => {
	await initializeCsrf();
	return api.patch(`/notifications/${id}/read`);
};
export const markAllNotificationsRead = async () => {
	await initializeCsrf();
	return api.patch('/notifications/read-all');
};
