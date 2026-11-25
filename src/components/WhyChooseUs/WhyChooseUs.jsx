const benefits = [
	{
		icon: '⌕',
		title: 'Browse published stays',
		text: 'See listings that have been approved and published by the platform.',
	},
	{
		icon: '✉',
		title: 'Email-verified accounts',
		text: 'Accounts must verify their email address before they can sign in.',
	},
	{
		icon: '⌖',
		title: 'Search by location',
		text: 'Search currently published stays by city, area, or nearby institution.',
	},
	{
		icon: '⌂',
		title: 'Owner-managed listings',
		text: 'Property owners can manage their listing information in one account.',
	},
];

const WhyChooseUs = () => {
	return (
		<section className="why-section" aria-labelledby="why-title">
			<div className="why-heading">
				<p className="why-kicker">A better way to settle in</p>
				<h2 id="why-title">Why Choose Homies Stay?</h2>
				<p>Core tools for browsing published stays and managing owner listings.</p>
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
