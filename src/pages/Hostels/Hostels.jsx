import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiClock, FiMapPin, FiNavigation } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { getPublicProperties } from '../../services/propertyCatalog';

const recentSearchesKey = 'homies-stay-recent-searches';
const getDistanceBetweenLocations = (latitude, longitude, property) => {
	const latitudeDifference = (latitude - Number(property.latitude)) * 111;
	const longitudeDifference = (longitude - Number(property.longitude)) * 111 * Math.cos((latitude * Math.PI) / 180);
	return Math.sqrt(latitudeDifference ** 2 + longitudeDifference ** 2);
};

const readRecentSearches = () => {
	try {
		return JSON.parse(window.localStorage.getItem(recentSearchesKey) || '[]');
	} catch {
		return [];
	}
};

const Hostels = () => {
	const navigate = useNavigate();
	const [hostels, setHostels] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [search, setSearch] = useState('');
	const [location, setLocation] = useState('');
	const [budget, setBudget] = useState('');
	const [recentSearches, setRecentSearches] = useState(readRecentSearches);
	const [locationStatus, setLocationStatus] = useState('Choose a destination');
	const [searchError, setSearchError] = useState('');

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties()
			.then((page) => { if (isCurrent) setHostels(page.content); })
			.catch(() => { if (isCurrent) setLoadError('Listings are temporarily unavailable. Please try again shortly.'); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const filteredHostels = useMemo(() => {
		const query = search.trim().toLowerCase();
		return hostels.filter((hostel) => {
			const matchesSearch = !query || [hostel.name, hostel.location, hostel.college].some((value) => value.toLowerCase().includes(query));
			const matchesBudget = !budget || (budget === 'under-8000' ? hostel.monthlyRent < 8000 : hostel.monthlyRent >= 8000 && hostel.monthlyRent <= 10000);
			return matchesSearch && matchesBudget;
		});
	}, [budget, hostels, search]);

	const cities = [...new Set(hostels.map((hostel) => hostel.city).filter(Boolean))];

	const handleSearch = (event) => {
		event.preventDefault();
		const query = search.trim();
		if (!query) {
			setSearchError('Enter a city, area, college, or hostel name first.');
			return;
		}
		setSearchError('');
		const nextSearches = [query, ...recentSearches.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
		window.localStorage.setItem(recentSearchesKey, JSON.stringify(nextSearches));
		setRecentSearches(nextSearches);
		const params = new URLSearchParams({ q: query });
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
			const locatedProperties = hostels.filter((property) => property.latitude != null && property.longitude != null && Number.isFinite(Number(property.latitude)) && Number.isFinite(Number(property.longitude)));
			if (!locatedProperties.length) {
				setLocationStatus('Location coordinates are not available for current listings');
				return;
			}
			const nearestProperty = locatedProperties.reduce((nearest, property) => {
				const distance = getDistanceBetweenLocations(position.coords.latitude, position.coords.longitude, property);
				return distance < nearest.distance ? { property, distance } : nearest;
			}, { property: locatedProperties[0], distance: Number.POSITIVE_INFINITY }).property;
			const nearestLocation = nearestProperty.city;
			setLocation(nearestLocation);
			setSearch(nearestLocation);
			setLocationStatus('Showing listings near your location');
			navigate(`/search-results?location=${encodeURIComponent(nearestLocation)}`);
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
					<div className="hostels-hero-copy"><p className="hostels-kicker">Your next chapter starts here</p><h1>Find a place that feels like <em>home.</em></h1><p>Browse approved stays published by Homies Stay property owners.</p></div>
					<div className="hostels-location-note"><FiMapPin aria-hidden="true" /><span><strong>{locationStatus}</strong><small>{location || 'No location selected'}{location ? ', India' : ''}</small></span></div>
				</section>

				<section className="hostels-search-panel" aria-labelledby="hostel-search-title">
					<div className="hostels-search-title"><span className="hostels-search-number">01</span><div><p className="hostels-kicker">Start with what matters</p><h2 id="hostel-search-title">Search your next stay</h2></div></div>
					<form className="hostels-search-form" id="hostel-search-form" onSubmit={handleSearch}>
						<label className="hostels-search-field hostels-search-field-wide"><span>Where are you headed?</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="City, area, college or hostel name" /></label>
						<label className="hostels-search-field"><span>Monthly budget</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="">Any budget</option><option value="under-8000">Under Rs. 8,000</option><option value="8000-10000">Rs. 8,000 - 10,000</option></select></label>
						<button className="hostels-search-button" type="submit">Search stays <FiArrowUpRight aria-hidden="true" /></button>
					</form>{searchError && <p className="hostels-search-error" role="alert">{searchError}</p>}
					<div className="hostels-search-meta"><span><FiClock aria-hidden="true" /> Recent searches</span>{recentSearches.map((item) => <button key={item} type="button" onClick={() => setSearch(item)}>{item}</button>)}<button className="hostels-use-location" type="button" onClick={useCurrentLocation}><FiNavigation aria-hidden="true" /> Use current location</button></div>
				</section>

				<section className="hostels-section hostels-recommendations" aria-labelledby="recommendations-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Recently approved</p><h2 id="recommendations-title">Available stays</h2><p>Listings visible here are published and approved.</p></div></div>{isLoading ? <p role="status">Loading available stays…</p> : loadError ? <p role="alert">{loadError}</p> : hostels.length ? <div className="property-grid">{hostels.slice(0, 3).map((hostel) => <PropertyCard hostel={hostel} key={hostel.id} />)}</div> : <div className="hostels-empty"><h3>No approved stays yet.</h3><p>Once property owners publish approved listings, they’ll appear here.</p></div>}</section>

				<section className="hostels-section hostels-browse" aria-labelledby="browse-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Live from the database</p><h2 id="browse-title">Browse all stays</h2><p>{isLoading ? 'Loading listings…' : `${filteredHostels.length} approved listings`}</p></div></div>{!isLoading && !loadError && filteredHostels.length > 0 && <div className="property-grid">{filteredHostels.map((hostel) => <PropertyCard key={hostel.id} hostel={hostel} />)}</div>}{!isLoading && !loadError && filteredHostels.length === 0 && <div className="hostels-empty"><h3>{hostels.length ? 'No exact matches.' : 'No approved listings yet.'}</h3><p>{hostels.length ? 'Try a different search or budget.' : 'New listings will appear here after an owner submits one and an administrator approves it.'}</p>{hostels.length > 0 && <button type="button" onClick={() => { setSearch(''); setBudget(''); }}>Clear search</button>}</div>}</section>

				{cities.length > 0 && <section className="hostels-areas" aria-labelledby="areas-title"><div className="hostels-section-heading"><div><p className="hostels-kicker">Explore locations</p><h2 id="areas-title">Cities with available stays</h2></div></div><div className="hostels-area-grid">{cities.map((city) => <a className="hostels-area-card" href={`/search-results?location=${encodeURIComponent(city)}`} key={city}><span>{city}</span><small>Browse approved listings</small><FiArrowUpRight aria-hidden="true" /></a>)}</div></section>}

				<section className="hostels-trust"><div><p className="hostels-kicker">A little less uncertainty</p><h2>Find a place that fits your next chapter.</h2></div><div className="hostels-trust-points"><span><strong>01</strong>Published by property owners</span><span><strong>02</strong>Clear monthly rent</span><span><strong>03</strong>Approved listings</span></div></section>
			</main>
			<Footer />
		</>
	);
};

export default Hostels;
