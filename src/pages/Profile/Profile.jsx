import { FiArrowLeft, FiLogOut, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminProfile from '../../components/Profiles/AdminProfile';
import OwnerProfile from '../../components/Profiles/OwnerProfile';
import StudentProfile from '../../components/Profiles/StudentProfile';
import { logout } from '../../redux/authSlice';

const roleConfig = {
	student: { label: 'Student account', title: 'My profile', back: '/dashboard' },
	owner: { label: 'Property owner account', title: 'Business profile', back: '/owner/dashboard' },
	admin: { label: 'Platform administrator', title: 'Admin profile', back: '/admin/dashboard' },
};

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const role = user?.role || 'student';
	const config = roleConfig[role] || roleConfig.student;

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};

	return (
		<main className={`profile-page profile-page-${role}`}>
			<div className="profile-page-inner">
				<header className="profile-page-header"><a className="profile-back-link" href={config.back}><FiArrowLeft /> Back to dashboard</a><div className="profile-header-actions"><a href="/settings"><FiSettings /> Settings</a><button type="button" onClick={handleLogout}><FiLogOut /> Log out</button></div></header>
				<section className="profile-page-title"><div className="profile-page-avatar">{user?.profileImage ? <img src={user.profileImage} alt="Current profile" /> : user?.initials || 'HS'}</div><div><p className="profile-kicker">{config.label}</p><h1>{config.title}</h1><p>Keep your information current so Homies Stay can work better for you.</p></div></section>
				{role === 'owner' ? <OwnerProfile user={user} /> : role === 'admin' ? <AdminProfile user={user} /> : <StudentProfile user={user} />}
			</div>
		</main>
	);
};

export default Profile;