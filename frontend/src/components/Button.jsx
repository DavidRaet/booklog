
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = "w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary",
    secondary: "bg-white text-primary border border-secondary-dark hover:bg-secondary focus:ring-secondary-dark",
    ghost: "text-slate-600 hover:text-primary hover:bg-slate-100 focus:ring-slate-200",
    accent: "bg-accent text-white hover:bg-accent-hover focus:ring-accent"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
