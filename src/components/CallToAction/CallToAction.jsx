import Button from '../common/Button';
import { useSelector } from 'react-redux';

const CallToAction = () => {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

	if (isAuthenticated) {
		return null;
	}

	return (
		<section className="cta-section" aria-labelledby="cta-title">
			<div className="cta-decoration cta-decoration-left" aria-hidden="true" />
			<div className="cta-content">
				<p className="cta-kicker">Your new home is closer than you think</p>
				<h2 id="cta-title">Ready to Find Your Perfect Hostel?</h2>
				<p className="cta-description">
					Join thousands of students who found a place they love near campus.
				</p>
				<div className="cta-actions">
					<Button className="cta-button" href="/hostels" variant="primary">
						Search Hostels <span aria-hidden="true">&rarr;</span>
					</Button>
					<Button className="cta-button cta-button-secondary" href="/register" variant="secondary">
						Register Now
					</Button>
				</div>
			</div>
			<div className="cta-decoration cta-decoration-right" aria-hidden="true" />
		</section>
	);
};

export default CallToAction;
