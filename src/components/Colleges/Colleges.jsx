import { useEffect, useState } from 'react';
import Button from '../common/Button';
import { getPublicProperties } from '../../services/propertyCatalog';

const Colleges = () => {
	const [colleges, setColleges] = useState([]);

	useEffect(() => {
		let isCurrent = true;
		getPublicProperties()
			.then(({ content }) => {
				if (isCurrent) setColleges([...new Set(content.map((property) => property.college).filter(Boolean))]);
			})
			.catch(() => { if (isCurrent) setColleges([]); });
		return () => { isCurrent = false; };
	}, []);

	if (!colleges.length) return null;

	return (
		<section className="colleges-section" aria-labelledby="colleges-title">
			<div className="colleges-heading">
				<p className="colleges-kicker">Find your campus neighbourhood</p>
				<h2 id="colleges-title">Institutions near available stays</h2>
				<p>Explore approved listings near institutions provided by property owners.</p>
			</div>

			<div className="colleges-grid">
				{colleges.map((college) => (
					<article className="college-card" key={college}>
						<div className="college-card-topline">
							<div className="college-mark" aria-hidden="true">{college.slice(0, 3).toUpperCase()}</div>
							<span className="college-arrow" aria-hidden="true"></span>
						</div>
						<h3>{college}</h3>
						<p>Approved listings available</p>
						<Button href={`/search-results?college=${encodeURIComponent(college)}`} className="college-link" variant="link">
							View nearby hostels <span aria-hidden="true">&rarr;</span>
						</Button>
					</article>
				))}
			</div>
		</section>
	);
};

export default Colleges;
