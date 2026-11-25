import { FiArrowUpRight, FiMessageCircle } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';

const Contact = () => (
	<>
		<NavBar />
		<main className="contact-page">
			<section className="contact-hero">
				<div className="contact-hero-copy"><p className="contact-kicker">Contact</p><h1>Questions about a <em>stay?</em></h1><p>Browse published listings for property details. Platform support channels will be added when they are configured.</p></div>
				<div className="contact-hero-card"><span className="contact-hero-card-icon"><FiMessageCircle aria-hidden="true" /></span><p className="contact-kicker">Property information</p><h2>Find a published listing</h2><p>Check the property details currently provided by its owner.</p><a href="/hostels">Browse listings <FiArrowUpRight aria-hidden="true" /></a></div>
			</section>
			<section className="contact-options" id="contact-options" aria-labelledby="contact-options-title"><div className="contact-section-heading"><div><p className="contact-kicker">Current contact options</p><h2 id="contact-options-title">Choose the available route.</h2></div><p>Property enquiries, platform support, and safety reporting do not yet have backend workflows.</p></div><div className="contact-channel-grid"><article className="contact-channel-card green"><span className="contact-channel-icon"><FiMessageCircle aria-hidden="true" /></span><p className="contact-kicker">Browse</p><h3>Explore published listings</h3><p>Review the current information available for each property.</p><a href="/hostels">Browse listings <FiArrowUpRight aria-hidden="true" /></a></article></div></section>
			<section className="contact-faq-strip"><div><p className="contact-kicker">Platform status</p><h2>Support workflows are not connected yet.</h2></div><p>No messages are submitted or delivered from this page. A contact form will be enabled after a backend support endpoint is configured.</p><a href="/about">About Homies Stay <FiArrowUpRight aria-hidden="true" /></a></section>
		</main>
		<Footer />
	</>
);

export default Contact;
