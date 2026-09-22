import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import StudentDashboard from '../dashboard/Student/StudentDashboard';
import OwnerDashboard from '../dashboard/Owner/OwnerDashboard';
import MyProperties from '../dashboard/Owner/MyProperties';
import OwnerEnquiries from '../dashboard/Owner/OwnerEnquiries';
import OwnerApplications from '../dashboard/Owner/OwnerApplications';
import AdminDashboard from '../dashboard/Admin/AdminDashboard';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import Hostels from '../pages/Hostels/Hostels';
import HostelDetails from '../pages/HostelDetails/HostelDetails';
import Profile from '../pages/Profile/Profile';
import SearchResults from '../pages/SearchResults/SearchResults';
import Settings from '../components/Settings/Settings';

const ProtectedRoute = ({ children, role }) => {
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const currentRole = user?.role || 'student';

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (role && currentRole !== role) {
		return <Navigate to={currentRole === 'owner' ? '/owner/dashboard' : currentRole === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
	}

	return children;
};

const GuestRoute = ({ children }) => {
	const { isAuthenticated } = useSelector((state) => state.auth);

	if (!isAuthenticated) {
		return children;
	}

	return <Navigate to="/" replace />;
};

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/hostels" element={<Hostels />} />
				<Route path="/search-results" element={<SearchResults />} />
				<Route path="/hostels/:hostelId" element={<HostelDetails />} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
				<Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
				<Route path="/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
				<Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
				<Route path="/owner/properties" element={<ProtectedRoute role="owner"><MyProperties /></ProtectedRoute>} />
				<Route path="/owner/enquiries" element={<ProtectedRoute role="owner"><OwnerEnquiries /></ProtectedRoute>} />
				<Route path="/owner/applications" element={<ProtectedRoute role="owner"><OwnerApplications /></ProtectedRoute>} />
				<Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
