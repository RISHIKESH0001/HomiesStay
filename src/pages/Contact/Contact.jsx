import { useState } from 'react';
import { FiArrowUpRight, FiCheck, FiHeadphones, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiSend, FiShield } from 'react-icons/fi';
import NavBar from '../../components/Navbar/NavBar';
import Footer from '../../components/Footer/Footer';

const contactChannels = [
	{ icon: FiMessageCircle, label: 'Contact a property owner', title: 'Ask about a stay', text: 'Open a hostel listing to ask about availability, amenities, move-in dates, or anything that matters before you book.', action: 'Browse hostels', href: '/hostels', tone: 'green' },
	{ icon: FiHeadphones, label: 'Homies Stay support', title: 'Talk to our team', text: 'Need help with an account, booking, payment, or a listing? Our support team can point you in the right direction.', action: 'Email support', href: 'mailto:support@homiesstay.com', tone: 'blue' },
	{ icon: FiShield, label: 'Safety and trust', title: 'Report a concern', text: 'Tell us about an inaccurate listing, suspicious behaviour, or anything that makes a stay feel unsafe.', action: 'Report by email', href: 'mailto:support@homiesstay.com?subject=Safety%20concern', tone: 'warm' },
];

const aiSuggestions = ['Find a hostel near my college', 'What should I ask a property owner?', 'How do I report a listing?'];

const assistantReplies = {
	'Find a hostel near my college': 'Start with your college or neighbourhood on the Hostels page. You can then compare rent, ratings, location, and nearby options.',
	'What should I ask a property owner?': 'Ask about availability, deposit, included utilities, room sharing, house rules, commute time, and the expected move-in date.',
	'How do I report a listing?': 'Use the “Report by email” option below or write to support@homiesstay.com with the property name and what looked incorrect.',
};

const Contact = () => {
	const [message, setMessage] = useState('');
	const [formState, setFormState] = useState('idle');
	const [assistantInput, setAssistantInput] = useState('');
	const [assistantReply, setAssistantReply] = useState('');

	const handleSupportSubmit = (event) => {
		event.preventDefault();
		setFormState('sent');
		setMessage('');
	};

	const askAssistant = (question = assistantInput) => {
		const trimmedQuestion = question.trim();
		if (!trimmedQuestion) return;
		const knownReply = assistantReplies[trimmedQuestion];
		setAssistantReply(knownReply || 'I can help you get started with finding a stay, contacting an owner, or reaching Homies Stay support. Try one of the questions below.');
		setAssistantInput('');
	};

	return (
		<>
			<NavBar />
			<main className="contact-page">
				<section className="contact-hero">
					<div className="contact-hero-copy"><p className="contact-kicker">We are here to help</p><h1>Good questions deserve <em>good answers.</em></h1><p>Whether you are choosing a room, managing a property, or need a hand with Homies Stay, start with the path that fits your need.</p><div className="contact-hero-links"><a href="#contact-options">Find the right contact <FiArrowUpRight aria-hidden="true" /></a><a href="#ai-assistant">Ask the AI assistant <FiArrowUpRight aria-hidden="true" /></a></div></div>
					<div className="contact-hero-card"><span className="contact-hero-card-icon"><FiMessageCircle aria-hidden="true" /></span><p className="contact-kicker">Quickest route</p><h2>Already found a property?</h2><p>The best way to reach an owner is through the enquiry option on that property’s listing.</p><a href="/hostels">Browse verified stays <FiArrowUpRight aria-hidden="true" /></a></div>
				</section>

				<section className="contact-options" id="contact-options" aria-labelledby="contact-options-title"><div className="contact-section-heading"><div><p className="contact-kicker">Choose your route</p><h2 id="contact-options-title">The right person is one click away.</h2></div><p>Use owner enquiries for property-specific questions. Our team can help with everything around the platform.</p></div><div className="contact-channel-grid">{contactChannels.map((channel) => { const Icon = channel.icon; return <article className={`contact-channel-card ${channel.tone}`} key={channel.title}><span className="contact-channel-icon"><Icon aria-hidden="true" /></span><p className="contact-kicker">{channel.label}</p><h3>{channel.title}</h3><p>{channel.text}</p><a href={channel.href}>{channel.action} <FiArrowUpRight aria-hidden="true" /></a></article>; })}</div></section>

				<section className="contact-support" aria-labelledby="support-title"><div className="contact-support-copy"><p className="contact-kicker">Need something specific?</p><h2 id="support-title">Send a note to the Homies Stay team.</h2><p>For account help, booking questions, feedback, or a concern that does not belong to one property, fill out the form. We will follow up at your email address.</p><div className="contact-details"><a href="mailto:support@homiesstay.com"><FiMail aria-hidden="true" /><span><strong>support@homiesstay.com</strong><small>General support and platform help</small></span></a><a href="tel:+919876543210"><FiPhone aria-hidden="true" /><span><strong>+91 9876543210</strong><small>Monday to Saturday, 9 AM to 6 PM</small></span></a><span><FiMapPin aria-hidden="true" /><span><strong>Kolkata, India</strong><small>Homies Stay support centre</small></span></span></div></div><form className="contact-form" onSubmit={handleSupportSubmit}><label><span>Your email</span><input type="email" required placeholder="you@example.com" /></label><label><span>What can we help with?</span><select defaultValue=""><option value="" disabled>Choose a topic</option><option>Account or login</option><option>Booking or payment</option><option>Property listing</option><option>Safety concern</option><option>Feedback</option></select></label><label><span>Your message</span><textarea required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us a little about what you need..."></textarea></label><button type="submit">Send message <FiSend aria-hidden="true" /></button>{formState === 'sent' && <p className="contact-form-success" role="status"><FiCheck aria-hidden="true" /> Thanks. Your note is ready for the support team.</p>}</form></section>

					<section className="contact-ai" aria-labelledby="ai-title"><div className="contact-ai-intro"><span className="contact-ai-spark" aria-hidden="true">✦</span><p className="contact-kicker">Homies assistant</p><h2 id="ai-title">A little help before you reach out.</h2><p>Ask about searching, owner conversations, or using Homies Stay. The assistant can help you choose your next step.</p></div><div className="contact-ai-box" id="ai-assistant"><div className="contact-ai-header"><span>Homies AI</span><small>Ready to help</small></div>{assistantReply && <div className="contact-ai-reply"><strong>Here is a useful place to start</strong><p>{assistantReply}</p></div>}<div className="contact-ai-suggestions">{aiSuggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => askAssistant(suggestion)}>{suggestion}<FiArrowUpRight aria-hidden="true" /></button>)}</div><form className="contact-ai-form" onSubmit={(event) => { event.preventDefault(); askAssistant(); }}><FiMessageCircle aria-hidden="true" /><input value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="Ask Homies AI anything..." aria-label="Ask Homies AI" /><button type="submit" aria-label="Send question"><FiSend aria-hidden="true" /></button></form></div></section>

				<section className="contact-faq-strip"><div><p className="contact-kicker">Before you write</p><h2>Most answers start with the listing.</h2></div><p>For availability, amenities, rent, and move-in details, contact the owner directly from the property page. For platform or safety questions, our support team is ready.</p><a href="/hostels">Explore hostels <FiArrowUpRight aria-hidden="true" /></a></section>
			</main>
			<Footer />
		</>
	);
};

export default Contact;
