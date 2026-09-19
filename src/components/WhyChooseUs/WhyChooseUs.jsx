const benefits = [
	{
		icon: '✅',
		title: 'Verified Hostels',
		text: 'All properties are verified by our team for safety and quality.',
	},
	{
		icon: '💳',
		title: 'Easy Payments',
		text: 'Pay booking fees and hostel rent securely online.',
	},
	{
		icon: '📍',
		title: 'Nearby Colleges',
		text: 'Find hostels close to your college and save travel time.',
	},
	{
		icon: '⭐',
		title: 'Trusted Reviews',
		text: 'Read genuine reviews from students before booking.',
	},
];

const WhyChooseUs = () => {
	return (
		<section className="why-section" aria-labelledby="why-title">
			<div className="why-heading">
				<p className="why-kicker">A better way to settle in</p>
				<h2 id="why-title">Why Choose Homies Stay?</h2>
				<p>Everything you need to find the perfect student accommodation.</p>
			</div>

			<div className="benefits-grid">
				{benefits.map((benefit) => (
					<article className="benefit-item" key={benefit.title}>
						<div className="benefit-icon" aria-hidden="true">{benefit.icon}</div>
						<h3>{benefit.title}</h3>
						<p>{benefit.text}</p>
					</article>
				))}
			</div>
		</section>
	);
};

export default WhyChooseUs;
