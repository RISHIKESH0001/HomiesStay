const Footer = () => {
	return (
		<footer className="site-footer">
			<div className="footer-content">
				<div className="footer-brand">
					<a className="footer-logo" href="/">Homies Stay</a>
					<p>Find verified hostels and PG accommodations near your college.</p>
				</div>

				<div className="footer-column">
					<h2>Quick Links</h2>
					<nav aria-label="Quick links">
						<a href="/">Home</a>
						<a href="/hostels">Hostels</a>
						<a href="/about">About</a>
						<a href="/contact">Contact</a>
					</nav>
				</div>

				<div className="footer-column">
					<h2>For Students</h2>
					<nav aria-label="Student links">
						<a href="/hostels#hostel-search-form">Search hostels</a>
						<a href="/dashboard#explore">Student dashboard</a>
						<a href="/about#how-it-works">How it works</a>
						<a href="/contact#ai-assistant">Contact support</a>
					</nav>
				</div>

				<div className="footer-column footer-contact">
					<h2>Contact</h2>
					<address>
						<span>Kolkata, India</span>
						<a href="mailto:support@homiesstay.com">support@homiesstay.com</a>
						<a href="tel:+919876543210">+91 9876543210</a>
					</address>
				</div>
			</div>

			<div className="footer-bottom">
					<p>&copy; 2026 Homies Stay. All Rights Reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
