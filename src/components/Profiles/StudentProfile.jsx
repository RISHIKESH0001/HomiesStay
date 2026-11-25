import { FiUser } from 'react-icons/fi';
import AccountProfileForm from './AccountProfileForm';

const StudentProfile = ({ user }) => (
	<section className="profile-role-content">
		<div className="profile-role-intro"><span className="profile-role-icon student"><FiUser /></span><div><p className="profile-kicker">Student profile</p><h2>Keep your account information current.</h2><p>Your name and phone number are saved to your account.</p></div></div>
		<div className="profile-role-grid single-column"><AccountProfileForm user={user} role="student" /></div>
	</section>
);

export default StudentProfile;
