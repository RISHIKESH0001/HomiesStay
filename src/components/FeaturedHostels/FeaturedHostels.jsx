import { useEffect, useState } from 'react';
import PropertyCard from '../PropertyCard/PropertyCard';
import { getPublicProperties } from '../../services/propertyCatalog';

const FeaturedHostels = () => {
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties({ size: 3 })
			.then((page) => { if (isCurrent) setProperties(page.content); })
			.catch(() => { if (isCurrent) setProperties([]); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	return (
		<section className="featured-section" aria-labelledby="featured-title">
			<div className="featured-heading">
				<div>
					<p className="featured-kicker">Handpicked for you</p>
					<h2 id="featured-title">Available stays</h2>
				</div>
				<a className="featured-view-all" href="/hostels">
					View all hostels <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
			{isLoading ? <p role="status">Loading approved listings…</p> : properties.length ? <div className="property-grid">{properties.map((property) => <PropertyCard key={property.id} hostel={property} />)}</div> : <p>No approved listings are available yet.</p>}
		</section>
	);
};

export default FeaturedHostels;
