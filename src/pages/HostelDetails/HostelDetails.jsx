import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiHeart, FiMapPin, FiMessageCircle, FiShield, FiStar, FiUsers } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';

const hostelDetails = {
	'the-nest-residency': { name: 'The Nest Residency', location: 'Koramangala, Bengaluru', college: 'Christ University', price: 'Rs. 8,500', rating: '4.8', reviews: '126', image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1400&q=85', type: 'Private rooms and co-living', commute: '12 min to Christ University', description: 'A bright, well-connected stay for students who want the energy of Koramangala close by and a comfortable place to come back to.', amenities: ['Wi-Fi', 'Housekeeping', 'Power backup', 'Study lounge', 'Meals available', '24/7 security'] },
	'campus-cove': { name: 'Campus Cove', location: 'Hinjewadi, Pune', college: 'Symbiosis Institute', price: 'Rs. 7,200', rating: '4.7', reviews: '98', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=85', type: 'Shared rooms and co-living', commute: '8 min to Symbiosis Institute', description: 'A practical, social home base in Hinjewadi with the essentials sorted for a smooth college routine.', amenities: ['Wi-Fi', 'Laundry', 'Gym access', 'Common kitchen', 'Parking', 'CCTV'] },
	'olive-house-madhapur': { name: 'Olive House Madhapur', location: 'Madhapur, Hyderabad', college: 'IIIT Hyderabad', price: 'Rs. 9,000', rating: '4.9', reviews: '151', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=85', type: 'Premium co-living', commute: '15 min to IIIT Hyderabad', description: 'A calm, thoughtfully designed co-living space in Madhapur with room to focus, recharge, and meet your people.', amenities: ['Wi-Fi', 'Daily meals', 'Rooftop', 'Fitness room', 'Study lounge', 'Housekeeping'] },
	'the-green-room': { name: 'The Green Room', location: 'Salt Lake, Kolkata', college: 'IEM Kolkata', price: 'Rs. 6,800', rating: '4.6', reviews: '74', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85', type: 'Student hostel', commute: '10 min to IEM Kolkata', description: 'An easy, value-focused stay in Salt Lake for students who want a simple commute and a welcoming community.', amenities: ['Wi-Fi', 'Meals available', 'Laundry', 'Power backup', 'CCTV', 'Common room'] },
	'north-star-living': { name: 'North Star Living', location: 'New Town, Kolkata', college: 'Techno India', price: 'Rs. 7,900', rating: '4.8', reviews: '62', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85', type: 'Modern co-living', commute: '9 min to Techno India', description: 'A new-on-Homies stay with clean lines, flexible rooms, and a quick route to New Town campuses.', amenities: ['Wi-Fi', 'Study desks', 'Laundry', 'Security', 'Common kitchen', 'Parking'] },
	'maple-co-live': { name: 'Maple Co-Live', location: 'Viman Nagar, Pune', college: 'MIT World Peace University', price: 'Rs. 8,100', rating: '4.7', reviews: '88', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=85', type: 'Shared apartments', commute: '14 min to MIT World Peace University', description: 'A move-in-ready shared apartment for students who want privacy, connection, and a well-placed Pune address.', amenities: ['Wi-Fi', 'Fully furnished', 'Housekeeping', 'Security', 'Power backup', 'Bike parking'] },
	'casa-nook': { name: 'Casa Nook', location: 'HSR Layout, Bengaluru', college: 'Christ University', price: 'Rs. 12,800', rating: '4.8', reviews: '103', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85', type: 'Private rooms', commute: '18 min to Christ University', description: 'A comfortable private-room option in HSR Layout with the space and calm to settle into your next chapter.', amenities: ['Wi-Fi', 'Fully furnished', 'Laundry', 'Security', 'Study desks', 'Common area'] },
	'mango-tree-living': { name: 'Mango Tree Living', location: 'Indiranagar, Bengaluru', college: 'Christ University', price: 'Rs. 11,500', rating: '4.7', reviews: '67', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85', type: 'Shared apartments', commute: '16 min to Christ University', description: 'A leafy shared stay in Indiranagar with generous common spaces and a relaxed community feel.', amenities: ['Wi-Fi', 'Common kitchen', 'Laundry', 'Power backup', 'Security', 'Study lounge'] },
	'the-olive-house': { name: 'The Olive House', location: 'Koramangala, Bengaluru', college: 'Christ University', price: 'Rs. 14,500', rating: '4.9', reviews: '142', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=85', type: 'Premium co-living', commute: '12 min to Christ University', description: 'A polished co-living stay in Koramangala with a warm shared atmosphere and everything close at hand.', amenities: ['Wi-Fi', 'Daily meals', 'Gym access', 'Housekeeping', 'Study lounge', '24/7 security'] },
	'the-nest-collective': { name: 'The Nest Collective', location: 'Indiranagar, Bengaluru', college: 'Christ University', price: 'Rs. 10,900', rating: '4.7', reviews: '91', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=85', type: 'Shared apartments', commute: '20 min to Christ University', description: 'A community-minded shared apartment in Indiranagar for students who like their city life close and lively.', amenities: ['Wi-Fi', 'Common kitchen', 'Laundry', 'Power backup', 'Security', 'Rooftop'] },
	'baruipur-student-nest': { name: 'Baruipur Student Nest', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 6,500', rating: '4.7', reviews: '38', image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=85', type: 'Shared student hostel', commute: '9 min to Gargi Memorial Institute of Technology', description: 'A practical, welcoming student stay near Gargi Memorial Institute of Technology with essentials that keep daily life simple.', amenities: ['Wi-Fi', 'Meals available', 'Laundry', 'Study desks', 'Power backup', 'Security'] },
	'gargi-girls-residency': { name: 'Gargi Girls Residency', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 7,200', rating: '4.8', reviews: '44', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85', type: 'Women-only hostel', commute: '11 min to Gargi Memorial Institute of Technology', description: 'A comfortable women-only residence in Baruipur with a calm setting and an easy route to campus.', amenities: ['Wi-Fi', 'CCTV', 'Housekeeping', 'Common room', 'Meals available', '24/7 security'] },
	'south-campus-boys-home': { name: 'South Campus Boys Home', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 5,900', rating: '4.6', reviews: '31', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85', type: 'Men-only hostel', commute: '14 min to Gargi Memorial Institute of Technology', description: 'A value-focused men-only hostel for students who want a straightforward commute and study-friendly routine.', amenities: ['Wi-Fi', 'Study desks', 'Laundry', 'Parking', 'Power backup', 'Security'] },
	'greenfield-co-living': { name: 'Greenfield Co-Living', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 8,100', rating: '4.9', reviews: '52', image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85', type: 'Unisex co-living', commute: '18 min to Gargi Memorial Institute of Technology', description: 'A modern unisex co-living space with bright shared areas, reliable essentials, and a relaxed student community.', amenities: ['Wi-Fi', 'Common kitchen', 'Fitness room', 'Housekeeping', 'Rooftop', 'Security'] },
	'baruipur-scholars-stay': { name: 'Baruipur Scholars Stay', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 6,800', rating: '4.7', reviews: '35', image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1400&q=85', type: 'Men-only hostel', commute: '23 min to Gargi Memorial Institute of Technology', description: 'A quiet, study-friendly stay for students looking for clear pricing and a dependable campus routine.', amenities: ['Wi-Fi', 'Study lounge', 'Meals available', 'Laundry', 'CCTV', 'Power backup'] },
	'lakeview-girls-hostel': { name: 'Lakeview Girls Hostel', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 7,600', rating: '4.8', reviews: '41', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85', type: 'Women-only hostel', commute: '27 min to Gargi Memorial Institute of Technology', description: 'A peaceful women-only hostel with a residential feel, useful amenities, and access to local transport.', amenities: ['Wi-Fi', 'Security', 'Common room', 'Laundry', 'Study desks', 'Meals available'] },
};

const hostelReviews = {
	'the-nest-residency': [
		{ name: 'Ananya S.', course: 'Christ University, 3rd year', rating: '5.0', quote: 'The commute is genuinely easy, and the room looked exactly like the photos. The team was helpful during move-in.' },
		{ name: 'Dev P.', course: 'Christ University, 2nd year', rating: '4.8', quote: 'A friendly place with reliable Wi-Fi and enough quiet space to study after class.' },
	],
	'campus-cove': [
		{ name: 'Ishita R.', course: 'Symbiosis Institute, 2nd year', rating: '4.9', quote: 'The location makes daily travel simple, and the common spaces are kept clean.' },
		{ name: 'Arjun M.', course: 'Symbiosis Institute, 1st year', rating: '4.7', quote: 'Good value for the area and a smooth process from enquiry to move-in.' },
	],
	'olive-house-madhapur': [
		{ name: 'Meera K.', course: 'IIIT Hyderabad, 3rd year', rating: '5.0', quote: 'The photos were accurate, the space feels calm, and the staff made settling in easy.' },
		{ name: 'Kabir S.', course: 'IIIT Hyderabad, 2nd year', rating: '4.9', quote: 'A comfortable premium stay with thoughtful amenities and a manageable commute.' },
	],
	'baruipur-student-nest': [
		{ name: 'Moumita C.', course: 'Gargi Memorial Institute of Technology, 2nd year', rating: '4.8', quote: 'The campus is close, the rent is manageable, and the shared setup feels welcoming.' },
		{ name: 'Ayan S.', course: 'Gargi Memorial Institute of Technology, 1st year', rating: '4.6', quote: 'A practical place to start college life with helpful management and reliable essentials.' },
	],
	'gargi-girls-residency': [
		{ name: 'Riya B.', course: 'Gargi Memorial Institute of Technology, 3rd year', rating: '4.9', quote: 'The surroundings feel comfortable and the daily commute to college is very convenient.' },
		{ name: 'Mitali P.', course: 'Gargi Memorial Institute of Technology, 1st year', rating: '4.7', quote: 'The residence is peaceful, well maintained, and easy to settle into.' },
	],
	'south-campus-boys-home': [
		{ name: 'Sourav D.', course: 'Gargi Memorial Institute of Technology, 2nd year', rating: '4.7', quote: 'A practical stay near campus with helpful management and a student-friendly price.' },
		{ name: 'Ritwik G.', course: 'Gargi Memorial Institute of Technology, 3rd year', rating: '4.5', quote: 'The commute works well and the study desks are useful during exam season.' },
	],
	'greenfield-co-living': [
		{ name: 'Anik P.', course: 'Gargi Memorial Institute of Technology, 4th year', rating: '5.0', quote: 'Clean common spaces, good connectivity, and a friendly mix of students.' },
		{ name: 'Srijita N.', course: 'Gargi Memorial Institute of Technology, 2nd year', rating: '4.8', quote: 'A bright, modern stay with a relaxed community and dependable amenities.' },
	],
	'baruipur-scholars-stay': [
		{ name: 'Subhajit R.', course: 'Gargi Memorial Institute of Technology, 2nd year', rating: '4.8', quote: 'The study-friendly environment and short ride to campus work well for my routine.' },
		{ name: 'Abhishek M.', course: 'Gargi Memorial Institute of Technology, 1st year', rating: '4.6', quote: 'Clear pricing, a quiet setup, and a straightforward move-in process.' },
	],
	'lakeview-girls-hostel': [
		{ name: 'Priya M.', course: 'Gargi Memorial Institute of Technology, 3rd year', rating: '4.9', quote: 'The hostel is peaceful, well maintained, and close enough to local transport.' },
		{ name: 'Sneha K.', course: 'Gargi Memorial Institute of Technology, 2nd year', rating: '4.7', quote: 'The residential feel and study desks make it a comfortable place for college life.' },
	],
	'the-green-room': [
		{ name: 'Soham D.', course: 'IEM Kolkata, 2nd year', rating: '4.7', quote: 'It is a practical stay with a short commute and everything needed for a student routine.' },
		{ name: 'Riya N.', course: 'IEM Kolkata, 1st year', rating: '4.6', quote: 'The value is excellent and the owners are responsive when something needs attention.' },
	],
	'north-star-living': [
		{ name: 'Aditi G.', course: 'Techno India, 3rd year', rating: '4.8', quote: 'Bright rooms, quick access to campus, and a much more comfortable setup than my last place.' },
		{ name: 'Nikhil J.', course: 'Techno India, 2nd year', rating: '4.8', quote: 'The property feels new and the move-in details were clear from the start.' },
	],
	'maple-co-live': [
		{ name: 'Tanya B.', course: 'MIT World Peace University, 2nd year', rating: '4.8', quote: 'A clean, well-connected apartment with a good balance of privacy and community.' },
		{ name: 'Om P.', course: 'MIT World Peace University, 1st year', rating: '4.6', quote: 'The furnishing and power backup made the move much easier than expected.' },
	],
	'casa-nook': [
		{ name: 'Neha V.', course: 'Christ University, 3rd year', rating: '4.8', quote: 'The room gets lovely light and there is enough space to focus without feeling boxed in.' },
		{ name: 'Rahul A.', course: 'Christ University, 1st year', rating: '4.7', quote: 'A comfortable private-room option with helpful staff and a relaxed atmosphere.' },
	],
	'mango-tree-living': [
		{ name: 'Pooja T.', course: 'Christ University, 2nd year', rating: '4.8', quote: 'The shared spaces are welcoming and the neighbourhood has everything nearby.' },
		{ name: 'Yash K.', course: 'Christ University, 3rd year', rating: '4.6', quote: 'It feels lived-in in a good way, with a friendly community and a straightforward commute.' },
	],
	'the-olive-house': [
		{ name: 'Sana F.', course: 'Christ University, 4th year', rating: '5.0', quote: 'Beautiful common areas, thoughtful service, and a very comfortable place to come back to.' },
		{ name: 'Aditya P.', course: 'Christ University, 2nd year', rating: '4.8', quote: 'The premium details are real, especially the study lounge and daily support.' },
	],
};

const HostelDetails = () => {
	const { hostelId } = useParams();
	const hostel = hostelDetails[hostelId] || hostelDetails['the-nest-residency'];
	const reviews = hostelReviews[hostelId] || hostelReviews['the-nest-residency'];
	const [isSaved, setIsSaved] = useState(false);
	const [enquirySent, setEnquirySent] = useState(false);

	return (
		<>
			<NavBar />
			<main className="hostel-detail-page">
				<div className="hostel-detail-inner"><Link className="hostel-back-link" to="/hostels"><FiArrowLeft aria-hidden="true" /> Back to all hostels</Link>
					<section className="hostel-detail-hero"><div className="hostel-detail-image"><img src={hostel.image} alt={`${hostel.name} accommodation`} /><span><FiShield aria-hidden="true" /> Verified property</span></div><div className="hostel-detail-summary"><p className="hostel-detail-kicker">{hostel.type}</p><h1>{hostel.name}</h1><p className="hostel-detail-location"><FiMapPin aria-hidden="true" /> {hostel.location}</p><div className="hostel-detail-rating"><strong><FiStar aria-hidden="true" /> {hostel.rating}</strong><span>{hostel.reviews} student reviews</span></div><p className="hostel-detail-description">{hostel.description}</p><div className="hostel-detail-price"><strong>{hostel.price}</strong><span>/ month</span></div><div className="hostel-detail-actions"><button className="hostel-enquire-button" type="button" onClick={() => setEnquirySent(true)}><FiMessageCircle aria-hidden="true" /> {enquirySent ? 'Enquiry sent' : 'Contact owner'}</button><button className={isSaved ? 'hostel-save-button saved' : 'hostel-save-button'} type="button" onClick={() => setIsSaved((current) => !current)} aria-label={isSaved ? 'Remove saved hostel' : 'Save hostel'}><FiHeart aria-hidden="true" /></button></div>{enquirySent && <p className="hostel-enquiry-note" role="status"><FiCheck aria-hidden="true" /> The owner will be notified. You can track replies from your dashboard.</p>}</div></section>

					<section className="hostel-detail-content"><div className="hostel-detail-main"><div className="hostel-detail-section"><p className="hostel-detail-kicker">A good fit if you want</p><h2>Less guesswork, more room to settle in.</h2><div className="hostel-detail-highlights"><span><FiMapPin aria-hidden="true" /><strong>Well connected</strong>{hostel.commute}</span><span><FiUsers aria-hidden="true" /><strong>Made for students</strong>Friendly shared spaces</span><span><FiShield aria-hidden="true" /><strong>Verified details</strong>Reviewed by Homies Stay</span></div></div><div className="hostel-detail-section"><p className="hostel-detail-kicker">What is included</p><h2>Everything you need to begin.</h2><div className="hostel-amenities">{hostel.amenities.map((amenity) => <span key={amenity}><FiCheck aria-hidden="true" /> {amenity}</span>)}</div></div><div className="hostel-detail-section hostel-review-section"><p className="hostel-detail-kicker">Student reviews</p><h2>What it is really like to stay here.</h2><div className="hostel-review-list">{reviews.map((review) => <article className="hostel-review" key={review.name}><div className="hostel-review-topline"><span><FiStar aria-hidden="true" /> {review.rating}</span><strong>{review.name}</strong></div><p>“{review.quote}”</p><small>{review.course}</small></article>)}</div></div></div><aside className="hostel-detail-aside"><p className="hostel-detail-kicker">Have a question?</p><h3>Ask before you decide.</h3><p>Send the owner an enquiry about availability, room types, move-in dates, or anything else on your mind.</p><button type="button" onClick={() => setEnquirySent(true)}>Ask the owner <FiArrowUpRight aria-hidden="true" /></button><small>Typical response within 24 hours</small></aside></section>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default HostelDetails;
