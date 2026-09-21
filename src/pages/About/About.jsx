import { useState } from 'react';
import { FiArrowUpRight, FiCheck, FiClipboard, FiHome, FiMapPin, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';
import { roomShared } from '../../assets/hostelImages';

const roleContent = {
	students: {
		label: 'For students',
		title: 'A calmer way to find your first home away from home.',
		text: 'Search by college, neighbourhood, landmark, or budget. Compare verified options, understand the area, and move forward with a little more confidence.',
		points: ['Discover stays close to your campus', 'Compare rent, ratings, and location', 'Save options and send enquiries'],
		link: '/hostels',
		linkText: 'Explore hostels',
		icon: FiSearch,
	},
	owners: {
		label: 'For property owners',
		title: 'A clearer way to fill rooms with the right residents.',
		text: 'Bring your property to students who are actively looking. Manage listings, follow enquiries, and understand how your spaces are performing from one place.',
		points: ['Showcase your property with confidence', 'Manage enquiries and applications', 'Track occupancy and property health'],
		link: '/register',
		linkText: 'List your property',
		icon: FiHome,
	},
	admins: {
		label: 'For platform teams',
		title: 'A trusted foundation for a growing accommodation community.',
		text: 'Review new properties, keep the marketplace healthy, and make sure the experience stays useful for the people who rely on it.',
		points: ['Review and approve listings', 'Monitor trust and platform activity', 'Keep students and owners moving'],
		link: '/contact',
		linkText: 'Talk to our team',
		icon: FiShield,
	},
};

const processSteps = [
	{ number: '01', icon: FiSearch, title: 'Tell us what matters', text: 'Start with a college, neighbourhood, budget, or the kind of room you want.' },
	{ number: '02', icon: FiMapPin, title: 'Explore with context', text: 'Browse verified stays near the places that shape your everyday routine.' },
	{ number: '03', icon: FiUsers, title: 'Make your move', text: 'Save your shortlist, ask questions, and choose a stay that feels right.' },
];

const About = () => {
	const [activeRole, setActiveRole] = useState('students');
	const role = roleContent[activeRole];
	const RoleIcon = role.icon;

	return (
		<>
			<NavBar />
			<main className="about-page">
				<section className="about-hero">
					<div className="about-hero-copy"><p className="about-kicker">About Homies Stay</p><h1>Room for the life you are <em>building.</em></h1><p>Homies Stay is a student accommodation marketplace built to make finding, listing, and managing a stay feel more human.</p><div className="about-hero-actions"><a className="about-primary-link" href="/hostels">Find your stay <FiArrowUpRight aria-hidden="true" /></a><a className="about-text-link" href="#how-it-works">See how it works <FiArrowUpRight aria-hidden="true" /></a></div></div>
					<div className="about-hero-visual"><img src={roomShared} alt="Bright shared bedroom with comfortable study space" /><div className="about-image-note"><span className="about-image-dot" aria-hidden="true" /><span><strong>Built around real routines</strong><small>Campus, commute, comfort</small></span></div></div>
				</section>

				<section className="about-intro"><p className="about-kicker">Why we exist</p><div className="about-intro-grid"><h2>Finding a room should not feel like finding your way through a maze.</h2><div><p>Moving for college or work is a big enough change. The search for a safe, affordable place to live should bring clarity, not more uncertainty.</p><p>Homies Stay brings the important pieces together: relevant locations, clear pricing, useful details, trusted reviews, and a direct way to connect with the people behind each listing.</p></div></div><div className="about-stats"><div><strong>500+</strong><span>hostels and PGs</span></div><div><strong>100+</strong><span>college neighbourhoods</span></div><div><strong>5,000+</strong><span>students finding their place</span></div></div></section>

				<section className="about-roles" aria-labelledby="roles-title"><div className="about-section-heading"><div><p className="about-kicker">One platform, different needs</p><h2 id="roles-title">Designed for the whole stay journey.</h2></div><p>Whether you are searching for a room, filling one, or caring for the marketplace, Homies Stay keeps the next step close at hand.</p></div><div className="about-role-layout"><div className="about-role-tabs" role="tablist" aria-label="Homies Stay audiences">{Object.entries(roleContent).map(([key, item]) => { const Icon = item.icon; return <button className={activeRole === key ? 'active' : ''} key={key} type="button" role="tab" aria-selected={activeRole === key} onClick={() => setActiveRole(key)}><Icon aria-hidden="true" />{item.label}</button>; })}</div><article className="about-role-panel"><div className="about-role-icon"><RoleIcon aria-hidden="true" /></div><p className="about-kicker">{role.label}</p><h3>{role.title}</h3><p>{role.text}</p><ul>{role.points.map((point) => <li key={point}><FiCheck aria-hidden="true" />{point}</li>)}</ul><a href={role.link}>{role.linkText} <FiArrowUpRight aria-hidden="true" /></a></article></div></section>

				<section className="about-process" id="how-it-works" aria-labelledby="process-title"><div className="about-section-heading"><div><p className="about-kicker">How it works</p><h2 id="process-title">From first search to feeling settled.</h2></div><FiClipboard className="about-process-mark" aria-hidden="true" /></div><div className="about-process-grid">{processSteps.map((step) => { const Icon = step.icon; return <article key={step.number}><span className="about-process-number">{step.number}</span><Icon aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p></article>; })}</div></section>

				<section className="about-trust"><div className="about-trust-copy"><p className="about-kicker">What we care about</p><h2>Useful information. Honest choices. Better beginnings.</h2><p>We are building Homies Stay around the details that make a decision feel considered: a location that works, a budget that holds, and a place that looks after the person living in it.</p></div><div className="about-trust-list"><div><FiShield aria-hidden="true" /><span><strong>Trust by design</strong>Listings are reviewed so students can search with more confidence.</span></div><div><FiMapPin aria-hidden="true" /><span><strong>Closer to real life</strong>Search around campuses, commutes, and the neighbourhoods students know.</span></div><div><FiUsers aria-hidden="true" /><span><strong>A shared community</strong>Students, owners, and platform teams each have a clear role to play.</span></div></div></section>

				<section className="about-cta"><p className="about-kicker">Start where you are</p><h2>There is a better place to begin.</h2><p>Explore the homes, neighbourhoods, and possibilities waiting for your next chapter.</p><a href="/hostels">Explore Homies Stay <FiArrowUpRight aria-hidden="true" /></a></section>
			</main>
			<Footer />
		</>
	);
};

export default About;
