import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiMapPin, FiSliders } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { getPublicProperties } from '../../services/propertyCatalog';

const getSearchLabel = ({ query, college, location, matches }) => {
	if (!query) return 'your next campus';
	if (college && location) return `${college} near ${location}`;
	const matchedLocations = [...new Set(matches.map((hostel) => hostel.location))];
	return matchedLocations.length ? matchedLocations.join(' and ') : query;
};

const SearchResults = () => {
	const [params] = useSearchParams();
	const [hostels, setHostels] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [distance, setDistance] = useState('10');
	const [rent, setRent] = useState('any');
	const [gender, setGender] = useState('any');
	const college = params.get('college')?.trim() || '';
	const location = params.get('location')?.trim() || '';
	const freeTextQuery = params.get('q')?.trim() || '';
	const query = [college, location, freeTextQuery].filter(Boolean).join(' ').trim();
	const budget = params.get('budget');

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties()
			.then((page) => { if (isCurrent) setHostels(page.content); })
			.catch(() => { if (isCurrent) setLoadError('Listings are temporarily unavailable. Please try again shortly.'); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const directMatches = useMemo(() => {
		const normalizedQuery = query.toLowerCase();
		return hostels.filter((hostel) => {
			const searchable = `${hostel.name} ${hostel.location} ${hostel.college}`.toLowerCase();
			return !normalizedQuery || normalizedQuery.split(/\s+/).every((word) => searchable.includes(word));
		});
	}, [hostels, query]);
	const searchLabel = getSearchLabel({ query: freeTextQuery || college || location, college, location, matches: directMatches });
	const results = useMemo(() => {
		const normalizedQuery = query.toLowerCase();
		return hostels.filter((hostel) => {
			const searchable = `${hostel.name} ${hostel.location} ${hostel.college}`.toLowerCase();
			const matchesQuery = !normalizedQuery || normalizedQuery.split(/\s+/).every((word) => searchable.includes(word));
			const matchesDistance = hostel.distance == null || hostel.distance <= Number(distance);
			const matchesRent = rent === 'any' ? true : rent === 'under-8000' ? hostel.monthlyRent < 8000 : rent === '8000-10000' ? hostel.monthlyRent <= 10000 : hostel.monthlyRent > 10000;
			const matchesGender = gender === 'any' || hostel.gender === gender;
			const matchesBudget = !budget || (budget === 'under-5000' ? hostel.monthlyRent < 5000 : budget === '5000-10000' ? hostel.monthlyRent >= 5000 && hostel.monthlyRent <= 10000 : hostel.monthlyRent > 10000);
			return matchesQuery && matchesDistance && matchesRent && matchesGender && matchesBudget;
		}).sort((first, second) => (first.distance ?? Number.POSITIVE_INFINITY) - (second.distance ?? Number.POSITIVE_INFINITY));
	}, [budget, distance, gender, hostels, query, rent]);

	return (
		<>
			<NavBar />
			<main className="results-page">
				<section className="results-hero"><div><p className="results-kicker">Search results</p><h1>Stays that keep you close to <em>{searchLabel}</em>.</h1><p>Showing published listings and their current details from Homies Stay.</p></div><div className="results-hero-note"><FiMapPin aria-hidden="true" /><span><strong>{isLoading ? 'Loading stays…' : `${results.length} stays found`}</strong><small>Live listing data</small></span></div></section>
				<section className="results-content" aria-labelledby="results-title">
					<aside className="results-filters"><div className="results-filter-heading"><FiSliders aria-hidden="true" /><h2>Refine your stay</h2></div><label><span>Distance from campus</span><select value={distance} onChange={(event) => setDistance(event.target.value)}><option value="2">Within 2 km</option><option value="5">Within 5 km</option><option value="10">Within 10 km</option></select></label><label><span>Monthly rent</span><select value={rent} onChange={(event) => setRent(event.target.value)}><option value="any">Any rent</option><option value="under-8000">Under Rs. 8,000</option><option value="8000-10000">Rs. 8,000 - 10,000</option><option value="over-10000">Above Rs. 10,000</option></select></label><label><span>Hostel residents</span><select value={gender} onChange={(event) => setGender(event.target.value)}><option value="any">Any preference</option><option value="Female">Female students</option><option value="Male">Male students</option><option value="Unisex">Unisex hostel</option></select></label><div className="results-filter-note"><FiCheck aria-hidden="true" /><p>Listings shown here are approved and live.</p></div></aside>
					<div className="results-list"><div className="results-list-heading"><div><p className="results-kicker">Best matches first</p><h2 id="results-title">Hostels near {searchLabel}</h2></div><span>{isLoading ? 'Loading…' : `${results.length} results`}</span></div>{loadError ? <div className="results-empty" role="alert"><h3>Could not load stays.</h3><p>{loadError}</p></div> : isLoading ? <p role="status">Loading approved listings…</p> : results.length > 0 ? <div className="property-grid">{results.map((hostel) => <div className="results-card-wrap" key={hostel.id}>{hostel.distance != null && <span className="results-distance"><FiMapPin aria-hidden="true" /> {hostel.distance} km away</span>}<PropertyCard hostel={hostel} /></div>)}</div> : <div className="results-empty"><h3>No published stays match this search.</h3><p>Try a broader search or check back when more approved properties are available.</p></div>}</div>
				</section>
				<section className="results-reviews" aria-labelledby="reviews-title"><div className="results-reviews-heading"><div><p className="results-kicker">Student reviews</p><h2 id="reviews-title">Reviews from real residents.</h2></div><a href="/hostels">See all stays <FiArrowUpRight aria-hidden="true" /></a></div><p className="results-review-empty">No student reviews are available yet.</p></section>
			</main>
			<Footer />
		</>
	);
};

export default SearchResults;
