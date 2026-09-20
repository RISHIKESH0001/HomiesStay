import Button from '../common/Button';

const getHostelSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PropertyCard = ({ hostel }) => {
	const hostelSlug = hostel.slug || getHostelSlug(hostel.name);

	return (
		<article className="property-card">
			<div className="property-card-image-wrap">
				<img className="property-card-image" src={hostel.image} alt={hostel.name} />
				<span className="property-card-badge">Verified</span>
			</div>
			<div className="property-card-content">
				<div className="property-card-heading">
					<div>
						<h3>{hostel.name}</h3>
						<p className="property-card-location">{hostel.location}</p>
					</div>
					<span className="property-card-rating" aria-label={`${hostel.rating} out of 5 rating`}>
						{hostel.rating}
					</span>
				</div>
				<div className="property-card-footer">
					<p className="property-card-price">
						<strong>{hostel.price}</strong> <span>/ month</span>
					</p>
					<Button className="property-card-link" href={`/hostels/${hostelSlug}`} variant="link">
						View Details <span aria-hidden="true">&rarr;</span>
					</Button>
				</div>
			</div>
		</article>
	);
};

export default PropertyCard;
