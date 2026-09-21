import Button from '../common/Button';
import { roomShared } from '../../assets/hostelImages';

const Hero = () => {
	return (
		<section className="hero-section" aria-labelledby="hero-title">
			<div className="hero-copy">
				<p className="hero-kicker">Your next chapter starts here</p>
				<h1 id="hero-title">Find The Perfect Hostel Near Your College</h1>
				<p className="hero-description">
					Book verified hostels, compare amenities, and find a comfortable place
					to call home before your semester begins.
				</p>
				<div className="hero-actions">
					<Button className="hero-button" href="/hostels" variant="primary">
						Find Hostel <span aria-hidden="true">&rarr;</span>
					</Button>
					<Button className="hero-button hero-button-secondary" href="/hostels" variant="secondary">
						Explore
					</Button>
				</div>
			</div>

			<div className="hero-visual">
				<div className="hero-image-frame">
					<img
						 src={roomShared}
						alt="Bright, modern shared hostel room"
					/>
					<div className="hero-image-label">
						<span className="status-dot" aria-hidden="true" />
						Verified stays only
					</div>
				</div>
			</div>

			<div className="hero-stats" aria-label="Homies Stay statistics">
				<div className="hero-stat">
					<strong>500+</strong>
					<span>Hostels</span>
				</div>
				<div className="hero-stat">
					<strong>100+</strong>
					<span>Colleges</span>
				</div>
				<div className="hero-stat">
					<strong>5000+</strong>
					<span>Students</span>
				</div>
			</div>
		</section>
	);
};

export default Hero;
