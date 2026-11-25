import { useEffect, useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { getApiErrorMessage } from '../../services/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ProfilePicture = ({ initials, image, onChange }) => {
	const inputRef = useRef(null);
	const [preview, setPreview] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => () => {
		if (preview) URL.revokeObjectURL(preview);
	}, [preview]);

	const handleImageChange = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = '';
		if (!file) return;
		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			setError('Choose a JPG or PNG image.');
			return;
		}
		if (file.size > MAX_FILE_SIZE) {
			setError('Choose an image no larger than 5 MB.');
			return;
		}

		setError('');
		setPreview(URL.createObjectURL(file));
		setIsUploading(true);
		try {
			await onChange(file);
			setPreview(null);
		} catch (uploadError) {
			setPreview(null);
			setError(getApiErrorMessage(uploadError, 'Unable to upload your profile picture. Please try again.'));
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="profile-picture-editor">
			<div className="profile-picture-preview">{preview || image ? <img src={preview || image} alt="Profile" /> : initials}</div>
			<div>
				<button className="profile-picture-button" type="button" onClick={() => inputRef.current?.click()} disabled={isUploading}><FiCamera /> {isUploading ? 'Uploading…' : image ? 'Change photo' : 'Add photo'}</button>
				<p>JPG or PNG, up to 5 MB. Your photo is stored securely with your account.</p>
				{error && <p className="field-error" role="alert">{error}</p>}
				<input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={handleImageChange} />
			</div>
		</div>
	);
};

export default ProfilePicture;
