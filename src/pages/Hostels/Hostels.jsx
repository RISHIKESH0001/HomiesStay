import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiClock, FiMapPin, FiNavigation, FiSliders } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { roomBaruipur1, roomBaruipur2, roomBaruipur3, roomBaruipur4, roomBaruipur5, roomBengaluru1, roomHyderabad1, roomKolkata1, roomKolkata2, roomPune1, roomPune2, roomWorkspace } from '../../assets/hostelImages';
import { readStoredProperties, toPublicHostel } from '../../services/propertyStorage';

const hostels = [
	{ name: 'The Nest Residency', location: 'Koramangala, Bengaluru', college: 'Christ University', gender: 'Unisex', price: 'Rs. 8,500', rating: '4.8', image: roomBengaluru1, tag: 'Best match' },
	{ name: 'Campus Cove', location: 'Hinjewadi, Pune', college: 'Symbiosis Institute', gender: 'Unisex', price: 'Rs. 7,200', rating: '4.7', image: roomPune1, tag: 'Popular nearby' },
	{ name: 'Olive House Madhapur', location: 'Madhapur, Hyderabad', college: 'IIIT Hyderabad', gender: 'Unisex', price: 'Rs. 9,000', rating: '4.9', image: roomHyderabad1, tag: 'Top rated' },
	{ name: 'The Green Room', location: 'Salt Lake, Kolkata', college: 'IEM Kolkata', gender: 'Unisex', price: 'Rs. 6,800', rating: '4.6', image: roomKolkata1, tag: 'Value pick' },
	{ name: 'North Star Living', location: 'New Town, Kolkata', college: 'Techno India', gender: 'Unisex', price: 'Rs. 7,900', rating: '4.8', image: roomKolkata2, tag: 'New on Homies' },
	{ name: 'Maple Co-Live', location: 'Viman Nagar, Pune', college: 'MIT World Peace University', gender: 'Unisex', price: 'Rs. 8,100', rating: '4.7', image: roomPune2, tag: 'Move-in ready' },
	{ name: 'Baruipur Student Nest', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Unisex', price: 'Rs. 6,500', rating: '4.7', image: roomBaruipur1, tag: 'Campus nearby' },
	{ name: 'Gargi Girls Residency', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Female', price: 'Rs. 7,200', rating: '4.8', image: roomBaruipur4, tag: 'Popular with students' },
	{ name: 'South Campus Boys Home', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Male', price: 'Rs. 5,900', rating: '4.6', image: roomWorkspace, tag: 'Value pick' },
	{ name: 'Greenfield Co-Living', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Unisex', price: 'Rs. 8,100', rating: '4.9', image: roomBaruipur3, tag: 'Top rated' },
	{ name: 'Baruipur Scholars Stay', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Male', price: 'Rs. 6,800', rating: '4.7', image: roomBaruipur2, tag: 'Study friendly' },
	{ name: 'Lakeview Girls Hostel', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Female', price: 'Rs. 7,600', rating: '4.8', image: roomBaruipur5, tag: 'Quiet stay' },
];

const recentSearches = ['Salt Lake, Kolkata', 'IIT Kharagpur', 'Hostels under Rs. 8,000'];
const popularAreas = [
	{ name: 'Kolkata', detail: '342 verified stays', tone: 'sage' },
	{ name: 'Pune', detail: '218 verified stays', tone: 'yellow' },
	{ name: 'Bengaluru', detail: '196 verified stays', tone: 'blue' },
	{ name: 'Hyderabad', detail: '154 verified stays', tone: 'rose' },
];

const supportedLocations = [
	{ name: 'Baruipur', latitude: 22.3654, longitude: 88.4325 },
	{ name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
	{ name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
	{ name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
	{ name: 'Hyderabad', latitude: 17.385, longitude: 78.4867 },
];

const getDistanceBetweenLocations = (latitude, longitude, location) => {
	const latitudeDifference = (latitude - location.latitude) * 111;
	const longitudeDifference = (longitude - location.longitude) * 111 * Math.cos((latitude * Math.PI) / 180);
	return Math.sqrt(latitudeDifference ** 2 + longitudeDifference ** 2);
};

const Hostels = () => {
	const navigate = useNavigate();
	const [ownerListings] = useState(() => readStoredProperties().filter((property) => property.status === 'Live').map(toPublicHostel));
	const [search, setSearch] = useState('');
	const [location, setLocation] = useState('Kolkata');
	const [budget, setBudget] = useState('');
	const [locationStatus, setLocationStatus] = useState('Based on your location');
	const [searchError, setSearchError] = useState('');

	const filteredHostels = useMemo(() => {
		const query = search.trim().toLowerCase();
		return [...hostels, ...ownerListings].filter((hostel) => {
			const matchesSearch = !query || [hostel.name, hostel.location, hostel.college].some((value) => value.toLowerCase().includes(query));
			const price = Number(hostel.price.replace(/[^0-9]/g, ''));
			const matchesBudget = !budget || (budget === 'under-8000' ? price < 8000 : price >= 8000 && price <= 10000);
			return matchesSearch && matchesBudget;
		});
	}, [budget, ownerListings, search]);

	const handleSearch = (event) => {
		event.preventDefault();
		if (!search.trim()) {
			setSearchError('Enter a city, area, college, or hostel name first.');
			return;
		}
		setSearchError('');
		const params = new URLSearchParams();
		if (search.trim()) params.set('q', search.trim());
		if (budget) params.set('budget', budget);
		navigate(`/search-results?${params.toString()}`);
	};

	const useCurrentLocation = () => {
		if (!navigator.geolocation) {
			setLocationStatus('Location unavailable');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const nearestLocation = supportedLocations.reduce((nearest, candidate) => {
					const candidateDistance = getDistanceBetweenLocations(position.coords.latitude, position.coords.longitude, candidate);
					return candidateDistance < nearest.distance ? { location: candidate, distance: candidateDistance } : nearest;
				}, { location: supportedLocations[0], distance: Number.POSITIVE_INFINITY }).location;
				setLocation(nearestLocation.name);
				setLocationStatus('Showing stays near your location');
				navigate(`/search-results?location=${encodeURIComponent(nearestLocation.name)}`);
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
					</form>{searchError && <p className="hostels-search-error" role="alert">{searchError}</p>}
					<div className="hostels-search-meta"><span><FiClock aria-hidden="true" /> Recently searched</span>{recentSearches.map((item) => <button key={item} type="button" onClick={() => setSearch(item.split(',')[0])}>{item}</button>)}<button className="hostels-use-location" type="button" onClick={useCurrentLocation}><FiNavigation aria-hidden="true" /> Use current location</button></div>
				</section>

				<section className="hostels-section hostels-recommendations" aria-labelledby="recommendations-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Curated around you</p><h2 id="recommendations-title">Recommended near {location}</h2><p>Stays with the right balance of distance, comfort, and monthly rent.</p></div><button className="hostels-filter-button" type="button"><FiSliders aria-hidden="true" /> Filters</button></div><div className="property-grid">{[...hostels, ...ownerListings].slice(0, 3).map((hostel) => <div className="hostel-recommendation" key={hostel.name}><span>{hostel.tag}</span><PropertyCard hostel={hostel} /></div>)}</div></section>

				<section className="hostels-section hostels-browse" aria-labelledby="browse-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Make it yours</p><h2 id="browse-title">Browse all stays</h2><p>{filteredHostels.length} verified homes ready for your move.</p></div></div><div className="property-grid">{filteredHostels.map((hostel) => <PropertyCard key={hostel.name} hostel={hostel} />)}</div>{filteredHostels.length === 0 && <div className="hostels-empty"><h3>No exact matches yet.</h3><p>Try a nearby city, college, or a wider budget.</p><button type="button" onClick={() => { setSearch(''); setBudget(''); }}>Clear search</button></div>}</section>

				<section className="hostels-areas" aria-labelledby="areas-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Know your neighbourhood</p><h2 id="areas-title">Popular student areas</h2></div><a href="/hostels">Explore all areas <FiArrowUpRight aria-hidden="true" /></a></div><div className="hostels-area-grid">{popularAreas.map((area) => <a className={`hostels-area-card ${area.tone}`} href={`/search-results?location=${encodeURIComponent(area.name)}`} key={area.name}><span>{area.name}</span><small>{area.detail}</small><FiArrowUpRight aria-hidden="true" /></a>)}</div></section>

				<section className="hostels-trust"><div><p className="hostels-kicker">A little less uncertainty</p><h2>Every listing is checked for the details that matter.</h2></div><div className="hostels-trust-points"><span><strong>01</strong>Verified properties</span><span><strong>02</strong>Transparent pricing</span><span><strong>03</strong>Student reviews</span></div></section>
			</main>
			<Footer />
		</>
	);
};

export default Hostels;
