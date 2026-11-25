import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getApiErrorMessage, resendEmailVerificationOtp, verifyEmailOtp } from '../../services/api';

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const email = searchParams.get('email')?.trim().toLowerCase() || '';
	const [otp, setOtp] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		if (cooldown <= 0) return undefined;
		const timer = window.setTimeout(() => setCooldown((remaining) => remaining - 1), 1000);
		return () => window.clearTimeout(timer);
	}, [cooldown]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!/^\d{6}$/.test(otp)) {
			setError('Enter the six-digit code from your email.');
			return;
		}

		setError('');
		setMessage('');
		setIsSubmitting(true);
		try {
			const result = await verifyEmailOtp({ email, otp });
			if (!result.verified) {
				setError(result.message || 'That code is invalid or expired. Request a new one and try again.');
				return;
			}
			setMessage(result.message || 'Your email is verified. You can now log in.');
			window.setTimeout(() => navigate('/login', { replace: true }), 1600);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'We could not verify that code. Check it and try again.'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResend = async () => {
		setError('');
		setMessage('');
		setIsResending(true);
		try {
			const result = await resendEmailVerificationOtp(email);
			setMessage(result.message || 'If the account needs verification, a new code will be sent when eligible.');
			setCooldown(RESEND_COOLDOWN_SECONDS);
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to request a new code. Please try again.'));
		} finally {
			setIsResending(false);
		}
	};

	if (!email) {
		return (
			<div className="auth-page">
				<main className="auth-panel login-panel">
					<div className="auth-panel-header">
						<p className="auth-kicker">Email verification</p>
						<h2>We need your email address</h2>
						<p>Register first, then use the link in your verification message.</p>
					</div>
					<Link className="register-submit" to="/register">Create an account</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="auth-page">
			<section className="auth-intro">
				<a className="auth-logo" href="/">Homies Stay</a>
				<div className="auth-intro-content">
					<p className="auth-kicker">One quick security check</p>
					<h1>Confirm it’s really you.</h1>
					<p>Verify your email to activate your Homies Stay account and keep it secure.</p>
				</div>
			</section>
			<main className="auth-panel login-panel">
				<div className="auth-panel-header">
					<p className="auth-kicker">Email verification</p>
					<h2>Enter your code</h2>
					<p>We sent a six-digit code to <strong>{email}</strong>. It expires after 10 minutes.</p>
				</div>
				<form className="login-form" onSubmit={handleSubmit}>
					<label className="auth-field">
						<span>Verification code</span>
						<input type="text" name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength="6" placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
					</label>
					{error && <p className="field-error" role="alert">{error}</p>}
					{message && <p role="status">{message}</p>}
					<Button className="register-submit login-submit" type="submit" disabled={isSubmitting || otp.length !== 6}>
						{isSubmitting ? 'Verifying...' : 'Verify email'} <span aria-hidden="true">&rarr;</span>
					</Button>
				</form>
				<button className="privacy-link" type="button" disabled={isResending || cooldown > 0} onClick={handleResend}>
					{isResending ? 'Sending...' : cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
				</button>
				<p className="auth-switch"><Link to="/register">Back to registration</Link></p>
			</main>
		</div>
	);
};

export default VerifyEmail;
