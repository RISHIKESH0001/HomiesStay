import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getApiErrorMessage, registerAccount } from '../../services/api';

const Register = () => {
	const navigate = useNavigate();
	const [role, setRole] = useState('student');
	const [isPolicyOpen, setIsPolicyOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState('');
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsPolicyOpen(false);
			}
		};

		if (isPolicyOpen) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isPolicyOpen]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const name = formData.get('name').trim();
		const email = formData.get('email').trim().toLowerCase();
		const username = formData.get('username').trim();
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

		if (!/^[A-Za-z0-9._-]{3,30}$/.test(username)) {
			nextErrors.username = 'Use 3–30 letters, numbers, dots, underscores, or hyphens.';
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
			setApiError('');
			setIsSubmitting(true);
			try {
				await registerAccount({ name, email, username, phone, password, role });
				navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
			} catch (error) {
				setApiError(getApiErrorMessage(error, 'Unable to create your account. Please try again.'));
			} finally {
				setIsSubmitting(false);
			}
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
						Create an account to explore approved property listings that feel
						like home.
					</p>
				</div>
			</section>

			<main className="auth-panel">
				<div className="auth-panel-header">
					<p className="auth-kicker">Welcome to Homies Stay</p>
					<h2>Create your account</h2>
					<p>Start browsing approved listings near your college.</p>
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
						<span>Username</span>
						<input type="text" name="username" placeholder="Choose a username" minLength="3" maxLength="30" autoComplete="username" required {...getErrorProps('username')} />
						{errors.username && <small className="field-error" id="username-error">{errors.username}</small>}
					</label>

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
					{apiError && <p className="field-error" role="alert">{apiError}</p>}

					<Button className="register-submit" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Creating account...' : 'Create account'} <span aria-hidden="true">&rarr;</span>
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
								<li>Your email address is used for account verification and sign-in.</li>
								<li>Your password is stored as a one-way hash, not in readable form.</li>
								<li>Property owners can see only property records belonging to their account.</li>
							</ul>
							<p>By continuing, you confirm that the information you provide is accurate and that you agree to these policies.</p>
						</div>
						<button className="policy-modal-action" type="button" onClick={() => setIsPolicyOpen(false)}>
							I understand
						</button>
					</section>
				</div>
			)}
		</div>
	);
};

export default Register;
