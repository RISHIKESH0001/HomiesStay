import Button from '../common/Button';

const colleges = [
	{ name: 'IIT Kharagpur', shortName: 'IIT', city: 'Kharagpur, West Bengal' },
	{ name: 'NIT Durgapur', shortName: 'NIT', city: 'Durgapur, West Bengal' },
	{ name: 'Jadavpur University', shortName: 'JU', city: 'Kolkata, West Bengal' },
	{ name: 'IEM Kolkata', shortName: 'IEM', city: 'Kolkata, West Bengal' },
	{ name: 'Heritage Institute', shortName: 'HIT', city: 'Kolkata, West Bengal' },
	{ name: 'Techno India', shortName: 'TI', city: 'Kolkata, West Bengal' },
	{ name: 'KIIT University', shortName: 'KIIT', city: 'Bhubaneswar, Odisha' },
	{ name: 'VIT Vellore', shortName: 'VIT', city: 'Vellore, Tamil Nadu' },
];

const Colleges = () => {
	return (
		<section className="colleges-section" aria-labelledby="colleges-title">
			<div className="colleges-heading">
				<p className="colleges-kicker">Find your campus neighbourhood</p>
				<h2 id="colleges-title">Popular Colleges</h2>
				<p>Explore hostels near top colleges and universities.</p>
			</div>

			<div className="colleges-grid">
				{colleges.map((college) => (
					<article className="college-card" key={college.name}>
						<div className="college-card-topline">
							<div className="college-mark" aria-hidden="true">{college.shortName}</div>
							<span className="college-arrow" aria-hidden="true"></span>
						</div>
						<h3>{college.name}</h3>
						<p>{college.city}</p>
						<Button href="/hostels" className="college-link" variant="link">
							View nearby hostels <span aria-hidden="true">&rarr;</span>
						</Button>
					</article>
				))}
			</div>
		</section>
	);
};

export default Colleges;
