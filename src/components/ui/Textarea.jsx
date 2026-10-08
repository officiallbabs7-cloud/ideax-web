import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-semibold">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={6}
        className={`w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;