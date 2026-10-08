import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, rightElement, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-semibold">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border bg-white py-3 outline-none focus:ring-2 focus:ring-brand ${
            Icon ? "pl-11" : "pl-4"
          } ${rightElement ? "pr-11" : "pr-4"} ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;