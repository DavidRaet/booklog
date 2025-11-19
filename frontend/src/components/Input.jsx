import React from 'react';

const Input = ({
  label,
  type = 'text',
  id,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-accent focus:ring-blue-100'
          }
          disabled:bg-slate-50 disabled:text-slate-500
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
