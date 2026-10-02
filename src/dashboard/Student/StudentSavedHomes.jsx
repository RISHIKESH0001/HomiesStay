import { useState } from 'react';
import { FiArrowUpRight, FiCompass, FiGrid, FiHeart, FiMapPin, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getPropertySlug } from '../../services/propertyStorage';

const studentNavigation = [
	{ label: 'Overview', icon: FiGrid },
	{ label: 'Explore stays', icon: FiCompass },
	{ label: 'Saved homes', icon: FiHeart },
	{ label: 'My enquiries', icon: FiMessageCircle },
];

const initialSaved = [
	{ name: 'The Olive House', area: 'Koramangala, Bengaluru', type: 'Co-living', price: '₹14,500', rating: '4.9', color: 'olive', initials: 'OH' },
	{ name: 'Casa Nook', area: 'HSR Layout, Bengaluru', type: 'Private room', price: '₹12,800', rating: '4.8', color: 'sunset', initials: 'CN' },
	{ name: 'The Nest Collective', area: 'Indiranagar, Bengaluru', type: 'Shared apartment', price: '₹10,900', rating: '4.7', color: 'blue', initials: 'NC' },
];

const StudentSavedHomes = () => {
	const [savedHomes, setSavedHomes] = useState(initialSaved);

	const removeHome = (name) => {
		setSavedHomes((current) => current.filter((item) => item.name !== name));
	};

	return (
		<DashboardLayout role="student" profile={{ initials: 'ST', name: 'Student user', type: 'Student account' }} navigation={studentNavigation} pageTitle="Saved homes">
			<main className="dashboard-content owner-workspace-page">
				<section className="dashboard-welcome owner-workspace-welcome">
					<div>
						<p className="dashboard-eyebrow">Your shortlist</p>
						<h1>Saved homes you <span>would actually live in.</span></h1>
						<p className="dashboard-subtitle">Keep the ones that match your budget, commute, and vibe in one easy place.</p>
					</div>
					<div className="owner-workspace-header-stat">
						<strong>{savedHomes.length}</strong>
						<span>saved homes</span>
					</div>
				</section>

				<section className="owner-workspace-panel">
					<div className="owner-workspace-panel-heading">
						<div>
							<p className="dashboard-eyebrow">Shortlist</p>
							<h2>Homes you’re comparing</h2>
						</div>
						<span>{savedHomes.length} properties</span>
					</div>
					<div className="owner-enquiries-list">
						{savedHomes.map((home) => (
							<article className="owner-enquiry-card" key={home.name}>
								<span className={`dashboard-top-avatar ${home.color}`}>{home.initials}</span>
								<div className="owner-enquiry-card-copy">
									<strong>{home.name}</strong>
									<b>{home.type}</b>
									<span><FiMapPin /> {home.area}</span>
									<small>{home.price} / month</small>
								</div>
								<div className="owner-enquiry-card-actions">
									<em className="new">{home.rating} ★</em>
									<button type="button" onClick={() => removeHome(home.name)}><FiTrash2 /> Remove</button>
									<a href={`/hostels/${getPropertySlug(home.name)}`}>View <FiArrowUpRight /></a>
								</div>
							</article>
						))}
					</div>
				</section>
			</main>
		</DashboardLayout>
	);
};

export default StudentSavedHomes;
