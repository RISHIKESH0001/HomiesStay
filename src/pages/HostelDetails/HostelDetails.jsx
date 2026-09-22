import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiBarChart2, FiCheck, FiClipboard, FiClock, FiHeart, FiHome, FiMapPin, FiMessageCircle, FiShield, FiStar, FiUsers } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import DashboardLayout from '../../layouts/DashboardLayout';
import { roomBaruipur1, roomBaruipur2, roomBaruipur3, roomBaruipur4, roomBaruipur5, roomBengaluru1, roomHyderabad1, roomKolkata1, roomKolkata2, roomModern2, roomModern3, roomPune1, roomPune2, roomWorkspace } from '../../assets/hostelImages';
import { getStoredProperty, toPublicHostel } from '../../services/propertyStorage';

const hostelDetails = {
	'the-nest-residency': { name: 'The Nest Residency', location: 'Koramangala, Bengaluru', college: 'Christ University', price: 'Rs. 8,500', rating: '4.8', reviews: '126', image: roomBengaluru1, type: 'Private rooms and co-living', commute: '12 min to Christ University', description: 'A bright, well-connected stay for students who want the energy of Koramangala close by and a comfortable place to come back to.', amenities: ['Wi-Fi', 'Housekeeping', 'Power backup', 'Study lounge', 'Meals available', '24/7 security'] },
	'campus-cove': { name: 'Campus Cove', location: 'Hinjewadi, Pune', college: 'Symbiosis Institute', price: 'Rs. 7,200', rating: '4.7', reviews: '98', image: roomPune1, type: 'Shared rooms and co-living', commute: '8 min to Symbiosis Institute', description: 'A practical, social home base in Hinjewadi with the essentials sorted for a smooth college routine.', amenities: ['Wi-Fi', 'Laundry', 'Gym access', 'Common kitchen', 'Parking', 'CCTV'] },
	'olive-house-madhapur': { name: 'Olive House Madhapur', location: 'Madhapur, Hyderabad', college: 'IIIT Hyderabad', price: 'Rs. 9,000', rating: '4.9', reviews: '151', image: roomHyderabad1, type: 'Premium co-living', commute: '15 min to IIIT Hyderabad', description: 'A calm, thoughtfully designed co-living space in Madhapur with room to focus, recharge, and meet your people.', amenities: ['Wi-Fi', 'Daily meals', 'Rooftop', 'Fitness room', 'Study lounge', 'Housekeeping'] },
	'the-green-room': { name: 'The Green Room', location: 'Salt Lake, Kolkata', college: 'IEM Kolkata', price: 'Rs. 6,800', rating: '4.6', reviews: '74', image: roomKolkata1, type: 'Student hostel', commute: '10 min to IEM Kolkata', description: 'An easy, value-focused stay in Salt Lake for students who want a simple commute and a welcoming community.', amenities: ['Wi-Fi', 'Meals available', 'Laundry', 'Power backup', 'CCTV', 'Common room'] },
	'north-star-living': { name: 'North Star Living', location: 'New Town, Kolkata', college: 'Techno India', price: 'Rs. 7,900', rating: '4.8', reviews: '62', image: roomKolkata2, type: 'Modern co-living', commute: '9 min to Techno India', description: 'A new-on-Homies stay with clean lines, flexible rooms, and a quick route to New Town campuses.', amenities: ['Wi-Fi', 'Study desks', 'Laundry', 'Security', 'Common kitchen', 'Parking'] },
	'maple-co-live': { name: 'Maple Co-Live', location: 'Viman Nagar, Pune', college: 'MIT World Peace University', price: 'Rs. 8,100', rating: '4.7', reviews: '88', image: roomPune2, type: 'Shared apartments', commute: '14 min to MIT World Peace University', description: 'A move-in-ready shared apartment for students who want privacy, connection, and a well-placed Pune address.', amenities: ['Wi-Fi', 'Fully furnished', 'Housekeeping', 'Security', 'Power backup', 'Bike parking'] },
	'casa-nook': { name: 'Casa Nook', location: 'HSR Layout, Bengaluru', college: 'Christ University', price: 'Rs. 12,800', rating: '4.8', reviews: '103', image: roomModern2, type: 'Private rooms', commute: '18 min to Christ University', description: 'A comfortable private-room option in HSR Layout with the space and calm to settle into your next chapter.', amenities: ['Wi-Fi', 'Fully furnished', 'Laundry', 'Security', 'Study desks', 'Common area'] },
	'mango-tree-living': { name: 'Mango Tree Living', location: 'Indiranagar, Bengaluru', college: 'Christ University', price: 'Rs. 11,500', rating: '4.7', reviews: '67', image: roomModern3, type: 'Shared apartments', commute: '16 min to Christ University', description: 'A leafy shared stay in Indiranagar with generous common spaces and a relaxed community feel.', amenities: ['Wi-Fi', 'Common kitchen', 'Laundry', 'Power backup', 'Security', 'Study lounge'] },
	'the-olive-house': { name: 'The Olive House', location: 'Koramangala, Bengaluru', college: 'Christ University', price: 'Rs. 14,500', rating: '4.9', reviews: '142', image: roomHyderabad1, type: 'Premium co-living', commute: '12 min to Christ University', description: 'A polished co-living stay in Koramangala with a warm shared atmosphere and everything close at hand.', amenities: ['Wi-Fi', 'Daily meals', 'Gym access', 'Housekeeping', 'Study lounge', '24/7 security'] },
	'the-nest-collective': { name: 'The Nest Collective', location: 'Indiranagar, Bengaluru', college: 'Christ University', price: 'Rs. 10,900', rating: '4.7', reviews: '91', image: roomPune2, type: 'Shared apartments', commute: '20 min to Christ University', description: 'A community-minded shared apartment in Indiranagar for students who like their city life close and lively.', amenities: ['Wi-Fi', 'Common kitchen', 'Laundry', 'Power backup', 'Security', 'Rooftop'] },
	'baruipur-student-nest': { name: 'Baruipur Student Nest', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 6,500', rating: '4.7', reviews: '38', image: roomBaruipur1, type: 'Shared student hostel', commute: '9 min to Gargi Memorial Institute of Technology', description: 'A practical, welcoming student stay near Gargi Memorial Institute of Technology with essentials that keep daily life simple.', amenities: ['Wi-Fi', 'Meals available', 'Laundry', 'Study desks', 'Power backup', 'Security'] },
	'gargi-girls-residency': { name: 'Gargi Girls Residency', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 7,200', rating: '4.8', reviews: '44', image: roomBaruipur4, type: 'Women-only hostel', commute: '11 min to Gargi Memorial Institute of Technology', description: 'A comfortable women-only residence in Baruipur with a calm setting and an easy route to campus.', amenities: ['Wi-Fi', 'CCTV', 'Housekeeping', 'Common room', 'Meals available', '24/7 security'] },
	'south-campus-boys-home': { name: 'South Campus Boys Home', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 5,900', rating: '4.6', reviews: '31', image: roomWorkspace, type: 'Men-only hostel', commute: '14 min to Gargi Memorial Institute of Technology', description: 'A value-focused men-only hostel for students who want a straightforward commute and study-friendly routine.', amenities: ['Wi-Fi', 'Study desks', 'Laundry', 'Parking', 'Power backup', 'Security'] },
	'greenfield-co-living': { name: 'Greenfield Co-Living', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 8,100', rating: '4.9', reviews: '52', image: roomBaruipur3, type: 'Unisex co-living', commute: '18 min to Gargi Memorial Institute of Technology', description: 'A modern unisex co-living space with bright shared areas, reliable essentials, and a relaxed student community.', amenities: ['Wi-Fi', 'Common kitchen', 'Fitness room', 'Housekeeping', 'Rooftop', 'Security'] },
	'baruipur-scholars-stay': { name: 'Baruipur Scholars Stay', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 6,800', rating: '4.7', reviews: '35', image: roomBaruipur2, type: 'Men-only hostel', commute: '23 min to Gargi Memorial Institute of Technology', description: 'A quiet, study-friendly stay for students looking for clear pricing and a dependable campus routine.', amenities: ['Wi-Fi', 'Study lounge', 'Meals available', 'Laundry', 'CCTV', 'Power backup'] },
	'lakeview-girls-hostel': { name: 'Lakeview Girls Hostel', location: 'Baruipur, Kolkata', college: 'Gargi Memorial Institute of Technology', price: 'Rs. 7,600', rating: '4.8', reviews: '41', image: roomBaruipur5, type: 'Women-only hostel', commute: '27 min to Gargi Memorial Institute of Technology', description: 'A peaceful women-only hostel with a residential feel, useful amenities, and access to local transport.', amenities: ['Wi-Fi', 'Security', 'Common room', 'Laundry', 'Study desks', 'Meals available'] },
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

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const ownerPropertySlugs = new Set(['the-olive-house', 'casa-nook', 'mango-tree-living']);
const ownerMetricsBySlug = {
	'the-olive-house': { totalRooms: 50, occupiedRooms: 46, paidStudents: 41, pendingStudents: 5 },
	'casa-nook': { totalRooms: 25, occupiedRooms: 21, paidStudents: 19, pendingStudents: 2 },
	'mango-tree-living': { totalRooms: 25, occupiedRooms: 17, paidStudents: 15, pendingStudents: 2 },
};

const getOwnerMetrics = (property) => {
	if (ownerMetricsBySlug[property?.slug]) return { ...ownerMetricsBySlug[property.slug], vacantRooms: ownerMetricsBySlug[property.slug].totalRooms - ownerMetricsBySlug[property.slug].occupiedRooms, applications: 6, admissions: 3, leavingSoon: 4 };
	const roomParts = property?.rooms?.split('/').map((value) => Number(value.trim())) || [];
	const totalRooms = roomParts[1] || property?.capacity || 25;
	const occupiedRooms = roomParts[0] || Math.round(totalRooms * ((property?.occupancy || 78) / 100));
	const vacantRooms = Math.max(totalRooms - occupiedRooms, 0);
	return {
		totalRooms,
		occupiedRooms,
		vacantRooms,
		paidStudents: Math.max(occupiedRooms - 3, 0),
		pendingStudents: Math.min(3, occupiedRooms),
		applications: 6,
		admissions: 3,
		leavingSoon: 4,
	};
};

const OwnerHostelDetails = ({ hostel }) => {
	const metrics = getOwnerMetrics(hostel);
	const [activeTab, setActiveTab] = useState('overview');
	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: 'Riya Shah', type: 'Property owner' }} navigation={ownerNavigation} pageTitle={hostel.name}>
			<main className="dashboard-content owner-hostel-overview">
				<Link className="owner-hostel-back" to="/owner/properties"><FiArrowLeft /> Back to my properties</Link>
				<section className="owner-hostel-heading"><div><p className="dashboard-eyebrow">Property operations</p><h1>{hostel.name}</h1><p><FiMapPin /> {hostel.location} <span>·</span> {hostel.college}</p></div><div className="owner-hostel-heading-actions"><span className="owner-hostel-live"><i /> Live listing</span><button type="button"><FiArrowUpRight /> Edit property</button></div></section>
				<section className="owner-hostel-stat-grid"><article><span className="owner-hostel-stat-icon occupied"><FiUsers /></span><div><strong>{metrics.occupiedRooms}</strong><span>Occupied rooms</span></div><small>of {metrics.totalRooms} total</small></article><article><span className="owner-hostel-stat-icon vacant"><FiHome /></span><div><strong>{metrics.vacantRooms}</strong><span>Vacant rooms</span></div><small>ready to fill</small></article><article><span className="owner-hostel-stat-icon paid"><FiCheck /></span><div><strong>{metrics.paidStudents}</strong><span>Rent paid</span></div><small>{metrics.pendingStudents} pending</small></article><article><span className="owner-hostel-stat-icon pending"><FiClock /></span><div><strong>{metrics.pendingStudents}</strong><span>Rent pending</span></div><small>needs follow-up</small></article></section>
				<div className="owner-hostel-tabs" role="tablist"><button className={activeTab === 'overview' ? 'active' : ''} type="button" onClick={() => setActiveTab('overview')}>Overview</button><button className={activeTab === 'students' ? 'active' : ''} type="button" onClick={() => setActiveTab('students')}>Students & rent</button><button className={activeTab === 'activity' ? 'active' : ''} type="button" onClick={() => setActiveTab('activity')}>Activity</button></div>
				{activeTab === 'overview' && <div className="owner-hostel-main-grid"><section className="owner-hostel-panel"><div className="owner-hostel-panel-heading"><div><p className="dashboard-eyebrow">Today at a glance</p><h2>Keep the house moving.</h2></div><span className="owner-hostel-updated">Updated just now</span></div><div className="owner-hostel-occupancy"><div className="owner-hostel-ring" style={{ '--occupancy': `${Math.round((metrics.occupiedRooms / metrics.totalRooms) * 100)}%` }}><strong>{Math.round((metrics.occupiedRooms / metrics.totalRooms) * 100)}%</strong><span>occupied</span></div><div><strong>{metrics.occupiedRooms} of {metrics.totalRooms} rooms are occupied</strong><p>{metrics.vacantRooms} rooms are currently available for your next admission.</p><div className="owner-hostel-progress"><i style={{ width: `${(metrics.occupiedRooms / metrics.totalRooms) * 100}%` }} /></div></div></div><div className="owner-hostel-payment-line"><span><FiCheck /> Rent collected this cycle</span><strong>{metrics.paidStudents} students paid</strong><em>{metrics.pendingStudents} pending</em></div></section><section className="owner-hostel-panel owner-hostel-quick-panel"><div className="owner-hostel-panel-heading"><div><p className="dashboard-eyebrow">Needs your attention</p><h2>Next actions</h2></div></div><div className="owner-hostel-action-row"><span className="owner-hostel-action-icon application"><FiClipboard /></span><div><strong>{metrics.applications} new applications</strong><small>Review profiles and move-in dates</small></div><button type="button">Review <FiArrowUpRight /></button></div><div className="owner-hostel-action-row"><span className="owner-hostel-action-icon admission"><FiUsers /></span><div><strong>{metrics.admissions} new admissions</strong><small>Ready for room assignment</small></div><button type="button">Open list <FiArrowUpRight /></button></div><div className="owner-hostel-action-row"><span className="owner-hostel-action-icon leaving"><FiClock /></span><div><strong>{metrics.leavingSoon} students leaving soon</strong><small>Course completion in the next 90 days</small></div><button type="button">Plan exits <FiArrowUpRight /></button></div></section></div>}
				{activeTab === 'students' && <section className="owner-hostel-panel owner-hostel-students-panel"><div className="owner-hostel-panel-heading"><div><p className="dashboard-eyebrow">Resident ledger</p><h2>Students & rent status</h2></div><button type="button" className="owner-hostel-export">Export list <FiArrowUpRight /></button></div><div className="owner-hostel-ledger"><div><strong>Room 204 · Aarav Mehta</strong><span>Christ University · Private room</span><em className="paid">Paid · 18 Sep</em></div><div><strong>Room 108 · Nisha Kapoor</strong><span>Christ University · Shared room</span><em className="pending">Pending · due today</em></div><div><strong>Room 312 · Kabir Rao</strong><span>Christ University · Private room</span><em className="paid">Paid · 17 Sep</em></div></div></section>}
				{activeTab === 'activity' && <section className="owner-hostel-panel"><div className="owner-hostel-panel-heading"><div><p className="dashboard-eyebrow">Recent activity</p><h2>What changed recently.</h2></div></div><div className="owner-hostel-activity"><p><span className="activity-mark green"><FiCheck /></span><span><strong>Rent payment received from Aarav Mehta</strong><small>Today · Room 204</small></span></p><p><span className="activity-mark yellow"><FiClipboard /></span><span><strong>New application received for a private room</strong><small>Yesterday · Move-in 1 October</small></span></p><p><span className="activity-mark blue"><FiClock /></span><span><strong>Course end reminder for 4 residents</strong><small>Yesterday · Follow up before renewal window</small></span></p></div></section>}
				<section className="owner-hostel-exit-panel"><div><p className="dashboard-eyebrow">Plan ahead</p><h2>Students nearing the end of their course.</h2><p>Start exit conversations early, confirm move-out dates, and keep vacant rooms ready for the next batch.</p></div><button type="button">View {metrics.leavingSoon} students <FiArrowUpRight /></button></section>
			</main>
		</DashboardLayout>
	);
};

const HostelDetails = () => {
	const { hostelId } = useParams();
	const signedInUser = useSelector((state) => state.auth.user);
	const storedProperty = getStoredProperty(hostelId);
	const hostel = storedProperty ? { ...toPublicHostel(storedProperty), slug: hostelId, commute: storedProperty.commute, owner: storedProperty.owner } : { ...(hostelDetails[hostelId] || hostelDetails['the-nest-residency']), slug: hostelId };
	const signedInOwnerId = signedInUser?.id || signedInUser?.email || signedInUser?.username;
	const isDemoOwner = signedInOwnerId === 'owner-1' || signedInUser?.username?.toLowerCase() === 'riya' || signedInUser?.name?.toLowerCase() === 'riya shah';
	const ownsProperty = signedInUser?.role === 'owner' && (storedProperty ? storedProperty.ownerId === signedInOwnerId : isDemoOwner && ownerPropertySlugs.has(hostelId));
	const reviews = hostelReviews[hostelId] || hostelReviews['the-nest-residency'];
	const [isSaved, setIsSaved] = useState(false);
	const [enquirySent, setEnquirySent] = useState(false);

	if (ownsProperty) return <OwnerHostelDetails hostel={hostel} />;

	return (
		<>
			<NavBar />
			<main className="hostel-detail-page">
				<div className="hostel-detail-inner"><Link className="hostel-back-link" to="/hostels"><FiArrowLeft aria-hidden="true" /> Back to all hostels</Link>
					<section className="hostel-detail-hero"><div className="hostel-detail-image"><img src={hostel.image} alt={`${hostel.name} accommodation`} /><span><FiShield aria-hidden="true" /> Verified property</span>{hostel.photos?.length > 1 && <div className="hostel-detail-gallery">{hostel.photos.slice(0, 5).map((photo) => <img src={photo} alt="" key={photo} />)}</div>}</div><div className="hostel-detail-summary"><p className="hostel-detail-kicker">{hostel.type}</p><h1>{hostel.name}</h1><p className="hostel-detail-location"><FiMapPin aria-hidden="true" /> {hostel.location}</p><div className="hostel-detail-rating"><strong><FiStar aria-hidden="true" /> {hostel.rating}</strong><span>{hostel.reviews} student reviews</span></div><p className="hostel-detail-description">{hostel.description}</p><div className="hostel-detail-price"><strong>{hostel.price}</strong><span>/ month</span></div><div className="hostel-detail-actions"><button className="hostel-enquire-button" type="button" onClick={() => setEnquirySent(true)}><FiMessageCircle aria-hidden="true" /> {enquirySent ? 'Enquiry sent' : 'Contact owner'}</button><button className={isSaved ? 'hostel-save-button saved' : 'hostel-save-button'} type="button" onClick={() => setIsSaved((current) => !current)} aria-label={isSaved ? 'Remove saved hostel' : 'Save hostel'}><FiHeart aria-hidden="true" /></button></div>{enquirySent && <p className="hostel-enquiry-note" role="status"><FiCheck aria-hidden="true" /> The owner will be notified. You can track replies from your dashboard.</p>}</div></section>

					<section className="hostel-detail-content"><div className="hostel-detail-main"><div className="hostel-detail-section"><p className="hostel-detail-kicker">A good fit if you want</p><h2>Less guesswork, more room to settle in.</h2><div className="hostel-detail-highlights"><span><FiMapPin aria-hidden="true" /><strong>Well connected</strong>{hostel.commute}</span><span><FiUsers aria-hidden="true" /><strong>Near your college</strong>{hostel.college}</span><span><FiShield aria-hidden="true" /><strong>Student preference</strong>{hostel.gender || 'Unisex'} stay</span></div></div><div className="hostel-detail-section"><p className="hostel-detail-kicker">What is included</p><h2>Everything you need to begin.</h2><div className="hostel-amenities">{hostel.amenities.map((amenity) => <span key={amenity}><FiCheck aria-hidden="true" /> {amenity}</span>)}</div></div><div className="hostel-detail-section hostel-review-section"><p className="hostel-detail-kicker">Student reviews</p><h2>What it is really like to stay here.</h2><div className="hostel-review-list">{reviews.map((review) => <article className="hostel-review" key={review.name}><div className="hostel-review-topline"><span><FiStar aria-hidden="true" /> {review.rating}</span><strong>{review.name}</strong></div><p>“{review.quote}”</p><small>{review.course}</small></article>)}</div></div></div><aside className="hostel-detail-aside"><p className="hostel-detail-kicker">Have a question?</p><h3>Ask before you decide.</h3><p>Send the owner an enquiry about availability, room types, move-in dates, or anything else on your mind.</p>{hostel.owner && <div className="hostel-owner-contact"><strong>{hostel.owner.name}</strong><a href={`tel:${hostel.owner.phone}`}>{hostel.owner.phone}</a><a href={`mailto:${hostel.owner.email}`}>{hostel.owner.email}</a></div>}<button type="button" onClick={() => setEnquirySent(true)}>Ask the owner <FiArrowUpRight aria-hidden="true" /></button><small>Typical response within 24 hours</small></aside></section>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default HostelDetails;
