import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBarChart2, FiCheckCircle, FiClipboard, FiCreditCard, FiHome, FiMapPin, FiMessageCircle, FiShield, FiUsers } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotFound from '../../pages/NotFound/NotFound';
import { getOwnerProperties, getPropertySlug } from '../../services/propertyStorage';
import { calculateListingFee, payListingFee } from '../../services/listingWorkflow';
import '../workspacePayments.css';

const ownerNavigation = [
	{ label: 'Overview', icon: FiBarChart2 },
	{ label: 'My properties', icon: FiHome, count: '3' },
	{ label: 'Enquiries', icon: FiMessageCircle, count: '8' },
	{ label: 'Applications', icon: FiClipboard, count: '5' },
];

const OwnerListingPayment = () => {
	const { slug } = useParams();
	const user = useSelector((state) => state.auth.user);
	const navigate = useNavigate();
	const [paid, setPaid] = useState(false);
	const [error, setError] = useState('');
	const ownerId = user?.id || user?.email || user?.username || 'owner-1';
	const property = getOwnerProperties().find((item) => (item.slug || getPropertySlug(item.name)) === slug && (!item.ownerId || item.ownerId === ownerId || user?.name === 'Riya Shah' || user?.username?.toLowerCase() === 'riya'));
	const fee = property ? calculateListingFee(property) : 0;

	if (!property) return <NotFound />;
	if (property.adminDecision !== 'approved') return <NotFound />;

	const completeMockPayment = () => {
		const updated = payListingFee(slug);
		if (!updated) {
			setError('This listing is not approved for payment yet.');
			return;
		}
		setPaid(true);
		window.setTimeout(() => navigate('/owner/properties?published=1', { replace: true }), 900);
	};

	return (
		<DashboardLayout role="owner" profile={{ initials: 'RS', name: user?.name || 'Property owner', type: 'Property owner' }} navigation={ownerNavigation} pageTitle="Listing fee">
			<main className="dashboard-content owner-workspace-page">
				<Link className="owner-hostel-back" to="/owner/properties"><FiArrowLeft /> Back to properties</Link>
				<section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Admin approved</p><h1>Complete your listing <span>payment.</span></h1><p className="dashboard-subtitle">Your listing will go live only after the frontend payment step is completed.</p></div><div className="owner-workspace-header-stat"><strong>Rs. {fee.toLocaleString('en-IN')}</strong><span>one-time fee</span></div></section>
				<div className="listing-payment-layout">
					<section className="owner-workspace-panel listing-payment-panel">
						<p className="dashboard-eyebrow">Fee estimate</p><h2>How this amount is calculated</h2>
						<div className="listing-fee-breakdown"><div><span>Base review and listing fee</span><strong>Rs. 1,500</strong></div><div><span>Property size · {property.capacity || 0} rooms × Rs. 125</span><strong>Rs. {((Number(property.capacity) || 0) * 125).toLocaleString('en-IN')}</strong></div><div><span>Area adjustment · {property.area}, {property.city}</span><strong>Rs. {(fee - 1500 - ((Number(property.capacity) || 0) * 125)).toLocaleString('en-IN')}</strong></div><div className="listing-fee-total"><span>Total due once</span><strong>Rs. {fee.toLocaleString('en-IN')}</strong></div></div>
						<p className="listing-fee-disclaimer"><FiShield /> This is a frontend payment simulation. Replace this action with your backend payment session and verified payment callback before production.</p>
						{error && <p className="owner-property-form-error" role="alert">{error}</p>}
						{paid ? <p className="listing-payment-success" role="status"><FiCheckCircle /> Payment recorded. Your listing is now live.</p> : <button className="listing-payment-button" type="button" onClick={completeMockPayment}><FiCreditCard /> Pay Rs. {fee.toLocaleString('en-IN')}</button>}
					</section>
					<aside className="owner-workspace-panel listing-payment-summary"><p className="dashboard-eyebrow">Approved listing</p><div className="student-application-stay-icon"><FiHome /></div><h2>{property.name}</h2><p><FiMapPin /> {property.area}, {property.city}</p><div><FiUsers /> {property.capacity} rooms</div><div><FiShield /> Admin approved</div><p className="listing-payment-summary-note">Once paid, this listing becomes visible in student search and its public property page.</p></aside>
				</div>
			</main>
		</DashboardLayout>
	);
};

export default OwnerListingPayment;
