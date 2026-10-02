import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiHome, FiMapPin, FiMessageCircle, FiShield } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotFound from '../../pages/NotFound/NotFound';
import { getPropertySlug, getStoredProperty, seededOwnerProperties, toPublicHostel } from '../../services/propertyStorage';
import { saveApplication } from '../../services/applicationStorage';
import './studentApplications.css';

const StudentApply = () => {
	const { hostelId } = useParams();
	const user = useSelector((state) => state.auth.user);
	const navigate = useNavigate();
	const location = useLocation();
	const property = getStoredProperty(hostelId);
	const seededProperty = seededOwnerProperties.find((item) => item.slug === hostelId);
	const stay = property?.status === 'Live' ? toPublicHostel(property) : property ? null : seededProperty ? toPublicHostel(seededProperty) : location.state?.stay;
	const studentId = user?.id || user?.email || user?.username || user?.name;
	const [form, setForm] = useState(() => ({
		fullName: user?.name || user?.username || '',
		email: user?.email || '',
		phone: user?.phone || '',
		college: user?.college || '',
		course: user?.course || '',
		year: user?.year || '',
		moveIn: '',
		duration: '12 months',
		roomPreference: 'Private room',
		genderPreference: user?.gender || 'No preference',
		monthlyBudget: '',
		foodPreference: 'No preference',
		needs: [],
		message: '',
	}));
	const [error, setError] = useState('');
	const availableNeeds = ['Study space', 'Wi-Fi', 'Meals', 'Laundry', 'Accessible room', 'Flexible move-in'];

	if (!stay) return <NotFound />;

	const updateField = (event) => {
		setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
		setError('');
	};

	const toggleNeed = (need) => setForm((current) => ({
		...current,
		needs: current.needs.includes(need) ? current.needs.filter((item) => item !== need) : [...current.needs, need],
	}));

	const submitApplication = (event) => {
		event.preventDefault();
		const formElement = event.currentTarget;
		if (!formElement.reportValidity()) return;
		if (!studentId) {
			setError('We could not identify your student account. Please sign in again.');
			return;
		}

		const application = {
			id: globalThis.crypto?.randomUUID?.() || `application-${Date.now()}`,
			studentId,
			studentName: form.fullName.trim(),
			name: form.fullName.trim(),
			email: form.email.trim(),
			phone: form.phone.trim(),
			college: form.college.trim(),
			course: `${form.college.trim()} · ${form.course.trim()}${form.year ? `, ${form.year}` : ''}`,
			year: form.year,
			property: stay.name,
			propertySlug: hostelId,
			propertyLocation: stay.location,
			propertyOwnerId: property?.ownerId || seededProperty?.ownerId,
			room: form.roomPreference,
			roomPreference: form.roomPreference,
			genderPreference: form.genderPreference,
			moveIn: form.moveIn,
			duration: form.duration,
			monthlyBudget: Number(form.monthlyBudget),
			foodPreference: form.foodPreference,
			needs: form.needs,
			about: form.message.trim() || 'No additional note provided.',
			city: user?.city || '',
			age: user?.age || '',
			status: 'New',
			submittedAt: new Date().toISOString(),
		};
		saveApplication(application);
		navigate('/dashboard/applications?submitted=1', { replace: true });
	};

	return (
		<DashboardLayout role="student" profile={{ initials: (user?.name || 'ST').slice(0, 2).toUpperCase(), name: user?.name || 'Student user', type: 'Student account' }} pageTitle="Apply for a stay">
			<main className="dashboard-content owner-workspace-page student-application-page">
				<Link className="owner-hostel-back" to={`/hostels/${hostelId}`}><FiArrowLeft /> Back to stay</Link>
				<section className="dashboard-welcome owner-workspace-welcome">
					<div><p className="dashboard-eyebrow">Student application</p><h1>Take the next step toward <span>{stay.name}.</span></h1><p className="dashboard-subtitle">Share the details owners need to check availability and decide whether the stay fits.</p></div>
					<div className="owner-workspace-header-stat"><strong><FiShield /></strong><span>Private to the owner</span></div>
				</section>

				<div className="student-application-layout">
					<form className="owner-workspace-panel student-application-form" onSubmit={submitApplication}>
						<section className="student-form-section">
							<div className="student-form-heading"><span>01</span><div><h2>Your details</h2><p>So the property owner can get back to you.</p></div></div>
							<div className="student-form-grid">
								<label><span>Full name *</span><input name="fullName" value={form.fullName} onChange={updateField} autoComplete="name" required /></label>
								<label><span>Email address *</span><input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required /></label>
								<label><span>Phone number *</span><input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" minLength="8" required /></label>
								<label><span>College / institution *</span><input name="college" value={form.college} onChange={updateField} required /></label>
								<label><span>Course / programme *</span><input name="course" value={form.course} onChange={updateField} required /></label>
								<label><span>Year of study *</span><select name="year" value={form.year} onChange={updateField} required><option value="">Choose year</option><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option><option>Postgraduate</option></select></label>
							</div>
						</section>

						<section className="student-form-section">
							<div className="student-form-heading"><span>02</span><div><h2>Stay preferences</h2><p>Help the owner check the room and timing you need.</p></div></div>
							<div className="student-form-grid">
								<label><span>Preferred move-in date *</span><input name="moveIn" type="date" value={form.moveIn} onChange={updateField} min={new Date().toISOString().slice(0, 10)} required /></label>
								<label><span>Expected stay duration *</span><select name="duration" value={form.duration} onChange={updateField} required><option>3 months</option><option>6 months</option><option>9 months</option><option>12 months</option><option>More than 12 months</option></select></label>
								<label><span>Room preference *</span><select name="roomPreference" value={form.roomPreference} onChange={updateField} required><option>Private room</option><option>Shared room</option><option>Single occupancy</option><option>No preference</option></select></label>
								<label><span>Gender preference</span><select name="genderPreference" value={form.genderPreference} onChange={updateField}><option>No preference</option><option>Women-only</option><option>Men-only</option><option>Co-ed</option></select></label>
								<label><span>Monthly budget (Rs.) *</span><input name="monthlyBudget" type="number" min="1" value={form.monthlyBudget} onChange={updateField} placeholder="e.g. 12000" required /></label>
								<label><span>Food preference</span><select name="foodPreference" value={form.foodPreference} onChange={updateField}><option>No preference</option><option>Vegetarian</option><option>Non-vegetarian</option><option>Vegan</option></select></label>
							</div>
							<fieldset className="student-needs-fieldset"><legend>What matters to you?</legend><div>{availableNeeds.map((need) => <label key={need}><input type="checkbox" checked={form.needs.includes(need)} onChange={() => toggleNeed(need)} /><span>{need}</span></label>)}</div></fieldset>
							<label className="student-message-field"><span>Note to the owner</span><textarea name="message" value={form.message} onChange={updateField} rows="4" maxLength="600" placeholder="Share anything that will help the owner understand your request." /></label>
						</section>

						{error && <p className="owner-property-form-error" role="alert">{error}</p>}
						<div className="student-application-submit"><p><FiShield /> Your contact details are shared with this property owner for this application.</p><button type="submit"><FiMessageCircle /> Send application</button></div>
					</form>

					<aside className="student-application-summary">
						<p className="dashboard-eyebrow">Applying to</p>
						<div className="student-application-stay-icon"><FiHome /></div>
						<h2>{stay.name}</h2>
						<p><FiMapPin /> {stay.location}</p>
						<div className="student-application-summary-line"><span>Starting rent</span><strong>{stay.price} / month</strong></div>
						<div className="student-application-summary-line"><span>Room type</span><strong>{stay.type}</strong></div>
						<div className="student-application-summary-line"><span>Move-in</span><strong>{form.moveIn || 'Choose a date'}</strong></div>
						<div className="student-application-summary-line"><span>Stay duration</span><strong>{form.duration}</strong></div>
						<div className="student-application-summary-note"><FiClock /> The owner can follow up through the contact details you provide.</div>
						<Link to={`/hostels/${getPropertySlug(stay.name)}`}><FiArrowLeft /> Review stay details</Link>
					</aside>
				</div>
			</main>
		</DashboardLayout>
	);
};

export default StudentApply;
