import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCreditCard, FiHome } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';

const OwnerRent = () => (
	<DashboardLayout role="owner" pageTitle="Rent & payments">
		<main className="dashboard-content owner-workspace-page">
			<section className="student-applications-empty"><span><FiCreditCard /></span><p className="dashboard-eyebrow">Rent ledger</p><h2>Payment records are not connected yet.</h2><p>No rent schedules, balances, fines, or payment statuses are simulated. A backend billing service and payment-provider integration are required.</p><Link to="/owner/properties"><FiHome /> Manage properties</Link><Link to="/owner/dashboard"><FiArrowUpRight /> Owner dashboard</Link></section>
		</main>
	</DashboardLayout>
);

export default OwnerRent;
