import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import { loginUser } from '../../redux/authSlice';
import { requestPasswordReset, resetAccountPassword, getApiErrorMessage } from '../../services/api';

const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [formError, setFormError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPasswordReset, setShowPasswordReset] = useState(false);
	const [resetStep, setResetStep] = useState(1);
	const [resetEmail, setResetEmail] = useState('');
	const [resetMessage, setResetMessage] = useState('');
	const [resetError, setResetError] = useState('');
	const [isResetSubmitting, setIsResetSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const identifier = formData.get('identifier').trim();
		const password = formData.get('password');

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		setFormError('');
		setIsSubmitting(true);
		try {
			const account = await dispatch(loginUser({ identifier, password })).unwrap();
			const requestedPath = location.state?.from;
			const destination = requestedPath
				? `${requestedPath.pathname}${requestedPath.search || ''}${requestedPath.hash || ''}`
				: account.role === 'owner' ? '/owner/dashboard' : account.role === 'admin' ? '/admin/dashboard' : '/dashboard';
			navigate(destination, { replace: true, state: requestedPath?.state });
		} catch (error) {
			setFormError(typeof error === 'string' ? { message: error } : error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRequestPasswordReset = async (event) => {
		event.preventDefault();
		const email = new FormData(event.currentTarget).get('resetEmail').trim();
		setResetError('');
		setResetMessage('');
		setIsResetSubmitting(true);
		try {
			const result = await requestPasswordReset(email);
			setResetEmail(email);
			setResetMessage(result.message);
			setResetStep(2);
		} catch (error) {
			setResetError(getApiErrorMessage(error, 'Unable to request a reset code. Please try again.'));
		} finally {
			setIsResetSubmitting(false);
		}
	};

	const handleResetPassword = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const otp = formData.get('otp').trim();
		const newPassword = formData.get('newPassword');
		if (newPassword !== formData.get('confirmPassword')) {
			setResetError('The passwords do not match.');
			return;
		}
		setResetError('');
		setIsResetSubmitting(true);
		try {
			const result = await resetAccountPassword({ email: resetEmail, otp, newPassword });
			if (!result.verified) {
				setResetError(result.message);
				return;
			}
			setResetMessage(result.message);
			setResetStep(3);
		} catch (error) {
			setResetError(getApiErrorMessage(error, 'Unable to reset the password. Please try again.'));
		} finally {
			setIsResetSubmitting(false);
		}
	};

	return (
		<div className="auth-page">
			<section className="auth-intro">
				<a className="auth-logo" href="/">Homies Stay</a>
				<div className="auth-intro-content">
					<p className="auth-kicker">Your next chapter starts here</p>
					<h1>Come home to a place that fits.</h1>
					<p>
						Sign in to browse currently approved listings close to
						your college.
					</p>
				</div>
			</section>

			<main className="auth-panel login-panel">
				<div className="auth-panel-header">
					<p className="auth-kicker">Welcome back</p>
					<h2>Log in to your account</h2>
					<p>Use your Homies Stay account to explore approved property listings.</p>
				</div>

				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label className="auth-field">
						<span>Email or username</span>
						<input type="text" name="identifier" placeholder="you@example.com or username" autoComplete="username" required />
					</label>

					<label className="auth-field">
						<span>Password</span>
						<div className="password-input-wrap">
							<input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" autoComplete="current-password" minLength="8" required />
							<button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</label>

					<div className="login-options">
						<button className="privacy-link" type="button" onClick={() => { setShowPasswordReset(true); setResetStep(1); setResetError(''); setResetMessage(''); }}>Forgot password?</button>
					</div>
					{formError && <p className="field-error" role="alert">{formError.message || 'Unable to sign in. Please try again.'}{formError.adminContactEmail && <> <a href={`mailto:${formError.adminContactEmail}`}>Email the administrator</a>.</>}</p>}

					<Button className="register-submit login-submit" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in...' : 'Log in'} <span aria-hidden="true">&rarr;</span>
					</Button>
				</form>

				{showPasswordReset && <section className="password-reset-panel" aria-label="Password recovery">
					<div className="auth-panel-header">
						<p className="auth-kicker">Account recovery</p>
						<h2>{resetStep === 1 ? 'Get a reset code' : resetStep === 2 ? 'Choose a new password' : 'Password updated'}</h2>
					</div>
					{resetStep === 1 && <form className="login-form" onSubmit={handleRequestPasswordReset}>
						<label className="auth-field"><span>Account email</span><input type="email" name="resetEmail" autoComplete="email" maxLength="254" required /></label>
						{resetError && <p className="field-error" role="alert">{resetError}</p>}
						{resetMessage && <p role="status">{resetMessage}</p>}
						<Button className="register-submit login-submit" type="submit" disabled={isResetSubmitting}>{isResetSubmitting ? 'Sending...' : 'Send reset code'}</Button>
					</form>}
					{resetStep === 2 && <form className="login-form" onSubmit={handleResetPassword}>
						<p>{resetMessage}</p>
						<label className="auth-field"><span>Six-digit reset code</span><input name="otp" inputMode="numeric" pattern="[0-9]{6}" minLength="6" maxLength="6" autoComplete="one-time-code" required /></label>
						<label className="auth-field"><span>New password</span><input type="password" name="newPassword" minLength="8" maxLength="72" autoComplete="new-password" required /></label>
						<label className="auth-field"><span>Confirm new password</span><input type="password" name="confirmPassword" minLength="8" maxLength="72" autoComplete="new-password" required /></label>
						{resetError && <p className="field-error" role="alert">{resetError}</p>}
						<Button className="register-submit login-submit" type="submit" disabled={isResetSubmitting}>{isResetSubmitting ? 'Updating...' : 'Update password'}</Button>
					</form>}
					{resetStep === 3 && <p role="status">{resetMessage}</p>}
					<button className="privacy-link" type="button" onClick={() => setShowPasswordReset(false)}>Back to login</button>
				</section>}

				<p className="auth-switch">New to Homies Stay? <a href="/register">Create an account</a></p>
			</main>
		</div>
	);
};

export default Login;
