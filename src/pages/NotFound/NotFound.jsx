import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
			<main className="auth-panel" style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
				<p className="auth-kicker">404 error</p>
				<h1 style={{ marginBottom: '0.8rem' }}>This page could not be found.</h1>
				<p style={{ marginBottom: '1.5rem', color: '#5f6f70' }}>
					The page you are looking for may have moved, been removed, or never existed.
				</p>
				<div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
					<Link className="dashboard-primary-action" to="/">Back home</Link>
					<Link className="dashboard-primary-action" to="/hostels" style={{ background: 'transparent', border: '1px solid #d8e0d6', color: '#214f55' }}>Browse stays</Link>
				</div>
			</main>
		</div>
	);
};

export default NotFound;
