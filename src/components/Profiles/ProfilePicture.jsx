import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';

const ProfilePicture = ({ initials, image, onChange }) => {
	const inputRef = useRef(null);
	const [preview, setPreview] = useState(image || '');
	const [zoom, setZoom] = useState(1);

	const handleZoomChange = (event) => {
		setZoom(Number(event.target.value));
	};

	const handleImageChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const nextImage = reader.result;
			setPreview(nextImage);
			onChange(nextImage);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="profile-picture-editor">
			<div className="profile-picture-preview">{preview ? <img src={preview} alt="Profile preview" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }} /> : initials}</div>
			<div><button className="profile-picture-button" type="button" onClick={() => inputRef.current?.click()}><FiCamera /> Change photo</button><label className="profile-picture-zoom"><span>Adjust {Math.round(zoom * 100)}%</span><input type="range" min="1" max="1.5" step="0.01" value={zoom} onChange={handleZoomChange} aria-label="Adjust profile photo zoom" /></label><p>JPG or PNG, up to 5 MB</p><input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={handleImageChange} /></div>
		</div>
	);
};

export default ProfilePicture;