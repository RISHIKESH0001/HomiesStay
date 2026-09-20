import { FiGrid, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const NavBar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector((state) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};

	return (
		<nav className="site-navbar" aria-label="Main navigation">
			<a href="/" className="site-navbar-brand">
				Homies Stay
			</a>

			<div className="site-navbar-links">
				<a href="/">Home</a>
				<a href="/hostels">Hostels</a>
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
			</div>

			<div className="site-navbar-auth">
				{isAuthenticated ? (
					<>
						<a className="site-navbar-dashboard" href={user?.role === 'owner' ? '/owner/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}><FiGrid /> Dashboard</a>
						<button className="site-navbar-logout" type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
						<a className="site-navbar-user" href="/profile" title="Open profile" aria-label={`Open profile for ${user?.name || 'user'}`}>{user?.profileImage ? <img src={user.profileImage} alt="" /> : user?.initials || 'HS'}</a>
					</>
				) : (
					<>
						<a href="/login">Login</a>
						<a href="/register" className="site-navbar-register">Register</a>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
