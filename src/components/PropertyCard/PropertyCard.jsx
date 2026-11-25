import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const PropertyCard = ({ hostel, showSave = false, saved = false, saving = false, onToggleSave }) => {
	const hostelSlug = hostel.slug || hostel.id;

	return (
		<article className="property-card">
			<div className="property-card-image-wrap">
				{hostel.image ? <img className="property-card-image" src={hostel.image} alt={hostel.name} /> : <div className="property-card-image-placeholder" aria-hidden="true" />}
				<span className="property-card-badge">Approved listing</span>
				{showSave && <button type="button" className={`stay-save${saved ? ' saved' : ''}`} onClick={() => onToggleSave?.(hostel)} disabled={saving} aria-label={`${saved ? 'Remove' : 'Save'} ${hostel.name}${saving ? ', updating' : ''}`} aria-pressed={saved}><FiHeart aria-hidden="true" /></button>}
			</div>
			<div className="property-card-content">
				<div className="property-card-heading">
					<div>
						<h3>{hostel.name}</h3>
						<p className="property-card-location">{hostel.location}</p>
					</div>
					{hostel.rating && <span className="property-card-rating" aria-label={`${hostel.rating} out of 5 rating`}>{hostel.rating}</span>}
				</div>
				{hostel.gender && <span className="property-card-gender">{hostel.gender} hostel</span>}
				<div className="property-card-footer">
					<p className="property-card-price">
						<strong>{hostel.price}</strong> <span>/ month</span>
					</p>
					<Link className="property-card-link" to={`/hostels/${hostelSlug}`}>
						View Details <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</div>
		</article>
	);
};

export default PropertyCard;
