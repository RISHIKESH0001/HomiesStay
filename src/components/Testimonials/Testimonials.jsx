const testimonials = [
	{
		quote: 'Found a verified hostel within minutes. The process was very easy.',
		name: 'Rahul Sharma',
		college: 'IIT Kharagpur',
		initials: 'RS',
	},
	{
		quote: 'The reviews helped me choose the right hostel near my campus.',
		name: 'Priya Singh',
		college: 'Jadavpur University',
		initials: 'PS',
	},
	{
		quote: 'Amazing platform. I booked my hostel before joining college.',
		name: 'Amit Das',
		college: 'IEM Kolkata',
		initials: 'AD',
	},
];

const Testimonials = () => {
	return (
		<section className="testimonials-section" aria-labelledby="testimonials-title">
			<div className="testimonials-heading">
				<p className="testimonials-kicker">Real stories, real peace of mind</p>
				<h2 id="testimonials-title">What Students Say</h2>
			</div>

			<div className="testimonials-grid">
				{testimonials.map((testimonial) => (
					<article className="testimonial-card" key={testimonial.name}>
						<span className="testimonial-quote-mark" aria-hidden="true">&ldquo;</span>
						<blockquote>{testimonial.quote}</blockquote>
						<div className="testimonial-student">
							<div className="testimonial-avatar" aria-hidden="true">{testimonial.initials}</div>
							<div>
								<h3>{testimonial.name}</h3>
								<p>{testimonial.college}</p>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};

export default Testimonials;
