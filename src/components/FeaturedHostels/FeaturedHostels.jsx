import PropertyCard from '../PropertyCard/PropertyCard';

const featuredHostels = [
	{
		name: 'The Nest Residency',
		location: 'Koramangala, Bengaluru',
		price: 'Rs. 8,500',
		rating: '4.8',
		image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=85',
	},
	{
		name: 'Campus Cove',
		location: 'Hinjewadi, Pune',
		price: 'Rs. 7,200',
		rating: '4.7',
		image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=85',
	},
	{
		name: 'Olive House',
		location: 'Madhapur, Hyderabad',
		price: 'Rs. 9,000',
		rating: '4.9',
		image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=85',
	},
];

const FeaturedHostels = () => {
	return (
		<section className="featured-section" aria-labelledby="featured-title">
			<div className="featured-heading">
				<div>
					<p className="featured-kicker">Handpicked for you</p>
					<h2 id="featured-title">Featured Hostels</h2>
				</div>
				<a className="featured-view-all" href="/hostels">
					View all hostels <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
			<div className="property-grid">
				{featuredHostels.map((hostel) => (
					<PropertyCard key={hostel.name} hostel={hostel} />
				))}
			</div>
		</section>
	);
};

export default FeaturedHostels;
