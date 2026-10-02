import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import StudentDashboard from '../dashboard/Student/StudentDashboard';
import StudentExplore from '../dashboard/Student/StudentExplore';
import StudentSavedHomes from '../dashboard/Student/StudentSavedHomes';
import StudentEnquiries from '../dashboard/Student/StudentEnquiries';
import StudentApply from '../dashboard/Student/StudentApply';
import StudentApplications from '../dashboard/Student/StudentApplications';
import StudentMyStay from '../dashboard/Student/StudentMyStay';
import OwnerDashboard from '../dashboard/Owner/OwnerDashboard';
import MyProperties from '../dashboard/Owner/MyProperties';
import OwnerEnquiries from '../dashboard/Owner/OwnerEnquiries';
import OwnerApplications from '../dashboard/Owner/OwnerApplications';
import OwnerListingPayment from '../dashboard/Owner/OwnerListingPayment';
import OwnerRent from '../dashboard/Owner/OwnerRent';
import AdminDashboard from '../dashboard/Admin/AdminDashboard';
import AdminProperties from '../dashboard/Admin/AdminProperties';
import AdminUsers from '../dashboard/Admin/AdminUsers';
import AdminUserDetails from '../dashboard/Admin/AdminUserDetails';
import AdminApprovals from '../dashboard/Admin/AdminApprovals';
import AdminPropertyReview from '../dashboard/Admin/AdminPropertyReview';
import OwnerStudentDetails from '../dashboard/Owner/OwnerStudentDetails';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import Hostels from '../pages/Hostels/Hostels';
import HostelDetails from '../pages/HostelDetails/HostelDetails';
import StayOwnerDetails from '../pages/HostelDetails/StayOwnerDetails';
import Profile from '../pages/Profile/Profile';
import SearchResults from '../pages/SearchResults/SearchResults';
import Settings from '../components/Settings/Settings';
import NotFound from '../pages/NotFound/NotFound';
import HelpCenter from '../pages/Help/HelpCenter';
import StudentActivity from '../dashboard/Student/StudentActivity';
import OwnerInsights from '../dashboard/Owner/OwnerInsights';
import AdminReports from '../dashboard/Admin/AdminReports';
import AdminEnquiries from '../dashboard/Admin/AdminEnquiries';
import WorkspaceNotifications from '../dashboard/WorkspaceNotifications';

const ProtectedRoute = ({ children, role }) => {
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const location = useLocation();
	const currentRole = user?.role || 'student';

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (role && currentRole !== role) {
		return <Navigate to={currentRole === 'owner' ? '/owner/dashboard' : currentRole === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
	}

	return children;
};

const GuestRoute = ({ children }) => {
	const { isAuthenticated, user } = useSelector((state) => state.auth);

	if (!isAuthenticated) {
		return children;
	}

	return <Navigate to={user?.role === 'owner' ? '/owner/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
};

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/hostels" element={<Hostels />} />
				<Route path="/search-results" element={<SearchResults />} />
				<Route path="/hostels/:hostelId" element={<HostelDetails />} />
				<Route path="/hostels/:hostelId/apply" element={<ProtectedRoute role="student"><StudentApply /></ProtectedRoute>} />
				<Route path="/hostels/:hostelId/owner" element={<StayOwnerDetails />} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
				<Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
				<Route path="/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
				<Route path="/dashboard/activity" element={<ProtectedRoute role="student"><StudentActivity /></ProtectedRoute>} />
				<Route path="/dashboard/explore-stays" element={<ProtectedRoute role="student"><StudentExplore /></ProtectedRoute>} />
				<Route path="/dashboard/saved-homes" element={<ProtectedRoute role="student"><StudentSavedHomes /></ProtectedRoute>} />
				<Route path="/dashboard/enquiries" element={<ProtectedRoute role="student"><StudentEnquiries /></ProtectedRoute>} />
				<Route path="/dashboard/applications" element={<ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>} />
				<Route path="/dashboard/my-stay" element={<ProtectedRoute role="student"><StudentMyStay /></ProtectedRoute>} />
				<Route path="/dashboard/notifications" element={<ProtectedRoute role="student"><WorkspaceNotifications role="student" /></ProtectedRoute>} />
				<Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
				<Route path="/owner/properties" element={<ProtectedRoute role="owner"><MyProperties /></ProtectedRoute>} />
				<Route path="/owner/enquiries" element={<ProtectedRoute role="owner"><OwnerEnquiries /></ProtectedRoute>} />
				<Route path="/owner/applications" element={<ProtectedRoute role="owner"><OwnerApplications /></ProtectedRoute>} />
				<Route path="/owner/rent" element={<ProtectedRoute role="owner"><OwnerRent /></ProtectedRoute>} />
				<Route path="/owner/notifications" element={<ProtectedRoute role="owner"><WorkspaceNotifications role="owner" /></ProtectedRoute>} />
				<Route path="/owner/properties/:slug/payment" element={<ProtectedRoute role="owner"><OwnerListingPayment /></ProtectedRoute>} />
				<Route path="/owner/students/:studentId" element={<ProtectedRoute role="owner"><OwnerStudentDetails /></ProtectedRoute>} />
				<Route path="/owner/insights" element={<ProtectedRoute role="owner"><OwnerInsights /></ProtectedRoute>} />
				<Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
				<Route path="/admin/properties" element={<ProtectedRoute role="admin"><AdminProperties /></ProtectedRoute>} />
				<Route path="/admin/properties/:slug/review" element={<ProtectedRoute role="admin"><AdminPropertyReview /></ProtectedRoute>} />
				<Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
				<Route path="/admin/users/:userId" element={<ProtectedRoute role="admin"><AdminUserDetails /></ProtectedRoute>} />
				<Route path="/admin/approvals" element={<ProtectedRoute role="admin"><AdminApprovals /></ProtectedRoute>} />
				<Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
				<Route path="/admin/enquiries" element={<ProtectedRoute role="admin"><AdminEnquiries /></ProtectedRoute>} />
				<Route path="/admin/notifications" element={<ProtectedRoute role="admin"><WorkspaceNotifications role="admin" /></ProtectedRoute>} />
				<Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
