import DashboardLayout from '../../layouts/DashboardLayout';
import EnquiryInbox from '../EnquiryInbox';

const OwnerEnquiries = () => <DashboardLayout role="owner" pageTitle="Enquiries"><main className="dashboard-content owner-workspace-page"><section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Owner inbox</p><h1>Respond to student <span>enquiries.</span></h1><p className="dashboard-subtitle">Only conversations about your own property listings appear here.</p></div></section><EnquiryInbox role="owner" /></main></DashboardLayout>;

export default OwnerEnquiries;
