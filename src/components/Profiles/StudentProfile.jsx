import { useState } from 'react';
import { FiBookOpen, FiCheck, FiMapPin, FiSave, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import ProfilePicture from './ProfilePicture';
import { updateProfile } from '../../redux/authSlice';

const StudentProfile = ({ user }) => {
	const dispatch = useDispatch();
	const [saved, setSaved] = useState(false);
	const [name, setName] = useState(user?.name || user?.username || 'Aarav Mehta');
	const [email, setEmail] = useState(user?.email || 'example@gmail.com');
	const [college, setCollege] = useState(user?.college || 'Gargi Memorial Institute of Technology');
	const [location, setLocation] = useState(user?.location || 'Baruip, West Bengal');
	const [profileImage, setProfileImage] = useState(user?.profileImage || '');

	const handleSave = () => {
		dispatch(updateProfile({ name, email, college, location, profileImage }));
		setSaved(true);
	};

	return (
		<section className="profile-role-content">
			<div className="profile-role-intro"><span className="profile-role-icon student"><FiUser /></span><div><p className="profile-kicker">Student profile</p><h2>Make your matches feel more like you.</h2><p>Tell Homies Stay what matters to you so your shortlist and recommendations stay useful.</p></div></div>
			<div className="profile-role-grid"><div className="profile-form-card"><div className="profile-card-heading"><div><p className="profile-kicker">Basic information</p><h3>Personal details</h3></div><span className="profile-complete-badge">72% complete</span></div><ProfilePicture initials={user?.initials || 'AM'} image={profileImage} onChange={(image) => { setProfileImage(image); setSaved(false); }} /><label className="profile-field"><span>Full name</span><input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Email address</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>College or university</span><input value={college} onChange={(event) => { setCollege(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Preferred location</span><input value={location} onChange={(event) => { setLocation(event.target.value); setSaved(false); }} /></label><button className="profile-save-button" type="button" onClick={handleSave}><FiSave /> {saved ? 'Changes saved' : 'Save changes'}</button></div><aside className="profile-side-card student"><p className="profile-kicker">Your preferences</p><h3>Better searches start here.</h3><div className="profile-side-stat"><FiMapPin /><span><strong>Preferred area</strong>{location}</span></div><div className="profile-side-stat"><FiBookOpen /><span><strong>Campus</strong>{college}</span></div><div className="profile-check-line"><FiCheck /> Your profile is visible only to improve recommendations.</div></aside></div>
		</section>
	);
};

export default StudentProfile;
