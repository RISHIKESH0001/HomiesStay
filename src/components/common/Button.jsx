const Button = ({
	children,
	href,
	variant = 'primary',
	className = '',
	...props
}) => {
	const buttonClassName = `ui-button ui-button-${variant} ${className}`.trim();

	if (href) {
		return (
			<a className={buttonClassName} href={href} {...props}>
				{children}
			</a>
		);
	}

	return (
		<button className={buttonClassName} type="button" {...props}>
			{children}
		</button>
	);
};

export default Button;
