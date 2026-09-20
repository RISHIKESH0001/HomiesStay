import { useState } from 'react';
import { FiActivity, FiCheck, FiSave, FiShield, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import ProfilePicture from './ProfilePicture';
import { updateProfile } from '../../redux/authSlice';

const AdminProfile = ({ user }) => {
	const dispatch = useDispatch();
	const [saved, setSaved] = useState(false);
	const [name, setName] = useState(user?.name || 'Aarav Desai');
	const [email, setEmail] = useState(user?.email || 'admin@homiesstay.com');
	const [team, setTeam] = useState(user?.team || 'Trust and platform operations');
	const [timeZone, setTimeZone] = useState(user?.timeZone || 'Asia/Kolkata');
	const [profileImage, setProfileImage] = useState(user?.profileImage || '');

	const handleSave = () => {
		dispatch(updateProfile({ name, email, team, timeZone, profileImage }));
		setSaved(true);
	};

	return (
		<section className="profile-role-content">
			<div className="profile-role-intro"><span className="profile-role-icon admin"><FiShield /></span><div><p className="profile-kicker">Admin profile</p><h2>Keep the Homies Stay community moving.</h2><p>Manage your administrator identity and keep the right contact details connected to platform operations.</p></div></div>
			<div className="profile-role-grid"><div className="profile-form-card"><div className="profile-card-heading"><div><p className="profile-kicker">Basic information</p><h3>Administrator details</h3></div><span className="profile-complete-badge">100% complete</span></div><ProfilePicture initials={user?.initials || 'AD'} image={profileImage} onChange={(image) => { setProfileImage(image); setSaved(false); }} /><label className="profile-field"><span>Full name</span><input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Work email</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Team</span><input value={team} onChange={(event) => { setTeam(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Timezone</span><input value={timeZone} onChange={(event) => { setTimeZone(event.target.value); setSaved(false); }} /></label><button className="profile-save-button" type="button" onClick={handleSave}><FiSave /> {saved ? 'Changes saved' : 'Save changes'}</button></div><aside className="profile-side-card admin"><p className="profile-kicker">Platform access</p><h3>Everything important, visible.</h3><div className="profile-side-stat"><FiActivity /><span><strong>Trust score</strong>98.4% healthy</span></div><div className="profile-side-stat"><FiUser /><span><strong>Role</strong>Platform administrator</span></div><div className="profile-check-line"><FiCheck /> Your profile has full moderation access.</div></aside></div>
		</section>
	);
};

export default AdminProfile;
