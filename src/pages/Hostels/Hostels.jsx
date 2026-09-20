import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiClock, FiMapPin, FiNavigation, FiSliders } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';

const hostels = [
	{ name: 'The Nest Residency', location: 'Koramangala, Bengaluru', college: 'Christ University', price: 'Rs. 8,500', rating: '4.8', image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=85', tag: 'Best match' },
	{ name: 'Campus Cove', location: 'Hinjewadi, Pune', college: 'Symbiosis Institute', price: 'Rs. 7,200', rating: '4.7', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=85', tag: 'Popular nearby' },
	{ name: 'Olive House', location: 'Madhapur, Hyderabad', college: 'IIIT Hyderabad', price: 'Rs. 9,000', rating: '4.9', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=85', tag: 'Top rated' },
	{ name: 'The Green Room', location: 'Salt Lake, Kolkata', college: 'IEM Kolkata', price: 'Rs. 6,800', rating: '4.6', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85', tag: 'Value pick' },
	{ name: 'North Star Living', location: 'New Town, Kolkata', college: 'Techno India', price: 'Rs. 7,900', rating: '4.8', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85', tag: 'New on Homies' },
	{ name: 'Maple Co-Live', location: 'Viman Nagar, Pune', college: 'MIT World Peace University', price: 'Rs. 8,100', rating: '4.7', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=85', tag: 'Move-in ready' },
];

const recentSearches = ['Salt Lake, Kolkata', 'IIT Kharagpur', 'Hostels under Rs. 8,000'];
const popularAreas = [
	{ name: 'Kolkata', detail: '342 verified stays', tone: 'sage' },
	{ name: 'Pune', detail: '218 verified stays', tone: 'yellow' },
	{ name: 'Bengaluru', detail: '196 verified stays', tone: 'blue' },
	{ name: 'Hyderabad', detail: '154 verified stays', tone: 'rose' },
];

const Hostels = () => {
	const [search, setSearch] = useState('');
	const [location, setLocation] = useState('Kolkata');
	const [budget, setBudget] = useState('');
	const [locationStatus, setLocationStatus] = useState('Based on your location');

	const filteredHostels = useMemo(() => {
		const query = search.trim().toLowerCase();
		return hostels.filter((hostel) => {
			const matchesSearch = !query || [hostel.name, hostel.location, hostel.college].some((value) => value.toLowerCase().includes(query));
			const price = Number(hostel.price.replace(/[^0-9]/g, ''));
			const matchesBudget = !budget || (budget === 'under-8000' ? price < 8000 : price >= 8000 && price <= 10000);
			return matchesSearch && matchesBudget;
		});
	}, [budget, search]);

	const handleSearch = (event) => {
		event.preventDefault();
		const query = search.trim().toLowerCase();
		const firstMatch = query ? hostels.find((hostel) => hostel.location.toLowerCase().includes(query)) : null;
		if (firstMatch) setLocation(firstMatch.location.split(',')[1]?.trim() || firstMatch.location);
	};

	const useCurrentLocation = () => {
		if (!navigator.geolocation) {
			setLocationStatus('Location unavailable');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			() => {
				setLocation('Near you');
				setLocationStatus('Using your current location');
			},
			() => setLocationStatus('Location permission needed'),
			{ enableHighAccuracy: false, timeout: 5000 },
		);
	};

	return (
		<>
			<NavBar />
			<main className="hostels-page">
				<section className="hostels-hero">
					<div className="hostels-hero-copy"><p className="hostels-kicker">Your next chapter starts here</p><h1>Find a place that feels like <em>home.</em></h1><p>Verified hostels and PGs around your campus, your commute, and your kind of living.</p></div>
					<div className="hostels-location-note"><FiMapPin aria-hidden="true" /><span><strong>{locationStatus}</strong><small>{location}, India</small></span></div>
				</section>

				<section className="hostels-search-panel" aria-labelledby="hostel-search-title">
					<div className="hostels-search-title"><span className="hostels-search-number">01</span><div><p className="hostels-kicker">Start with what matters</p><h2 id="hostel-search-title">Search your next stay</h2></div></div>
					<form className="hostels-search-form" id="hostel-search-form" onSubmit={handleSearch}>
						<label className="hostels-search-field hostels-search-field-wide"><span>Where are you headed?</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="City, area, college or hostel name" /></label>
						<label className="hostels-search-field"><span>Monthly budget</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="">Any budget</option><option value="under-8000">Under Rs. 8,000</option><option value="8000-10000">Rs. 8,000 - 10,000</option></select></label>
						<button className="hostels-search-button" type="submit">Search stays <FiArrowUpRight aria-hidden="true" /></button>
					</form>
					<div className="hostels-search-meta"><span><FiClock aria-hidden="true" /> Recently searched</span>{recentSearches.map((item) => <button key={item} type="button" onClick={() => setSearch(item.split(',')[0])}>{item}</button>)}<button className="hostels-use-location" type="button" onClick={useCurrentLocation}><FiNavigation aria-hidden="true" /> Use current location</button></div>
				</section>

				<section className="hostels-section hostels-recommendations" aria-labelledby="recommendations-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Curated around you</p><h2 id="recommendations-title">Recommended near {location}</h2><p>Stays with the right balance of distance, comfort, and monthly rent.</p></div><button className="hostels-filter-button" type="button"><FiSliders aria-hidden="true" /> Filters</button></div><div className="property-grid">{hostels.slice(0, 3).map((hostel) => <div className="hostel-recommendation" key={hostel.name}><span>{hostel.tag}</span><PropertyCard hostel={hostel} /></div>)}</div></section>

				<section className="hostels-section hostels-browse" aria-labelledby="browse-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Make it yours</p><h2 id="browse-title">Browse all stays</h2><p>{filteredHostels.length} verified homes ready for your move.</p></div></div><div className="property-grid">{filteredHostels.map((hostel) => <PropertyCard key={hostel.name} hostel={hostel} />)}</div>{filteredHostels.length === 0 && <div className="hostels-empty"><h3>No exact matches yet.</h3><p>Try a nearby city, college, or a wider budget.</p><button type="button" onClick={() => { setSearch(''); setBudget(''); }}>Clear search</button></div>}</section>

				<section className="hostels-areas" aria-labelledby="areas-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Know your neighbourhood</p><h2 id="areas-title">Popular student areas</h2></div><a href="/hostels">Explore all areas <FiArrowUpRight aria-hidden="true" /></a></div><div className="hostels-area-grid">{popularAreas.map((area) => <a className={`hostels-area-card ${area.tone}`} href="/hostels" key={area.name}><span>{area.name}</span><small>{area.detail}</small><FiArrowUpRight aria-hidden="true" /></a>)}</div></section>

				<section className="hostels-trust"><div><p className="hostels-kicker">A little less uncertainty</p><h2>Every listing is checked for the details that matter.</h2></div><div className="hostels-trust-points"><span><strong>01</strong>Verified properties</span><span><strong>02</strong>Transparent pricing</span><span><strong>03</strong>Student reviews</span></div></section>
			</main>
			<Footer />
		</>
	);
};

export default Hostels;
