import { useState } from 'react';
import { FiBarChart2, FiCheck, FiHome, FiSave } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import ProfilePicture from './ProfilePicture';
import { updateProfile } from '../../redux/authSlice';

const OwnerProfile = ({ user }) => {
	const dispatch = useDispatch();
	const [saved, setSaved] = useState(false);
	const [name, setName] = useState(user?.name || 'Riya Shah');
	const [email, setEmail] = useState(user?.email || 'riya@homiesstay.com');
	const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
	const [location, setLocation] = useState(user?.location || 'Bengaluru, Karnataka');
	const [profileImage, setProfileImage] = useState(user?.profileImage || '');

	const handleSave = () => {
		dispatch(updateProfile({ name, email, phone, location, profileImage }));
		setSaved(true);
	};

	return (
		<section className="profile-role-content">
			<div className="profile-role-intro"><span className="profile-role-icon owner"><FiHome /></span><div><p className="profile-kicker">Owner profile</p><h2>Put your spaces in good hands.</h2><p>Keep your contact details and business information ready for the students who are considering your properties.</p></div></div>
			<div className="profile-role-grid"><div className="profile-form-card"><div className="profile-card-heading"><div><p className="profile-kicker">Basic information</p><h3>Owner details</h3></div><span className="profile-complete-badge">86% complete</span></div><ProfilePicture initials={user?.initials || 'RS'} image={profileImage} onChange={(image) => { setProfileImage(image); setSaved(false); }} /><label className="profile-field"><span>Owner name</span><input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Business email</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Phone number</span><input value={phone} onChange={(event) => { setPhone(event.target.value); setSaved(false); }} /></label><label className="profile-field"><span>Operating city</span><input value={location} onChange={(event) => { setLocation(event.target.value); setSaved(false); }} /></label><button className="profile-save-button" type="button" onClick={handleSave}><FiSave /> {saved ? 'Changes saved' : 'Save changes'}</button></div><aside className="profile-side-card owner"><p className="profile-kicker">Owner snapshot</p><h3>Your properties at a glance.</h3><div className="profile-side-stat"><FiHome /><span><strong>Live properties</strong>3 spaces listed</span></div><div className="profile-side-stat"><FiBarChart2 /><span><strong>Average occupancy</strong>84% this month</span></div><div className="profile-check-line"><FiCheck /> Verified owner details build student confidence.</div></aside></div>
		</section>
	);
};

export default OwnerProfile;
