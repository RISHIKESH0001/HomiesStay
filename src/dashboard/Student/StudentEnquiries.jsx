import DashboardLayout from '../../layouts/DashboardLayout';
import EnquiryInbox from '../EnquiryInbox';

const StudentEnquiries = () => <DashboardLayout role="student" pageTitle="My enquiries"><main className="dashboard-content owner-workspace-page"><section className="dashboard-welcome owner-workspace-welcome"><div><p className="dashboard-eyebrow">Your conversations</p><h1>Talk to property <span>owners.</span></h1><p className="dashboard-subtitle">Messages are private to you and the owner of each listing.</p></div></section><EnquiryInbox role="student" /></main></DashboardLayout>;

export default StudentEnquiries;
