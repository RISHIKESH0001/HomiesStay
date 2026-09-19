import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const Register = () => {
	const navigate = useNavigate();
	const [role, setRole] = useState('student');
	const [isPolicyOpen, setIsPolicyOpen] = useState(false);
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsPolicyOpen(false);
				setIsSuccessOpen(false);
			}
		};

		if (isPolicyOpen || isSuccessOpen) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isPolicyOpen, isSuccessOpen]);

	useEffect(() => {
		if (!isSuccessOpen) {
			return undefined;
		}

		const redirectTimer = window.setTimeout(() => navigate('/login'), 1800);
		return () => window.clearTimeout(redirectTimer);
	}, [isSuccessOpen, navigate]);

	const handleSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const name = formData.get('name').trim();
		const phone = formData.get('phone').replace(/[\s-]/g, '');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const nextErrors = {};

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(name)) {
			nextErrors.name = 'Enter your full name using at least two characters.';
		}

		if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
			nextErrors.phone = 'Enter a valid 10-digit Indian phone number.';
		}

		if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
			nextErrors.password = 'Use 8+ characters with uppercase, lowercase, and a number.';
		}

		if (password !== confirmPassword) {
			nextErrors.confirmPassword = 'Passwords do not match.';
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length === 0) {
			setIsSuccessOpen(true);
		}
	};

	const getErrorProps = (fieldName) => ({
		'aria-invalid': Boolean(errors[fieldName]),
		'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined,
	});

	return (
		<div className="auth-page">
			<section className="auth-intro">
				<a className="auth-logo" href="/">Homies Stay</a>
				<div className="auth-intro-content">
					<p className="auth-kicker">A better place to begin</p>
					<h1>Make room for what comes next.</h1>
					<p>
						Join a trusted student community and find a verified stay that feels
						like home.
					</p>
				</div>
				<div className="auth-intro-note">
					<span aria-hidden="true">5000+</span>
					students already finding their place
				</div>
			</section>

			<main className="auth-panel">
				<div className="auth-panel-header">
					<p className="auth-kicker">Welcome to Homies Stay</p>
					<h2>Create your account</h2>
					<p>Start discovering verified hostels near your college.</p>
				</div>

				<form className="register-form" onSubmit={handleSubmit}>
					<fieldset className="role-selector">
						<legend>I am registering as</legend>
						<div className="role-options">
							<label className={role === 'student' ? 'role-option selected' : 'role-option'}>
								<input
									type="radio"
									name="role"
									value="student"
									checked={role === 'student'}
									onChange={(event) => setRole(event.target.value)}
								/>
								<span>Student</span>
							</label>
							<label className={role === 'owner' ? 'role-option selected' : 'role-option'}>
								<input
									type="radio"
									name="role"
									value="owner"
									checked={role === 'owner'}
									onChange={(event) => setRole(event.target.value)}
								/>
								<span>Property owner</span>
							</label>
						</div>
					</fieldset>

					<div className="register-field-grid">
						<label className="auth-field">
							<span>Full name</span>
							<input type="text" name="name" placeholder="Your full name" minLength="2" required {...getErrorProps('name')} />
							{errors.name && <small className="field-error" id="name-error">{errors.name}</small>}
						</label>
						<label className="auth-field">
							<span>Email address</span>
							<input type="email" name="email" placeholder="you@example.com" required />
						</label>
					</div>

					<label className="auth-field">
						<span>Phone number</span>
						<input type="tel" name="phone" placeholder="+91 98765 43210" required {...getErrorProps('phone')} />
						{errors.phone && <small className="field-error" id="phone-error">{errors.phone}</small>}
					</label>

					<div className="register-field-grid">
						<label className="auth-field">
							<span>Password</span>
							<input type="password" name="password" placeholder="Create a password" minLength="8" required {...getErrorProps('password')} />
							{errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
						</label>
						<label className="auth-field">
							<span>Confirm password</span>
							<input type="password" name="confirmPassword" placeholder="Repeat your password" minLength="8" required {...getErrorProps('confirmPassword')} />
							{errors.confirmPassword && <small className="field-error" id="confirmPassword-error">{errors.confirmPassword}</small>}
						</label>
					</div>

					<button className="privacy-link" type="button" onClick={() => setIsPolicyOpen(true)}>
						Read privacy policies before signing up
					</button>

					<label className="terms-check">
						<input type="checkbox" required />
						<span>I agree to the terms and privacy policy.</span>
					</label>

					<Button className="register-submit" type="submit">
						Create account <span aria-hidden="true">&rarr;</span>
					</Button>
				</form>

				<p className="auth-switch">Already have an account? <a href="/login">Log in</a></p>
			</main>

			{isPolicyOpen && (
				<div className="policy-modal-backdrop" role="presentation" onMouseDown={() => setIsPolicyOpen(false)}>
					<section
						className="policy-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="policy-modal-title"
						onMouseDown={(event) => event.stopPropagation()}
					>
						<div className="policy-modal-header">
							<div>
								<p className="auth-kicker">Before you join</p>
								<h2 id="policy-modal-title">Privacy policies</h2>
							</div>
							<button className="policy-modal-close" type="button" onClick={() => setIsPolicyOpen(false)} aria-label="Close privacy policies">
								&times;
							</button>
						</div>
						<div className="policy-modal-body">
							<p>Your information is used to create and manage your Homies Stay account.</p>
							<ul>
								<li>We only use your contact details for account updates, bookings, and support.</li>
								<li>Your personal information is not sold to third parties.</li>
								<li>Hostel and payment information is handled securely through trusted services.</li>
								<li>You can request changes or deletion of your account information at any time.</li>
							</ul>
							<p>By continuing, you confirm that the information you provide is accurate and that you agree to these policies.</p>
						</div>
						<button className="policy-modal-action" type="button" onClick={() => setIsPolicyOpen(false)}>
							I understand
						</button>
					</section>
				</div>
			)}

			{isSuccessOpen && (
				<div className="policy-modal-backdrop" role="presentation">
					<section className="policy-modal success-modal" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
						<div className="success-icon" aria-hidden="true">&#10003;</div>
						<p className="auth-kicker">Registration complete</p>
						<h2 id="success-modal-title">Your account is ready</h2>
						<p className="success-modal-text">Registration successful. Redirecting you to the login page...</p>
						<button className="policy-modal-action" type="button" onClick={() => navigate('/login')}>
							Continue to login
						</button>
					</section>
				</div>
			)}
		</div>
	);
};

export default Register;
