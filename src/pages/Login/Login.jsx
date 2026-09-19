import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import { login } from '../../redux/authSlice';

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [selectedRole, setSelectedRole] = useState('student');
	const [rememberMe, setRememberMe] = useState(true);
	const [errors, setErrors] = useState({});
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const username = formData.get('username').trim();
		const password = formData.get('password');
		const nextErrors = {};

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		if (!username) {
			nextErrors.username = 'Enter your username.';
		}

		if (password.length < 8) {
			nextErrors.password = 'Your password must be at least 8 characters.';
		}

		if (username === 'Admin' && password !== 'Admin123@') {
			nextErrors.password = 'Use the administrator password provided for this account.';
		}

		if (selectedRole === 'admin' && (username !== 'Admin' || password !== 'Admin123@')) {
			nextErrors.username = 'Use the designated Admin account credentials.';
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length === 0) {
			const role = username === 'Admin' && password === 'Admin123@' ? 'admin' : selectedRole;
			const initials = username.slice(0, 2).toUpperCase();
			dispatch(login({ name: username, username, initials, role }));
			setIsSuccess(true);
			navigate('/', { replace: true });
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
					<p className="auth-kicker">Your next chapter starts here</p>
					<h1>Come home to a place that fits.</h1>
					<p>
						Pick up where you left off and keep exploring verified stays close to
						your college.
					</p>
				</div>
				<div className="auth-intro-note">
					<span aria-hidden="true">5000+</span>
					students already finding their place
				</div>
			</section>

			<main className="auth-panel login-panel">
				<div className="auth-panel-header">
					<p className="auth-kicker">Welcome back</p>
					<h2>Log in to your account</h2>
					<p>Keep your shortlist, enquiries, and bookings in one place.</p>
				</div>

				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label className="auth-field">
						<span>Username</span>
						<input type="text" name="username" placeholder="Enter your username" autoComplete="username" required {...getErrorProps('username')} />
						{errors.username && <small className="field-error" id="username-error">{errors.username}</small>}
					</label>

					<label className="auth-field">
						<span>Account type</span>
						<select name="role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
							<option value="student">Student</option>
							<option value="owner">Property owner</option>
							<option value="admin">Admin</option>
						</select>
					</label>

					<label className="auth-field">
						<span>Password</span>
						<div className="password-input-wrap">
							<input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" autoComplete="current-password" minLength="8" required {...getErrorProps('password')} />
							<button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
						{errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
					</label>

					<div className="login-options">
						<label className="terms-check">
							<input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
							<span>Remember me</span>
						</label>
						<button className="privacy-link" type="button" onClick={() => window.alert('Password recovery is coming soon.')}>Forgot password?</button>
					</div>

					<Button className="register-submit login-submit" type="submit">
						{isSuccess ? 'You are signed in' : 'Log in'} <span aria-hidden="true">&rarr;</span>
					</Button>
				</form>

				<p className="auth-switch">New to Homies Stay? <a href="/register">Create an account</a></p>
			</main>
		</div>
	);
};

export default Login;
