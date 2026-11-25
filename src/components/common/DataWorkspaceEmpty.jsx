import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const DataWorkspaceEmpty = ({ icon: Icon, eyebrow, title, description, linkTo, linkText }) => (
	<section className="student-applications-empty">
		<span>{Icon && <Icon />}</span>
		<p className="dashboard-eyebrow">{eyebrow}</p>
		<h2>{title}</h2>
		<p>{description}</p>
		{linkTo && <Link to={linkTo}>{linkText || 'Open workspace'} <FiArrowUpRight /></Link>}
	</section>
);

export default DataWorkspaceEmpty;
