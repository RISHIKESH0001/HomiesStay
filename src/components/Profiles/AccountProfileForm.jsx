import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { getApiErrorMessage, updateAccountProfile, uploadAccountProfilePicture } from '../../services/api';
import { profileUpdated } from '../../redux/authSlice';
import ProfilePicture from './ProfilePicture';

const AccountProfileForm = ({ user, role }) => {
	const dispatch = useDispatch();
	const [name, setName] = useState(user?.name || '');
	const [phone, setPhone] = useState(user?.phone || '');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [saved, setSaved] = useState(false);

	const handlePictureUpload = async (file) => {
		const account = await uploadAccountProfilePicture(file);
		dispatch(profileUpdated(account));
		return account;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setSaved(false);
		setIsSaving(true);
		try {
			const account = await updateAccountProfile({ name: name.trim(), phone: phone.trim().replace(/[\s-]/g, '') });
			dispatch(profileUpdated(account));
			setName(account.name);
			setPhone(account.phone || '');
			setSaved(true);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to save your profile. Please try again.'));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<form className="profile-form-card" onSubmit={handleSubmit}>
			<div className="profile-card-heading"><div><p className="profile-kicker">Basic information</p><h3>{role === 'owner' ? 'Owner details' : role === 'admin' ? 'Administrator details' : 'Personal details'}</h3></div></div>
			<ProfilePicture initials={user?.initials || 'HS'} image={user?.profileImage} onChange={handlePictureUpload} />
			<label className="profile-field"><span>Full name</span><input name="name" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} maxLength="120" required /></label>
			<label className="profile-field"><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => { setPhone(event.target.value); setSaved(false); }} maxLength="32" pattern="\+?[1-9][0-9\s-]{5,29}[0-9]" title="Enter a phone number with country code, for example +919876543210." required /><small>Use an international format, for example +919876543210.</small></label>
			<label className="profile-field"><span>Email address</span><input type="email" value={user?.email || ''} readOnly /></label>
			<label className="profile-field"><span>Username</span><input value={user?.username || ''} readOnly /></label>
			<p className="profile-field-note">Email and username changes are disabled here. Email changes require a separate verification flow.</p>
			{error && <p className="field-error" role="alert">{error}</p>}
			{saved && <p className="profile-form-success" role="status">Your profile was saved.</p>}
			<button className="profile-save-button" type="submit" disabled={isSaving}><FiSave /> {isSaving ? 'Saving…' : 'Save changes'}</button>
		</form>
	);
};

export default AccountProfileForm;
