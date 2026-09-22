import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiMapPin, FiSliders, FiStar } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { roomBaruipur1, roomBaruipur2, roomBaruipur3, roomBaruipur4, roomBaruipur5, roomBengaluru1, roomHyderabad1, roomKolkata1, roomKolkata2, roomModern1, roomModern2, roomModern3, roomPune1, roomPune2, roomWorkspace } from '../../assets/hostelImages';
import { readStoredProperties, toPublicHostel } from '../../services/propertyStorage';

const hostels = [
	{ name: 'The Nest Residency', location: 'Koramangala, Bengaluru', college: 'Christ University', gender: 'Unisex', price: 'Rs. 8,500', rating: '4.8', distance: 1.2, image: roomBengaluru1 },
	{ name: 'Casa Nook', location: 'HSR Layout, Bengaluru', college: 'Christ University', gender: 'Unisex', price: 'Rs. 12,800', rating: '4.8', distance: 2.8, image: roomModern2 },
	{ name: 'Mango Tree Living', location: 'Indiranagar, Bengaluru', college: 'Christ University', gender: 'Unisex', price: 'Rs. 11,500', rating: '4.7', distance: 4.5, image: roomModern3 },
	{ name: 'The Olive House', location: 'Koramangala, Bengaluru', college: 'Christ University', gender: 'Unisex', price: 'Rs. 14,500', rating: '4.9', distance: 1.5, image: roomHyderabad1 },
	{ name: 'Campus Cove', location: 'Hinjewadi, Pune', college: 'Symbiosis Institute', gender: 'Unisex', price: 'Rs. 7,200', rating: '4.7', distance: 1.8, image: roomPune1 },
	{ name: 'Maple Co-Live', location: 'Viman Nagar, Pune', college: 'MIT World Peace University', gender: 'Unisex', price: 'Rs. 8,100', rating: '4.7', distance: 3.4, image: roomPune2 },
	{ name: 'Olive House Madhapur', location: 'Madhapur, Hyderabad', college: 'IIIT Hyderabad', gender: 'Unisex', price: 'Rs. 9,000', rating: '4.9', distance: 2.1, image: roomModern1 },
	{ name: 'The Green Room', location: 'Salt Lake, Kolkata', college: 'IEM Kolkata', gender: 'Unisex', price: 'Rs. 6,800', rating: '4.6', distance: 1.4, image: roomKolkata1 },
	{ name: 'North Star Living', location: 'New Town, Kolkata', college: 'Techno India', gender: 'Unisex', price: 'Rs. 7,900', rating: '4.8', distance: 4.2, image: roomKolkata2 },
	{ name: 'Baruipur Student Nest', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Unisex', price: 'Rs. 6,500', rating: '4.7', distance: 0.9, image: roomBaruipur1 },
	{ name: 'Gargi Girls Residency', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Female', price: 'Rs. 7,200', rating: '4.8', distance: 1.1, image: roomBaruipur4 },
	{ name: 'South Campus Boys Home', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Male', price: 'Rs. 5,900', rating: '4.6', distance: 1.4, image: roomWorkspace },
	{ name: 'Greenfield Co-Living', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Unisex', price: 'Rs. 8,100', rating: '4.9', distance: 1.8, image: roomBaruipur3 },
	{ name: 'Baruipur Scholars Stay', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Male', price: 'Rs. 6,800', rating: '4.7', distance: 2.3, image: roomBaruipur2 },
	{ name: 'Lakeview Girls Hostel', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', gender: 'Female', price: 'Rs. 7,600', rating: '4.8', distance: 2.7, image: roomBaruipur5 },
];

const reviews = [
	{ name: 'Ananya S.', stay: 'The Nest Residency', quote: 'The commute to class is genuinely easy, and the listing matched what I saw in person.' },
	{ name: 'Rohan M.', stay: 'Casa Nook', quote: 'Good light, helpful staff, and enough quiet space to actually study after college.' },
	{ name: 'Meera K.', stay: 'The Olive House', quote: 'The photos were accurate and the move-in process felt much less stressful than expected.' },
	{ name: 'Ishita R.', stay: 'Campus Cove', quote: 'The location makes daily travel simple, and the common spaces are kept clean.' },
	{ name: 'Tanya B.', stay: 'Maple Co-Live', quote: 'A clean, well-connected apartment with a good balance of privacy and community.' },
	{ name: 'Kabir S.', stay: 'Olive House Madhapur', quote: 'A comfortable premium stay with thoughtful amenities and a manageable commute.' },
	{ name: 'Soham D.', stay: 'The Green Room', quote: 'It is a practical stay with a short commute and everything needed for a student routine.' },
	{ name: 'Aditi G.', stay: 'North Star Living', quote: 'Bright rooms, quick access to campus, and a much more comfortable setup than my last place.' },
	{ name: 'Pooja T.', stay: 'Mango Tree Living', quote: 'The shared spaces are welcoming and the neighbourhood has everything nearby.' },
	{ name: 'Sana F.', stay: 'The Olive House', quote: 'Beautiful common areas, thoughtful service, and a very comfortable place to come back to.' },
	{ name: 'Moumita C.', stay: 'Baruipur Student Nest', quote: 'The campus is close, the rent is manageable, and the shared setup feels welcoming.' },
	{ name: 'Riya B.', stay: 'Gargi Girls Residency', quote: 'The surroundings feel comfortable and the daily commute to college is very convenient.' },
	{ name: 'Sourav D.', stay: 'South Campus Boys Home', quote: 'A practical stay near campus with helpful management and a student-friendly price.' },
	{ name: 'Anik P.', stay: 'Greenfield Co-Living', quote: 'Clean common spaces, good connectivity, and a friendly mix of students.' },
	{ name: 'Subhajit R.', stay: 'Baruipur Scholars Stay', quote: 'The study-friendly environment and short ride to campus work well for my routine.' },
	{ name: 'Priya M.', stay: 'Lakeview Girls Hostel', quote: 'The hostel is peaceful, well maintained, and close enough to walk to local transport.' },
];

const getPrice = (hostel) => Number(hostel.price.replace(/[^0-9]/g, ''));

const getSearchLabel = ({ query, college, location, directMatches }) => {
	if (!query) return 'your next campus';
	if (college && location) return `${college} near ${location}`;

	const normalizedQuery = query.toLowerCase();
	const nameMatches = directMatches.filter((hostel) => hostel.name.toLowerCase().includes(normalizedQuery));
	if (nameMatches.length > 0) return nameMatches.map((hostel) => hostel.name).join(' and ');

	const locationMatches = [...new Set(directMatches.filter((hostel) => hostel.location.toLowerCase().includes(normalizedQuery)).map((hostel) => hostel.location))];
	if (locationMatches.length > 0) return locationMatches.join(' and ');

	const collegeMatches = [...new Set(directMatches.filter((hostel) => hostel.college.toLowerCase().includes(normalizedQuery)).map((hostel) => hostel.college))];
	if (collegeMatches.length > 0) return collegeMatches.join(' and ');

	return directMatches.length === 1 ? directMatches[0].name : query;
};

const getSearchContextLabel = ({ college, location, directMatches }) => {
	const colleges = [...new Set(directMatches.map((hostel) => hostel.college))];
	if (colleges.length === 1) return colleges[0];
	if (college) return college;
	if (location) return location.split(',').pop().trim();
	if (directMatches.length === 0) return 'your next campus';

	const towns = [...new Set(directMatches.map((hostel) => hostel.location.split(',').pop().trim()))];
	return towns.length === 1 ? towns[0] : towns.slice(0, 2).join(' and ');
};

const SearchResults = () => {
	const [params] = useSearchParams();
	const [ownerListings] = useState(() => readStoredProperties().filter((property) => property.status === 'Live').map(toPublicHostel));
	const allHostels = useMemo(() => [...hostels, ...ownerListings], [ownerListings]);
	const [distance, setDistance] = useState('10');
	const [rent, setRent] = useState('any');
	const [gender, setGender] = useState('any');
	const college = params.get('college')?.trim() || '';
	const location = params.get('location')?.trim() || '';
	const freeTextQuery = params.get('q')?.trim() || '';
	const query = [college, location, freeTextQuery].filter(Boolean).join(' ').trim();
	const budget = params.get('budget');
	const directMatches = useMemo(() => {
		const normalizedQuery = query.toLowerCase();
		return allHostels.filter((hostel) => {
			const searchable = `${hostel.name} ${hostel.location} ${hostel.college}`.toLowerCase();
			return !normalizedQuery || normalizedQuery.split(/\s+/).every((word) => searchable.includes(word));
		});
	}, [allHostels, query]);
	const searchLabel = getSearchLabel({ query: freeTextQuery || college || location, college, location, directMatches }) || 'your next campus';
	const searchContextLabel = getSearchContextLabel({ college, location, directMatches });
	const hostelSearchText = (freeTextQuery || college).toLowerCase();
	const searchedHostelNames = hostelSearchText ? directMatches.filter((hostel) => hostel.name.toLowerCase().includes(hostelSearchText)).map((hostel) => hostel.name) : [];

	const results = useMemo(() => {
		const normalizedQuery = query.toLowerCase();
		const nearbyLocations = new Set(directMatches.map((hostel) => hostel.location.toLowerCase()));
		const nearbyColleges = new Set(directMatches.map((hostel) => hostel.college.toLowerCase()));
		return allHostels
			.filter((hostel) => {
				const searchable = `${hostel.name} ${hostel.location} ${hostel.college}`.toLowerCase();
				const matchesQuery = !normalizedQuery || normalizedQuery.split(/\s+/).every((word) => searchable.includes(word));
				const isNearby = normalizedQuery && (nearbyLocations.has(hostel.location.toLowerCase()) || nearbyColleges.has(hostel.college.toLowerCase()));
				const matchesDistance = hostel.distance <= Number(distance);
				const price = getPrice(hostel);
				const matchesRent = rent === 'any' ? true : rent === 'under-8000' ? price < 8000 : rent === '8000-10000' ? price <= 10000 : price > 10000;
				const matchesGender = gender === 'any' || hostel.gender === gender;
				const matchesBudget = !budget || budget === 'under-5000' ? !budget || price < 5000 : budget === '5000-10000' ? price >= 5000 && price <= 10000 : price > 10000;
				return (matchesQuery || isNearby) && matchesDistance && matchesRent && matchesGender && matchesBudget;
			})
			.sort((first, second) => first.distance - second.distance);
	}, [allHostels, budget, directMatches, distance, gender, query, rent]);
	const recommendations = useMemo(() => {
		const resultNames = new Set(results.map((hostel) => hostel.name));
		return reviews.filter((review) => resultNames.has(review.stay)).slice(0, 3);
	}, [results]);

	return (
		<>
			<NavBar />
			<main className="results-page">
				<section className="results-hero"><div><p className="results-kicker">Search results</p><h1>Stays that keep you close to <em>{searchContextLabel}</em>.</h1><p>Verified student homes, sorted by how easy they make your everyday commute.</p></div><div className="results-hero-note"><FiMapPin aria-hidden="true" /><span><strong>{results.length} stays found</strong><small>Updated this week</small></span></div></section>
				<section className="results-content" aria-labelledby="results-title">
					<aside className="results-filters"><div className="results-filter-heading"><FiSliders aria-hidden="true" /><h2>Refine your stay</h2></div><label><span>Distance from campus</span><select value={distance} onChange={(event) => setDistance(event.target.value)}><option value="2">Within 2 km</option><option value="5">Within 5 km</option><option value="10">Within 10 km</option></select></label><label><span>Monthly rent</span><select value={rent} onChange={(event) => setRent(event.target.value)}><option value="any">Any rent</option><option value="under-8000">Under Rs. 8,000</option><option value="8000-10000">Rs. 8,000 - 10,000</option><option value="over-10000">Above Rs. 10,000</option></select></label><label><span>Hostel residents</span><select value={gender} onChange={(event) => setGender(event.target.value)}><option value="any">Any preference</option><option value="Female">Female students</option><option value="Male">Male students</option><option value="Unisex">Unisex hostel</option></select></label><div className="results-filter-note"><FiCheck aria-hidden="true" /><p>Every property is checked for price, location, and student-ready essentials.</p></div></aside>
					<div className="results-list"><div className="results-list-heading"><div><p className="results-kicker">Best matches first</p><h2 id="results-title">Hostels near {searchLabel}</h2>{searchedHostelNames.length > 0 && <p className="results-specific-stay">Specific stay: <strong>{searchedHostelNames.join(' and ')}</strong></p>}</div><span>{results.length} results</span></div>{results.length > 0 ? <div className="property-grid">{results.map((hostel) => <div className="results-card-wrap" key={hostel.name}><span className="results-distance"><FiMapPin aria-hidden="true" /> {hostel.distance} km away</span><PropertyCard hostel={hostel} /></div>)}</div> : <div className="results-empty"><h3>No stays match these filters.</h3><p>Try widening your distance or monthly rent range.</p></div>}</div>
				</section>
				<section className="results-reviews" aria-labelledby="reviews-title"><div className="results-reviews-heading"><div><p className="results-kicker">From the student community</p><h2 id="reviews-title">Top recommendations near {searchLabel}.</h2></div><a href="/hostels">See all stays <FiArrowUpRight aria-hidden="true" /></a></div>{recommendations.length > 0 ? <div className="results-review-grid">{recommendations.map((review) => <article className="results-review" key={review.name}><div className="results-review-rating"><FiStar aria-hidden="true" /> 5.0</div><p>“{review.quote}”</p><footer><strong>{review.name}</strong><span>Stayed at {review.stay}</span></footer></article>)}</div> : <p className="results-review-empty">Student recommendations for this search are coming soon.</p>}</section>
			</main>
			<Footer />
		</>
	);
};

export default SearchResults;
