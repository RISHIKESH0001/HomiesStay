import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const SearchSection = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState({
		college: '',
		location: '',
		budget: '',
	});
	const [searchError, setSearchError] = useState('');

	const handleChange = (event) => {
		const { name, value } = event.target;
		setSearch((currentSearch) => ({ ...currentSearch, [name]: value }));
		if (name !== 'budget' && value.trim()) setSearchError('');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!search.college.trim() && !search.location.trim()) {
			setSearchError('Enter a college, hostel name, city, or neighbourhood to search.');
			return;
		}
		setSearchError('');
		const params = new URLSearchParams();
		if (search.college.trim()) params.set('college', search.college.trim());
		if (search.location.trim()) params.set('location', search.location.trim());
		if (search.budget) params.set('budget', search.budget);
		navigate(`/search-results?${params.toString()}`);
	};

	return (
		<section className="search-section" aria-labelledby="search-title">
			<div className="search-heading">
				<p className="search-kicker">Start exploring</p>
				<h2 id="search-title">Find Your Hostel</h2>
				<p>Search trusted stays close to the places that matter.</p>
			</div>

			<form className="search-form" onSubmit={handleSubmit}>
				<label className="search-field">
					<span>College or hostel name</span>
					<input
						name="college"
						value={search.college}
						onChange={handleChange}
						placeholder="Search a college or hostel"
						autoComplete="organization"
					/>
				</label>

				<label className="search-field">
					<span>Location</span>
					<input
						name="location"
						value={search.location}
						onChange={handleChange}
						placeholder="City or neighbourhood"
						autoComplete="address-level2"
					/>
				</label>

				<label className="search-field">
					<span>Monthly budget</span>
					<select name="budget" value={search.budget} onChange={handleChange}>
						<option value="">Any budget</option>
						<option value="under-5000">Under Rs. 5,000</option>
						<option value="5000-10000">Rs. 5,000 - 10,000</option>
						<option value="over-10000">Above Rs. 10,000</option>
					</select>
				</label>

				<Button className="search-submit" type="submit">
					Search <span aria-hidden="true">&rarr;</span>
				</Button>
			</form>
			{searchError && <p className="search-error" role="alert">{searchError}</p>}
		</section>
	);
};

export default SearchSection;
