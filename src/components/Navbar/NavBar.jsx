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
						<span className="site-navbar-user" title={user?.name || 'Signed-in user'} aria-label={`Signed in as ${user?.name || 'user'}`}>{user?.initials || 'HS'}</span>
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
